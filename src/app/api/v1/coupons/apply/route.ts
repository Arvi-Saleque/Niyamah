import type { NextRequest } from "next/server";
import {
  couponRepository,
  CouponError,
} from "@/modules/commerce/infrastructure/coupon.repository";
import { cartRepository } from "@/modules/commerce/infrastructure/cart.repository";
import { couponApplySchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { getCurrentUser } from "@/lib/auth/guards";

/**
 * POST /api/v1/coupons/apply  — preview a coupon's discount against a cart.
 * Does NOT mutate state. The actual coupon is locked-in by checkout.
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "coupon-apply", 20, 60);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Slow down.", 429);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = couponApplySchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const cart = await cartRepository.load(parsed.data.cartId);
  if (!cart) return apiError("CART_NOT_FOUND", "Cart not found.", 404);
  if (!cart.items.length)
    return apiError("EMPTY_CART", "Cart is empty.", 400);

  const user = await getCurrentUser();

  try {
    const discount = await couponRepository.validateForCart({
      code: parsed.data.code,
      subtotal: Number(cart.subtotal),
      userId: user?.userId ?? null,
    });
    return apiSuccess(discount);
  } catch (err) {
    if (err instanceof CouponError) {
      return apiError(err.code, err.message, 400);
    }
    console.error("[coupon.apply]", err);
    return apiError("INTERNAL_ERROR", "Could not apply coupon.", 500);
  }
}
