import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import { Truck } from "lucide-react";

interface FreeShippingProgressProps {
  currentTotal: number;
  threshold?: number;
  className?: string;
}

/** Progress bar motivating the customer to reach the free-shipping threshold. */
export function FreeShippingProgress({
  currentTotal,
  threshold = 2000,
  className,
}: FreeShippingProgressProps) {
  const pct = Math.min((currentTotal / threshold) * 100, 100);
  const remaining = threshold - currentTotal;

  return (
    <div className={cn("rounded-lg bg-[var(--color-surface-alt)] p-3 text-sm", className)}>
      <div className="mb-2 flex items-center gap-1.5 text-[var(--color-text-muted)]">
        <Truck className="h-4 w-4" />
        {remaining > 0 ? (
          <span>
            Add <span className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(remaining)}</span> more for free shipping!
          </span>
        ) : (
          <span className="font-semibold text-green-600">You have free shipping!</span>
        )}
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
