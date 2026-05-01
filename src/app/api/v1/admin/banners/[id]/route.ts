import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { banners } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().max(500).optional(),
  linkUrl: z.string().url().max(500).nullable().optional(),
  position: z.string().max(100).nullable().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  sortOrder: z.number().int().min(0).optional(),
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

  const [updated] = await db
    .update(banners)
    .set(parsed.data)
    .where(eq(banners.id, id))
    .returning();
  if (!updated) return apiError("NOT_FOUND", "Banner not found.", 404);
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0)
    return apiError("INVALID_ID", "Invalid id.", 400);

  await db.delete(banners).where(eq(banners.id, id));
  return apiSuccess({ deleted: true });
}
