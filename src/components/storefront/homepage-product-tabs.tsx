"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, Clock, Heart } from "lucide-react";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { ProductCardData } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";

export type ProductTabKey = "new" | "best" | "trending" | "viewed";

const TABS: { id: ProductTabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "best", label: "Best Sellers", icon: Flame },
  { id: "new", label: "New Arrivals", icon: Sparkles },
  { id: "trending", label: "Quran Picks", icon: Clock },
  { id: "viewed", label: "Gift Box", icon: Heart },
];

interface HomepageProductTabsProps {
  newArrivals: ProductCardData[];
  bestSellers: ProductCardData[];
  trending?: ProductCardData[];
  recentlyViewed?: ProductCardData[];
  className?: string;
}

/** Tabbed product showcase that condenses multiple grids into one premium widget. */
export function HomepageProductTabs({
  newArrivals,
  bestSellers,
  trending,
  recentlyViewed,
  className,
}: HomepageProductTabsProps) {
  const [active, setActive] = useState<ProductTabKey>("new");

  const dataMap: Record<ProductTabKey, ProductCardData[]> = {
    new: newArrivals,
    best: bestSellers,
    trending: trending ?? bestSellers,
    viewed: recentlyViewed?.length ? recentlyViewed : bestSellers,
  };

  const products = dataMap[active];

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#006B3A]">
            Carefully Selected
          </p>
          <h2
            className="text-2xl font-semibold md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Discover Products
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#6D7668]">
            Islamic essentials for everyday worship, gifting, and remembrance.
          </p>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-dark)]"
        >
          View all products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] pb-px">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const isEmpty = dataMap[id].length === 0;
          if (isEmpty) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {isActive && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-[var(--color-accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center text-sm text-[var(--color-text-muted)]">
          Nothing to show here yet — start browsing to see picks.
        </div>
      )}
    </section>
  );
}
