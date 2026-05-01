import { NextRequest } from "next/server";
import {
  placeOrderUseCase,
  CheckoutError,
} from "@/modules/commerce/application/place-order.usecase";
import { cartRepository } from "@/modules/commerce/infrastructure/cart.repository";
import { checkoutSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { getCurrentUser } from "@/lib/auth/guards";
import { getOrCreateSessionId } from "@/lib/session/guest";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { inngest } from "@/lib/inngest/client";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";

export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "checkout", 5, 60);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Too many checkout attempts.", 429);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const user = await getCurrentUser();
  const sessionId = user ? null : await getOrCreateSessionId();

  // Resolve user's/guest's active cart
  const cart = await cartRepository.findOrCreate({
    userId: user?.userId ?? null,
    sessionId,
  });
  if (!cart.items.length) {
    return apiError("EMPTY_CART", "Cart is empty.", 400);
  }

  if (!user && !parsed.data.guestEmail) {
    return apiError(
      "GUEST_EMAIL_REQUIRED",
      "Guest checkout requires an email.",
      400,
    );
  }

  try {
    const result = await placeOrderUseCase({
      cartId: cart.id,
      userId: user?.userId ?? null,
      input: parsed.data,
    });

    // Hydrate order for email + return payload
    const fullOrder = await orderRepository.findByIdAdmin(result.orderId);

    // Best-effort side-effects (don't fail checkout if email/inngest dispatch fails)
    if (fullOrder) {
      const recipient = user?.email ?? parsed.data.guestEmail ?? null;
      if (recipient) {
        sendOrderConfirmationEmail({
          to: recipient,
          order: fullOrder,
        }).catch((err) =>
          console.error("[checkout] order confirmation email failed", err),
        );
      }
      inngest
        .send({
          name: "checkout/inventory.reserved",
          data: { orderId: result.orderId },
        })
        .catch((err) =>
          console.error("[checkout] inngest dispatch failed", err),
        );

      // Server-side analytics: Meta CAPI (no-op if META env not set)
      const recipientPhone = fullOrder.guestPhone ?? null;
      inngest
        .send({
          name: "commerce/order.created",
          data: {
            orderId: result.orderId,
            total: Number(fullOrder.total),
            currency: "BDT",
            ...(recipient && { email: recipient }),
            ...(recipientPhone && { phone: recipientPhone }),
            items: fullOrder.items.map((i) => ({
              id: i.variantId ?? 0,
              quantity: i.quantity,
              price: Number(i.unitPrice),
            })),
          },
        })
        .catch((err) =>
          console.error("[checkout] order.created dispatch failed", err),
        );
    }

    return apiSuccess(result, 201);
  } catch (err) {
    if (err instanceof CheckoutError) {
      return apiError(err.code, err.message, err.status);
    }
    console.error("[checkout]", err);
    return apiError("INTERNAL_ERROR", "Could not place order.", 500);
  }
}
