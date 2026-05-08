import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { shipments } from "@/lib/db/schema";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { courierDispatchSchema } from "@/lib/validations/commerce";
import { createSteadfastConsignment } from "@/lib/courier/steadfast";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";
import { recordAudit } from "@/lib/audit/record";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

interface Ctx {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/admin/orders/[id]/courier
 * List existing shipment rows for the order.
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0)
    return apiError("INVALID_ID", "Invalid order id.", 400);

  const rows = await db
    .select()
    .from(shipments)
    .where(eq(shipments.orderId, orderId));
  return apiSuccess({ items: rows });
}

/**
 * POST /api/v1/admin/orders/[id]/courier
 * Dispatch the order to a courier (currently Steadfast supported; others
 * fall back to a "manual" record).
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0)
    return apiError("INVALID_ID", "Invalid order id.", 400);

  const body = await req.json().catch(() => ({}));
  const parsed = courierDispatchSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const order = await orderRepository.findByIdAdmin(orderId);
  if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
  if (!order.shippingPhone || !order.shippingName || !order.shippingAddressLine1) {
    return apiError(
      "MISSING_SHIPPING_INFO",
      "Order is missing recipient details.",
      400,
    );
  }

  const codAmount =
    order.payments[0]?.method === "COD" ? Number(order.total) : 0;

  let courierResult: {
    ok: boolean;
    consignmentId?: string | null;
    trackingCode?: string | null;
    raw?: unknown;
    error?: string;
  };

  if (parsed.data.courier === "steadfast") {
    const r = await createSteadfastConsignment({
      invoice: `NIY-${order.id}`,
      recipient_name: order.shippingName,
      recipient_phone: order.shippingPhone,
      recipient_address: [
        order.shippingAddressLine1,
        order.shippingAddressLine2,
        order.shippingArea,
        order.shippingDistrict,
        order.shippingCity,
      ]
        .filter(Boolean)
        .join(", "),
      cod_amount: codAmount,
      note: parsed.data.note,
    });
    courierResult = {
      ok: r.ok,
      consignmentId: r.consignment ? String(r.consignment.consignment_id) : null,
      trackingCode: r.consignment?.tracking_code ?? null,
      raw: r.raw,
      error: r.error,
    };
  } else {
    // Other couriers — record manually until adapters are added.
    courierResult = { ok: true, consignmentId: null, trackingCode: null };
  }

  if (!courierResult.ok) {
    return apiError(
      "COURIER_FAILED",
      courierResult.error ?? "Courier API failed.",
      502,
      courierResult.raw,
    );
  }

  const [shipment] = await db
    .insert(shipments)
    .values({
      storeId: DEFAULT_STORE_ID,
      orderId,
      courier: parsed.data.courier,
      consignmentId: courierResult.consignmentId,
      trackingCode: courierResult.trackingCode,
      status: "DISPATCHED",
      codAmount: codAmount ? codAmount.toFixed(2) : null,
      note: parsed.data.note ?? null,
      providerResponse: (courierResult.raw ?? null) as object | null,
      dispatchedBy: guard.ctx.userId,
    })
    .returning();

  // Move the order to SHIPPED and append history
  await orderRepository.updateStatus(
    orderId,
    {
      status: "SHIPPED",
      note: `Dispatched via ${parsed.data.courier}${
        courierResult.trackingCode ? ` (${courierResult.trackingCode})` : ""
      }`,
    },
    guard.ctx.userId,
  );

  recordAudit({
    actorId: guard.ctx.userId,
    action: "order.dispatch",
    entityType: "order",
    entityId: orderId,
    after: {
      courier: parsed.data.courier,
      trackingCode: courierResult.trackingCode,
    },
  }).catch(() => {});

  return apiSuccess(shipment, 201);
}
