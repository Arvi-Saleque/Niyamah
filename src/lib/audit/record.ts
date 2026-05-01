import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

/**
 * Append an admin audit-log entry. Best-effort — silently swallows errors so
 * write paths are never blocked by audit failures.
 */
export async function recordAudit(opts: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
  storeId?: number;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      storeId: opts.storeId ?? DEFAULT_STORE_ID,
      actorId: opts.actorId ?? null,
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId != null ? String(opts.entityId) : null,
      before: (opts.before ?? null) as object | null,
      after: (opts.after ?? null) as object | null,
      ip: opts.ip ?? null,
    });
  } catch {
    /* swallow */
  }
}
