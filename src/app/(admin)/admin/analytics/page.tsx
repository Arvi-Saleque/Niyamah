import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products, users } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { StatsCard } from "@/components/admin/stats-card";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();

  // Totals (last 30 days)
  const [revenueRow] = await db
    .select({
      total: sql<string>`coalesce(sum(${orders.total}), 0)`,
      cnt: sql<string>`count(*)`,
    })
    .from(orders)
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${sinceIso} and ${orders.status} <> 'CANCELLED'`,
    );
  const revenue30 = Number(revenueRow?.total ?? 0);
  const orders30 = Number(revenueRow?.cnt ?? 0);
  const aov = orders30 > 0 ? revenue30 / orders30 : 0;

  const [newCustomersRow] = await db
    .select({ c: sql<string>`count(*)` })
    .from(users)
    .where(
      sql`${users.role} = 'customer' and ${users.createdAt} >= ${sinceIso}`,
    );
  const newCustomers30 = Number(newCustomersRow?.c ?? 0);

  // Daily revenue (last 30 days)
  const daily = await db
    .select({
      day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
      total: sql<string>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${sinceIso} and ${orders.status} <> 'CANCELLED'`,
    )
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD') asc`);

  const maxDaily = daily.reduce(
    (m, d) => Math.max(m, Number(d.total)),
    0,
  );

  // Top products
  const top = await db
    .select({
      productName: orderItems.productName,
      qty: sql<string>`sum(${orderItems.quantity})`,
      revenue: sql<string>`sum(${orderItems.totalPrice})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${sinceIso} and ${orders.status} <> 'CANCELLED'`,
    )
    .groupBy(orderItems.productName)
    .orderBy(sql`sum(${orderItems.totalPrice}) desc`)
    .limit(10);

  // Status breakdown
  const byStatus = await db
    .select({
      status: orders.status,
      c: sql<string>`count(*)`,
    })
    .from(orders)
    .where(
      sql`${orders.storeId} = ${DEFAULT_STORE_ID} and ${orders.createdAt} >= ${sinceIso}`,
    )
    .groupBy(orders.status);

  const totalProductsRow = await db
    .select({ c: sql<string>`count(*)` })
    .from(products)
    .where(eq(products.storeId, DEFAULT_STORE_ID));
  const totalProducts = Number(totalProductsRow[0]?.c ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Last 30 days performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue (30d)"
          value={revenue30}
          isCurrency
          icon={DollarSign}
        />
        <StatsCard title="Orders (30d)" value={orders30} icon={ShoppingBag} />
        <StatsCard
          title="Avg order value"
          value={aov}
          isCurrency
          icon={TrendingUp}
        />
        <StatsCard
          title="New customers"
          value={newCustomers30}
          icon={Users}
        />
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 text-lg font-medium">Daily revenue</h2>
        {daily.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No orders in this period.
          </p>
        ) : (
          <div className="flex h-48 items-end gap-1">
            {daily.map((d) => {
              const v = Number(d.total);
              const h = maxDaily > 0 ? Math.max(2, (v / maxDaily) * 100) : 2;
              return (
                <div
                  key={d.day}
                  className="group relative flex-1"
                  title={`${d.day}: ${formatCurrency(v)}`}
                >
                  <div
                    className="w-full rounded-t bg-[var(--color-accent)]/80 transition hover:bg-[var(--color-accent)]"
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 text-lg font-medium">Top products</h2>
          {top.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No sales yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--color-text-secondary)]">
                <tr>
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium text-right">Qty</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top.map((t, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="py-2">{t.productName}</td>
                    <td className="py-2 text-right">{Number(t.qty)}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(t.revenue))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 text-lg font-medium">Orders by status</h2>
          {byStatus.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No orders.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {byStatus.map((s) => (
                <li
                  key={s.status}
                  className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 last:border-0"
                >
                  <span className="font-medium">{s.status}</span>
                  <span>{Number(s.c)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
            Catalog has {totalProducts} products.
          </p>
        </section>
      </div>
    </div>
  );
}
