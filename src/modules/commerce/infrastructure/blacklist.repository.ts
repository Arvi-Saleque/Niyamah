import { and, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { customerBlacklist } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { BlacklistAddInput } from "@/lib/validations/commerce";

export const blacklistRepository = {
  async list() {
    return db
      .select()
      .from(customerBlacklist)
      .where(eq(customerBlacklist.storeId, DEFAULT_STORE_ID));
  },

  async create(input: BlacklistAddInput, actorId: string) {
    const [row] = await db
      .insert(customerBlacklist)
      .values({
        storeId: DEFAULT_STORE_ID,
        phone: input.phone ?? null,
        email: input.email ?? null,
        reason: input.reason,
        note: input.note ?? null,
        createdBy: actorId,
      })
      .returning();
    return row;
  },

  async remove(id: number) {
    const [row] = await db
      .delete(customerBlacklist)
      .where(
        and(
          eq(customerBlacklist.id, id),
          eq(customerBlacklist.storeId, DEFAULT_STORE_ID),
        ),
      )
      .returning();
    return row ?? null;
  },

  /**
   * Returns the matching blacklist entry if the phone or email is blocked.
   */
  async findMatch(opts: { phone?: string | null; email?: string | null }) {
    const phone = opts.phone?.trim() || null;
    const email = opts.email?.trim().toLowerCase() || null;
    if (!phone && !email) return null;
    const conds = [];
    if (phone) conds.push(eq(customerBlacklist.phone, phone));
    if (email) conds.push(eq(customerBlacklist.email, email));
    const [row] = await db
      .select()
      .from(customerBlacklist)
      .where(
        and(
          eq(customerBlacklist.storeId, DEFAULT_STORE_ID),
          or(...conds),
        ),
      )
      .limit(1);
    return row ?? null;
  },
};
