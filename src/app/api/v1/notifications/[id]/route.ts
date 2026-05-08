import type { NextRequest } from "next/server";
import { notificationRepository } from "@/lib/notifications/notification-repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

/**
 * PATCH /api/v1/notifications/[id]
 * Mark a single notification as read.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const notifId = Number(id);
  if (!Number.isInteger(notifId) || notifId < 1) {
    return apiError("INVALID_ID", "Invalid notification id.", 400);
  }

  const row = await notificationRepository.markAsRead(notifId, guard.ctx.userId);
  if (!row) return apiError("NOT_FOUND", "Notification not found.", 404);
  return apiSuccess(row);
}

/**
 * DELETE /api/v1/notifications/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const notifId = Number(id);
  if (!Number.isInteger(notifId) || notifId < 1) {
    return apiError("INVALID_ID", "Invalid notification id.", 400);
  }

  const ok = await notificationRepository.delete(notifId, guard.ctx.userId);
  if (!ok) return apiError("NOT_FOUND", "Notification not found.", 404);
  return apiSuccess({ deleted: true });
}
