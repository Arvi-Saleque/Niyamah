import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Truck } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { shipments } from "@/lib/db/schema";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";
import { CourierDispatchPanel } from "@/components/admin/courier-dispatch-panel";

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

  const [orderShipments, orderReturns] = await Promise.all([
    db.select().from(shipments).where(eq(shipments.orderId, id)),
    returnRepository.listForOrder(id),
  ]);

  const created = new Date(order.createdAt).toLocaleString();
  const codAmount = order.payments[0]?.method === "COD" ? Number(order.total) : 0;
  const canDispatch = ["CONFIRMED", "PROCESSING"].includes(order.status);

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Placed {created} · {order.shippingName ?? order.guestEmail ?? order.userId ?? "Guest"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`/api/v1/orders/${order.id}/invoice`} target="_blank" rel="noreferrer">
                <FileText className="mr-1 h-4 w-4" /> Invoice
              </a>
            </Button>
            <AdminOrderActions orderId={String(order.id)} currentStatus={order.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
                      SKU {it.sku ?? "—"} · Qty {it.quantity} ×{" "}
                      {formatCurrency(Number(it.unitPrice))}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(Number(it.totalPrice))}</p>
                </div>
              ))}
            </div>
          </section>

          {orderReturns.length > 0 && (
            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="mb-3 font-semibold">Return requests</h2>
              <ul className="space-y-2 text-sm">
                {orderReturns.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3"
                  >
                    <div>
                      <Link
                        href={`/admin/returns/${r.id}`}
                        className="font-medium hover:text-[var(--color-accent)]"
                      >
                        Request #{r.id}
                      </Link>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.refundAmount && (
                        <span className="text-sm font-medium">
                          {formatCurrency(Number(r.refundAmount))}
                        </span>
                      )}
                      <StatusBadge status={r.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <h2 className="font-semibold">Shipments</h2>
            </div>
            {orderShipments.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No shipments dispatched yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {orderShipments.map((s) => (
                  <li key={s.id} className="rounded-lg border border-[var(--color-border)] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{s.courier}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
                      {s.trackingCode && <span>Tracking: {s.trackingCode}</span>}
                      {s.consignmentId && <span>Consignment: {s.consignmentId}</span>}
                      {s.codAmount && <span>COD: {formatCurrency(Number(s.codAmount))}</span>}
                      <span>Sent {new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                    {s.note && (
                      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{s.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Status history</h2>
            {order.statusHistory.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No status changes yet.</p>
            ) : (
              <ol className="space-y-3 text-sm">
                {order.statusHistory.map((h) => (
                  <li key={h.id} className="flex items-start gap-3">
                    <StatusBadge status={h.toStatus} />
                    <div className="flex-1">
                      <p className="text-[var(--color-text-secondary)]">{h.note ?? "—"}</p>
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
              <p className="text-sm text-[var(--color-text-muted)]">No payments recorded.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {order.payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3"
                  >
                    <span>{p.method ?? "—"}</span>
                    <span className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <span className="font-semibold">{formatCurrency(Number(p.amount))}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {canDispatch && <CourierDispatchPanel orderId={order.id} codAmount={codAmount} />}

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Subtotal</dt>
                <dd>{formatCurrency(Number(order.subtotal))}</dd>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Discount</dt>
                  <dd>−{formatCurrency(Number(order.discountAmount))}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Shipping</dt>
                <dd>{formatCurrency(Number(order.shippingAmount))}</dd>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrency(Number(order.total))}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Customer</h2>
            <p className="text-sm font-medium">
              {order.shippingName ?? order.guestEmail ?? order.userId ?? "Guest"}
            </p>
            {(order.shippingPhone ?? order.guestPhone) && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {order.shippingPhone ?? order.guestPhone}
              </p>
            )}
            {order.guestEmail && order.shippingName && (
              <p className="text-sm text-[var(--color-text-muted)]">{order.guestEmail}</p>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Shipping address</h2>
            {order.shippingAddressLine1 ? (
              <address className="text-sm text-[var(--color-text-secondary)] not-italic">
                {order.shippingAddressLine1}
                {order.shippingAddressLine2 && (
                  <>
                    <br />
                    {order.shippingAddressLine2}
                  </>
                )}
                <br />
                {[order.shippingArea, order.shippingCity, order.shippingDistrict]
                  .filter(Boolean)
                  .join(", ")}
                {order.shippingPostalCode && ` — ${order.shippingPostalCode}`}
              </address>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">—</p>
            )}
          </section>

          {order.couponCode && (
            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="mb-3 font-semibold">Coupon</h2>
              <p className="font-mono text-sm">{order.couponCode}</p>
            </section>
          )}
          {order.note && (
            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="mb-3 font-semibold">Customer note</h2>
              <p className="text-sm whitespace-pre-wrap">{order.note}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
