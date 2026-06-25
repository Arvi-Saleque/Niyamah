import type { NextRequest } from "next/server";
import { couponRepository } from "@/modules/commerce/infrastructure/coupon.repository";
import { couponCreateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

export async function GET() {
  const guard = await requirePermission("coupons.view");
  if ("error" in guard) return guard.error;
  const items = await couponRepository.list();
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requirePermission("coupons.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = couponCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  try {
    const row = await couponRepository.create(parsed.data);
    return apiSuccess(row, 201);
  } catch (err) {
    console.error("[coupons.create]", err);
    return apiError("INTERNAL_ERROR", "Could not create coupon.", 500);
  }
}
