import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  change?: number; // percentage delta, positive = up
  icon?: LucideIcon;
  className?: string;
}

/** Dashboard KPI card — value + optional % change trend. */
export function StatsCard({ title, value, isCurrency, change, icon: Icon, className }: StatsCardProps) {
  const TrendIcon = change === undefined || change === 0 ? Minus : change > 0 ? TrendingUp : TrendingDown;
  const trendColor = change === undefined || change === 0 ? "text-[var(--color-text-muted)]" : change > 0 ? "text-green-600" : "text-red-500";

  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
        {Icon && (
          <div className="rounded-lg bg-[var(--color-accent)]/10 p-2">
            <Icon className="h-4 w-4 text-[var(--color-accent)]" />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold">
        {isCurrency && typeof value === "number" ? formatCurrency(value) : value}
      </p>
      {change !== undefined && (
        <div className={cn("mt-1 flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      )}
    </div>
  );
}
