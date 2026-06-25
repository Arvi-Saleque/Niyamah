import type { NextRequest } from "next/server";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

const VALID_STATUSES = new Set(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

/**
 * GET /api/v1/admin/returns?status=PENDING&page=1&limit=20
 * List all return requests for admin review.
 */
export async function GET(req: NextRequest) {
  const guard = await requirePermission("returns.view");
  if ("error" in guard) return guard.error;

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const status = req.nextUrl.searchParams.get("status") ?? undefined;

  if (!Number.isInteger(page) || page < 1) return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);
  if (status && !VALID_STATUSES.has(status))
    return apiError("INVALID_STATUS", "Invalid status filter.", 400);

  const result = await returnRepository.listAdmin({
    page,
    limit,
    status: status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | undefined,
  });
  return apiSuccess({ items: result.items }, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
}
