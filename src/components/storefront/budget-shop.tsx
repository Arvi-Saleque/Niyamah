import Link from "next/link";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetChip {
  label: string;
  href: string;
  badge?: string;
  highlight?: boolean;
}

const DEFAULT_CHIPS: BudgetChip[] = [
  { label: "Under ৳499", href: "/products?max=499", badge: "Steal" },
  { label: "Under ৳999", href: "/products?max=999", highlight: true },
  { label: "Under ৳1,499", href: "/products?max=1499" },
  { label: "Under ৳2,499", href: "/products?max=2499" },
  { label: "Premium", href: "/products?premium=1", badge: "Top Shelf" },
];

interface BudgetShopProps {
  chips?: BudgetChip[];
  className?: string;
}

/** Budget-bracketed shopping shortcuts. */
export function BudgetShop({ chips = DEFAULT_CHIPS, className }: BudgetShopProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Shop by Budget
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Find your sweet spot
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Pick a price bracket — we&apos;ll show what fits.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {chips.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              "group relative flex h-28 flex-col items-center justify-center rounded-2xl border bg-gradient-to-br p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg",
              c.highlight
                ? "border-[var(--color-accent)] from-[var(--color-accent-light)]/60 to-white text-[var(--color-text-primary)]"
                : "border-[var(--color-border)] from-[var(--color-surface)] to-[var(--color-surface-alt)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]",
            )}
          >
            {c.badge && (
              <span
                className={cn(
                  "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  c.highlight
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
                )}
              >
                {c.badge}
              </span>
            )}
            <Tag
              className={cn(
                "mb-2 h-6 w-6 transition-transform group-hover:rotate-6",
                c.highlight
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]",
              )}
            />
            <p className="text-sm font-semibold">{c.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
