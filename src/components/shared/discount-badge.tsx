import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  percent: number;
  className?: string;
}

/** Red pill badge showing "20% OFF" — place on product images or near price. */
export function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  if (percent <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
        "bg-[var(--color-error)] text-white",
        className,
      )}
    >
      -{percent}%
    </span>
  );
}
