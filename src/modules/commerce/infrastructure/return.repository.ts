import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  returnRequests,
  orders,
  orderItems,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { ReturnRequestItem } from "@/lib/validations/commerce";

type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export const returnRepository = {
  async create(input: {
    orderId: number;
    userId: string | null;
    reason: string;
    items: ReturnRequestItem[];
  }) {
    const [row] = await db
      .insert(returnRequests)
      .values({
        storeId: DEFAULT_STORE_ID,
        orderId: input.orderId,
        userId: input.userId,
        reason: input.reason,
        items: input.items,
        status: "PENDING",
      })
      .returning();
    return row;
  },

  async findById(id: number) {
    const row = await db.query.returnRequests.findFirst({
      where: and(
        eq(returnRequests.id, id),
        eq(returnRequests.storeId, DEFAULT_STORE_ID),
      ),
    });
    return row ?? null;
  },

  async findByIdForUser(id: number, userId: string) {
    const row = await db.query.returnRequests.findFirst({
      where: and(
        eq(returnRequests.id, id),
        eq(returnRequests.userId, userId),
        eq(returnRequests.storeId, DEFAULT_STORE_ID),
      ),
    });
    return row ?? null;
  },

  async listForOrder(orderId: number) {
    return db
      .select()
      .from(returnRequests)
      .where(
        and(
          eq(returnRequests.orderId, orderId),
          eq(returnRequests.storeId, DEFAULT_STORE_ID),
        ),
      )
      .orderBy(desc(returnRequests.createdAt));
  },

  async listForUser(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(returnRequests)
        .where(
          and(
            eq(returnRequests.userId, userId),
            eq(returnRequests.storeId, DEFAULT_STORE_ID),
          ),
        )
        .orderBy(desc(returnRequests.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(returnRequests)
        .where(
          and(
            eq(returnRequests.userId, userId),
            eq(returnRequests.storeId, DEFAULT_STORE_ID),
          ),
        ),
    ]);
    return { items: rows, total: countRows[0]?.count ?? 0, page, limit };
  },

  async listAdmin(opts: {
    page?: number;
    limit?: number;
    status?: ReturnStatus;
  } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const offset = (page - 1) * limit;

    const where = [eq(returnRequests.storeId, DEFAULT_STORE_ID)];
    if (opts.status) where.push(eq(returnRequests.status, opts.status));

    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(returnRequests)
        .where(and(...where))
        .orderBy(desc(returnRequests.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(returnRequests)
        .where(and(...where)),
    ]);
    return { items: rows, total: countRows[0]?.count ?? 0, page, limit };
  },

  /**
   * Validate that the requested orderItems belong to the order and that
   * requested quantities don't exceed the original purchased quantity.
   */
  async validateRequestItems(
    orderId: number,
    items: ReturnRequestItem[],
  ): Promise<{ ok: true } | { ok: false; reason: string }> {
    const rows = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        variantId: orderItems.variantId,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
    const map = new Map(rows.map((r) => [r.id, r]));
    for (const it of items) {
      const row = map.get(it.orderItemId);
      if (!row) {
        return { ok: false, reason: `orderItem ${it.orderItemId} not in order` };
      }
      if (it.quantity > row.quantity) {
        return {
          ok: false,
          reason: `orderItem ${it.orderItemId}: quantity exceeds purchased`,
        };
      }
    }
    return { ok: true };
  },

  async hasOpenRequestForOrder(orderId: number) {
    const row = await db
      .select({ id: returnRequests.id })
      .from(returnRequests)
      .where(
        and(
          eq(returnRequests.orderId, orderId),
          eq(returnRequests.storeId, DEFAULT_STORE_ID),
          eq(returnRequests.status, "PENDING"),
        ),
      )
      .limit(1);
    return row.length > 0;
  },

  async getOrderForReturn(orderId: number, userId: string) {
    return db.query.orders.findFirst({
      where: and(
        eq(orders.id, orderId),
        eq(orders.userId, userId),
        eq(orders.storeId, DEFAULT_STORE_ID),
      ),
    });
  },
};
