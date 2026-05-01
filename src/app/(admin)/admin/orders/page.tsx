import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.storeId, DEFAULT_STORE_ID))
    .orderBy(desc(orders.id))
    .limit(100);

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Orders
      </h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-alt)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-medium hover:text-[var(--color-accent)]"
                    >
                      #{o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {o.guestEmail ?? o.userId ?? "Guest"}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs uppercase tracking-wide">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
