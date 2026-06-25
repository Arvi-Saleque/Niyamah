import Link from "next/link";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { Undo2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

const STATUSES = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;

export default async function AdminReturnsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const statusParam = sp.status?.toUpperCase();
  const status =
    statusParam && STATUSES.includes(statusParam as (typeof STATUSES)[number])
      ? (statusParam as (typeof STATUSES)[number])
      : "ALL";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const result = await returnRepository.listAdmin({
    page,
    limit: 20,
    status:
      status === "ALL" ? undefined : (status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"),
  });

  const totalPages = Math.max(1, Math.ceil(result.total / result.limit));

  return (
    <div>
      <PageHeader
        title="Returns & refunds"
        description="Review customer return requests and approve refunds."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/returns?status=${s.toLowerCase()}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === s
                ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          icon={Undo2}
          title="No return requests"
          description="When customers request a return, you'll see them here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Request</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Refund</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/returns/${r.id}`}
                      className="font-medium hover:text-[var(--color-accent)]"
                    >
                      #{r.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${r.orderId}`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                    >
                      #{r.orderId}
                    </Link>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-[var(--color-text-secondary)]">
                    {r.reason}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.refundAmount ? formatCurrency(Number(r.refundAmount)) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-[var(--color-text-muted)]">
            Page {page} of {totalPages} · {result.total} total
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/returns?status=${status.toLowerCase()}&page=${page - 1}`}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 hover:bg-[var(--color-surface-alt)]"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/returns?status=${status.toLowerCase()}&page=${page + 1}`}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 hover:bg-[var(--color-surface-alt)]"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
