import { asc, desc, eq, and, inArray, count } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  products,
  productImages,
  categories,
  brands,
  productVariants,
  inventory,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export interface StorefrontProductCard {
  id: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  inStock?: boolean;
}

const FALLBACK_IMAGE = "/placeholder.svg";

interface PrimaryVariantInfo {
  variantId: number;
  priceOverride: string | null;
  salePriceOverride: string | null;
  stockAvailable: number;
  trackStock: boolean;
}

async function attachPrimaryImages(productRows: Array<{ id: number }>) {
  if (productRows.length === 0) return new Map<number, string>();
  const ids = productRows.map((r) => r.id);
  const imgs = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      isPrimary: productImages.isPrimary,
    })
    .from(productImages)
    .where(inArray(productImages.productId, ids));
  const map = new Map<number, string>();
  for (const img of imgs) {
    if (img.isPrimary || !map.has(img.productId)) {
      map.set(img.productId, img.url);
    }
  }
  return map;
}

async function attachPrimaryVariants(productRows: Array<{ id: number }>) {
  if (productRows.length === 0) return new Map<number, PrimaryVariantInfo>();
  const ids = productRows.map((r) => r.id);
  const rows = await db
    .select({
      productId: productVariants.productId,
      variantId: productVariants.id,
      priceOverride: productVariants.priceOverride,
      salePriceOverride: productVariants.salePriceOverride,
      stockAvailable: inventory.stockAvailable,
      trackStock: inventory.trackStock,
    })
    .from(productVariants)
    .leftJoin(inventory, eq(inventory.variantId, productVariants.id))
    .where(and(inArray(productVariants.productId, ids), eq(productVariants.status, true)))
    .orderBy(asc(productVariants.productId), asc(productVariants.sortOrder), asc(productVariants.id));

  const map = new Map<number, PrimaryVariantInfo>();
  for (const row of rows) {
    if (map.has(row.productId)) continue;
    map.set(row.productId, {
      variantId: row.variantId,
      priceOverride: row.priceOverride,
      salePriceOverride: row.salePriceOverride,
      stockAvailable: row.stockAvailable ?? 0,
      trackStock: row.trackStock ?? true,
    });
  }
  return map;
}

function toCard(
  p: typeof products.$inferSelect,
  image: string | undefined,
  variant: PrimaryVariantInfo | undefined,
): StorefrontProductCard {
  const effectivePrice = variant?.salePriceOverride ?? variant?.priceOverride ?? p.salePrice ?? p.price;
  const originalPrice =
    variant?.salePriceOverride && variant.priceOverride
      ? variant.priceOverride
      : variant?.priceOverride
        ? p.salePrice
          ? p.price
          : undefined
        : p.salePrice
          ? p.price
          : undefined;
  const card: StorefrontProductCard = {
    id: String(p.id),
    ...(variant && { variantId: String(variant.variantId) }),
    slug: p.slug,
    name: p.name,
    image: image ?? FALLBACK_IMAGE,
    price: Number(effectivePrice),
    inStock: variant ? !variant.trackStock || variant.stockAvailable > 0 : false,
  };
  if (originalPrice !== undefined) card.originalPrice = Number(originalPrice);
  return card;
}

export async function getNewArrivals(limit = 8): Promise<StorefrontProductCard[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.storeId, DEFAULT_STORE_ID), eq(products.status, "published")))
    .orderBy(desc(products.createdAt))
    .limit(limit);
  const imgMap = await attachPrimaryImages(rows);
  const variantMap = await attachPrimaryVariants(rows);
  return rows.map((p) => toCard(p, imgMap.get(p.id), variantMap.get(p.id)));
}

export async function getBestSellers(limit = 8): Promise<StorefrontProductCard[]> {
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.storeId, DEFAULT_STORE_ID),
        eq(products.status, "published"),
        eq(products.bestSeller, true),
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);
  // Fallback to newest if no flagged best sellers
  const list = rows.length > 0 ? rows : await db
    .select()
    .from(products)
    .where(and(eq(products.storeId, DEFAULT_STORE_ID), eq(products.status, "published")))
    .orderBy(desc(products.createdAt))
    .limit(limit);
  const imgMap = await attachPrimaryImages(list);
  const variantMap = await attachPrimaryVariants(list);
  return list.map((p) => toCard(p, imgMap.get(p.id), variantMap.get(p.id)));
}

export async function getFeaturedCategories(limit = 6) {
  const rows = await db
    .select()
    .from(categories)
    .where(and(eq(categories.storeId, DEFAULT_STORE_ID), eq(categories.status, true)))
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .limit(limit);
  return rows.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    ...(c.image && { image: c.image }),
  }));
}

export async function listAllBrands(limit = 50) {
  return db
    .select()
    .from(brands)
    .where(eq(brands.storeId, DEFAULT_STORE_ID))
    .orderBy(asc(brands.name))
    .limit(limit);
}

export async function listProductsForGrid(opts: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  q?: string;
}): Promise<{ items: StorefrontProductCard[]; total: number; page: number; limit: number }> {
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 24;

  const conds = [eq(products.storeId, DEFAULT_STORE_ID), eq(products.status, "published" as const)];

  if (opts.categorySlug) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.storeId, DEFAULT_STORE_ID), eq(categories.slug, opts.categorySlug)))
      .limit(1);
    if (!cat) return { items: [], total: 0, page, limit };
    conds.push(eq(products.categoryId, cat.id));
  }
  if (opts.brandSlug) {
    const [b] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.slug, opts.brandSlug)))
      .limit(1);
    if (!b) return { items: [], total: 0, page, limit };
    conds.push(eq(products.brandId, b.id));
  }

  const [countRow] = await db
    .select({ total: count() })
    .from(products)
    .where(and(...conds));
  const totalCount = countRow?.total ?? 0;

  const rows = await db
    .select()
    .from(products)
    .where(and(...conds))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const imgMap = await attachPrimaryImages(rows);
  const variantMap = await attachPrimaryVariants(rows);

  return {
    items: rows.map((p) => toCard(p, imgMap.get(p.id), variantMap.get(p.id))),
    total: totalCount,
    page,
    limit,
  };
}
