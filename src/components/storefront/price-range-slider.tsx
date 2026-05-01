"use client";

import { Slider } from "@/components/ui/slider";
import { cn, formatCurrency } from "@/lib/utils";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  step?: number;
  className?: string;
}

/** Dual-thumb price range slider using shadcn Slider with formatted BDT labels. */
export function PriceRangeSlider({
  min = 0,
  max = 10000,
  value,
  onChange,
  step = 100,
  className,
}: PriceRangeSliderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
      />
      <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
        <span>{formatCurrency(value[0])}</span>
        <span>{formatCurrency(value[1])}</span>
      </div>
    </div>
  );
}
