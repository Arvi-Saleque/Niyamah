import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await db.query.users.findFirst({
    where: and(eq(users.id, id), eq(users.role, "customer")),
  });
  if (!customer) notFound();

  const customerOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, id))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  const totalSpent = customerOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {customer.name ?? customer.email}
        </h1>
        <Link
          href="/admin/customers"
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
        >
          ← Back to customers
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-1 rounded-2xl border border-[var(--color-border)] bg-white p-6 space-y-3">
          <h2 className="text-lg font-medium">Profile</h2>
          <dl className="text-sm space-y-2">
            <div>
              <dt className="text-[var(--color-text-secondary)]">Email</dt>
              <dd>{customer.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-secondary)]">Phone</dt>
              <dd>{customer.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-secondary)]">Verified</dt>
              <dd>{customer.verified ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-secondary)]">Joined</dt>
              <dd>{customer.createdAt.toLocaleDateString()}</dd>
            </div>
          </dl>
        </section>

        <section className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Orders</h2>
            <div className="text-sm text-[var(--color-text-secondary)]">
              {customerOrders.length} orders · {formatCurrency(totalSpent)} total
            </div>
          </div>
          {customerOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="This customer hasn't placed any orders."
            />
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
                {customerOrders.map((o) => (
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
    </div>
  );
}
