import type { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  if (!Number.isInteger(page) || page < 1)
    return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);

  const result = await orderRepository.listAdmin(
    status ? { page, limit, status } : { page, limit },
  );
  return apiSuccess({ items: result.items }, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
}
