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
import { HOMEPAGE_DEFAULTS, type TrustData, type TrustItemData } from "@/modules/storefront/homepage-defaults";

interface TrustSectionProps {
  className?: string;
  data?: TrustData;
}

/** Clickable trust badges — opens a dialog explaining each promise. */
export function TrustSection({ className, data }: TrustSectionProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.trust;
  const [open, setOpen] = useState<TrustItemData | null>(null);

  return (
    <section className={cn("space-y-5", className)}>
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#007A3D]">
          {d.eyebrow}
        </p>
        <h2
          className="text-2xl font-semibold text-[#162018] md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {d.title}
        </h2>
        <p className="mt-1 text-sm text-[#687464]">
          {d.subtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#D6DDCF] bg-white shadow-[0_18px_50px_rgba(4,61,37,0.08)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {d.items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpen(item)}
              className="group flex min-h-[152px] flex-col items-center justify-center gap-2 border-b border-r border-[#EAF6DD] p-4 text-center transition-colors hover:bg-[#F0F5EA] lg:border-b-0"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6DD] text-[#007A3D] transition-colors group-hover:bg-[#007A3D] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[#162018]">
                {item.title}
              </p>
              <p className="text-xs text-[#687464]">{item.short}</p>
            </button>
          );
        })}
        </div>
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
