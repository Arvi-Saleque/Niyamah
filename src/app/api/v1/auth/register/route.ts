import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import {
  registerUserUseCase,
  EmailAlreadyTakenError,
} from "@/modules/auth/application/register-user.usecase";

/**
 * POST /api/v1/auth/register
 *
 * Body: { name, email, password, phone? }
 * Rate limit: 5 requests per IP per hour
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "register", 5, 3600);
  if (!limit.success) {
    return apiError(
      "TOO_MANY_REQUESTS",
      "Too many registration attempts. Please try again later.",
      429,
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return apiError("INVALID_JSON", "Invalid request body.", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const { userId } = await registerUserUseCase(parsed.data);
    return apiSuccess(
      { userId, message: "Account created successfully." },
      201,
    );
  } catch (err) {
    if (err instanceof EmailAlreadyTakenError) {
      return apiError("EMAIL_TAKEN", err.message, 409);
    }
    console.error("[register] unexpected error:", err);
    return apiError(
      "INTERNAL_ERROR",
      "Something went wrong. Please try again.",
      500,
    );
  }
}
