import { inngest } from "@/lib/inngest/client";

/**
 * Server-side Meta Conversions API forwarder.
 * Triggered by `commerce/order.created` after a successful checkout.
 * No-ops if META_ACCESS_TOKEN / META_PIXEL_ID env vars are not configured.
 *
 * Improves attribution accuracy when client-side Pixel is blocked.
 */
export const metaCapiPurchase = inngest.createFunction(
  { id: "meta-capi-purchase", name: "Meta CAPI - Purchase event" },
  { event: "commerce/order.created" },
  async ({ event, step }) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!accessToken || !pixelId) {
      return { skipped: "meta_not_configured" };
    }

    const { orderId, total, currency, email, phone, items } = event.data as {
      orderId: number | string;
      total: number;
      currency: string;
      email?: string;
      phone?: string;
      items?: Array<{ id: number | string; quantity: number; price: number }>;
    };

    return await step.run("send-capi", async () => {
      const userData: Record<string, unknown> = {};
      if (email) userData.em = await sha256(email.toLowerCase().trim());
      if (phone) userData.ph = await sha256(phone.replace(/\D/g, ""));

      const payload = {
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: `order_${orderId}`,
            action_source: "website",
            user_data: userData,
            custom_data: {
              currency,
              value: total,
              ...(items && {
                contents: items.map((i) => ({
                  id: String(i.id),
                  quantity: i.quantity,
                  item_price: i.price,
                })),
                content_type: "product",
              }),
            },
          },
        ],
      };

      const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Meta CAPI failed: ${res.status} ${txt}`);
      }
      return { sent: true, orderId };
    });
  },
);

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
