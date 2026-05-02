import type { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { homepageBlocks } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import {
  HOMEPAGE_BLOCK_KEYS,
  HOMEPAGE_DEFAULTS,
  type HomepageBlockKey,
} from "@/modules/storefront/homepage-content";

const updateSchema = z.object({
  data: z.unknown(),
  isActive: z.boolean().optional(),
});

function isValidKey(k: string): k is HomepageBlockKey {
  return (HOMEPAGE_BLOCK_KEYS as readonly string[]).includes(k);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ key: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { key } = await ctx.params;
  if (!isValidKey(key)) {
    return apiError("INVALID_KEY", `Unknown homepage block: ${key}`, 400);
  }

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

  const existing = await db
    .select()
    .from(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, key),
      ),
    )
    .limit(1);

  if (existing[0]) {
    const [updated] = await db
      .update(homepageBlocks)
      .set({
        data: parsed.data.data as object,
        ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
        updatedAt: new Date(),
      })
      .where(eq(homepageBlocks.id, existing[0].id))
      .returning();
    return apiSuccess(updated);
  }

  const [created] = await db
    .insert(homepageBlocks)
    .values({
      storeId: DEFAULT_STORE_ID,
      blockKey: key,
      data: parsed.data.data as object,
      isActive: parsed.data.isActive ?? true,
    })
    .returning();
  return apiSuccess(created);
}

/** Reset a block to defaults (deletes the override row). */
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ key: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { key } = await ctx.params;
  if (!isValidKey(key)) {
    return apiError("INVALID_KEY", `Unknown homepage block: ${key}`, 400);
  }

  await db
    .delete(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, key),
      ),
    );

  return apiSuccess({ blockKey: key, data: HOMEPAGE_DEFAULTS[key], reset: true });
}
