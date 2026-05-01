import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 registrations per IP per hour
  const rateLimitResult = await rateLimit(req, "register", 5, 3600);
  if (!rateLimitResult.success) {
    return apiError("TOO_MANY_REQUESTS", "Too many registration attempts. Please try again later.", 429);
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

  const { name, email, password, phone } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return apiError("EMAIL_TAKEN", "An account with this email already exists.", 409);
  }

  const passwordHash = await hash(password, 12);
  const userId = nanoid();

  await db.insert(users).values({
    id: userId,
    name,
    email,
    passwordHash,
    phone: phone ?? null,
    role: "customer",
    verified: false,
  });

  return apiSuccess({ message: "Account created successfully." }, 201);
}
