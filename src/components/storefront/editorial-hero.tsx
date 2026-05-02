"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditorialSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Tailwind/CSS gradient classes for the right-side panel */
  rightGradient: string;
  /** Big decoration label drawn behind */
  decoration: string;
  badge?: string;
  popularLinks?: { label: string; href: string }[];
}

interface EditorialHeroProps {
  slides: EditorialSlide[];
  autoPlayMs?: number;
  className?: string;
}

/** Editorial split-hero with auto-play, controls, and brand storytelling — no images required. */
export function EditorialHero({ slides, autoPlayMs = 6000, className }: EditorialHeroProps) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [next, autoPlayMs, total]);

  if (total === 0) return null;
  const slide = slides[current]!;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm",
        className
      )}
    >
      <div className="grid min-h-[480px] md:grid-cols-2 md:min-h-[560px]">
        {/* LEFT — copy */}
        <div className="relative flex flex-col justify-center gap-6 p-8 md:p-14">
          {slide.badge && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
              <Sparkles className="h-3 w-3" />
              {slide.badge}
            </span>
          )}

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {slide.eyebrow}
            </p>
            <h1
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {slide.title}
              {slide.highlight && (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                </>
              )}
            </h1>
          </div>

          <p className="max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={slide.ctaPrimary.href}
              className="group flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent)]"
            >
              {slide.ctaPrimary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>

          {slide.popularLinks && slide.popularLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Popular:
              </span>
              {slide.popularLinks.map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  className="text-xs text-[var(--color-text-secondary)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — visual */}
        <div className={cn("relative overflow-hidden bg-gradient-to-br", slide.rightGradient)}>
          {/* Decorative giant typography */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="select-none text-[8rem] font-black uppercase leading-none tracking-tighter text-white/15 md:text-[12rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {slide.decoration}
            </span>
          </div>

          {/* Floating product card mock */}
          <div className="absolute bottom-8 right-8 hidden w-56 rotate-3 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-sm md:block">
            <div className="mb-3 aspect-square rounded-lg bg-gradient-to-br from-[var(--color-surface-alt)] to-[var(--color-accent-light)]/40" />
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">
              {slide.title}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--color-accent)]">
                ৳1,290
              </span>
              <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent)]">
                ★ 4.8
              </span>
            </div>
          </div>

          {/* Floating offer badge */}
          <div className="absolute left-8 top-8 hidden rotate-[-6deg] rounded-2xl bg-white px-4 py-2 shadow-lg md:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Limited
            </p>
            <p className="text-lg font-bold text-[var(--color-accent)]">-30% OFF</p>
          </div>
        </div>
      </div>

      {/* Controls + dots overlay */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-white/90 p-2 text-[var(--color-text-primary)] backdrop-blur transition hover:bg-white hover:text-[var(--color-accent)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-white/90 p-2 text-[var(--color-text-primary)] backdrop-blur transition hover:bg-white hover:text-[var(--color-accent)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current
                    ? "w-8 bg-[var(--color-accent)]"
                    : "w-1.5 bg-[var(--color-border-strong)]"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
