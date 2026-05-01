"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}

/** Increment / decrement quantity control used in cart items and product pages. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
  disabled = false,
}: QuantityStepperProps) {
  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-[var(--color-border)]",
        size === "sm" ? "h-8" : "h-10",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-r-none border-r border-[var(--color-border)]", size === "sm" ? "h-8 w-8" : "h-10 w-10")}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || isMin}
        aria-label="Decrease quantity"
      >
        <Minus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      </Button>

      <span
        className={cn(
          "flex min-w-[2.5rem] items-center justify-center font-medium tabular-nums",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {value}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-l-none border-l border-[var(--color-border)]", size === "sm" ? "h-8 w-8" : "h-10 w-10")}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || isMax}
        aria-label="Increase quantity"
      >
        <Plus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
    </div>
  );
}
