import type { NextRequest } from "next/server";
import {
  cancelOrderUseCase,
  CancelOrderError,
} from "@/modules/commerce/application/cancel-order.usecase";
import { cancelOrderSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";
import { inngest } from "@/lib/inngest/client";

interface Ctx {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/v1/orders/[id]/cancel
 *
 * Customer-initiated cancellation. Releases reserved stock; rejects after
 * the order has shipped (use returns instead).
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id: idStr } = await params;
  const orderId = Number(idStr);
  if (!Number.isInteger(orderId) || orderId <= 0)
    return apiError("INVALID_ID", "Invalid order id.", 400);

  const body = await req.json().catch(() => ({}));
  const parsed = cancelOrderSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    await cancelOrderUseCase({
      orderId,
      userId: guard.ctx.userId,
      reason: parsed.data.reason,
    });

    inngest
      .send({
        name: "commerce/order.status-changed",
        data: {
          orderId,
          newStatus: "CANCELLED",
          note: parsed.data.reason ?? "Cancelled by customer",
          recipientEmail: guard.ctx.email,
        },
      })
      .catch((err) =>
        console.error("[cancel-order] inngest dispatch failed", err),
      );

    return apiSuccess({ orderId, status: "CANCELLED" });
  } catch (err) {
    if (err instanceof CancelOrderError) {
      return apiError(err.code, err.message, err.status);
    }
    console.error("[cancel-order]", err);
    return apiError("INTERNAL_ERROR", "Could not cancel order.", 500);
  }
}
