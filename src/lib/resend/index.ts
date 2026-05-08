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

export async function sendPasswordResetEmail(opts: {
  to: string;
  resetUrl: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY not set — skipping password reset email");
    return null;
  }
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:auto;color:#1A1814;background:#FAFAF8;padding:24px;">
      <h2 style="font-family:'Playfair Display',serif;color:#C9A96E;margin-bottom:8px;">Niyamah</h2>
      <h3>Reset your password</h3>
      <p>We received a request to reset the password for your account. Click the button below to choose a new password. This link expires in 1 hour.</p>
      <p style="margin:24px 0;">
        <a href="${opts.resetUrl}" style="background:#C9A96E;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a>
      </p>
      <p style="color:#666;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
      <p style="color:#999;font-size:12px;margin-top:16px;">Or copy this link into your browser:<br/><a href="${opts.resetUrl}" style="color:#C9A96E;">${escapeHtml(opts.resetUrl)}</a></p>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: "Niyamah — Reset your password",
    html,
  });
}

/**
 * Sent when an order ships.
 */
export async function sendShipmentDispatchedEmail(opts: {
  to: string;
  customerName?: string | null;
  orderId: number;
  trackingNote?: string | null;
}) {
  const resend = getResend();
  if (!resend) return null;
  const greeting = opts.customerName
    ? `Hi ${escapeHtml(opts.customerName)},`
    : "Hi,";
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:auto;color:#1A1814;background:#FAFAF8;padding:24px;">
      <h2 style="font-family:'Playfair Display',serif;color:#C9A96E;margin-bottom:8px;">Niyamah</h2>
      <h3>Your order is on the way</h3>
      <p>${greeting}</p>
      <p>Good news — your order <strong>#${opts.orderId}</strong> has been dispatched and is heading to your address.</p>
      ${opts.trackingNote ? `<p style="background:#fff;padding:12px;border-left:3px solid #C9A96E;">${escapeHtml(opts.trackingNote)}</p>` : ""}
      <p style="color:#666;font-size:13px;margin-top:24px;">If you have any questions, just reply to this email.</p>
    </div>`;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Niyamah — Order #${opts.orderId} has been shipped`,
    html,
  });
}

/**
 * Sent when a refund is processed.
 */
export async function sendRefundConfirmationEmail(opts: {
  to: string;
  customerName?: string | null;
  orderId: number;
  amount: string;
  currency?: string;
}) {
  const resend = getResend();
  if (!resend) return null;
  const greeting = opts.customerName
    ? `Hi ${escapeHtml(opts.customerName)},`
    : "Hi,";
  const currency = opts.currency ?? "BDT";
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:auto;color:#1A1814;background:#FAFAF8;padding:24px;">
      <h2 style="font-family:'Playfair Display',serif;color:#C9A96E;margin-bottom:8px;">Niyamah</h2>
      <h3>Your refund has been processed</h3>
      <p>${greeting}</p>
      <p>We've processed a refund of <strong>${currency} ${escapeHtml(opts.amount)}</strong> for order <strong>#${opts.orderId}</strong>.</p>
      <p>Depending on your payment method, the funds should reach you within a few business days.</p>
      <p style="color:#666;font-size:13px;margin-top:24px;">Reply to this email if anything looks off.</p>
    </div>`;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Niyamah — Refund processed for order #${opts.orderId}`,
    html,
  });
}

/**
 * Sent to admin/operations when a variant drops to or below its low stock threshold.
 */
export async function sendLowStockAdminEmail(opts: {
  to: string;
  productName: string;
  variantLabel?: string | null;
  sku?: string | null;
  stockAvailable: number;
  threshold: number;
}) {
  const resend = getResend();
  if (!resend) return null;
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:auto;color:#1A1814;background:#FAFAF8;padding:24px;">
      <h2 style="font-family:'Playfair Display',serif;color:#C9A96E;margin-bottom:8px;">Niyamah · Low stock alert</h2>
      <p>The following variant has reached its low stock threshold:</p>
      <table width="100%" cellspacing="0" cellpadding="8" style="border-collapse:collapse;background:#fff;margin:12px 0;">
        <tr><td><strong>Product</strong></td><td>${escapeHtml(opts.productName)}</td></tr>
        ${opts.variantLabel ? `<tr><td><strong>Variant</strong></td><td>${escapeHtml(opts.variantLabel)}</td></tr>` : ""}
        ${opts.sku ? `<tr><td><strong>SKU</strong></td><td>${escapeHtml(opts.sku)}</td></tr>` : ""}
        <tr><td><strong>Available</strong></td><td>${opts.stockAvailable}</td></tr>
        <tr><td><strong>Threshold</strong></td><td>${opts.threshold}</td></tr>
      </table>
      <p style="color:#666;font-size:13px;">Restock soon to avoid out-of-stock listings.</p>
    </div>`;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Niyamah — Low stock: ${opts.productName}`,
    html,
  });
}

/**
 * Generic Resend send. No-op if RESEND_API_KEY is not configured.
 */
export async function sendGenericEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  if (!resend) return null;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
