"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, TrendingUp, Tag, Layers, Loader2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { HOMEPAGE_DEFAULTS, type DiscoveryData } from "@/modules/storefront/homepage-defaults";

interface SearchDiscoveryPanelProps {
  className?: string;
  data?: DiscoveryData;
}

interface AutocompleteData {
  query: string;
  products: {
    id: string;
    slug: string;
    name: string;
    image: string | null;
    price: number;
    salePrice: number | null;
  }[];
  categories: { id: string; slug: string; name: string }[];
  brands: { id: string; slug: string; name: string }[];
}

/** Hero-adjacent search panel with live autocomplete + trending chips. */
export function SearchDiscoveryPanel({ className, data }: SearchDiscoveryPanelProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.discovery;
  const router = useRouter();
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Debounced autocomplete fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const v = value.trim();
    if (v.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(v)}`);
        const json = await res.json();
        if (json?.success) setSuggestions(json.data as AutocompleteData);
      } catch {
        setSuggestions(null);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const hasResults =
    suggestions &&
    (suggestions.products.length > 0 ||
      suggestions.categories.length > 0 ||
      suggestions.brands.length > 0);

  return (
    <section
      className={cn(
        "relative mx-auto max-w-5xl overflow-visible rounded-[28px] border border-[#e8d9be] bg-white p-5 shadow-[0_24px_70px_rgba(75,54,24,0.14)] md:p-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--color-accent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-[linear-gradient(135deg,transparent_0%,transparent_55%,rgba(184,137,61,0.12)_55%,rgba(184,137,61,0.12)_100%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7029]">
          {d.eyebrow}
        </p>
        <h2
          className="mb-2 text-2xl font-semibold text-[#1c1710] md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {d.title}
        </h2>
        <p className="mb-6 text-sm text-[#7a6a55]">{d.subtitle}</p>

        <div ref={containerRef} className="relative mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(value);
            }}
            className="relative flex"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              type="search"
              placeholder={d.placeholder}
              autoComplete="off"
              className="h-14 w-full rounded-full border border-[#e1d2b7] bg-[#fbf7ef] pl-12 pr-32 text-sm shadow-sm outline-none transition-all focus:border-[#c6923a] focus:ring-2 focus:ring-[#c6923a]/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#c6923a] px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-[#9a7029]"
            >
              Search
            </button>
          </form>

          {/* Autocomplete dropdown */}
          {open && value.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white text-left shadow-xl">
              {loading && (
                <div className="flex items-center gap-2 p-4 text-xs text-[var(--color-text-muted)]">
                  <Loader2 className="h-3 w-3 animate-spin" /> Searching…
                </div>
              )}

              {!loading && !hasResults && (
                <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                  No matches for <span className="font-medium">{value}</span>. Try a
                  different keyword.
                </div>
              )}

              {!loading && suggestions && suggestions.products.length > 0 && (
                <div className="border-b border-[var(--color-border)] p-2">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Products
                  </p>
                  <ul>
                    {suggestions.products.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--color-surface-alt)]"
                        >
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-alt)]">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-text-muted)]">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                              {p.name}
                            </p>
                            <p className="text-xs text-[var(--color-accent)]">
                              {formatCurrency(p.salePrice ?? p.price)}
                              {p.salePrice && (
                                <span className="ml-2 text-[var(--color-text-muted)] line-through">
                                  {formatCurrency(p.price)}
                                </span>
                              )}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!loading && suggestions && suggestions.categories.length > 0 && (
                <div className="border-b border-[var(--color-border)] p-2">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Categories
                  </p>
                  <ul className="flex flex-wrap gap-2 px-3 pb-2">
                    {suggestions.categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/category/${c.slug}`}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        >
                          <Layers className="h-3 w-3" />
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!loading && suggestions && suggestions.brands.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Brands
                  </p>
                  <ul className="flex flex-wrap gap-2 px-3 pb-2">
                    {suggestions.brands.map((b) => (
                      <li key={b.id}>
                        <Link
                          href={`/products?brand=${b.slug}`}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        >
                          <Tag className="h-3 w-3" />
                          {b.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!loading && hasResults && (
                <button
                  type="button"
                  onClick={() => go(value)}
                  className="block w-full border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2 text-center text-xs font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                >
                  See all results for &ldquo;{value}&rdquo; →
                </button>
              )}
            </div>
          )}
        </div>

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
