import type { NextRequest } from "next/server";
import { shippingRepository } from "@/modules/commerce/infrastructure/shipping.repository";
import { shippingZoneCreateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET() {
  const items = await shippingRepository.listZones();
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = shippingZoneCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await shippingRepository.createZone(parsed.data);
  return apiSuccess(row, 201);
}
