"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiveProofEvent {
  type: "order" | "wishlist" | "view";
  message: string;
  meta?: string;
}

interface LiveShoppingProofProps {
  events?: LiveProofEvent[];
  /** Delay before first toast (ms). */
  initialDelay?: number;
  /** Time the toast remains visible (ms). */
  visibleFor?: number;
  /** Time between toasts (ms). */
  intervalBetween?: number;
  className?: string;
}

const DEFAULT_EVENTS: LiveProofEvent[] = [
  { type: "order", message: "Someone from Dhaka ordered", meta: "12 minutes ago" },
  { type: "wishlist", message: "A customer added a product to wishlist", meta: "just now" },
  { type: "view", message: "25 people are viewing this product today" },
  { type: "order", message: "Order shipped to Chattogram", meta: "5 minutes ago" },
  { type: "wishlist", message: "New wishlist saved from Sylhet", meta: "2 minutes ago" },
  { type: "order", message: "Cash-on-Delivery order from Khulna", meta: "8 minutes ago" },
];

const ICONS = {
  order: ShoppingBag,
  wishlist: Heart,
  view: Eye,
};

/** Subtle bottom-left rotating "social proof" toast — dismissable. */
export function LiveShoppingProof({
  events = DEFAULT_EVENTS,
  initialDelay = 4000,
  visibleFor = 5000,
  intervalBetween = 9000,
  className,
}: LiveShoppingProofProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || events.length === 0) return;
    let mounted = true;
    let visibleTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      if (!mounted) return;
      setVisible(true);
      visibleTimer = setTimeout(() => {
        if (!mounted) return;
        setVisible(false);
        nextTimer = setTimeout(() => {
          if (!mounted) return;
          setIndex((i) => (i + 1) % events.length);
          cycle();
        }, intervalBetween);
      }, visibleFor);
    };

    const startTimer = setTimeout(cycle, initialDelay);
    return () => {
      mounted = false;
      clearTimeout(startTimer);
      clearTimeout(visibleTimer!);
      clearTimeout(nextTimer!);
    };
  }, [dismissed, events.length, initialDelay, visibleFor, intervalBetween]);

  if (dismissed || events.length === 0) return null;
  const ev = events[index];
  if (!ev) return null;
  const Icon = ICONS[ev.type];

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-24 left-4 z-40 max-w-xs sm:bottom-6 sm:left-6",
        "transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white/95 p-3 pr-2 shadow-lg backdrop-blur">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-light)]/60 text-[var(--color-accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-xs font-medium text-[var(--color-text-primary)]">
            {ev.message}
          </p>
          {ev.meta && (
            <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{ev.meta}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="flex-shrink-0 rounded-full p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
