import { NextRequest } from "next/server";
import { blogRepository } from "@/modules/blog/infrastructure/blog.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const post = await blogRepository.findPostBySlug(slug);
  if (!post || post.status !== "published") return apiError("NOT_FOUND", "Post not found.", 404);
  return apiSuccess(post);
}
