import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  shippingLabel?: string;
  total: number;
  className?: string;
}

/** Order totals breakdown shown in cart drawer and checkout. */
export function CartSummary({
  subtotal,
  discount = 0,
  shippingLabel = "Cash on Delivery",
  total,
  className,
}: CartSummaryProps) {
  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Subtotal", value: formatCurrency(subtotal) },
    ...(discount > 0 ? [{ label: "Coupon discount", value: `- ${formatCurrency(discount)}` }] : []),
    { label: "Shipping", value: shippingLabel },
  ];

  return (
    <div className={cn("space-y-2 text-sm", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
      <Separator />
      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span className="text-[var(--color-accent)]">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
