import type { NextRequest } from "next/server";
import { statsRepository } from "@/modules/commerce/infrastructure/stats.repository";
import { apiSuccess } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

/**
 * GET /api/v1/admin/stats/orders
 * Order count grouped by status.
 */
export async function GET(_req: NextRequest) {
  const guard = await requirePermission("orders.view");
  if ("error" in guard) return guard.error;

  const data = await statsRepository.ordersByStatus();
  return apiSuccess(data);
}
