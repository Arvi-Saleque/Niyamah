import Link from "next/link";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, returnRequests } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const statusUpper = sp.status?.toUpperCase();
  const status =
    statusUpper && STATUS_TABS.includes(statusUpper as (typeof STATUS_TABS)[number])
      ? (statusUpper as (typeof STATUS_TABS)[number])
      : "ALL";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const limit = 25;
  const offset = (page - 1) * limit;

  const where = [eq(orders.storeId, DEFAULT_STORE_ID)];
  if (status !== "ALL") {
    where.push(eq(orders.status, status as (typeof orders.$inferSelect)["status"]));
  }
  if (q) {
    if (/^\d+$/.test(q)) {
      where.push(eq(orders.id, Number(q)));
    } else {
      where.push(
        or(
          ilike(orders.guestEmail, `%${q}%`),
          ilike(orders.guestPhone, `%${q}%`),
          ilike(orders.shippingName, `%${q}%`),
          ilike(orders.shippingPhone, `%${q}%`),
        )!,
      );
    }
  }

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(and(...where))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(orders)
      .where(and(...where)),
  ]);

  // Order ids that have a pending return — for the "needs attention" badge.
  const orderIds = rows.map((r) => r.id);
  const pendingReturnIds = new Set<number>();
  if (orderIds.length > 0) {
    const returnsRows = await db
      .select({ orderId: returnRequests.orderId })
      .from(returnRequests)
      .where(and(eq(returnRequests.status, "PENDING"), inArray(returnRequests.orderId, orderIds)));
    for (const r of returnsRows) pendingReturnIds.add(r.orderId);
  }

  const total = Number(totalRow[0]?.c ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const buildHref = (next: { status?: string; q?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    if (s !== "ALL") params.set("status", s.toLowerCase());
    const term = next.q ?? q;
    if (term) params.set("q", term);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    return `/admin/orders${params.toString() ? `?${params}` : ""}`;
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${total} order${total === 1 ? "" : "s"} · filter by status or search.`}
      />

      <form className="mb-3" action="/admin/orders" method="get">
        {status !== "ALL" && <input type="hidden" name="status" value={status.toLowerCase()} />}
        <Input
          name="q"
          placeholder="Search by order #, name, phone, or email…"
          defaultValue={q}
          className="max-w-md"
        />
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: s, page: 1 })}
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

      {rows.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders match"
          description="Try a different status or clear your search."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-2 font-medium hover:text-[var(--color-accent)]"
                    >
                      #{o.id}
                      {pendingReturnIds.has(o.id) && (
                        <span
                          title="Pending return request"
                          className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-800"
                        >
                          <AlertTriangle className="h-3 w-3" /> return
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {o.shippingName ?? o.guestEmail ?? o.userId ?? "Guest"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {o.shippingPhone ?? o.guestPhone ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {new Date(o.createdAt).toLocaleDateString()}
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
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 hover:bg-[var(--color-surface-alt)]"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildHref({ page: page + 1 })}
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
