import type { NextRequest } from "next/server";
import { notificationRepository } from "@/lib/notifications/notification-repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

/**
 * GET /api/v1/notifications?page=1&limit=20&unread=1
 * Returns the signed-in user's notifications.
 */
export async function GET(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const unreadOnly = req.nextUrl.searchParams.get("unread") === "1";

  if (!Number.isInteger(page) || page < 1)
    return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);

  const result = await notificationRepository.listForUser(guard.ctx.userId, {
    page,
    limit,
    unreadOnly,
  });

  return apiSuccess(
    { items: result.items, unreadCount: result.unreadCount },
    200,
    { page: result.page, limit: result.limit, total: result.total },
  );
}

/**
 * PATCH /api/v1/notifications
 * Marks ALL of the signed-in user's notifications as read.
 */
export async function PATCH() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const updated = await notificationRepository.markAllAsRead(guard.ctx.userId);
  return apiSuccess({ updated });
}
