import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const order = await orderRepository.findByIdAdmin(id);
  if (!order) notFound();

  const created = new Date(order.createdAt).toLocaleString();

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Placed {created} · {order.guestEmail ?? order.userId ?? "Guest"}
            </p>
          </div>
          <AdminOrderActions
            orderId={String(order.id)}
            currentStatus={order.status}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items + history */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Items ({order.items.length})</h2>
            <div className="divide-y divide-[var(--color-border)]">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{it.productName}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      SKU {it.sku ?? "—"} · Qty {it.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(Number(it.totalPrice))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Status history</h2>
            {order.statusHistory.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                No status changes yet.
              </p>
            ) : (
              <ol className="space-y-3 text-sm">
                {order.statusHistory.map((h) => (
                  <li key={h.id} className="flex items-start gap-3">
                    <StatusBadge status={h.toStatus} />
                    <div className="flex-1">
                      <p className="text-[var(--color-text-secondary)]">
                        {h.note ?? "—"}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(h.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Payments</h2>
            {order.payments.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                No payments recorded.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {order.payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3"
                  >
                    <span>
                      {p.gateway} · {p.method ?? "—"}
                    </span>
                    <span className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <span className="font-semibold">
                        {formatCurrency(Number(p.amount))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Subtotal</dt>
                <dd>{formatCurrency(Number(order.subtotal))}</dd>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Discount</dt>
                  <dd>−{formatCurrency(Number(order.discount))}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Shipping</dt>
                <dd>{formatCurrency(Number(order.shippingCost))}</dd>
              </div>
              {Number(order.tax) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Tax</dt>
                  <dd>{formatCurrency(Number(order.tax))}</dd>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrency(Number(order.total))}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Customer</h2>
            <p className="text-sm">
              {order.guestEmail ?? order.userId ?? "Guest"}
            </p>
            {order.guestPhone && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {order.guestPhone}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Shipping</h2>
            <p className="text-sm">
              {order.shippingMethod ?? "—"}
            </p>
            {order.shippingAddress &&
              typeof order.shippingAddress === "object" && (
                <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-[var(--color-text-muted)]">
                  {JSON.stringify(order.shippingAddress, null, 2)}
                </pre>
              )}
          </section>
        </aside>
      </div>
    </div>
  );
}
