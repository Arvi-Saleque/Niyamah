import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products, customers } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { StatsCard } from "@/components/admin/stats-card";
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
    .from(customers)
    .where(eq(customers.storeId, DEFAULT_STORE_ID));

  const ordersToday = Number(ordersTodayRow?.c ?? 0);
  const revenueToday = Number(revenueRow?.total ?? 0);
  const totalProducts = Number(productCountRow?.c ?? 0);
  const totalCustomers = Number(customerCountRow?.c ?? 0);

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-semibold"
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
    </div>
  );
}
