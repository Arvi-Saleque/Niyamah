import { getCurrentAdminAccess, hasPermission } from "@/modules/auth/application/get-admin-access";
import { getFirstAllowedAdminPath } from "@/modules/auth/application/get-first-allowed-path";
import { redirect } from "next/navigation";
import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { Package, ShoppingBag, AlertTriangle, RotateCcw, Clock, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { orders, products, inventory, returnRequests } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { StatsCard } from "@/components/admin/stats-card";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default async function AdminDashboardPage() {
  const ctx = await getCurrentAdminAccess();
  if (!ctx) redirect("/login?redirect=/admin");
  
  if (!hasPermission(ctx, "dashboard.view")) {
    const fallback = getFirstAllowedAdminPath(ctx);
    if (fallback === "/admin") {
       redirect("/admin/access-denied");
    }
    redirect(fallback);
  }

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 86400000));
  const monthStart = startOfDay(new Date(now.getTime() - 29 * 86400000));

  const isStore = eq(orders.storeId, DEFAULT_STORE_ID);
  const notCancelled = sql`${orders.status} <> 'CANCELLED'`;

  const [
    revenueTodayRow,
    revenueWeekRow,
    revenueMonthRow,
    ordersTodayRow,
    pendingActionRow,
    productCountRow,
    lowStockRow,
    pendingReturnsRow,
    seriesRows,
    recentOrders,
    needsAttentionLowStock,
    needsAttentionReturns,
  ] = await Promise.all([
    db
      .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(and(isStore, notCancelled, sql`${orders.createdAt} >= ${todayStart}`)),
    db
      .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(and(isStore, notCancelled, sql`${orders.createdAt} >= ${weekStart}`)),
    db
      .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(and(isStore, notCancelled, sql`${orders.createdAt} >= ${monthStart}`)),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(orders)
      .where(and(isStore, sql`${orders.createdAt} >= ${todayStart}`)),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(orders)
      .where(and(isStore, sql`${orders.status} in ('PENDING','CONFIRMED','PROCESSING')`)),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.storeId, DEFAULT_STORE_ID)),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(inventory)
      .where(
        and(
          eq(inventory.storeId, DEFAULT_STORE_ID),
          eq(inventory.trackStock, true),
          sql`${inventory.stockAvailable} <= ${inventory.lowStockThreshold}`,
        ),
      ),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(returnRequests)
      .where(eq(returnRequests.status, "PENDING")),
    db
      .select({
        day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
        total: sql<string>`coalesce(sum(${orders.total}), 0)`,
      })
      .from(orders)
      .where(and(isStore, notCancelled, sql`${orders.createdAt} >= ${monthStart}`))
      .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`),
    db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        shippingName: orders.shippingName,
        guestEmail: orders.guestEmail,
      })
      .from(orders)
      .where(eq(orders.storeId, DEFAULT_STORE_ID))
      .orderBy(sql`${orders.createdAt} desc`)
      .limit(8),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(inventory)
      .where(
        and(
          eq(inventory.storeId, DEFAULT_STORE_ID),
          eq(inventory.trackStock, true),
          sql`${inventory.stockAvailable} = 0`,
        ),
      ),
    db
      .select({
        id: returnRequests.id,
        orderId: returnRequests.orderId,
        createdAt: returnRequests.createdAt,
      })
      .from(returnRequests)
      .where(eq(returnRequests.status, "PENDING"))
      .orderBy(sql`${returnRequests.createdAt} desc`)
      .limit(5),
  ]);

  const revenueToday = Number(revenueTodayRow[0]?.total ?? 0);
  const revenueWeek = Number(revenueWeekRow[0]?.total ?? 0);
  const revenueMonth = Number(revenueMonthRow[0]?.total ?? 0);
  const ordersToday = Number(ordersTodayRow[0]?.c ?? 0);
  const pendingAction = Number(pendingActionRow[0]?.c ?? 0);
  const totalProducts = Number(productCountRow[0]?.c ?? 0);
  const lowStock = Number(lowStockRow[0]?.c ?? 0);
  const pendingReturns = Number(pendingReturnsRow[0]?.c ?? 0);
  const outOfStock = Number(needsAttentionLowStock[0]?.c ?? 0);

  // Build a 30-day series, filling missing days with 0.
  const seriesMap = new Map(seriesRows.map((r) => [r.day, Number(r.total)]));
  const series: { day: string; total: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(monthStart.getTime() + i * 86400000);
    const key = d.toISOString().slice(0, 10);
    series.push({ day: key, total: seriesMap.get(key) ?? 0 });
  }
  const maxValue = Math.max(1, ...series.map((p) => p.total));

  const W = 600;
  const H = 120;
  const stepX = W / (series.length - 1);
  const points = series
    .map((p, i) => {
      const x = i * stepX;
      const y = H - (p.total / maxValue) * (H - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back. ${ordersToday} order${ordersToday === 1 ? "" : "s"} today.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Revenue Today" value={revenueToday} isCurrency icon={TrendingUp} />
        <StatsCard title="Revenue 7-day" value={revenueWeek} isCurrency icon={TrendingUp} />
        <StatsCard title="Revenue 30-day" value={revenueMonth} isCurrency icon={TrendingUp} />
        <StatsCard title="Orders Today" value={ordersToday} icon={ShoppingBag} />
        <StatsCard title="Needs action" value={pendingAction} icon={Clock} />
        <StatsCard title="Products" value={totalProducts} icon={Package} />
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Revenue — last 30 days</h2>
          <span className="text-sm text-[var(--color-text-muted)]">
            Peak {formatCurrency(maxValue)}
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full" preserveAspectRatio="none">
          <polygon fill="var(--color-accent-light)" opacity="0.5" points={areaPoints} />
          <polyline fill="none" stroke="var(--color-accent)" strokeWidth="2" points={points} />
        </svg>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--color-text-muted)]">
                <tr>
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-[var(--color-border)]">
                    <td className="py-2">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-medium hover:text-[var(--color-accent)]"
                      >
                        #{o.id}
                      </Link>
                    </td>
                    <td className="py-2 text-[var(--color-text-secondary)]">
                      {o.shippingName ?? o.guestEmail ?? "Guest"}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 font-medium">Needs attention</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <Link
                href="/admin/returns?status=PENDING"
                className="flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <RotateCcw className="h-4 w-4 text-[var(--color-text-muted)]" />
                Pending returns
              </Link>
              <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs font-semibold">
                {pendingReturns}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/admin/inventory/low-stock"
                className="flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <AlertTriangle className="h-4 w-4 text-[var(--color-text-muted)]" />
                Low stock variants
              </Link>
              <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs font-semibold">
                {lowStock}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/admin/inventory/low-stock"
                className="flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Out of stock
              </Link>
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                {outOfStock}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/admin/orders?status=PENDING"
                className="flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                Orders awaiting confirmation
              </Link>
              <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs font-semibold">
                {pendingAction}
              </span>
            </li>
          </ul>
          {needsAttentionReturns.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                Latest pending returns
              </p>
              <ul className="space-y-1 text-sm">
                {needsAttentionReturns.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/admin/returns/${r.id}`}
                      className="hover:text-[var(--color-accent)]"
                    >
                      Request #{r.id} · Order #{r.orderId}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
