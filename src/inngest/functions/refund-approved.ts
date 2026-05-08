import { eq } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { sendRefundConfirmationEmail } from "@/lib/resend";
import { createNotification } from "@/lib/notifications/notification-repository";

/**
 * Sends a refund confirmation email and an in-app notification when a
 * return is approved.
 */
export const refundApproved = inngest.createFunction(
  {
    id: "refund-approved",
    name: "Refund approved — notify customer",
    triggers: [{ event: "commerce/refund.approved" }],
  },
  async ({ event, step }) => {
    const { orderId, refundAmount, currency, recipientEmail } = event.data as {
      orderId: number;
      refundAmount: number;
      currency: string;
      recipientEmail?: string | null;
    };

    const ctx = await step.run("load-recipient", async () => {
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });
      if (!order) return null;
      let email = recipientEmail ?? order.guestEmail ?? null;
      let name: string | null = order.shippingName ?? null;
      let userId: string | null = order.userId;
      if (!email && order.userId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, order.userId),
        });
        email = user?.email ?? null;
        name = user?.name ?? name;
      }
      return { email, name, userId };
    });
    if (!ctx) return { skipped: "order_not_found" };

    await step.run("send-email", async () => {
      if (!ctx.email) return;
      await sendRefundConfirmationEmail({
        to: ctx.email,
        customerName: ctx.name,
        orderId,
        amount: refundAmount.toFixed(2),
        currency,
      });
    });

    if (ctx.userId) {
      await step.run("create-notification", async () => {
        await createNotification({
          userId: ctx.userId,
          type: "refund.approved",
          title: `Refund processed for order #${orderId}`,
          body: `${currency} ${refundAmount.toFixed(2)} has been refunded.`,
        });
      });
    }

    return { ok: true };
  },
);
