import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  orderStatusHistory,
  payments,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { OrderStatusUpdateInput } from "@/lib/validations/commerce";

export const orderRepository = {
  async listForUser(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows, [{ count }]] = await Promise.all([
      db
        .select()
        .from(orders)
        .where(
          and(eq(orders.storeId, DEFAULT_STORE_ID), eq(orders.userId, userId)),
        )
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(
          and(eq(orders.storeId, DEFAULT_STORE_ID), eq(orders.userId, userId)),
        ),
    ]);
    return { items: rows, total: count, page, limit };
  },

  async listAdmin(opts: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const offset = (page - 1) * limit;

    const where = [eq(orders.storeId, DEFAULT_STORE_ID)];
    if (opts.status) {
      where.push(
        eq(
          orders.status,
          opts.status as Parameters<typeof eq<typeof orders.status>>[1],
        ),
      );
    }

    const [rows, [{ count }]] = await Promise.all([
      db
        .select()
        .from(orders)
        .where(and(...where))
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(and(...where)),
    ]);
    return { items: rows, total: count, page, limit };
  },

  async findByIdForUser(id: number, userId: string) {
    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.storeId, DEFAULT_STORE_ID),
        eq(orders.id, id),
        eq(orders.userId, userId),
      ),
    });
    if (!order) return null;
    return this.hydrate(order);
  },

  async findByIdAdmin(id: number) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.storeId, DEFAULT_STORE_ID), eq(orders.id, id)),
    });
    if (!order) return null;
    return this.hydrate(order);
  },

  async findByIdempotencyKey(key: string) {
    const row = await db.query.orders.findFirst({
      where: and(
        eq(orders.storeId, DEFAULT_STORE_ID),
        eq(orders.idempotencyKey, key),
      ),
    });
    return row ?? null;
  },

  async hydrate(order: typeof orders.$inferSelect) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    const history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, order.id))
      .orderBy(asc(orderStatusHistory.createdAt));
    const pays = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id));
    return { ...order, items, statusHistory: history, payments: pays };
  },

  async updateStatus(
    id: number,
    update: OrderStatusUpdateInput,
    actorId: string,
  ) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.storeId, DEFAULT_STORE_ID), eq(orders.id, id)),
    });
    if (!order) return null;

    await db.transaction(async (tx) => {
      await tx
        .update(orders)
        .set({ status: update.status, updatedAt: new Date() })
        .where(eq(orders.id, id));
      await tx.insert(orderStatusHistory).values({
        orderId: id,
        fromStatus: order.status,
        toStatus: update.status,
        note: update.note ?? null,
        actorId,
      });
    });

    return this.findByIdAdmin(id);
  },
};
