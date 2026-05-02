import type { NextRequest } from "next/server";
import { cartRepository } from "@/modules/commerce/infrastructure/cart.repository";
import { cartUpdateItemSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { getCurrentUser } from "@/lib/auth/guards";
import { getOrCreateSessionId } from "@/lib/session/guest";

interface Ctx {
  params: Promise<{ itemId: string }>;
}

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function resolveCart() {
  const user = await getCurrentUser();
  const sessionId = await getOrCreateSessionId();
  return cartRepository.findOrCreate({
    userId: user?.userId ?? null,
    sessionId: user ? null : sessionId,
  });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { itemId: raw } = await params;
  const itemId = parseId(raw);
  if (itemId === null) return apiError("INVALID_ID", "Invalid item id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = cartUpdateItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const cart = await resolveCart();
  const updated = await cartRepository.updateItem(
    cart.id,
    itemId,
    parsed.data.quantity,
  );
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { itemId: raw } = await params;
  const itemId = parseId(raw);
  if (itemId === null) return apiError("INVALID_ID", "Invalid item id.", 400);

  const cart = await resolveCart();
  const updated = await cartRepository.removeItem(cart.id, itemId);
  return apiSuccess(updated);
}
