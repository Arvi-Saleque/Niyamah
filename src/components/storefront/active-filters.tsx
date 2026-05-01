"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import type { FilterState } from "@/components/storefront/filter-sidebar";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemove: (key: keyof FilterState, value?: unknown) => void;
  onClear: () => void;
  className?: string;
}

/** Row of applied filter chips with individual remove buttons. */
export function ActiveFilters({ filters, onRemove, onClear, className }: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity) {
    chips.push({
      label: `${formatCurrency(filters.priceRange[0])} – ${formatCurrency(filters.priceRange[1])}`,
      onRemove: () => onRemove("priceRange"),
    });
  }
  filters.brands.forEach((b) =>
    chips.push({ label: b, onRemove: () => onRemove("brands", b) }),
  );
  filters.ratings.forEach((r) =>
    chips.push({ label: `${r}★ & up`, onRemove: () => onRemove("ratings", r) }),
  );
  if (filters.inStockOnly) {
    chips.push({ label: "In Stock", onRemove: () => onRemove("inStockOnly") });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-[var(--color-text-muted)]">Active:</span>
      {chips.map((chip, i) => (
        <Badge
          key={i}
          variant="secondary"
          className="gap-1 pr-1 cursor-default"
        >
          {chip.label}
          <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClear}
        className="text-xs text-[var(--color-accent)] hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
