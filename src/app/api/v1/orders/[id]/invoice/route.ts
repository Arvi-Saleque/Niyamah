import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { storeSettings, stores } from "@/lib/db/schema";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { renderInvoiceHtml } from "@/lib/invoice/render";
import { apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

interface Ctx {
  params: Promise<{ id: string }>;
}

const ADMIN_ROLES = new Set(["superadmin", "admin", "manager", "staff"]);

/**
 * GET /api/v1/orders/[id]/invoice
 *
 * Returns a printable HTML invoice. Customers see only their own orders;
 * admins see any order. Frontend / printer can render this as PDF.
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const orderId = Number(idStr);
  if (!Number.isInteger(orderId) || orderId <= 0)
    return apiError("INVALID_ID", "Invalid order id.", 400);

  const isAdmin = ADMIN_ROLES.has(guard.ctx.role);
  const order = isAdmin
    ? await orderRepository.findByIdAdmin(orderId)
    : await orderRepository.findByIdForUser(orderId, guard.ctx.userId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

  // Resolve store branding for the invoice header
  const [store] = await db
    .select({ name: stores.name })
    .from(stores)
    .where(eq(stores.id, DEFAULT_STORE_ID))
    .limit(1);
  const [settings] = await db
    .select({
      address: storeSettings.address,
      phone: storeSettings.contactPhone,
      email: storeSettings.contactEmail,
    })
    .from(storeSettings)
    .where(eq(storeSettings.storeId, DEFAULT_STORE_ID))
    .limit(1);

  const payment = order.payments[0];
  const html = renderInvoiceHtml({
    orderId: order.id,
    createdAt: order.createdAt,
    status: order.status,
    shipping: {
      name: order.shippingName,
      phone: order.shippingPhone,
      addressLine1: order.shippingAddressLine1,
      addressLine2: order.shippingAddressLine2,
      district: order.shippingDistrict,
      area: order.shippingArea,
      city: order.shippingCity,
      postalCode: order.shippingPostalCode,
    },
    items: order.items.map((i) => ({
      productName: i.productName,
      variantLabel: i.variantLabel,
      sku: i.sku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
    })),
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    shippingAmount: order.shippingAmount,
    total: order.total,
    couponCode: order.couponCode,
    paymentMethod: payment?.method ?? "COD",
    paymentStatus: payment?.status ?? "UNPAID",
    store: {
      name: store?.name ?? "Niyamah",
      address: settings?.address ?? null,
      phone: settings?.phone ?? null,
      email: settings?.email ?? null,
    },
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
