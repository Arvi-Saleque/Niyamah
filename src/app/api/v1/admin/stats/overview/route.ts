import type { NextRequest } from "next/server";
import { statsRepository } from "@/modules/commerce/infrastructure/stats.repository";
import { apiSuccess } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

/**
 * GET /api/v1/admin/stats/overview
 * High-level dashboard numbers: revenue, orders, customers, low stock count.
 */
export async function GET(_req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const data = await statsRepository.overview();
  return apiSuccess(data);
}
