import { NextRequest } from "next/server";
import { addressRepository } from "@/modules/commerce/infrastructure/address.repository";
import { addressCreateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const items = await addressRepository.listForUser(guard.ctx.userId);
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = addressCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const row = await addressRepository.create(guard.ctx.userId, parsed.data);
  return apiSuccess(row, 201);
}
