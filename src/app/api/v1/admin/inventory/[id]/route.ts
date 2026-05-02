import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { inventory } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  stockOnHand: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  trackStock: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0)
    return apiError("INVALID_ID", "Invalid id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const existing = await db.query.inventory.findFirst({
    where: eq(inventory.id, id),
  });
  if (!existing) return apiError("NOT_FOUND", "Inventory row not found.", 404);

  const data = parsed.data;
  const nextOnHand = data.stockOnHand ?? existing.stockOnHand;
  const stockReserved = existing.stockReserved;
  const stockAvailable = Math.max(0, nextOnHand - stockReserved);

  const [updated] = await db
    .update(inventory)
    .set({
      ...(data.stockOnHand !== undefined && { stockOnHand: data.stockOnHand }),
      ...(data.lowStockThreshold !== undefined && {
        lowStockThreshold: data.lowStockThreshold,
      }),
      ...(data.trackStock !== undefined && { trackStock: data.trackStock }),
      stockAvailable,
    })
    .where(eq(inventory.id, id))
    .returning();

  return apiSuccess(updated);
}
