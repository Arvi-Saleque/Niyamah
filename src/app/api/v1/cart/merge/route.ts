import type { NextRequest } from "next/server";
import { cartRepository } from "@/modules/commerce/infrastructure/cart.repository";
import { apiSuccess } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";
import { getSessionId } from "@/lib/session/guest";

/**
 * POST /api/v1/cart/merge — call right after sign-in.
 * Merges any items in the guest cart (resolved via the `niyamah_sid` cookie)
 * into the authenticated user's cart, then deletes the guest cart.
 */
export async function POST(_req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const sessionId = await getSessionId();
  if (!sessionId) {
    // Nothing to merge — just return the user's current cart
    const cart = await cartRepository.findOrCreate({
      userId: guard.ctx.userId,
      sessionId: null,
    });
    return apiSuccess(cart);
  }

  const merged = await cartRepository.mergeGuestIntoUser(
    sessionId,
    guard.ctx.userId,
  );
  return apiSuccess(merged);
}
