import type { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

/**
 * GET /api/v1/admin/orders/[id]
 *
 * Returns full order details (order, items, status history, payments) for admins.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return apiError("INVALID_ID", "Invalid order id.", 400);
  }

  const order = await orderRepository.findByIdAdmin(orderId);
  if (!order) {
    return apiError("NOT_FOUND", "Order not found.", 404);
  }

  return apiSuccess(order);
}
