import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { banners } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

const bannerSchema = z.object({
  title: z.string().min(1).max(255),
  imageUrl: z.string().url().max(500),
  linkUrl: z.string().url().max(500).optional().or(z.literal("")),
  position: z.string().max(100).optional(),
  status: z.enum(["active", "inactive", "scheduled"]).default("active"),
  sortOrder: z.number().int().min(0).default(0),
});

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const rows = await db
    .select()
    .from(banners)
    .where(eq(banners.storeId, DEFAULT_STORE_ID))
    .orderBy(asc(banners.sortOrder), asc(banners.id));
  return apiSuccess(rows);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const data = parsed.data;
  const [created] = await db
    .insert(banners)
    .values({
      storeId: DEFAULT_STORE_ID,
      title: data.title,
      imageUrl: data.imageUrl,
      ...(data.linkUrl && { linkUrl: data.linkUrl }),
      ...(data.position && { position: data.position }),
      status: data.status,
      sortOrder: data.sortOrder,
    })
    .returning();
  return apiSuccess(created);
}
