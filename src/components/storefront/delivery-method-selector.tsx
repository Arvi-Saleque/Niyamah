import { Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon?: "standard" | "express";
}

interface DeliveryMethodSelectorProps {
  methods: DeliveryMethod[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

const IconMap = { standard: Truck, express: Zap };

/** Radio card group for selecting delivery method at checkout. */
export function DeliveryMethodSelector({ methods, value, onChange, className }: DeliveryMethodSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn("space-y-3", className)}>
      {methods.map((m) => {
        const Icon = IconMap[m.icon ?? "standard"];
        const isSelected = value === m.id;
        return (
          <Label
            key={m.id}
            htmlFor={`delivery-${m.id}`}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors",
              isSelected
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50",
            )}
          >
            <RadioGroupItem id={`delivery-${m.id}`} value={m.id} className="mt-0.5" />
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
            <div className="flex-1">
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{m.description} · {m.estimatedDays}</p>
            </div>
            <span className="ml-auto font-semibold">
              {m.price === 0 ? "Free" : formatCurrency(m.price)}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
