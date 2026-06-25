import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { userRepository } from "../infrastructure/user.repository";
import type { RegisterInput } from "@/lib/validations/auth";

export class EmailAlreadyTakenError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyTakenError";
  }
}

/**
 * Use case: register a new customer account.
 * - Validates email uniqueness
 * - Hashes password with bcrypt (cost 12)
 * - Creates user with role="customer", verified=false
 *
 * Returns the new user's ID.
 */
export async function registerUserUseCase(input: RegisterInput): Promise<{ userId: string }> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new EmailAlreadyTakenError();
  }

  const passwordHash = await hash(input.password, 12);
  const userId = nanoid();

  await userRepository.create({
    id: userId,
    name: input.name,
    email: input.email,
    passwordHash,
    phone: input.phone ?? null,
    role: "customer",
  });

  return { userId };
}
