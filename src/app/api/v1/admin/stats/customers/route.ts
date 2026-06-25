import type { NextRequest } from "next/server";
import { statsRepository } from "@/modules/commerce/infrastructure/stats.repository";
import { apiSuccess } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

/**
 * GET /api/v1/admin/stats/customers
 * Customer counts: total, new this month, repeat buyers.
 */
export async function GET(_req: NextRequest) {
  const guard = await requirePermission("analytics.view");
  if ("error" in guard) return guard.error;

  const data = await statsRepository.customers();
  return apiSuccess(data);
}
