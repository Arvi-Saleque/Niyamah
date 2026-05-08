import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  returnRequests,
  orders,
  orderItems,
  payments,
  inventory,
  orderStatusHistory,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { inngest } from "@/lib/inngest/client";
import type { ReturnRequestItem } from "@/lib/validations/commerce";

export class RefundError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/**
 * Approve a return request:
 *  - mark request APPROVED
 *  - update order status -> RETURNED
 *  - update payment status -> REFUNDED (or PARTIALLY_REFUNDED if partial)
 *  - restock inventory for returned items
 *  - append order status history
 *  - fire commerce/refund.approved event
 *
 * Runs inside a transaction to keep state consistent.
 */
export async function approveReturnUseCase(opts: {
  returnRequestId: number;
  adminId: string;
  adminNote?: string | null;
  refundAmount: number;
}) {
  const result = await db.transaction(async (tx) => {
    const reqRow = await tx.query.returnRequests.findFirst({
      where: and(
        eq(returnRequests.id, opts.returnRequestId),
        eq(returnRequests.storeId, DEFAULT_STORE_ID),
      ),
    });
    if (!reqRow) throw new RefundError("NOT_FOUND", "Return request not found.", 404);
    if (reqRow.status !== "PENDING") {
      throw new RefundError(
        "ALREADY_RESOLVED",
        `Request is already ${reqRow.status}.`,
        409,
      );
    }

    const order = await tx.query.orders.findFirst({
      where: and(
        eq(orders.id, reqRow.orderId),
        eq(orders.storeId, DEFAULT_STORE_ID),
      ),
    });
    if (!order) throw new RefundError("ORDER_NOT_FOUND", "Order not found.", 404);

    if (opts.refundAmount > Number(order.total)) {
      throw new RefundError(
        "REFUND_EXCEEDS_TOTAL",
        "Refund amount exceeds order total.",
      );
    }

    const items = (reqRow.items ?? []) as ReturnRequestItem[];

    // Restock inventory for variants tied to the returned items.
    for (const it of items) {
      const oi = await tx.query.orderItems.findFirst({
        where: eq(orderItems.id, it.orderItemId),
      });
      if (!oi || !oi.variantId) continue;
      await tx
        .update(inventory)
        .set({
          stockOnHand: sql`${inventory.stockOnHand} + ${it.quantity}`,
          stockAvailable: sql`${inventory.stockAvailable} + ${it.quantity}`,
        })
        .where(eq(inventory.variantId, oi.variantId));
    }

    // Update payment status (use PARTIALLY_REFUNDED if amount < order total).
    const isPartial = opts.refundAmount < Number(order.total);
    await tx
      .update(payments)
      .set({ status: isPartial ? "PARTIALLY_REFUNDED" : "REFUNDED" })
      .where(eq(payments.orderId, order.id));

    // Update order status -> RETURNED.
    await tx
      .update(orders)
      .set({ status: "RETURNED", updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    await tx.insert(orderStatusHistory).values({
      orderId: order.id,
      fromStatus: order.status,
      toStatus: "RETURNED",
      note: `Return approved (refund ${opts.refundAmount})`,
      actorId: opts.adminId,
    });

    // Mark the return request resolved.
    const [updated] = await tx
      .update(returnRequests)
      .set({
        status: "APPROVED",
        adminNote: opts.adminNote ?? null,
        refundAmount: opts.refundAmount.toFixed(2),
        resolvedBy: opts.adminId,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(returnRequests.id, reqRow.id))
      .returning();

    return { request: updated, order };
  });

  // Fire event for downstream notifications/email.
  const recipient =
    result.order.userId == null
      ? result.order.guestEmail ?? null
      : null;

  inngest
    .send({
      name: "commerce/refund.approved",
      data: {
        returnRequestId: result.request.id,
        orderId: result.order.id,
        refundAmount: opts.refundAmount,
        currency: "BDT",
        ...(recipient ? { recipientEmail: recipient } : {}),
      },
    })
    .catch((err) => console.error("[refund] event dispatch failed", err));

  return result.request;
}

/**
 * Reject a return request — no inventory or payment changes.
 */
export async function rejectReturnUseCase(opts: {
  returnRequestId: number;
  adminId: string;
  adminNote?: string | null;
}) {
  const reqRow = await db.query.returnRequests.findFirst({
    where: and(
      eq(returnRequests.id, opts.returnRequestId),
      eq(returnRequests.storeId, DEFAULT_STORE_ID),
    ),
  });
  if (!reqRow) throw new RefundError("NOT_FOUND", "Return request not found.", 404);
  if (reqRow.status !== "PENDING") {
    throw new RefundError(
      "ALREADY_RESOLVED",
      `Request is already ${reqRow.status}.`,
      409,
    );
  }

  const [updated] = await db
    .update(returnRequests)
    .set({
      status: "REJECTED",
      adminNote: opts.adminNote ?? null,
      resolvedBy: opts.adminId,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(returnRequests.id, reqRow.id))
    .returning();
  return updated;
}
