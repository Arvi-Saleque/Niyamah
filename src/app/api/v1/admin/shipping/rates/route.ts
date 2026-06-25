import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { shippingRates } from "@/lib/db/schema";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

const rateSchema = z.object({
  zoneId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  price: z.number().min(0),
  freeAboveAmount: z.number().min(0).optional(),
});

export async function POST(req: NextRequest) {
  const guard = await requirePermission("shipping.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = rateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  const [created] = await db
    .insert(shippingRates)
    .values({
      zoneId: parsed.data.zoneId,
      name: parsed.data.name,
      price: parsed.data.price.toString(),
      ...(parsed.data.freeAboveAmount !== undefined && {
        freeAboveAmount: parsed.data.freeAboveAmount.toString(),
      }),
    })
    .returning();
  return apiSuccess(created);
}
