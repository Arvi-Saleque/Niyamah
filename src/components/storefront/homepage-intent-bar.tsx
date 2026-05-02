"use client";

import { useState } from "react";
import { Sparkles, Gift, Home, Tag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShoppingIntent = "all" | "myself" | "gift" | "home" | "offer" | "new";

const INTENTS: {
  id: ShoppingIntent;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** anchor on the page to scroll to when picked */
  anchor: string;
}[] = [
  { id: "all", label: "Everything", icon: Sparkles, anchor: "discover" },
  { id: "myself", label: "For Myself", icon: Star, anchor: "discover" },
  { id: "gift", label: "Gift Ideas", icon: Gift, anchor: "editorial" },
  { id: "home", label: "For Home", icon: Home, anchor: "categories" },
  { id: "offer", label: "On Offer", icon: Tag, anchor: "flash-sale" },
  { id: "new", label: "New Drop", icon: Sparkles, anchor: "discover" },
];

interface HomepageIntentBarProps {
  className?: string;
}

/** Pill-style "shopping intent" selector — scrolls to the most relevant section. */
export function HomepageIntentBar({ className }: HomepageIntentBarProps) {
  const [active, setActive] = useState<ShoppingIntent>("all");

  const handlePick = (id: ShoppingIntent, anchor: string) => {
    setActive(id);
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          I&rsquo;m shopping for…
        </p>
        <span className="hidden text-xs text-[var(--color-text-muted)] sm:block">
          Tap to jump to relevant picks
        </span>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
        {INTENTS.map(({ id, label, icon: Icon, anchor }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handlePick(id, anchor)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-md shadow-[color:var(--color-accent)]/25"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
