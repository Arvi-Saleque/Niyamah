"use client";

import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { RatingStars } from "@/components/shared/rating-stars";

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  maxPrice?: number;
  brands?: string[];
  className?: string;
}

/** Desktop left-rail filter panel for category / search pages. */
export function FilterSidebar({
  filters,
  onChange,
  onClear,
  maxPrice = 10000,
  brands = [],
  className,
}: FilterSidebarProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const toggleBrand = (brand: string) =>
    update({
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });

  const toggleRating = (r: number) =>
    update({
      ratings: filters.ratings.includes(r)
        ? filters.ratings.filter((x) => x !== r)
        : [...filters.ratings, r],
    });

  return (
    <aside className={cn("space-y-6 py-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold">Filters</span>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-[var(--color-accent)]">
          Clear all
        </Button>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-3 text-sm font-medium">Price Range</p>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={filters.priceRange}
          onValueChange={(v) => update({ priceRange: v as [number, number] })}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>{formatCurrency(filters.priceRange[0])}</span>
          <span>{formatCurrency(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium">Brand</p>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm font-normal">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <p className="mb-3 text-sm font-medium">Rating</p>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${r}`}
                checked={filters.ratings.includes(r)}
                onCheckedChange={() => toggleRating(r)}
              />
              <Label htmlFor={`rating-${r}`} className="cursor-pointer">
                <RatingStars rating={r} showCount={false} size="sm" />
              </Label>
              <span className="text-xs text-[var(--color-text-muted)]">& up</span>
            </div>
          ))}
        </div>
      </div>

      {/* In stock only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={filters.inStockOnly}
          onCheckedChange={(v) => update({ inStockOnly: !!v })}
        />
        <Label htmlFor="in-stock" className="cursor-pointer text-sm font-normal">
          In Stock Only
        </Label>
      </div>
    </aside>
  );
}
