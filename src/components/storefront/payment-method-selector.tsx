import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  className?: string;
}

/**
 * Payment method panel — Cash on Delivery only in v1.
 * Displays a locked selection card; no interaction required.
 */
export function PaymentMethodSelector({ className }: PaymentMethodSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/5 p-4",
        className,
      )}
    >
      <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
      <div>
        <p className="font-medium">Cash on Delivery</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Pay with cash when your order arrives. No card required.
        </p>
      </div>
    </div>
  );
}
