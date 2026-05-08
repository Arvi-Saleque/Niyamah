import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  orderStatusHistory,
  inventory,
  payments,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export class CancelOrderError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
    this.name = "CancelOrderError";
  }
}

/**
 * Customer-initiated cancellation.
 * Allowed only when the order belongs to the user and is still in
 * PENDING / CONFIRMED / PROCESSING. Once SHIPPED we refuse — at that point
 * the customer must use the return flow.
 *
 * On success:
 *  - status → CANCELLED
 *  - reserved stock released (stockReserved -= qty, stockAvailable += qty)
 *  - any UNPAID/PENDING payment row marked FAILED
 *  - order_status_history entry appended (actor = userId)
 */
export async function cancelOrderUseCase(opts: {
  orderId: number;
  userId: string;
  reason?: string;
}) {
  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.storeId, DEFAULT_STORE_ID),
      eq(orders.id, opts.orderId),
      eq(orders.userId, opts.userId),
    ),
  });
  if (!order) throw new CancelOrderError("NOT_FOUND", "Order not found.", 404);

  if (
    order.status === "CANCELLED" ||
    order.status === "REFUNDED" ||
    order.status === "RETURNED"
  ) {
    throw new CancelOrderError("ALREADY_CLOSED", `Order is already ${order.status}.`);
  }
  if (order.status === "SHIPPED" || order.status === "DELIVERED") {
    throw new CancelOrderError(
      "TOO_LATE",
      "Order has already shipped — please request a return instead.",
    );
  }

  await db.transaction(async (tx) => {
    const items = await tx
      .select({ variantId: orderItems.variantId, quantity: orderItems.quantity })
      .from(orderItems)
      .where(eq(orderItems.orderId, opts.orderId));

    // Release reserved stock for each variant
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

    await tx
      .update(orders)
      .set({ status: "CANCELLED", updatedAt: new Date() })
      .where(eq(orders.id, opts.orderId));

    await tx.insert(orderStatusHistory).values({
      orderId: opts.orderId,
      fromStatus: order.status,
      toStatus: "CANCELLED",
      note: opts.reason ?? "Cancelled by customer",
      actorId: opts.userId,
    });

    // Mark COD payment(s) failed (no money to refund)
    await tx
      .update(payments)
      .set({ status: "FAILED" })
      .where(
        and(
          eq(payments.orderId, opts.orderId),
          sql`${payments.status} IN ('UNPAID','PENDING')`,
        ),
      );
  });

  return { ok: true as const };
}
