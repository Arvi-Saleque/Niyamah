import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const limit = 50;
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      ip: auditLogs.ip,
      createdAt: auditLogs.createdAt,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorId, users.id))
    .where(eq(auditLogs.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Audit logs
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Recent administrative actions across the store.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No audit logs"
          description="System events will appear here as they happen."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {r.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{r.actorName ?? r.actorEmail ?? "system"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.action}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {r.entityType}
                    {r.entityId ? `#${r.entityId}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{r.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        {page > 1 ? (
          <Link
            href={`/admin/audit?page=${page - 1}`}
            className="text-[var(--color-accent)] hover:underline"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        {rows.length === limit && (
          <Link
            href={`/admin/audit?page=${page + 1}`}
            className="text-[var(--color-accent)] hover:underline"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
