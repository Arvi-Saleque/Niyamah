import type { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ id: string }>;
}

const ADMIN_ROLES = new Set(["superadmin", "admin", "manager", "staff"]);

export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0)
    return apiError("INVALID_ID", "Invalid id.", 400);

  const isAdmin = ADMIN_ROLES.has(guard.ctx.role);
  const order = isAdmin
    ? await orderRepository.findByIdAdmin(id)
    : await orderRepository.findByIdForUser(id, guard.ctx.userId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
  return apiSuccess(order);
}
