import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { returnRepository } from "@/modules/commerce/infrastructure/return.repository";
import { orderRepository } from "@/modules/commerce/infrastructure/order.repository";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { ReturnReviewActions } from "@/components/admin/return-review-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ReturnItem {
  orderItemId: number;
  quantity: number;
}

export default async function AdminReturnDetailPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const ret = await returnRepository.findById(id);
  if (!ret) notFound();

  const order = await orderRepository.findByIdAdmin(ret.orderId);

  // Build a map of order items so we can show product / unit price
  const itemMap = new Map(order?.items.map((it) => [it.id, it]) ?? []);
  const lines = (ret.items as ReturnItem[]).map((rl) => {
    const orderItem = itemMap.get(rl.orderItemId);
    const unit = orderItem ? Number(orderItem.unitPrice) : 0;
    return {
      orderItemId: rl.orderItemId,
      quantity: rl.quantity,
      productName: orderItem?.productName ?? `Item #${rl.orderItemId}`,
      sku: orderItem?.sku ?? null,
      unitPrice: unit,
      lineTotal: unit * rl.quantity,
    };
  });

  const suggestedRefund = lines.reduce((s, l) => s + l.lineTotal, 0);
  const isPending = ret.status === "PENDING";

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href="/admin/returns">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to returns
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Return request #{ret.id}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              For{" "}
              <Link
                href={`/admin/orders/${ret.orderId}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                Order #{ret.orderId}
              </Link>{" "}
              · {new Date(ret.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={ret.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 font-semibold">Items requested</h2>
            <div className="divide-y divide-[var(--color-border)]">
              {lines.map((l) => (
                <div
                  key={l.orderItemId}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{l.productName}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      SKU {l.sku ?? "—"} · Qty {l.quantity} ×{" "}
                      {formatCurrency(l.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(l.lineTotal)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">
                Suggested refund total
              </span>
              <span className="font-semibold">
                {formatCurrency(suggestedRefund)}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Customer reason</h2>
            <p className="whitespace-pre-wrap text-sm text-[var(--color-text-secondary)]">
              {ret.reason}
            </p>
          </section>

          {ret.adminNote && (
            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="mb-3 font-semibold">Admin note</h2>
              <p className="whitespace-pre-wrap text-sm">{ret.adminNote}</p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {isPending && (
            <ReturnReviewActions
              returnId={ret.id}
              suggestedRefund={suggestedRefund}
            />
          )}

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 font-semibold">Resolution</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Status</dt>
                <dd>
                  <StatusBadge status={ret.status} />
                </dd>
              </div>
              {ret.refundAmount && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">
                    Refund amount
                  </dt>
                  <dd className="font-semibold">
                    {formatCurrency(Number(ret.refundAmount))}
                  </dd>
                </div>
              )}
              {ret.resolvedAt && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Resolved at</dt>
                  <dd>{new Date(ret.resolvedAt).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
