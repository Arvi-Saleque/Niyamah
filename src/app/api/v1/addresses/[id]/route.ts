import { NextRequest } from "next/server";
import { addressRepository } from "@/modules/commerce/infrastructure/address.repository";
import { addressUpdateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ id: string }>;
}
function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);
  const row = await addressRepository.findForUser(id, guard.ctx.userId);
  if (!row) return apiError("NOT_FOUND", "Address not found.", 404);
  return apiSuccess(row);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = addressUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await addressRepository.update(id, guard.ctx.userId, parsed.data);
  if (!row) return apiError("NOT_FOUND", "Address not found.", 404);
  return apiSuccess(row);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = parseId(idStr);
  if (id === null) return apiError("INVALID_ID", "Invalid id.", 400);
  const ok = await addressRepository.remove(id, guard.ctx.userId);
  if (!ok) return apiError("NOT_FOUND", "Address not found.", 404);
  return apiSuccess({ deleted: true });
}
