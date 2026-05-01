import { Resend } from "resend";

let cached: Resend | null | undefined;

function getResend(): Resend | null {
  if (cached !== undefined) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    cached = null;
    return null;
  }
  cached = new Resend(key);
  return cached;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Niyamah <orders@niyamah.com.bd>";

export interface OrderEmailPayload {
  to: string;
  order: {
    id: number;
    total: string;
    subtotal: string;
    shippingAmount: string;
    discountAmount: string;
    status: string;
    couponCode?: string | null;
    items: Array<{
      productName: string;
      sku: string | null;
      quantity: number;
      unitPrice: string;
      totalPrice: string;
    }>;
  };
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  const resend = getResend();
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY not set — skipping email");
    return null;
  }

  const { to, order } = payload;
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.productName)}${
          i.sku ? ` <small>(${escapeHtml(i.sku)})</small>` : ""
        }</td><td align="center">${i.quantity}</td><td align="right">৳${
          i.totalPrice
        }</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:auto;color:#1A1814;background:#FAFAF8;padding:24px;">
      <h2 style="font-family:'Playfair Display',serif;color:#C9A96E;margin-bottom:8px;">Niyamah</h2>
      <h3>Order #${order.id} confirmed</h3>
      <p>Thank you for your order. Below are the details.</p>
      <table width="100%" cellspacing="0" cellpadding="8" style="border-collapse:collapse;background:#fff;">
        <thead><tr style="background:#F5F4F1;"><th align="left">Item</th><th>Qty</th><th align="right">Total</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <table width="100%" style="margin-top:16px;">
        <tr><td>Subtotal</td><td align="right">৳${order.subtotal}</td></tr>
        ${
          Number(order.discountAmount) > 0
            ? `<tr><td>Discount${
                order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ""
              }</td><td align="right">-৳${order.discountAmount}</td></tr>`
            : ""
        }
        <tr><td>Shipping</td><td align="right">৳${order.shippingAmount}</td></tr>
        <tr><td><strong>Total</strong></td><td align="right"><strong>৳${order.total}</strong></td></tr>
      </table>
      <p style="margin-top:24px;color:#666;font-size:13px;">If you have any questions, just reply to this email.</p>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Niyamah — Order #${order.id} confirmed`,
    html,
  });
}

export async function sendOrderStatusEmail(opts: {
  to: string;
  orderId: number;
  newStatus: string;
  note?: string | null;
}) {
  const resend = getResend();
  if (!resend) return null;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Niyamah — Order #${opts.orderId} update: ${opts.newStatus}`,
    html: `<p>Your order <strong>#${opts.orderId}</strong> status has been updated to <strong>${escapeHtml(
      opts.newStatus,
    )}</strong>.</p>${opts.note ? `<p>${escapeHtml(opts.note)}</p>` : ""}`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
