import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { NewUser, User } from "../domain/user.entity";

/**
 * UserRepository — all DB access for the `users` table is encapsulated here.
 * Per architecture: no module outside this file should touch users via Drizzle.
 */
export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    return (row as User | undefined) ?? null;
  },

  async findById(id: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return (row as User | undefined) ?? null;
  },

  async create(input: NewUser): Promise<{ id: string }> {
    await db.insert(users).values({
      id: input.id,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      phone: input.phone ?? null,
      role: input.role ?? "customer",
      verified: false,
    });
    return { id: input.id };
  },

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, id));
  },

  async markVerified(id: string): Promise<void> {
    await db
      .update(users)
      .set({ verified: true, emailVerified: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  },
};
