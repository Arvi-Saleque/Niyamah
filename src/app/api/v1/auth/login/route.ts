import type { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { userRepository } from "@/modules/auth/infrastructure/user.repository";

/**
 * POST /api/v1/auth/login
 *
 * Programmatic credential check (REST surface). Web clients should prefer
 * `signIn('credentials', ...)` from next-auth/react which sets the session
 * cookie. This endpoint exists for mobile / external integrations and just
 * verifies the credentials, returning user info on success.
 *
 * Rate limit: 10 requests per IP per minute.
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "login", 10, 60);
  if (!limit.success) {
    return apiError(
      "TOO_MANY_REQUESTS",
      "Too many login attempts. Please try again shortly.",
      429,
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return apiError("INVALID_JSON", "Invalid request body.", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { email, password } = parsed.data;
  const user = await userRepository.findByEmail(email);

  if (!user || !user.passwordHash) {
    return apiError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  const ok = await compare(password, user.passwordHash);
  if (!ok) {
    return apiError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  return apiSuccess({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
