import { NextRequest } from "next/server";
import { productRepository } from "@/modules/catalog/infrastructure/product.repository";
import {
  productCreateSchema,
  listQuerySchema,
} from "@/lib/validations/catalog";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = listQuerySchema.safeParse(params);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid query.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const data = await productRepository.list(parsed.data);
  return apiSuccess(data, 200, {
    page: data.page,
    limit: data.limit,
    total: data.total,
    pages: Math.ceil(data.total / data.limit) || 1,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  try {
    const row = await productRepository.create(parsed.data);
    return apiSuccess(row, 201);
  } catch (err) {
    console.error("[products.create] error:", err);
    return apiError("INTERNAL_ERROR", "Could not create product.", 500);
  }
}
