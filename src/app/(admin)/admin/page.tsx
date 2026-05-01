import Link from "next/link";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products, users } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [ordersTodayRow] = await db
    .select({ c: count() })
    .from(orders)
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${todayIso}`,
    );
  const [revenueRow] = await db
    .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
    .from(orders)
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${todayIso} and ${orders.status} <> 'CANCELLED'`,
    );
  const [productCountRow] = await db
    .select({ c: count() })
    .from(products)
    .where(eq(products.storeId, DEFAULT_STORE_ID));
  const [customerCountRow] = await db
    .select({ c: count() })
    .from(users)
    .where(eq(users.role, "customer"));

  const ordersToday = Number(ordersTodayRow?.c ?? 0);
  const revenueToday = Number(revenueRow?.total ?? 0);
  const totalProducts = Number(productCountRow?.c ?? 0);
  const totalCustomers = Number(customerCountRow?.c ?? 0);

  const recentOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.storeId, DEFAULT_STORE_ID))
    .orderBy(sql`${orders.createdAt} desc`)
    .limit(8);

  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Orders Today" value={ordersToday} icon={ShoppingBag} />
        <StatsCard
          title="Revenue Today"
          value={revenueToday}
          isCurrency
          icon={DollarSign}
        />
        <StatsCard title="Total Products" value={totalProducts} icon={Package} />
        <StatsCard title="Customers" value={totalCustomers} icon={Users} />
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No orders yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-text-secondary)]">
              <tr>
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Date</th>
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
                  <td className="py-2">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-2">{formatCurrency(Number(o.total))}</td>
                  <td className="py-2 text-[var(--color-text-secondary)]">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
