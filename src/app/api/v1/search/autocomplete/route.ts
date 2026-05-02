import type { NextRequest } from "next/server";
import { ilike, and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, categories, brands } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

export interface AutocompleteProduct {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  salePrice: number | null;
}

export interface AutocompleteCategory {
  id: string;
  slug: string;
  name: string;
}

export interface AutocompleteBrand {
  id: string;
  slug: string;
  name: string;
}

export interface AutocompleteResponse {
  products: AutocompleteProduct[];
  categories: AutocompleteCategory[];
  brands: AutocompleteBrand[];
  query: string;
}

/**
 * GET /api/v1/search/autocomplete?q=...
 * Lightweight typeahead used by storefront search inputs. Rate-limited.
 */
export async function GET(req: NextRequest) {
  const limit = await rateLimit(req, "search-ac", 120, 60);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Autocomplete rate limit exceeded.", 429);
  }

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return apiSuccess<AutocompleteResponse>({
      products: [],
      categories: [],
      brands: [],
      query: q,
    });
  }
  const pattern = `%${q.replace(/[%_]/g, "\\$&")}%`;

  const productRows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      salePrice: products.salePrice,
    })
    .from(products)
    .where(
      and(
        eq(products.storeId, DEFAULT_STORE_ID),
        eq(products.status, "published"),
        ilike(products.name, pattern),
      ),
    )
    .orderBy(sql`length(${products.name}) ASC`)
    .limit(5);

  const categoryRows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories)
    .where(
      and(
        eq(categories.storeId, DEFAULT_STORE_ID),
        eq(categories.status, true),
        ilike(categories.name, pattern),
      ),
    )
    .limit(4);

  const brandRows = await db
    .select({
      id: brands.id,
      slug: brands.slug,
      name: brands.name,
    })
    .from(brands)
    .where(and(eq(brands.storeId, DEFAULT_STORE_ID), ilike(brands.name, pattern)))
    .limit(3);

  // Attach primary images
  const imageMap = new Map<number, string>();
  if (productRows.length > 0) {
    const ids = productRows.map((p) => p.id);
    const imgs = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(sql`${productImages.productId} = ANY(${ids})`);
    for (const img of imgs) {
      if (img.isPrimary || !imageMap.has(img.productId)) {
        imageMap.set(img.productId, img.url);
      }
    }
  }

  const data: AutocompleteResponse = {
    query: q,
    products: productRows.map((p) => ({
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      image: imageMap.get(p.id) ?? null,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
    })),
    categories: categoryRows.map((c) => ({
      id: String(c.id),
      slug: c.slug,
      name: c.name,
    })),
    brands: brandRows.map((b) => ({
      id: String(b.id),
      slug: b.slug,
      name: b.name,
    })),
  };

  return apiSuccess(data);
}
