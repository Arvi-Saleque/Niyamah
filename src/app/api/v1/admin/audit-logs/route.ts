import type { NextRequest } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requirePermission } from "@/modules/auth/application/get-admin-access";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

/**
 * GET /api/v1/admin/audit-logs
 *
 * Paginated audit-log feed. Filter by entityType / actorId / action.
 *
 * Query: ?page=1&limit=50&entityType=order&actorId=xxx&action=order.dispatch
 */
export async function GET(req: NextRequest) {
  const guard = await requirePermission("audit.view");
  if ("error" in guard) return guard.error;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const limit = Math.min(200, Math.max(1, Number(sp.get("limit") ?? 50)));
  const offset = (page - 1) * limit;

  const where = [eq(auditLogs.storeId, DEFAULT_STORE_ID)];
  const entityType = sp.get("entityType");
  const actorId = sp.get("actorId");
  const action = sp.get("action");
  if (entityType) where.push(eq(auditLogs.entityType, entityType));
  if (actorId) where.push(eq(auditLogs.actorId, actorId));
  if (action) where.push(eq(auditLogs.action, action));

  const [items, countRows] = await Promise.all([
    db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        actorId: auditLogs.actorId,
        actorEmail: users.email,
        actorName: users.name,
        before: auditLogs.before,
        after: auditLogs.after,
        ip: auditLogs.ip,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(users, eq(users.id, auditLogs.actorId))
      .where(and(...where))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogs)
      .where(and(...where)),
  ]);

  return apiSuccess({
    items,
    total: countRows[0]?.count ?? 0,
    page,
    limit,
  });
}

export const dynamic = "force-dynamic";

// Avoid lint complaint on unused apiError when guard short-circuits
void apiError;
