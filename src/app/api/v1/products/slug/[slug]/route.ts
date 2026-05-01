import { NextRequest } from "next/server";
import { productRepository } from "@/modules/catalog/infrastructure/product.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

interface Ctx {
  params: Promise<{ slug: string }>;
}

/**
 * Public storefront endpoint — fetch product (with images + variants) by slug.
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  if (!slug) return apiError("INVALID_SLUG", "Invalid slug.", 400);
  const row = await productRepository.findBySlug(slug);
  if (!row) return apiError("NOT_FOUND", "Product not found.", 404);
  return apiSuccess(row);
}
