"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar, type FilterState } from "@/components/storefront/filter-sidebar";

interface FilterDrawerProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  maxPrice?: number;
  brands?: string[];
}

/** Mobile filter panel — same content as FilterSidebar wrapped in a shadcn Sheet. */
export function FilterDrawer({ filters, onChange, onClear, maxPrice, brands }: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 md:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <FilterSidebar
          filters={filters}
          onChange={onChange}
          onClear={onClear}
          maxPrice={maxPrice}
          brands={brands}
          className="mt-4"
        />
      </SheetContent>
    </Sheet>
  );
}
