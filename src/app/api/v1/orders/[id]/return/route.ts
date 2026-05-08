import type { NextRequest } from "next/server";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import { returnRequestCreateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";
import { inngest } from "@/lib/inngest/client";

/**
 * Eligible order statuses for opening a return.
 * Allow returns only after the order has been delivered.
 */
const RETURNABLE_STATUSES = new Set(["DELIVERED"]);

/**
 * GET /api/v1/orders/[id]/return
 * List return requests for the given order (owner only).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return apiError("INVALID_ID", "Invalid order id.", 400);
  }

  const order = await returnRepository.getOrderForReturn(orderId, guard.ctx.userId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

  const items = await returnRepository.listForOrder(orderId);
  return apiSuccess({ items });
}

/**
 * POST /api/v1/orders/[id]/return
 * Customer submits a new return request.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return apiError("INVALID_ID", "Invalid order id.", 400);
  }

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  const parsed = returnRequestCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const order = await returnRepository.getOrderForReturn(orderId, guard.ctx.userId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

  if (!RETURNABLE_STATUSES.has(order.status)) {
    return apiError(
      "ORDER_NOT_RETURNABLE",
      "Returns can only be opened on delivered orders.",
      409,
    );
  }

  const hasOpen = await returnRepository.hasOpenRequestForOrder(orderId);
  if (hasOpen) {
    return apiError(
      "RETURN_ALREADY_PENDING",
      "An open return request already exists for this order.",
      409,
    );
  }

  const validation = await returnRepository.validateRequestItems(
    orderId,
    parsed.data.items,
  );
  if (!validation.ok) {
    return apiError("INVALID_ITEMS", validation.reason, 422);
  }

  const created = await returnRepository.create({
    orderId,
    userId: guard.ctx.userId,
    reason: parsed.data.reason,
    items: parsed.data.items,
  });

  inngest
    .send({
      name: "commerce/return.requested",
      data: {
        returnRequestId: created.id,
        orderId,
        userId: guard.ctx.userId,
      },
    })
    .catch((err) => console.error("[return] event dispatch failed", err));

  return apiSuccess(created, 201);
}
