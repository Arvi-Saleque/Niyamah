import type { NextRequest } from "next/server";
import { blogRepository, BlogError } from "@/modules/blog/infrastructure/blog.repository";
import { blogCategoryCreateSchema } from "@/lib/validations/marketing";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET() {
  const items = await blogRepository.listCategories();
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid body.", 400);
  const parsed = blogCategoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  try {
    const created = await blogRepository.createCategory(parsed.data);
    return apiSuccess(created, 201);
  } catch (err) {
    if (err instanceof BlogError) return apiError(err.code, err.message, 409);
    throw err;
  }
}
