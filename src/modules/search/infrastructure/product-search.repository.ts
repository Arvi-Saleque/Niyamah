import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

export interface SearchHit {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: string;
  salePrice: string | null;
  image: string | null;
  rank: number;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  categoryId?: number;
  brandId?: number;
}

/**
 * PostgreSQL full-text search over products.
 *
 * Uses `to_tsvector('simple', name || ' ' || description)` with `plainto_tsquery`
 * for matching. Results ranked by ts_rank_cd. Isolated here so we can swap to
 * Meilisearch/Algolia later by replacing this single repository.
 */
export const productSearchRepository = {
  async search(query: string, opts: SearchOptions = {}) {
    const page = opts.page ?? 1;
    const limit = Math.min(opts.limit ?? 20, 100);
    const offset = (page - 1) * limit;
    const q = query.trim();

    if (!q) {
      return { items: [] as SearchHit[], total: 0, page, limit };
    }

    const tsQuery = sql`plainto_tsquery('simple', ${q})`;
    const tsDoc = sql`
      setweight(to_tsvector('simple', coalesce(p.name, '')), 'A')
      || setweight(to_tsvector('simple', coalesce(p.short_description, '')), 'B')
      || setweight(to_tsvector('simple', coalesce(p.description, '')), 'C')
    `;

    const filters: ReturnType<typeof sql>[] = [
      sql`p.store_id = ${DEFAULT_STORE_ID}`,
      sql`p.status = 'published'`,
    ];
    if (opts.categoryId) filters.push(sql`p.category_id = ${opts.categoryId}`);
    if (opts.brandId) filters.push(sql`p.brand_id = ${opts.brandId}`);

    const whereClause = sql.join(filters, sql` AND `);

    const rowsRes = await db.execute(sql`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.short_description AS "shortDescription",
        p.price,
        p.sale_price AS "salePrice",
        (SELECT url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) AS image,
        ts_rank_cd(${tsDoc}, ${tsQuery}) AS rank
      FROM products p
      WHERE ${whereClause}
        AND (${tsDoc}) @@ ${tsQuery}
      ORDER BY rank DESC, p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    const countRes = await db.execute(sql`
      SELECT count(*)::int AS total
      FROM products p
      WHERE ${whereClause}
        AND (${tsDoc}) @@ ${tsQuery}
    `);

    const items = rowsRes.rows as unknown as SearchHit[];
    const total = (countRes.rows[0] as { total: number } | undefined)?.total ?? 0;

    return { items, total, page, limit };
  },
};
