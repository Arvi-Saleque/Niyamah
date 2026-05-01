import { NextRequest } from "next/server";
import { cartRepository } from "@/modules/commerce/infrastructure/cart.repository";
import { cartAddItemSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { getCurrentUser } from "@/lib/auth/guards";
import { getOrCreateSessionId } from "@/lib/session/guest";

/**
 * GET /api/v1/cart
 * Returns the current user's (or session's) cart, creating one if needed.
 */
export async function GET() {
  const user = await getCurrentUser();
  const sessionId = await getOrCreateSessionId();
  const cart = await cartRepository.findOrCreate({
    userId: user?.userId ?? null,
    sessionId: user ? null : sessionId,
  });
  return apiSuccess(cart);
}

/**
 * POST /api/v1/cart  — add a variant to the cart.
 * Body: { variantId, quantity }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = cartAddItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const user = await getCurrentUser();
  const sessionId = await getOrCreateSessionId();
  const cart = await cartRepository.findOrCreate({
    userId: user?.userId ?? null,
    sessionId: user ? null : sessionId,
  });

  try {
    const updated = await cartRepository.addItem(
      cart.id,
      parsed.data.variantId,
      parsed.data.quantity,
    );
    return apiSuccess(updated, 201);
  } catch (err) {
    return apiError(
      "ADD_FAILED",
      err instanceof Error ? err.message : "Could not add item.",
      400,
    );
  }
}
