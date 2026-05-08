import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  users,
  inventory,
  productVariants,
  products,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

/**
 * Statistics repository for admin dashboard.
 * All queries are scoped to DEFAULT_STORE_ID.
 *
 * Revenue is computed from non-cancelled, non-returned orders.
 */

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date): Date {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const statsRepository = {
  /**
   * Dashboard overview: total revenue (lifetime + this month),
   * total orders, total customers, pending order count, low stock count.
   */
  async overview() {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const baseWhere = and(
      eq(orders.storeId, DEFAULT_STORE_ID),
      sql`${orders.status} NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')`,
    );

    const [
      lifetimeRow,
      monthRow,
      ordersTotalRow,
      customersRow,
      pendingRow,
      lowStockRow,
    ] = await Promise.all([
      db
        .select({
          revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
        })
        .from(orders)
        .where(baseWhere),
      db
        .select({
          revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
          count: sql<number>`count(*)::int`,
        })
        .from(orders)
        .where(and(baseWhere, gte(orders.createdAt, monthStart))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(eq(orders.storeId, DEFAULT_STORE_ID)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.role, "customer")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(
          and(
            eq(orders.storeId, DEFAULT_STORE_ID),
            eq(orders.status, "PENDING"),
          ),
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(inventory)
        .where(
          and(
            eq(inventory.storeId, DEFAULT_STORE_ID),
            eq(inventory.trackStock, true),
            sql`${inventory.stockAvailable} <= ${inventory.lowStockThreshold}`,
          ),
        ),
    ]);

    return {
      revenue: {
        lifetime: lifetimeRow[0]?.revenue ?? "0",
        thisMonth: monthRow[0]?.revenue ?? "0",
      },
      orders: {
        total: ordersTotalRow[0]?.count ?? 0,
        thisMonth: monthRow[0]?.count ?? 0,
        pending: pendingRow[0]?.count ?? 0,
      },
      customers: {
        total: customersRow[0]?.count ?? 0,
      },
      inventory: {
        lowStockCount: lowStockRow[0]?.count ?? 0,
      },
    };
  },

  /**
   * Daily revenue trend for the past `days` days.
   * Returns one row per day, including days with zero orders.
   */
  async revenueTrend(days: number) {
    const now = new Date();
    const end = startOfDay(now);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    const rows = await db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`,
        revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, DEFAULT_STORE_ID),
          sql`${orders.status} NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')`,
          gte(orders.createdAt, start),
        ),
      )
      .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})`);

    // Fill missing days with zero entries.
    const map = new Map(rows.map((r) => [r.day, r]));
    const series: Array<{ date: string; revenue: string; orderCount: number }> = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const r = map.get(key);
      series.push({
        date: key,
        revenue: r?.revenue ?? "0",
        orderCount: r?.count ?? 0,
      });
    }
    return series;
  },

  /**
   * Order count grouped by status.
   */
  async ordersByStatus() {
    const rows = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(eq(orders.storeId, DEFAULT_STORE_ID))
      .groupBy(orders.status);

    const result: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      RETURNED: 0,
      REFUNDED: 0,
    };
    for (const r of rows) result[r.status] = r.count;
    return result;
  },

  /**
   * Top products by units sold and revenue.
   * Joins order_items -> product_variants -> products.
   */
  async topProducts(limit = 10) {
    const rows = await db
      .select({
        productId: products.id,
        productName: products.name,
        productSlug: products.slug,
        unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        revenue: sql<string>`coalesce(sum(${orderItems.totalPrice}), 0)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .innerJoin(productVariants, eq(productVariants.id, orderItems.variantId))
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(
        and(
          eq(orders.storeId, DEFAULT_STORE_ID),
          sql`${orders.status} NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')`,
        ),
      )
      .groupBy(products.id, products.name, products.slug)
      .orderBy(desc(sql`sum(${orderItems.totalPrice})`))
      .limit(limit);

    return rows;
  },

  /**
   * Customer stats: total customers, new this month, repeat purchasers
   * (customers with 2+ non-cancelled orders).
   */
  async customers() {
    const monthStart = startOfMonth(new Date());

    const [totalRow, newMonthRow, repeatRow] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.role, "customer")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(
          and(
            eq(users.role, "customer"),
            gte(users.createdAt, monthStart),
          ),
        ),
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(
          db
            .select({
              userId: orders.userId,
            })
            .from(orders)
            .where(
              and(
                eq(orders.storeId, DEFAULT_STORE_ID),
                sql`${orders.userId} IS NOT NULL`,
                sql`${orders.status} NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')`,
              ),
            )
            .groupBy(orders.userId)
            .having(sql`count(*) >= 2`)
            .as("repeat_buyers"),
        ),
    ]);

    return {
      total: totalRow[0]?.count ?? 0,
      newThisMonth: newMonthRow[0]?.count ?? 0,
      repeatBuyers: repeatRow[0]?.count ?? 0,
    };
  },
};
