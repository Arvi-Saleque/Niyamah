import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { NewsletterSubscribeInput } from "@/lib/validations/marketing";

export const newsletterRepository = {
  async subscribe(input: NewsletterSubscribeInput) {
    const email = input.email.toLowerCase().trim();
    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(
        and(
          eq(newsletterSubscribers.storeId, DEFAULT_STORE_ID),
          eq(newsletterSubscribers.email, email),
        ),
      )
      .limit(1);

    if (existing) {
      if (existing.subscribed) return { subscribed: true, isNew: false };
      const [updated] = await db
        .update(newsletterSubscribers)
        .set({ subscribed: true, unsubscribedAt: null })
        .where(eq(newsletterSubscribers.id, existing.id))
        .returning();
      return { subscribed: true, isNew: false, row: updated };
    }

    const [row] = await db
      .insert(newsletterSubscribers)
      .values({
        storeId: DEFAULT_STORE_ID,
        email,
        name: input.name ?? null,
        source: input.source ?? null,
        subscribed: true,
      })
      .returning();
    return { subscribed: true, isNew: true, row };
  },

  async unsubscribe(email: string) {
    const e = email.toLowerCase().trim();
    const result = await db
      .update(newsletterSubscribers)
      .set({ subscribed: false, unsubscribedAt: new Date() })
      .where(
        and(
          eq(newsletterSubscribers.storeId, DEFAULT_STORE_ID),
          eq(newsletterSubscribers.email, e),
        ),
      )
      .returning({ id: newsletterSubscribers.id });
    return result.length > 0;
  },

  async list(opts: { page?: number; limit?: number } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 50;
    return db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.storeId, DEFAULT_STORE_ID))
      .limit(limit)
      .offset((page - 1) * limit);
  },
};
