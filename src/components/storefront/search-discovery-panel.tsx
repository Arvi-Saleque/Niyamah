"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_DEFAULTS, type DiscoveryData } from "@/modules/storefront/homepage-content";

interface SearchDiscoveryPanelProps {
  className?: string;
  data?: DiscoveryData;
}

/** Hero-adjacent search panel with trending search chips. */
export function SearchDiscoveryPanel({ className, data }: SearchDiscoveryPanelProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.discovery;
  const router = useRouter();
  const [value, setValue] = useState("");

  const go = (q: string) => {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-alt)] via-[var(--color-surface)] to-[var(--color-accent-light)]/40 p-6 shadow-sm md:p-10",
        className
      )}
    >
      {/* Decorative gold orb */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[var(--color-accent-light)]/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
          {d.eyebrow}
        </p>
        <h2
          className="mb-2 text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {d.title}
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          {d.subtitle}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(value);
          }}
          className="relative mx-auto flex max-w-xl"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="search"
            placeholder={d.placeholder}
            className="h-14 w-full rounded-full border border-[var(--color-border)] bg-white pl-12 pr-32 text-sm shadow-sm outline-none transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)]">
            <TrendingUp className="h-3 w-3" /> Trending:
          </span>
          {d.trending.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => go(q)}
              className="rounded-full border border-[var(--color-border)] bg-white/80 px-3 py-1 text-xs text-[var(--color-text-secondary)] backdrop-blur transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
