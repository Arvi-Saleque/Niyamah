import { inngest } from "@/lib/inngest/client";
import { sendGenericEmail } from "@/lib/resend";

/**
 * Notifies operations team about a high-risk COD order.
 * No-op if HIGH_RISK_ALERT_EMAIL env var is not set.
 */
export const highRiskOrderAlert = inngest.createFunction(
  {
    id: "high-risk-order-alert",
    name: "High-risk order alert",
    triggers: [{ event: "commerce/order.high-risk" }],
  },
  async ({ event, step }) => {
    const to = process.env.HIGH_RISK_ALERT_EMAIL;
    if (!to) return { skipped: "no_alert_email_configured" };

    const { orderId, score, reasons, total, paymentMethod } = event.data as {
      orderId: number;
      score: number;
      reasons: string[];
      total: number;
      paymentMethod: string;
    };

    await step.run("send-alert", async () => {
      const reasonsHtml = reasons.map((r) => `<li>${r}</li>`).join("");
      await sendGenericEmail({
        to,
        subject: `[High Risk] Order #${orderId} flagged (score ${score})`,
        html: `
          <h2>High-risk order flagged</h2>
          <p>Order <strong>#${orderId}</strong> requires manual review.</p>
          <ul>
            <li>Score: <strong>${score}/100</strong></li>
            <li>Total: ৳${total.toLocaleString()}</li>
            <li>Payment: ${paymentMethod}</li>
          </ul>
          <p><strong>Reasons:</strong></p>
          <ul>${reasonsHtml}</ul>
        `,
      });
    });
    return { ok: true };
  },
);
