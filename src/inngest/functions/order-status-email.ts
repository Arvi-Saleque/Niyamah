import { inngest } from "@/lib/inngest/client";
import { sendOrderStatusEmail } from "@/lib/resend";

/**
 * Triggered when an admin updates an order's status.
 * Sends a notification email to the customer (best-effort).
 */
export const orderStatusEmail = inngest.createFunction(
  { id: "order-status-email", name: "Order status update email" },
  { event: "commerce/order.status-changed" },
  async ({ event, step }) => {
    const { orderId, newStatus, note, recipientEmail } = event.data as {
      orderId: number;
      newStatus: string;
      note?: string | null;
      recipientEmail?: string | null;
    };
    if (!recipientEmail) return { skipped: "no_recipient" };

    await step.run("send-status-email", async () => {
      await sendOrderStatusEmail({
        to: recipientEmail,
        orderId,
        newStatus,
        note: note ?? null,
      });
    });
    return { ok: true };
  },
);
