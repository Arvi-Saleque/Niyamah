/**
 * SERVER-ONLY — imports @/lib/db. Do NOT import this in client components.
 * Client components should import from ./homepage-defaults instead.
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { homepageBlocks, storeSettings } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import {
  HOMEPAGE_DEFAULTS,
  HOMEPAGE_BLOCK_KEYS,
  type HomepageBlockKey,
  type HomepageContent,
  type HeroSlideData,
  type TickerItem,
  type DiscoveryData,
  type NeedsData,
  type TrustData,
  type EditorialData,
  type TestimonialsData,
  type WhatsAppData,
  type FlashSaleData,
} from "./homepage-defaults";

// Re-export everything so existing imports of homepage-content still work.
export * from "./homepage-defaults";

// ─────────────────────────────────────────────
// DB helpers
// ─────────────────────────────────────────────

/** Merges active DB overrides over defaults. Runs on the server only. */
export async function getHomepageContent(): Promise<HomepageContent> {
  const rows = await db
    .select()
    .from(homepageBlocks)
    .where(eq(homepageBlocks.storeId, DEFAULT_STORE_ID));

  const map = new Map(rows.filter((r) => r.isActive).map((r) => [r.blockKey, r.data]));

  return {
    hero: (map.get("hero") as HeroSlideData[]) ?? HOMEPAGE_DEFAULTS.hero,
    ticker: (map.get("ticker") as { items: TickerItem[] }) ?? HOMEPAGE_DEFAULTS.ticker,
    discovery: (map.get("discovery") as DiscoveryData) ?? HOMEPAGE_DEFAULTS.discovery,
    needs: (map.get("needs") as NeedsData) ?? HOMEPAGE_DEFAULTS.needs,
    trust: (map.get("trust") as TrustData) ?? HOMEPAGE_DEFAULTS.trust,
    editorial: (map.get("editorial") as EditorialData) ?? HOMEPAGE_DEFAULTS.editorial,
    testimonials:
      (map.get("testimonials") as TestimonialsData) ?? HOMEPAGE_DEFAULTS.testimonials,
    whatsapp: (map.get("whatsapp") as WhatsAppData) ?? HOMEPAGE_DEFAULTS.whatsapp,
    flashSale: (map.get("flashSale") as FlashSaleData) ?? HOMEPAGE_DEFAULTS.flashSale,
  };
}

/** Admin: list all blocks with status, merged with defaults. */
export async function getAllHomepageBlocksAdmin() {
  const rows = await db
    .select()
    .from(homepageBlocks)
    .where(eq(homepageBlocks.storeId, DEFAULT_STORE_ID));
  const byKey = new Map(rows.map((r) => [r.blockKey, r]));
  return HOMEPAGE_BLOCK_KEYS.map((key) => {
    const row = byKey.get(key);
    return {
      blockKey: key,
      data: row?.data ?? HOMEPAGE_DEFAULTS[key as HomepageBlockKey],
      isActive: row?.isActive ?? true,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
      isCustomized: !!row,
    };
  });
}

/** Returns just the WhatsApp config (used by storefront layout). */
export async function getWhatsAppConfig(): Promise<WhatsAppData> {
  const all = await db
    .select()
    .from(homepageBlocks)
    .where(eq(homepageBlocks.storeId, DEFAULT_STORE_ID));
  const found = all.find((r) => r.blockKey === "whatsapp" && r.isActive);
  if (found) return found.data as WhatsAppData;
  // Fallback: try contactPhone from store settings
  const [s] = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.storeId, DEFAULT_STORE_ID))
    .limit(1);
  return {
    ...HOMEPAGE_DEFAULTS.whatsapp,
    phoneNumber: s?.contactPhone ?? HOMEPAGE_DEFAULTS.whatsapp.phoneNumber,
  };
}
