import type { NextRequest } from "next/server";
import { blogRepository } from "@/modules/blog/infrastructure/blog.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Number(sp.get("page") ?? "1");
  const limit = Number(sp.get("limit") ?? "12");
  const categorySlug = sp.get("category") ?? undefined;
  const tagSlug = sp.get("tag") ?? undefined;
  if (!Number.isInteger(page) || page < 1) return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) return apiError("INVALID_LIMIT", "Invalid limit.", 400);

  const opts: { page: number; limit: number; status: "published"; categorySlug?: string; tagSlug?: string } = {
    page,
    limit,
    status: "published",
  };
  if (categorySlug) opts.categorySlug = categorySlug;
  if (tagSlug) opts.tagSlug = tagSlug;
  const result = await blogRepository.listPosts(opts);
  return apiSuccess({ items: result.items }, 200, { page: result.page, limit: result.limit, total: result.total });
}
