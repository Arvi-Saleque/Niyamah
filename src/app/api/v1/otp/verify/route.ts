import type { NextRequest } from "next/server";
import { verifyOtp, OtpError } from "@/lib/otp";
import { otpVerifySchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

/**
 * POST /api/v1/otp/verify
 *
 * Verifies a submitted code. On success, marks the OTP row consumed.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, "otp-verify", 10, 60);
  if (!rl.success) {
    return apiError("TOO_MANY_REQUESTS", "Too many verification attempts.", 429);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    await verifyOtp({
      phone: parsed.data.phone,
      email: parsed.data.email,
      code: parsed.data.code,
      purpose: parsed.data.purpose,
    });
    return apiSuccess({ verified: true });
  } catch (err) {
    if (err instanceof OtpError) {
      return apiError(err.code, err.message, err.status);
    }
    console.error("[otp.verify]", err);
    return apiError("INTERNAL_ERROR", "Could not verify OTP.", 500);
  }
}
