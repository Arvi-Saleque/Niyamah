import { NextRequest } from "next/server";
import { z } from "zod";
import { productSearchRepository } from "@/modules/search/infrastructure/product-search.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
});

/**
 * GET /api/v1/search?q=...&page=1&limit=20
 * Public; rate-limited 60 req/min/IP.
 */
export async function GET(req: NextRequest) {
  const limit = await rateLimit(req, "search", 60, 60);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Search rate limit exceeded.", 429);
  }

  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = searchQuerySchema.safeParse(params);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid query.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const result = await productSearchRepository.search(parsed.data.q, {
    page: parsed.data.page,
    limit: parsed.data.limit,
    categoryId: parsed.data.categoryId,
    brandId: parsed.data.brandId,
  });

  return apiSuccess(result, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    pages: Math.ceil(result.total / result.limit) || 1,
  });
}
