import type { NextRequest } from "next/server";
import { statsRepository } from "@/modules/commerce/infrastructure/stats.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

/**
 * GET /api/v1/admin/stats/products?limit=10
 * Top selling products by revenue.
 */
export async function GET(req: NextRequest) {
  const guard = await requirePermission("products.view");
  if ("error" in guard) return guard.error;

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    return apiError("INVALID_LIMIT", "limit must be 1-50.", 400);
  }

  const items = await statsRepository.topProducts(limit);
  return apiSuccess({ items });
}
