import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = "cart" | "address" | "review" | "placed";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  className?: string;
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "cart", label: "Cart" },
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
  { id: "placed", label: "Placed" },
];

/** Horizontal step indicator for the checkout flow. */
export function CheckoutSteps({ currentStep, className }: CheckoutStepsProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout steps" className={cn("flex items-center gap-0", className)}>
      {STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            {/* Circle */}
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                isDone
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : isActive
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)]",
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {/* Label */}
            <span
              className={cn(
                "ml-2 text-sm",
                isActive ? "font-semibold text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]",
              )}
            >
              {step.label}
            </span>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px w-8 transition-colors",
                  isDone ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
