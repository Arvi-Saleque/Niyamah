import { NextRequest } from "next/server";
import { couponRepository } from "@/modules/commerce/infrastructure/coupon.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0)
    return apiError("INVALID_ID", "Invalid id.", 400);
  const ok = await couponRepository.remove(id);
  if (!ok) return apiError("NOT_FOUND", "Coupon not found.", 404);
  return apiSuccess({ deleted: true });
}
