import type { NextRequest } from "next/server";
import { blogRepository, BlogError } from "@/modules/blog/infrastructure/blog.repository";
import { blogPostCreateSchema } from "@/lib/validations/marketing";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";

export async function GET(req: NextRequest) {
  const guard = await requirePermission("blog.view");
  if ("error" in guard) return guard.error;
  const sp = req.nextUrl.searchParams;
  const page = Number(sp.get("page") ?? "1");
  const limit = Number(sp.get("limit") ?? "20");
  const status = sp.get("status") ?? undefined;
  if (!Number.isInteger(page) || page < 1) return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);
  const isStatus = status === "draft" || status === "published" || status === "archived";
  const result = await blogRepository.listPosts(
    isStatus ? { page, limit, status } : { page, limit },
  );
  return apiSuccess({ items: result.items }, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requirePermission("blog.manage");
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid body.", 400);
  const parsed = blogPostCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  try {
    const created = await blogRepository.createPost(parsed.data, guard.ctx.userId);
    return apiSuccess(created, 201);
  } catch (err) {
    if (err instanceof BlogError) return apiError(err.code, err.message, 409);
    throw err;
  }
}
