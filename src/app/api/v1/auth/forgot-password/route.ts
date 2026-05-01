import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { userRepository } from "@/modules/auth/infrastructure/user.repository";
import {
  generateResetToken,
  storeResetToken,
} from "@/lib/auth/password-reset";

/**
 * POST /api/v1/auth/forgot-password
 *
 * Stub: validates the email and (in Phase 5+) will enqueue a Resend email
 * with a signed reset token. Always returns 200 to avoid email enumeration.
 *
 * Rate limit: 3 requests per IP per hour.
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "forgot-password", 3, 3600);
  if (!limit.success) {
    return apiError(
      "TOO_MANY_REQUESTS",
      "Too many requests. Please try again later.",
      429,
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return apiError("INVALID_JSON", "Invalid request body.", 400);
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  // Lookup user — never reveal whether the email exists.
  const user = await userRepository.findByEmail(parsed.data.email);

  if (user) {
    const token = generateResetToken();
    await storeResetToken(token, user.id);
    // TODO(Phase 22): enqueue Resend email with link to /reset-password?token=...
    // For now, the token is only stored in Redis; client must use the link
    // delivered by the email job (or by direct admin lookup in dev).
  }

  return apiSuccess({
    message:
      "If an account with that email exists, a reset link has been sent.",
  });
}
