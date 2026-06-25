import type { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { shippingZones, shippingRates } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

const zoneSchema = z.object({
  name: z.string().min(1).max(255),
  districts: z.array(z.string()).default([]),
  deliveryDaysMin: z.number().int().min(0).default(1),
  deliveryDaysMax: z.number().int().min(0).default(3),
});

export async function GET() {
  const guard = await requirePermission("shipping.view");
  if ("error" in guard) return guard.error;
  const zones = await db
    .select()
    .from(shippingZones)
    .where(eq(shippingZones.storeId, DEFAULT_STORE_ID))
    .orderBy(asc(shippingZones.id));
  const rates = await db.select().from(shippingRates).orderBy(asc(shippingRates.id));
  return apiSuccess({ zones, rates });
}

export async function POST(req: NextRequest) {
  const guard = await requirePermission("shipping.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = zoneSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  const [created] = await db
    .insert(shippingZones)
    .values({
      storeId: DEFAULT_STORE_ID,
      name: parsed.data.name,
      districts: parsed.data.districts,
      deliveryDaysMin: parsed.data.deliveryDaysMin,
      deliveryDaysMax: parsed.data.deliveryDaysMax,
    })
    .returning();
  return apiSuccess(created);
}
