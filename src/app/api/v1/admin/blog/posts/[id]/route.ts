import { NextRequest } from "next/server";
import { blogRepository } from "@/modules/blog/infrastructure/blog.repository";
import { blogPostUpdateSchema } from "@/lib/validations/marketing";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return apiError("INVALID_ID", "Invalid id.", 400);
  const row = await blogRepository.findPostById(id);
  if (!row) return apiError("NOT_FOUND", "Post not found.", 404);
  return apiSuccess(row);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return apiError("INVALID_ID", "Invalid id.", 400);
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid body.", 400);
  const parsed = blogPostUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  const updated = await blogRepository.updatePost(id, parsed.data);
  if (!updated) return apiError("NOT_FOUND", "Post not found.", 404);
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return apiError("INVALID_ID", "Invalid id.", 400);
  const ok = await blogRepository.deletePost(id);
  if (!ok) return apiError("NOT_FOUND", "Post not found.", 404);
  return apiSuccess({ deleted: true });
}
