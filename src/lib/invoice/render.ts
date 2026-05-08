/**
 * Server-side HTML invoice generator.
 * Frontend / printer can render this as PDF (window.print or third-party).
 */

interface InvoiceItem {
  productName: string;
  variantLabel?: string | null;
  sku?: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface InvoiceData {
  orderId: number;
  createdAt: Date | string;
  status: string;
  shipping: {
    name?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    district?: string | null;
    area?: string | null;
    city?: string | null;
    postalCode?: string | null;
  };
  items: InvoiceItem[];
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  total: string;
  couponCode?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  store: {
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
  };
}

function escape(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderInvoiceHtml(data: InvoiceData): string {
  const created =
    typeof data.createdAt === "string"
      ? new Date(data.createdAt)
      : data.createdAt;
  const dateStr = created.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const itemsRows = data.items
    .map(
      (i) => `
        <tr>
          <td>
            <div>${escape(i.productName)}${
              i.variantLabel ? ` <span style="color:#888;">— ${escape(i.variantLabel)}</span>` : ""
            }</div>
            ${i.sku ? `<small style="color:#888;">SKU: ${escape(i.sku)}</small>` : ""}
          </td>
          <td align="center">${i.quantity}</td>
          <td align="right">৳${escape(i.unitPrice)}</td>
          <td align="right">৳${escape(i.totalPrice)}</td>
        </tr>`,
    )
    .join("");

  const addrParts = [
    data.shipping.addressLine1,
    data.shipping.addressLine2,
    data.shipping.area,
    data.shipping.district,
    data.shipping.city,
    data.shipping.postalCode,
  ]
    .filter(Boolean)
    .map(escape)
    .join(", ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice #${data.orderId} — ${escape(data.store.name)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; color: #1A1814; max-width: 820px; margin: 0 auto; padding: 32px; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #C9A96E; padding-bottom: 16px; margin-bottom: 24px; }
  .brand { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #C9A96E; letter-spacing: 0.5px; }
  .meta { text-align: right; font-size: 13px; color: #555; }
  .meta strong { color: #1A1814; font-size: 16px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 24px 0 8px; }
  .row { display: flex; gap: 24px; margin-bottom: 16px; }
  .col { flex: 1; font-size: 13px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  thead th { background: #F5F4F1; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600; }
  tbody td { padding: 10px; border-bottom: 1px solid #f0efea; vertical-align: top; }
  .totals { margin-top: 16px; margin-left: auto; width: 320px; font-size: 13px; }
  .totals tr td { padding: 4px 0; border: none; }
  .totals tr:last-child td { border-top: 1px solid #ccc; padding-top: 8px; font-weight: 700; font-size: 15px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center; }
  @media print {
    body { padding: 16px; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${escape(data.store.name)}</div>
      ${data.store.address ? `<div style="font-size:12px;color:#666;margin-top:4px;">${escape(data.store.address)}</div>` : ""}
      ${data.store.phone ? `<div style="font-size:12px;color:#666;">Phone: ${escape(data.store.phone)}</div>` : ""}
      ${data.store.email ? `<div style="font-size:12px;color:#666;">${escape(data.store.email)}</div>` : ""}
    </div>
    <div class="meta">
      <div><strong>INVOICE</strong></div>
      <div>Order #${data.orderId}</div>
      <div>${dateStr}</div>
      <div style="margin-top:6px;">Status: <strong>${escape(data.status)}</strong></div>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h2>Bill To</h2>
      <div><strong>${escape(data.shipping.name)}</strong></div>
      <div>${escape(data.shipping.phone)}</div>
      <div>${addrParts}</div>
    </div>
    <div class="col">
      <h2>Payment</h2>
      <div>Method: <strong>${escape(data.paymentMethod)}</strong></div>
      <div>Status: <strong>${escape(data.paymentStatus)}</strong></div>
      ${data.couponCode ? `<div>Coupon: <strong>${escape(data.couponCode)}</strong></div>` : ""}
    </div>
  </div>

  <h2>Items</h2>
  <table>
    <thead><tr><th>Product</th><th align="center">Qty</th><th align="right">Unit</th><th align="right">Total</th></tr></thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <table class="totals">
    <tr><td>Subtotal</td><td align="right">৳${escape(data.subtotal)}</td></tr>
    ${Number(data.discountAmount) > 0 ? `<tr><td>Discount</td><td align="right">-৳${escape(data.discountAmount)}</td></tr>` : ""}
    <tr><td>Shipping</td><td align="right">৳${escape(data.shippingAmount)}</td></tr>
    <tr><td>Total</td><td align="right">৳${escape(data.total)}</td></tr>
  </table>

  <div class="footer">
    Thank you for shopping with ${escape(data.store.name)}.
    <div class="no-print" style="margin-top:8px;">
      <button onclick="window.print()" style="padding:6px 14px;border:1px solid #C9A96E;background:#fff;color:#C9A96E;cursor:pointer;border-radius:4px;">Print / Save as PDF</button>
    </div>
  </div>
</body>
</html>`;
}
