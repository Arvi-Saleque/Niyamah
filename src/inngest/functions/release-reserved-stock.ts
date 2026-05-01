import { eq, sql } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { orders, orderItems, inventory, payments } from "@/lib/db/schema";

/**
 * 30 minutes after stock is reserved during checkout, if the order is still
 * PENDING and (for non-COD methods) UNPAID, release the reserved stock and
 * cancel the order. COD orders skip the release because confirmation happens
 * out-of-band via admin status update.
 */
export const releaseReservedStock = inngest.createFunction(
  { id: "release-reserved-stock", name: "Release reserved stock" },
  { event: "checkout/inventory.reserved" },
  async ({ event, step }) => {
    await step.sleep("wait-30-minutes", "30m");

    const orderId = event.data.orderId;

    const order = await step.run("load-order", async () => {
      return db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    });
    if (!order) return { skipped: "order_not_found" };

    const pay = await step.run("load-payment", async () => {
      return db.query.payments.findFirst({ where: eq(payments.orderId, orderId) });
    });

    if (pay?.method === "COD") return { skipped: "cod_no_release" };
    if (order.status !== "PENDING") return { skipped: "already_processed" };
    if (pay?.status === "PAID") return { skipped: "already_paid" };

    await step.run("release-stock-and-cancel", async () => {
      await db.transaction(async (tx) => {
        const items = await tx
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));

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
          .where(eq(orders.id, orderId));
      });
    });

    return { released: true, orderId };
  },
);
