import { NextRequest } from "next/server";
import { productRepository } from "@/modules/catalog/infrastructure/product.repository";
import { productUpdateSchema } from "@/lib/validations/catalog";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);
  const row = await productRepository.findById(id);
  if (!row) return apiError("NOT_FOUND", "Product not found.", 404);
  return apiSuccess(row);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await productRepository.update(id, parsed.data);
  if (!row) return apiError("NOT_FOUND", "Product not found.", 404);
  return apiSuccess(row);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);

  const ok = await productRepository.remove(id);
  if (!ok) return apiError("NOT_FOUND", "Product not found.", 404);
  return apiSuccess({ deleted: true });
}
