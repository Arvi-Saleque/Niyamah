import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guards";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Order details" };

export default async function OrderDetailPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=/account/orders/${idStr}`);

  const order = await orderRepository.findByIdForUser(id, user.userId);
  if (!order) notFound();

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/account/orders">Back to orders</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items + history */}
        <div className="space-y-6">
          <section className="rounded-xl border border-[var(--color-border)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Items</h2>
              <StatusBadge status={order.status} />
            </div>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-alt)]">
                    {it.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.imageUrl} alt={it.productName} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{it.productName}</p>
                    {it.variantLabel && (
                      <p className="text-xs text-[var(--color-text-muted)]">{it.variantLabel}</p>
                    )}
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Qty: {it.quantity} × {formatCurrency(Number(it.unitPrice))}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(Number(it.totalPrice))}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {order.statusHistory.length > 0 && (
            <section className="rounded-xl border border-[var(--color-border)] p-5">
              <h2 className="mb-3 font-semibold">Status timeline</h2>
              <ol className="space-y-3">
                {order.statusHistory.map((h) => (
                  <li key={h.id} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{h.toStatus}</span>
                        {h.fromStatus && (
                          <span className="text-[var(--color-text-muted)]"> from {h.fromStatus}</span>
                        )}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(h.createdAt).toLocaleString()}
                      </p>
                      {h.note && <p className="mt-0.5 text-sm">{h.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Summary + payment */}
        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] p-5 text-sm">
            <h2 className="mb-3 font-semibold">Order summary</h2>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {formatCurrency(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Shipping</span>
                <span>{formatCurrency(Number(order.shippingAmount))}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[var(--color-accent)]">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </section>

          {order.payments.length > 0 && (
            <section className="rounded-xl border border-[var(--color-border)] p-5 text-sm">
              <h2 className="mb-3 font-semibold">Payment</h2>
              {order.payments.map((p) => (
                <div key={p.id} className="space-y-1">
                  <p>
                    <span className="text-[var(--color-text-muted)]">Method:</span>{" "}
                    <span className="font-medium">{p.method}</span>
                  </p>
                  <p>
                    <span className="text-[var(--color-text-muted)]">Status:</span>{" "}
                    <StatusBadge status={p.status} />
                  </p>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </Container>
  );
}
