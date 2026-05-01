import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderConfirmationProps {
  orderId: string;
  className?: string;
}

/** Success screen shown after order placement with order ID and navigation CTAs. */
export function OrderConfirmation({ orderId, className }: OrderConfirmationProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 py-12 text-center", className)}>
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <div>
        <h1 className="font-heading text-2xl font-bold">Order Placed!</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Thank you! We&rsquo;ll confirm your order shortly.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
        <span className="text-sm text-[var(--color-text-muted)]">Order ID:</span>
        <span className="font-mono font-semibold">{orderId}</span>
        <CopyButton text={orderId} />
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/account/orders/${orderId}`}>View Order</Link>
        </Button>
        <Button asChild className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
