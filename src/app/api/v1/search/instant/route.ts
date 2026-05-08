import type { NextRequest } from "next/server";
import { instantSearchProducts } from "@/modules/search/instant-search";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/search/instant?q=glas&limit=6
 *
 * Public, debounced typeahead endpoint backed by Postgres `pg_trgm`.
 * Rate limited 60/min/IP to prevent abuse from open keystroke streams.
 */
export async function GET(req: NextRequest) {
  const limit = await rateLimit(req, "search-instant", 60, 60);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Too many search requests. Slow down.", 429);
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limitParam = Number(searchParams.get("limit") ?? 6);

  if (q.length < 2) {
    return apiSuccess({ q, items: [], total: 0 });
  }

  const items = await instantSearchProducts({
    q,
    limit: Number.isFinite(limitParam) ? limitParam : 6,
  });

  return apiSuccess({ q, items, total: items.length });
}
