import type { NextRequest } from "next/server";
import { categoryRepository } from "@/modules/catalog/infrastructure/category.repository";
import {
  categoryCreateSchema,
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
  const data = await categoryRepository.list(parsed.data);
  return apiSuccess(data);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = categoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await categoryRepository.create(parsed.data);
  return apiSuccess(row, 201);
}
