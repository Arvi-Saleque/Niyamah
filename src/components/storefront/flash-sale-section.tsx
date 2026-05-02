import { CountdownTimer } from "@/components/shared/countdown-timer";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { ProductCardData } from "@/components/storefront/product-card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashSaleSectionProps {
  products: ProductCardData[];
  endsAt: string | Date;
  title?: string;
  /** Percentage 0-100 of stock claimed; controls the urgency bar. */
  stockClaimedPct?: number;
  className?: string;
}

/** Homepage flash-sale band with countdown timer + stock-claimed urgency bar. */
export function FlashSaleSection({
  products,
  endsAt,
  title = "Flash Sale",
  stockClaimedPct,
  className,
}: FlashSaleSectionProps) {
  const pct = Math.min(100, Math.max(0, Math.round(stockClaimedPct ?? 64)));

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-end gap-4">
        <SectionHeader title={title} className="mb-0 flex-1" />
        <CountdownTimer endsAt={endsAt} />
      </div>

      {/* Stock-claimed urgency bar */}
      <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-gradient-to-r from-[var(--color-accent-light)]/40 via-[var(--color-surface-alt)] to-[var(--color-accent-light)]/40 p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1 text-[var(--color-accent-dark)]">
            <Flame className="h-3.5 w-3.5" /> Going fast — {pct}% stock claimed
          </span>
          <span className="text-[var(--color-text-muted)]">{100 - pct}% remaining</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/70">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-accent-dark)] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ProductGrid products={products} columns={5} />
    </section>
  );
}
