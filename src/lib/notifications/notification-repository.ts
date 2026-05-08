import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export interface CreateNotificationInput {
  /** Target user. Pass null for broadcast / store-wide notifications. */
  userId: string | null;
  /** Machine-readable type, e.g. "order.confirmed", "refund.approved". */
  type: string;
  title: string;
  body?: string | null;
  storeId?: number;
}

/**
 * Insert a single notification row. Safe to call from anywhere on the server.
 */
export async function createNotification(input: CreateNotificationInput) {
  const [row] = await db
    .insert(notifications)
    .values({
      storeId: input.storeId ?? DEFAULT_STORE_ID,
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
    })
    .returning();
  return row;
}

export const notificationRepository = {
  /**
   * List notifications for a user. Optionally filter by unread only.
   */
  async listForUser(
    userId: string,
    opts: { page?: number; limit?: number; unreadOnly?: boolean } = {},
  ) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const offset = (page - 1) * limit;

    const where = [
      eq(notifications.storeId, DEFAULT_STORE_ID),
      eq(notifications.userId, userId),
    ];
    if (opts.unreadOnly) {
      where.push(eq(notifications.read, false));
    }

    const [rows, countRows, unreadRow] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(and(...where))
        .orderBy(sql`${notifications.createdAt} desc`)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(notifications)
        .where(and(...where)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(notifications)
        .where(
          and(
            eq(notifications.storeId, DEFAULT_STORE_ID),
            eq(notifications.userId, userId),
            eq(notifications.read, false),
          ),
        ),
    ]);

    return {
      items: rows,
      total: countRows[0]?.count ?? 0,
      unreadCount: unreadRow[0]?.count ?? 0,
      page,
      limit,
    };
  },

  async markAsRead(id: number, userId: string) {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId),
          eq(notifications.storeId, DEFAULT_STORE_ID),
        ),
      )
      .returning();
    return result[0] ?? null;
  },

  async markAllAsRead(userId: string) {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.storeId, DEFAULT_STORE_ID),
          eq(notifications.userId, userId),
          eq(notifications.read, false),
        ),
      )
      .returning({ id: notifications.id });
    return result.length;
  },

  async delete(id: number, userId: string) {
    const result = await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId),
          eq(notifications.storeId, DEFAULT_STORE_ID),
        ),
      )
      .returning({ id: notifications.id });
    return result.length > 0;
  },
};
