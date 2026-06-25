import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { storeSettings } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

const updateSchema = z.object({
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(7).optional(),
  address: z.string().optional(),
  currency: z.string().min(2).max(10).optional(),
  language: z.string().min(2).max(10).optional(),
  timezone: z.string().optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
});

async function ensureRow() {
  let row = await db.query.storeSettings.findFirst({
    where: eq(storeSettings.storeId, DEFAULT_STORE_ID),
  });
  if (!row) {
    const [created] = await db
      .insert(storeSettings)
      .values({ storeId: DEFAULT_STORE_ID })
      .returning();
    row = created;
  }
  return row!;
}

export async function GET() {
  const guard = await requirePermission("settings.view");
  if ("error" in guard) return guard.error;
  const row = await ensureRow();
  return apiSuccess(row);
}

export async function PATCH(req: NextRequest) {
  const guard = await requirePermission("settings.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  await ensureRow();
  const [updated] = await db
    .update(storeSettings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(storeSettings.storeId, DEFAULT_STORE_ID))
    .returning();
  return apiSuccess(updated);
}
