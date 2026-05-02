import type { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

/**
 * Public order tracking — by order id + recipient phone (or email for guests).
 * Does NOT leak any other order data; only this order's status timeline.
 *
 * GET /api/v1/track?orderId=123&phone=01700000000
 *      OR ?orderId=123&email=foo@bar.com
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const orderId = Number(sp.get("orderId"));
  const phone = sp.get("phone")?.trim();
  const email = sp.get("email")?.trim();

  if (!Number.isInteger(orderId) || orderId <= 0)
    return apiError("INVALID_ID", "Invalid order id.", 400);
  if (!phone && !email)
    return apiError(
      "MISSING_IDENTIFIER",
      "phone or email is required to verify ownership.",
      400,
    );

  const order = await orderRepository.findByIdAdmin(orderId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

  // Verify ownership for guest orders or by registered email
  if (phone && order.guestPhone && order.guestPhone === phone) {
    // ok
  } else if (email && order.guestEmail && order.guestEmail.toLowerCase() === email.toLowerCase()) {
    // ok
  } else {
    return apiError("ACCESS_DENIED", "Verification details do not match.", 403);
  }

  return apiSuccess({
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      totalPrice: i.totalPrice,
    })),
    timeline: order.statusHistory.map((s) => ({
      from: s.fromStatus,
      to: s.toStatus,
      note: s.note,
      at: s.createdAt,
    })),
  });
}
