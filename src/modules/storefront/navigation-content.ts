/**
 * SERVER-ONLY — imports @/lib/db. Do NOT import this in client components.
 * Client components should import from ./navigation-defaults instead.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { homepageBlocks } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import {
  NAVIGATION_BLOCK_KEY,
  NAVIGATION_DEFAULTS,
  type NavigationData,
  type NavPanel,
} from "./navigation-defaults";

// Re-export everything so callers can import types from one place if they prefer.
export * from "./navigation-defaults";

/** Returns the active navigation menu (DB override or built-in defaults). */
export async function getNavigationContent(): Promise<NavigationData> {
  const [row] = await db
    .select()
    .from(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, NAVIGATION_BLOCK_KEY),
      ),
    )
    .limit(1);

  if (!row || !row.isActive) return NAVIGATION_DEFAULTS;

  // Soft-validate: if the stored payload doesn't have a panels array, fall back.
  const data = row.data as Partial<NavigationData> | null;
  if (!data || !Array.isArray(data.panels) || data.panels.length === 0) {
    return NAVIGATION_DEFAULTS;
  }

  return { panels: data.panels as NavPanel[] };
}

/** Admin-side: returns the row plus a flag for whether the admin has customised it. */
export async function getNavigationAdmin(): Promise<{
  data: NavigationData;
  isActive: boolean;
  isCustomized: boolean;
  updatedAt: string | null;
}> {
  const [row] = await db
    .select()
    .from(homepageBlocks)
    .where(
      and(
        eq(homepageBlocks.storeId, DEFAULT_STORE_ID),
        eq(homepageBlocks.blockKey, NAVIGATION_BLOCK_KEY),
      ),
    )
    .limit(1);

  if (!row) {
    return {
      data: NAVIGATION_DEFAULTS,
      isActive: true,
      isCustomized: false,
      updatedAt: null,
    };
  }

  const stored = row.data as Partial<NavigationData> | null;
  const data: NavigationData =
    stored && Array.isArray(stored.panels) && stored.panels.length > 0
      ? { panels: stored.panels as NavPanel[] }
      : NAVIGATION_DEFAULTS;

  return {
    data,
    isActive: row.isActive,
    isCustomized: true,
    updatedAt: row.updatedAt?.toISOString() ?? null,
  };
}
