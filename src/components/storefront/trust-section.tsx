"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icon-registry";
import { HOMEPAGE_DEFAULTS, type TrustData, type TrustItemData } from "@/modules/storefront/homepage-content";

interface TrustSectionProps {
  className?: string;
  data?: TrustData;
}

/** Clickable trust badges — opens a dialog explaining each promise. */
export function TrustSection({ className, data }: TrustSectionProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.trust;
  const [open, setOpen] = useState<TrustItemData | null>(null);

  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          {d.eyebrow}
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {d.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {d.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {d.items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpen(item)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">{item.short}</p>
            </button>
          );
        })}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-md">
          {open && (() => {
            const Icon = getIcon(open.icon);
            return (
              <DialogHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <Icon className="h-6 w-6" />
                </div>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription className="text-[var(--color-text-secondary)] leading-relaxed">
                  {open.details}
                </DialogDescription>
              </DialogHeader>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
}
