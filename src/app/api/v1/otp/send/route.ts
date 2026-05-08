import type { NextRequest } from "next/server";
import { issueOtp, OtpError } from "@/lib/otp";
import { otpSendSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

/**
 * POST /api/v1/otp/send
 *
 * Issues a 6-digit OTP and dispatches via SMS (phone) and/or email.
 * Rate-limited per IP to prevent abuse.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, "otp-send", 5, 60);
  if (!rl.success) {
    return apiError("TOO_MANY_REQUESTS", "Too many OTP requests.", 429);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = otpSendSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const result = await issueOtp({
      phone: parsed.data.phone,
      email: parsed.data.email,
      purpose: parsed.data.purpose,
      ip,
    });
    return apiSuccess({
      ok: true,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof OtpError) {
      return apiError(err.code, err.message, err.status);
    }
    console.error("[otp.send]", err);
    return apiError("INTERNAL_ERROR", "Could not send OTP.", 500);
  }
}
