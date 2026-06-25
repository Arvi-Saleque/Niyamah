import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { shippingRates } from "@/lib/db/schema";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requirePermission("shipping.manage");
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return apiError("INVALID_ID", "Invalid id.", 400);
  await db.delete(shippingRates).where(eq(shippingRates.id, id));
  return apiSuccess({ deleted: true });
}
