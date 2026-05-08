import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export interface InstantSearchHit {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: string;
  salePrice: string | null;
  image: string | null;
  categorySlug: string | null;
  score: number;
}

interface InstantSearchOptions {
  q: string;
  limit?: number;
}

/**
 * Postgres-native instant search using `pg_trgm`.
 *  - Prefix match via `ILIKE 'q%'` (free, ranked highest)
 *  - Substring fuzzy match via trigram `similarity()` (typo-tolerant)
 *  - Returns up to `limit` hits, joined with primary product image + category slug
 *
 * Requires migration `0005_search_trgm.sql` (CREATE EXTENSION pg_trgm + GIN indexes).
 */
export async function instantSearchProducts({
  q,
  limit = 6,
}: InstantSearchOptions): Promise<InstantSearchHit[]> {
  const query = q.trim();
  if (query.length < 2) return [];

  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const prefixPattern = `${query}%`;
  const containsPattern = `%${query}%`;

  const result = await db.execute(sql`
    SELECT
      p.id,
      p.slug,
      p.name,
      p.short_description AS "shortDescription",
      p.price::text       AS price,
      p.sale_price::text  AS "salePrice",
      img.url             AS image,
      c.slug              AS "categorySlug",
      (
        CASE WHEN p.name ILIKE ${prefixPattern} THEN 1.0 ELSE 0 END
        + similarity(p.name, ${query}) * 0.7
        + CASE WHEN p.name ILIKE ${containsPattern} THEN 0.3 ELSE 0 END
      )::float AS score
    FROM products p
    LEFT JOIN LATERAL (
      SELECT url
      FROM product_images
      WHERE product_id = p.id
      ORDER BY is_primary DESC, sort_order ASC, id ASC
      LIMIT 1
    ) img ON TRUE
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.store_id = ${DEFAULT_STORE_ID}
      AND p.status  = 'published'
      AND (
        p.name ILIKE ${containsPattern}
        OR similarity(p.name, ${query}) > 0.2
      )
    ORDER BY score DESC, p.featured DESC, p.id DESC
    LIMIT ${safeLimit};
  `);

  const rows = result.rows as unknown as Array<{
    id: number;
    slug: string;
    name: string;
    shortDescription: string | null;
    price: string;
    salePrice: string | null;
    image: string | null;
    categorySlug: string | null;
    score: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortDescription: r.shortDescription,
    price: r.price,
    salePrice: r.salePrice,
    image: r.image,
    categorySlug: r.categorySlug,
    score: Number(r.score),
  }));
}
