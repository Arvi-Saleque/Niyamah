"use server";

import { and, asc, desc, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type { StorefrontProductCard } from "@/modules/storefront/queries";

export type GiftPurpose =
  | "Quran Gift"
  | "Prayer Gift"
  | "Dhikr Gift"
  | "Complete Gift Box";

export type GiftBudget = "Under ৳1000" | "৳1000–৳2500" | "Premium";

export interface GiftFinderInput {
  purpose?: GiftPurpose;
  budget?: GiftBudget;
  recipient?: string;
}

const PURPOSE_TO_CATEGORY_SLUGS: Record<GiftPurpose, string[]> = {
  "Quran Gift": ["quran", "bengali-quran"],
  "Prayer Gift": ["prayer-mat"],
  "Dhikr Gift": ["tasbih"],
  "Complete Gift Box": ["gift-box"],
};

const BUDGET_RANGES: Record<GiftBudget, { min?: number; max?: number }> = {
  "Under ৳1000": { max: 1000 },
  "৳1000–৳2500": { min: 1000, max: 2500 },
  Premium: { min: 2500 },
};

const FALLBACK_IMAGE = "/placeholder.svg";

/**
 * Effective price = COALESCE(salePrice, price), used for budget filtering.
 */
const effectivePriceSql = sql<number>`COALESCE(${products.salePrice}, ${products.price})::numeric`;

export async function findGiftSuggestions(
  input: GiftFinderInput,
): Promise<StorefrontProductCard[]> {
  const conds = [
    eq(products.storeId, DEFAULT_STORE_ID),
    eq(products.status, "published" as const),
  ];

  // Filter by purpose -> category
  if (input.purpose) {
    const slugs = PURPOSE_TO_CATEGORY_SLUGS[input.purpose];
    const cats = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(eq(categories.storeId, DEFAULT_STORE_ID), inArray(categories.slug, slugs)),
      );
    if (cats.length === 0) return [];
    conds.push(inArray(products.categoryId, cats.map((c) => c.id)));
  }

  // Filter by budget -> price range
  if (input.budget) {
    const range = BUDGET_RANGES[input.budget];
    if (range.min !== undefined) {
      conds.push(gte(effectivePriceSql, range.min));
    }
    if (range.max !== undefined) {
      // Use lt for "Under X" so 1000 is exclusive on the lower tier.
      conds.push(input.budget === "Under ৳1000" ? lt(effectivePriceSql, range.max) : lte(effectivePriceSql, range.max));
    }
  }

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      salePrice: products.salePrice,
      ogImage: products.ogImage,
      featured: products.featured,
      bestSeller: products.bestSeller,
    })
    .from(products)
    .where(and(...conds))
    .orderBy(desc(products.featured), desc(products.bestSeller), asc(products.name))
    .limit(8);

  if (rows.length === 0) {
    // Relax: drop budget if no results
    if (input.budget) {
      return findGiftSuggestions({ purpose: input.purpose });
    }
    return [];
  }

  // Attach primary images
  const ids = rows.map((r) => r.id);
  const { productImages } = await import("@/lib/db/schema");
  const imgs = ids.length
    ? await db
        .select({ productId: productImages.productId, url: productImages.url, isPrimary: productImages.isPrimary })
        .from(productImages)
        .where(inArray(productImages.productId, ids))
    : [];
  const imgMap = new Map<number, string>();
  for (const i of imgs) {
    if (i.isPrimary || !imgMap.has(i.productId)) imgMap.set(i.productId, i.url);
  }

  return rows.map((p) => {
    const effective = Number(p.salePrice ?? p.price);
    const card: StorefrontProductCard = {
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      image: imgMap.get(p.id) ?? p.ogImage ?? FALLBACK_IMAGE,
      price: effective,
      inStock: true,
    };
    if (p.salePrice) card.originalPrice = Number(p.price);
    return card;
  });
}
