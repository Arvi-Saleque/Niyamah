import type { NextRequest } from "next/server";
import { shippingRepository } from "@/modules/commerce/infrastructure/shipping.repository";
import { db } from "@/lib/db";
import { shippingRates } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { shippingCalculateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

/**
 * POST /api/v1/shipping/calculate
 *
 * Public — returns available shipping rate options for a destination district
 * with computed final price (after free-shipping threshold).
 *
 * Body: { district: string, subtotal: number }
 *
 * Response: {
 *   zone: { id, name, deliveryDaysMin, deliveryDaysMax } | null,
 *   options: Array<{ rateId, name, price, freeAboveAmount, finalPrice }>
 * }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = shippingCalculateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const zone = await shippingRepository.findZoneForDistrict(parsed.data.district);
  if (!zone) {
    return apiSuccess({ zone: null, options: [] });
  }

  const rates = await db
    .select()
    .from(shippingRates)
    .where(eq(shippingRates.zoneId, zone.id))
    .orderBy(asc(shippingRates.price));

  const options = rates.map((r) => ({
    rateId: r.id,
    name: r.name,
    price: Number(r.price),
    freeAboveAmount: r.freeAboveAmount ? Number(r.freeAboveAmount) : null,
    finalPrice: shippingRepository.computePrice(
      { price: r.price, freeAboveAmount: r.freeAboveAmount },
      parsed.data.subtotal,
    ),
  }));

  return apiSuccess({
    zone: {
      id: zone.id,
      name: zone.name,
      deliveryDaysMin: zone.deliveryDaysMin,
      deliveryDaysMax: zone.deliveryDaysMax,
    },
    options,
  });
}
