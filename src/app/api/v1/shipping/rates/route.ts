import { NextRequest } from "next/server";
import { shippingRepository } from "@/modules/commerce/infrastructure/shipping.repository";
import { shippingRateCreateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const zoneIdRaw = req.nextUrl.searchParams.get("zoneId");
  const zoneId = zoneIdRaw ? Number(zoneIdRaw) : undefined;
  if (zoneIdRaw && (!Number.isInteger(zoneId) || zoneId! <= 0)) {
    return apiError("INVALID_ZONE_ID", "Invalid zoneId.", 400);
  }
  const items = await shippingRepository.listRates(zoneId);
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = shippingRateCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await shippingRepository.createRate(parsed.data);
  return apiSuccess(row, 201);
}
