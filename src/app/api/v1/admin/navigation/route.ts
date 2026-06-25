import type { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { homepageBlocks } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import {
  NAVIGATION_BLOCK_KEY,
  NAVIGATION_DEFAULTS,
} from "@/modules/storefront/navigation-defaults";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const featureColumnSchema = z.object({
  image: z.string().optional(),
  tone: z.string().optional(),
  title: z.string().min(1),
  href: z.string().min(1),
  links: z.array(linkSchema),
});

const listColumnSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  links: z.array(linkSchema),
});

const tileSchema = z.object({
  image: z.string().optional(),
  tone: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
});

const panelBase = {
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  pinned: z.boolean().optional(),
};

const panelSchema = z.discriminatedUnion("template", [
  z.object({
    ...panelBase,
    template: z.literal("feature-columns"),
    columns: z.array(featureColumnSchema).min(1),
  }),
  z.object({
    ...panelBase,
    template: z.literal("mega-list"),
    columns: z.array(listColumnSchema).min(1),
  }),
  z.object({ ...panelBase, template: z.literal("image-tiles"), tiles: z.array(tileSchema).min(1) }),
]);

const updateSchema = z.object({
  data: z.object({ panels: z.array(panelSchema).min(1) }),
  isActive: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  const guard = await requirePermission("navigation.manage");
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid navigation payload.", 422, parsed.error.flatten());
  }

  const existing = await db
    .select()
    .from(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, NAVIGATION_BLOCK_KEY),
      ),
    )
    .limit(1);

  if (existing[0]) {
    const [updated] = await db
      .update(homepageBlocks)
      .set({
        data: parsed.data.data,
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
      blockKey: NAVIGATION_BLOCK_KEY,
      data: parsed.data.data,
      isActive: parsed.data.isActive ?? true,
    })
    .returning();
  return apiSuccess(created);
}

/** Reset the navigation menu to built-in defaults (deletes the override row). */
export async function DELETE() {
  const guard = await requirePermission("navigation.manage");
  if ("error" in guard) return guard.error;

  await db
    .delete(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, NAVIGATION_BLOCK_KEY),
      ),
    );

  return apiSuccess({ data: NAVIGATION_DEFAULTS, reset: true });
}
