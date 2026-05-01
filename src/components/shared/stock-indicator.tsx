import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
  showCount?: boolean;
}

/** Displays In Stock / Low Stock / Out of Stock with color-coded text. */
export function StockIndicator({
  stock,
  lowStockThreshold = 10,
  className,
  showCount = false,
}: StockIndicatorProps) {
  const isOut = stock <= 0;
  const isLow = !isOut && stock <= lowStockThreshold;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm font-medium", className)}>
      {isOut && (
        <>
          <AlertCircle className="h-4 w-4 text-[var(--color-error)]" />
          <span className="text-[var(--color-error)]">Out of Stock</span>
        </>
      )}
      {isLow && (
        <>
          <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />
          <span className="text-[var(--color-warning)]">
            {showCount ? `Only ${stock} left` : "Low Stock"}
          </span>
        </>
      )}
      {!isOut && !isLow && (
        <>
          <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
          <span className="text-[var(--color-success)]">
            {showCount ? `${stock} in stock` : "In Stock"}
          </span>
        </>
      )}
    </div>
  );
}
