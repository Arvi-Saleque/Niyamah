"use client";

import { cn } from "@/lib/utils";
import { Text } from "@/components/shared/typography";

export interface VariantOption {
  label: string;
  value: string;
  disabled?: boolean;
  swatch?: string; // hex color for color variants
}

export interface VariantGroup {
  name: string;
  type?: "text" | "color";
  options: VariantOption[];
}

interface ProductVariantSelectorProps {
  groups: VariantGroup[];
  selected: Record<string, string>;
  onChange: (groupName: string, value: string) => void;
  className?: string;
}

/** Renders size, color, and other variant option buttons for a product. */
export function ProductVariantSelector({
  groups,
  selected,
  onChange,
  className,
}: ProductVariantSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {groups.map((group) => (
        <div key={group.name}>
          <div className="mb-2 flex items-center gap-2">
            <Text variant="small" className="font-medium">
              {group.name}
            </Text>
            {selected[group.name] && (
              <Text variant="muted">{selected[group.name]}</Text>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt) => {
              const isSelected = selected[group.name] === opt.value;
              const isColor = group.type === "color" && opt.swatch;
              return (
                <button
                  key={opt.value}
                  disabled={opt.disabled}
                  onClick={() => onChange(group.name, opt.value)}
                  title={opt.label}
                  className={cn(
                    "rounded-md border-2 transition-all",
                    isColor ? "h-8 w-8 rounded-full" : "px-3 py-1.5 text-sm",
                    isSelected
                      ? "border-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-accent-light)]",
                    opt.disabled && "cursor-not-allowed opacity-40",
                  )}
                  style={isColor ? { backgroundColor: opt.swatch } : undefined}
                >
                  {!isColor && opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
