import type { NextRequest } from "next/server";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { orderStatusUpdateSchema } from "@/lib/validations/commerce";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireAdmin } from "@/lib/auth/guards";
import { inngest } from "@/lib/inngest/client";

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

  // Best-effort status email — registered user OR guest
  let recipient: string | null = updated.guestEmail ?? null;
  if (!recipient && updated.userId) {
    try {
      const { db } = await import("@/lib/db");
      const { users } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");
      const [u] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, updated.userId))
        .limit(1);
      recipient = u?.email ?? null;
    } catch (err) {
      console.error("[order.status] user lookup failed", err);
    }
  }

  if (recipient) {
    inngest
      .send({
        name: "commerce/order.status-changed",
        data: {
          orderId: updated.id,
          newStatus: parsed.data.status,
          ...(parsed.data.note && { note: parsed.data.note }),
          recipientEmail: recipient,
        },
      })
      .catch((err) =>
        console.error("[order.status] inngest dispatch failed", err),
      );
  }

  return apiSuccess(updated);
}
