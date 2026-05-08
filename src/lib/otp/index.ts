import bcrypt from "bcryptjs";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { otpCodes } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { sendSms } from "@/lib/sms";
import { sendGenericEmail } from "@/lib/resend";

const TTL_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;
type OtpPurpose = "checkout" | "phone_verification" | "login";

function generateCode(): string {
  // 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate, persist (hashed), and dispatch an OTP via SMS or email.
 * Throws { code, message } shaped errors via OtpError.
 */
export class OtpError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
    this.name = "OtpError";
  }
}

export async function issueOtp(opts: {
  phone?: string | null;
  email?: string | null;
  purpose?: OtpPurpose;
  ip?: string | null;
}): Promise<{ ok: true; expiresAt: Date }> {
  const purpose = opts.purpose ?? "checkout";
  const phone = opts.phone?.trim() || null;
  const email = opts.email?.trim().toLowerCase() || null;
  if (!phone && !email) {
    throw new OtpError("MISSING_RECIPIENT", "phone or email is required.");
  }

  // Cooldown — don't issue another for same recipient within COOLDOWN_SECONDS
  const cooldownThreshold = new Date(Date.now() - COOLDOWN_SECONDS * 1000);
  const recent = await db
    .select({ id: otpCodes.id })
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.storeId, DEFAULT_STORE_ID),
        eq(otpCodes.purpose, purpose),
        phone ? eq(otpCodes.phone, phone) : isNull(otpCodes.phone),
        email ? eq(otpCodes.email, email) : isNull(otpCodes.email),
        gt(otpCodes.createdAt, cooldownThreshold),
      ),
    )
    .limit(1);
  if (recent.length) {
    throw new OtpError(
      "COOLDOWN",
      `Please wait ${COOLDOWN_SECONDS}s before requesting another code.`,
      429,
    );
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000);

  await db.insert(otpCodes).values({
    storeId: DEFAULT_STORE_ID,
    phone,
    email,
    codeHash,
    purpose,
    expiresAt,
    requesterIp: opts.ip ?? null,
  });

  // Dispatch — best effort
  const message = `Niyamah verification code: ${code}. Valid for ${TTL_MINUTES} minutes. Do not share.`;
  if (phone) {
    sendSms({ to: phone, message }).catch((err) =>
      console.error("[otp] sms send failed", err),
    );
  }
  if (email) {
    sendGenericEmail({
      to: email,
      subject: "Niyamah verification code",
      html: `<p>Your Niyamah verification code is <strong>${code}</strong>.</p><p>It is valid for ${TTL_MINUTES} minutes.</p>`,
    }).catch((err) => console.error("[otp] email send failed", err));
  }

  return { ok: true, expiresAt };
}

/**
 * Verify a submitted OTP. On success the row is marked consumed.
 */
export async function verifyOtp(opts: {
  phone?: string | null;
  email?: string | null;
  code: string;
  purpose?: OtpPurpose;
}): Promise<{ ok: true }> {
  const purpose = opts.purpose ?? "checkout";
  const phone = opts.phone?.trim() || null;
  const email = opts.email?.trim().toLowerCase() || null;
  if (!phone && !email) {
    throw new OtpError("MISSING_RECIPIENT", "phone or email is required.");
  }

  const [row] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.storeId, DEFAULT_STORE_ID),
        eq(otpCodes.purpose, purpose),
        phone ? eq(otpCodes.phone, phone) : isNull(otpCodes.phone),
        email ? eq(otpCodes.email, email) : isNull(otpCodes.email),
        isNull(otpCodes.consumedAt),
      ),
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row) throw new OtpError("NOT_FOUND", "No active code. Request a new one.", 404);
  if (row.expiresAt < new Date()) throw new OtpError("EXPIRED", "Code expired. Request a new one.");
  if (row.attempts >= MAX_ATTEMPTS)
    throw new OtpError("TOO_MANY_ATTEMPTS", "Too many attempts. Request a new code.", 429);

  const matches = await bcrypt.compare(opts.code, row.codeHash);
  if (!matches) {
    await db
      .update(otpCodes)
      .set({ attempts: sql`${otpCodes.attempts} + 1` })
      .where(eq(otpCodes.id, row.id));
    throw new OtpError("INVALID_CODE", "Invalid code.");
  }

  await db
    .update(otpCodes)
    .set({ consumedAt: new Date() })
    .where(eq(otpCodes.id, row.id));

  return { ok: true };
}
