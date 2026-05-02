import type { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { consumeResetToken } from "@/lib/auth/password-reset";
import { userRepository } from "@/modules/auth/infrastructure/user.repository";

const BCRYPT_COST = 12;

/**
 * POST /api/v1/auth/reset-password
 *
 * Body: { token, password, confirmPassword }
 * Consumes a single-use reset token from Redis and updates the user's password.
 *
 * Rate limit: 5 requests per IP per 10 minutes.
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "reset-password", 5, 600);
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

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const userId = await consumeResetToken(parsed.data.token);
  if (!userId) {
    return apiError(
      "INVALID_OR_EXPIRED_TOKEN",
      "This reset link is invalid or has expired.",
      400,
    );
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return apiError("USER_NOT_FOUND", "Account not found.", 404);
  }

  const passwordHash = await hash(parsed.data.password, BCRYPT_COST);
  await userRepository.updatePassword(userId, passwordHash);

  return apiSuccess({ message: "Password updated. You can now sign in." });
}
