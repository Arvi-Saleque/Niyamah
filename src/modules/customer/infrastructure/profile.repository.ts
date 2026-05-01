import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { userRepository } from "@/modules/auth/infrastructure/user.repository";
import type {
  ProfileUpdateInput,
  PasswordChangeInput,
} from "@/lib/validations/customer";

export class IncorrectPasswordError extends Error {
  constructor() {
    super("Current password is incorrect.");
    this.name = "IncorrectPasswordError";
  }
}

export const profileRepository = {
  async getProfile(userId: string) {
    const u = await userRepository.findById(userId);
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      role: u.role,
      createdAt: u.createdAt,
    };
  },

  async updateProfile(userId: string, input: ProfileUpdateInput) {
    const [row] = await db
      .update(users)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return row ?? null;
  },

  async changePassword(userId: string, input: PasswordChangeInput) {
    const u = await userRepository.findById(userId);
    if (!u || !u.passwordHash) throw new IncorrectPasswordError();
    const ok = await bcrypt.compare(input.currentPassword, u.passwordHash);
    if (!ok) throw new IncorrectPasswordError();
    const hash = await bcrypt.hash(input.newPassword, 12);
    await userRepository.updatePassword(userId, hash);
    return { changed: true };
  },
};
