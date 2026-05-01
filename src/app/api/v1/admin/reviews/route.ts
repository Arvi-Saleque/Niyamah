import { NextRequest } from "next/server";
import { reviewRepository } from "@/modules/customer/infrastructure/review.repository";
import { reviewModerateSchema } from "@/lib/validations/customer";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  if (!Number.isInteger(page) || page < 1)
    return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);

  const isStatus =
    status === "PENDING" || status === "APPROVED" || status === "REJECTED";
  const result = await reviewRepository.listForModeration(
    isStatus ? { page, limit, status } : { page, limit },
  );
  return apiSuccess({ items: result.items }, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
}
