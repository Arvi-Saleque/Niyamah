import { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { orderStatusUpdateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";
import { sendOrderStatusEmail } from "@/lib/resend";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0)
    return apiError("INVALID_ID", "Invalid id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = orderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const updated = await orderRepository.updateStatus(
    id,
    parsed.data,
    guard.ctx.userId,
  );
  if (!updated) return apiError("NOT_FOUND", "Order not found.", 404);

  // Best-effort status email
  const recipient = updated.guestEmail ?? null;
  // For registered users we'd need to join users table — skipping inline lookup.
  if (recipient) {
    sendOrderStatusEmail({
      to: recipient,
      orderId: updated.id,
      newStatus: parsed.data.status,
      note: parsed.data.note ?? null,
    }).catch((err) => console.error("[order.status] email failed", err));
  }

  return apiSuccess(updated);
}
