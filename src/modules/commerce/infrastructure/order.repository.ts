import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  orderStatusHistory,
  payments,
  inventory,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { OrderStatusUpdateInput } from "@/lib/validations/commerce";

export const orderRepository = {
  async listForUser(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows, countRows] = await Promise.all([
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
    return { items: rows, total: countRows[0]?.count ?? 0, page, limit };
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
      const validStatus = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
        "REFUNDED",
      ].includes(opts.status);
      if (validStatus) {
        where.push(eq(orders.status, opts.status as (typeof orders.$inferSelect)["status"]));
      }
    }

    const [rows, countRows] = await Promise.all([
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
    return { items: rows, total: countRows[0]?.count ?? 0, page, limit };
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

    // Don't bother if state isn't actually changing
    const fromStatus = order.status;
    const toStatus = update.status;

    await db.transaction(async (tx) => {
      // Stock movements at status boundaries
      const reservedStatuses = ["PENDING", "CONFIRMED", "PROCESSING"] as const;
      const wasReserved = (reservedStatuses as readonly string[]).includes(
        fromStatus,
      );

      if (wasReserved && toStatus === "CANCELLED") {
        // Release reservation back to available
        const items = await tx
          .select({
            variantId: orderItems.variantId,
            quantity: orderItems.quantity,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, id));
        for (const it of items) {
          if (!it.variantId) continue;
          await tx
            .update(inventory)
            .set({
              stockReserved: sql`GREATEST(0, ${inventory.stockReserved} - ${it.quantity})`,
              stockAvailable: sql`${inventory.stockAvailable} + ${it.quantity}`,
            })
            .where(eq(inventory.variantId, it.variantId));
        }
        // Mark unpaid payments failed
        await tx
          .update(payments)
          .set({ status: "FAILED" })
          .where(
            and(
              eq(payments.orderId, id),
              sql`${payments.status} IN ('UNPAID','PENDING')`,
            ),
          );
      }

      if (
        (fromStatus === "SHIPPED" || wasReserved) &&
        toStatus === "DELIVERED"
      ) {
        // Convert reservation into actual stock-on-hand deduction
        const items = await tx
          .select({
            variantId: orderItems.variantId,
            quantity: orderItems.quantity,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, id));
        for (const it of items) {
          if (!it.variantId) continue;
          await tx
            .update(inventory)
            .set({
              stockOnHand: sql`GREATEST(0, ${inventory.stockOnHand} - ${it.quantity})`,
              stockReserved: sql`GREATEST(0, ${inventory.stockReserved} - ${it.quantity})`,
            })
            .where(eq(inventory.variantId, it.variantId));
        }
        // For COD orders: mark payment PAID at delivery
        await tx
          .update(payments)
          .set({ status: "PAID" })
          .where(
            and(
              eq(payments.orderId, id),
              eq(payments.method, "COD"),
              sql`${payments.status} IN ('UNPAID','PENDING')`,
            ),
          );
      }

      await tx
        .update(orders)
        .set({ status: toStatus, updatedAt: new Date() })
        .where(eq(orders.id, id));
      await tx.insert(orderStatusHistory).values({
        orderId: id,
        fromStatus,
        toStatus,
        note: update.note ?? null,
        actorId,
      });
    });

    return this.findByIdAdmin(id);
  },
};
