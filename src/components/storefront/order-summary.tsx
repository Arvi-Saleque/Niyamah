import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/stores/cart-store";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  className?: string;
}

/** Read-only order summary panel shown on the checkout review step. */
export function OrderSummary({ items, subtotal, shipping, discount = 0, total, className }: OrderSummaryProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] p-5 space-y-4", className)}>
      <h3 className="font-semibold">Order Summary</h3>
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.image && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-alt)]">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm">{item.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-[var(--color-accent)]">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
