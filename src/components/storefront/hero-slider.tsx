"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { cn } from "@/lib/utils";
import type { HeroSlideData } from "@/modules/storefront/homepage-defaults";

interface HeroSliderProps {
  slides: HeroSlideData[];
  autoPlayMs?: number;
  className?: string;
}

const FALLBACK_COLORS: NonNullable<HeroSlideData["colors"]> = {
  purple: "#123d2d",
  lightBlue: "#f1ead9",
  green: "#0b4a34",
  infoGreen: "#073827",
  white: "#f1ead9",
  orange: "#f1ead9",
  accent: "#c6a05d",
  shadow: "rgba(4, 36, 25, 0.22)",
};

const LEGACY_COLOR_MAP: Record<string, string> = {
  "#7552c7": FALLBACK_COLORS.purple,
  "#6f57c9": FALLBACK_COLORS.purple,
  "#7258bf": FALLBACK_COLORS.purple,
  "#c9f0ff": FALLBACK_COLORS.lightBlue,
  "#d6f4ff": FALLBACK_COLORS.lightBlue,
  "#c8effa": FALLBACK_COLORS.lightBlue,
  "#0b6b47": FALLBACK_COLORS.green,
  "#0c704b": FALLBACK_COLORS.green,
  "#0a6345": FALLBACK_COLORS.green,
  "#07583b": FALLBACK_COLORS.infoGreen,
  "#095b3e": FALLBACK_COLORS.infoGreen,
  "#074f38": FALLBACK_COLORS.infoGreen,
  "#ffb15c": FALLBACK_COLORS.orange,
  "#ffa35f": FALLBACK_COLORS.orange,
  "#f7a84f": FALLBACK_COLORS.orange,
  "#bfe8c6": FALLBACK_COLORS.accent,
  "#ffe2b8": FALLBACK_COLORS.accent,
  "#d9f4dc": FALLBACK_COLORS.accent,
  "rgba(0, 0, 0, 0.18)": FALLBACK_COLORS.shadow,
  "rgba(0,0,0,0.18)": FALLBACK_COLORS.shadow,
};

function cleanColor(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return LEGACY_COLOR_MAP[value.trim().toLowerCase()] ?? value;
}

function colorsFor(slide: HeroSlideData) {
  const colors = { ...FALLBACK_COLORS, ...(slide.colors ?? {}) };
  return {
    purple: cleanColor(colors.purple, FALLBACK_COLORS.purple),
    lightBlue: cleanColor(colors.lightBlue, FALLBACK_COLORS.lightBlue),
    green: cleanColor(colors.green, FALLBACK_COLORS.green),
    infoGreen: cleanColor(colors.infoGreen, FALLBACK_COLORS.infoGreen),
    white: cleanColor(colors.white, FALLBACK_COLORS.white),
    orange: cleanColor(colors.orange, FALLBACK_COLORS.orange),
    accent: cleanColor(colors.accent, FALLBACK_COLORS.accent),
    shadow: cleanColor(colors.shadow, FALLBACK_COLORS.shadow),
  };
}

function slideNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function HeroSlider({ slides, autoPlayMs = 6500, className }: HeroSliderProps) {
  const safeSlides = Array.isArray(slides) ? slides.filter(Boolean) : [];
  const [current, setCurrent] = useState(0);

  const max = safeSlides.length;
  const safeCurrent = max > 0 ? current % max : 0;
  const active = safeSlides[safeCurrent] ?? safeSlides[0];

  const prev = useCallback(() => {
    if (max < 2) return;
    setCurrent((value) => (value - 1 + max) % max);
  }, [max]);

  const next = useCallback(() => {
    if (max < 2) return;
    setCurrent((value) => (value + 1) % max);
  }, [max]);

  useEffect(() => {
    if (max < 2) return;
    const id = window.setInterval(next, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, max, next]);

  const activeColors = active ? colorsFor(active) : FALLBACK_COLORS;
  const railStyle = useMemo(
    () =>
      ({
        "--slider-rail-y": `${safeCurrent * -272}px`,
        "--slider-rail-x": `${safeCurrent * -50}vw`,
      }) as CSSProperties,
    [safeCurrent],
  );

  if (!active) return null;

  const rootStyle = {
    "--slider-purple": activeColors.purple,
    "--slider-blue": activeColors.lightBlue,
    "--slider-green": activeColors.green,
    "--slider-info-green": activeColors.infoGreen,
    "--slider-white": activeColors.white,
    "--slider-orange": activeColors.orange,
    "--slider-accent": activeColors.accent,
    "--slider-shadow": activeColors.shadow,
  } as CSSProperties;

  return (
    <section
      className={cn(
        "allfather-product-slider relative isolate min-h-[calc(100svh-64px)] overflow-hidden bg-[var(--slider-green)] text-black",
        className,
      )}
      style={rootStyle}
    >
      <div className="absolute left-0 top-0 z-10 h-20 w-[50%] bg-[var(--slider-green)] md:h-24" />
      <div className="absolute left-[50%] right-0 top-0 z-20 flex h-20 items-center bg-[var(--slider-orange)] px-5 text-sm font-bold uppercase tracking-[0.2em] md:h-24 md:px-10 md:text-base">
        <span className="truncate">{active.productName || active.cardName || active.title}</span>
      </div>

      <div
        className="allfather-card-rail pointer-events-auto absolute left-4 top-[34vh] z-40 flex w-[220px] flex-col gap-[22px] transition-transform duration-500 ease-out md:left-8 lg:left-14 lg:w-[250px]"
        style={railStyle}
      >
        {safeSlides.map((slide, index) => {
          const colors = colorsFor(slide);
          const selected = index === safeCurrent;
          return (
            <button
              key={slide.id ?? index}
              type="button"
              onClick={() => setCurrent(index)}
              className={cn(
                "group relative flex h-[250px] w-full shrink-0 overflow-hidden border-2 border-white p-3 text-left shadow-[11px_11px_0_var(--slider-shadow)] transition-all duration-300",
                selected ? "opacity-100" : "opacity-75 hover:opacity-100",
              )}
              style={{
                backgroundColor: colors.orange,
                color: "#061b14",
              }}
              aria-label={`Show slide ${index + 1}`}
            >
              <span className="relative z-10 text-lg font-bold leading-none">
                {slide.cardName || slide.productName || slide.title}
              </span>
              <span className="relative z-10 ml-auto text-lg font-bold tracking-[0.14em]">
                {slideNumber(index)}
              </span>
              {slide.productImage ? (
                <ImageWithFallback
                  src={slide.productImage}
                  alt={slide.productImageAlt || slide.productName || slide.title}
                  fill
                  sizes="260px"
                  className={cn(
                    "object-contain p-8 mix-blend-soft-light transition-all duration-500 group-hover:mix-blend-normal",
                    selected && "mix-blend-normal",
                  )}
                />
              ) : (
                <span className="absolute inset-x-6 bottom-8 text-center text-xs font-black uppercase tracking-[0.28em] opacity-30">
                  Niyamah
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[calc(100svh-64px)]">
        {safeSlides.map((slide, index) => {
          const selected = index === safeCurrent;
          const colors = colorsFor(slide);
          return (
            <div
              key={slide.id ?? index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                selected ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={!selected}
              style={
                {
                  "--slider-orange": colors.orange,
                  "--slider-white": colors.white,
                  "--slider-green": colors.green,
                  "--slider-info-green": colors.infoGreen,
                  "--slider-accent": colors.accent,
                } as CSSProperties
              }
            >
              <div className="absolute bottom-0 left-0 top-0 w-full bg-[var(--slider-green)] lg:w-[50%]" />

              <div className="absolute bottom-0 right-0 top-24 hidden w-full overflow-hidden bg-[var(--slider-orange)] md:block lg:w-[50%]">
                <div className="allfather-big-word allfather-big-word-back" key={`back-${safeCurrent}`}>
                  <span>{slide.decoration || slide.productName || slide.title}</span>
                  <span>{slide.highlight || slide.cardName || "Collection"}</span>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 top-24 z-20 hidden w-[50%] md:block">
                <div className="relative h-full overflow-hidden">
                  {slide.productImage ? (
                    <ImageWithFallback
                      src={slide.productImage}
                      alt={slide.productImageAlt || slide.productName || slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="allfather-product-image object-contain px-16 pb-20 pt-14 lg:px-24"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-8 text-center text-sm font-black uppercase tracking-[0.28em] text-black/25">
                      Product image
                    </div>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-0 right-0 top-24 z-40 hidden w-full overflow-hidden md:block lg:w-[50%]">
                <div className="allfather-big-word allfather-big-word-front" key={`front-${safeCurrent}`}>
                  <span>{slide.decoration || slide.productName || slide.title}</span>
                  <span>{slide.highlight || slide.cardName || "Collection"}</span>
                </div>
              </div>

              <div className="relative z-20 flex min-h-[calc(100svh-64px)] items-start px-5 pb-28 pt-[21rem] md:items-end md:px-8 md:pb-32 md:pt-28 lg:px-10 xl:pl-[360px] xl:pr-[58%]">
                <div className="allfather-copy max-w-xl text-white" key={`copy-${safeCurrent}`}>
                  {slide.eyebrow && (
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/75">
                      {slide.eyebrow}
                    </p>
                  )}
                  <h1 className="mt-4 text-5xl font-black leading-[0.96] text-white md:text-7xl">
                    {slide.title}
                  </h1>
                  {(slide.subheading || slide.highlight) && (
                    <p className="mt-4 text-2xl font-bold leading-tight text-[var(--slider-accent)] md:text-3xl">
                      {slide.subheading || slide.highlight}
                    </p>
                  )}
                  <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white/86 md:text-lg">
                    {slide.subtitle}
                  </p>
                  {slide.ctaPrimary?.href && slide.ctaPrimary.label && (
                    <Link
                      href={slide.ctaPrimary.href}
                      className="mt-7 inline-flex h-12 items-center justify-center border-b-2 border-white px-1 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--slider-accent)]"
                    >
                      {slide.ctaPrimary.label}
                    </Link>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 right-0 z-30 grid min-h-20 w-full grid-cols-3 bg-[var(--slider-green)] px-4 py-4 text-white md:px-8 lg:w-[58vw] lg:px-10">
                {(slide.infoItems ?? []).slice(0, 3).map((item, infoIndex) => (
                  <div key={`${item.label}-${infoIndex}`} className="flex flex-col justify-center px-2 text-left md:items-center md:text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                      {item.label}
                    </span>
                    <strong className="mt-1 truncate text-sm md:text-base">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {max > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute bottom-4 left-5 z-50 flex h-14 w-14 items-center justify-center bg-[var(--slider-orange)] text-[var(--slider-purple)] shadow-[4px_4px_0_var(--slider-shadow)] transition-all duration-300 hover:bg-black hover:shadow-[-4px_-4px_0_var(--slider-shadow)] md:left-8 lg:left-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute bottom-4 right-5 z-50 flex h-14 w-14 items-center justify-center bg-[var(--slider-orange)] text-[var(--slider-purple)] shadow-[4px_4px_0_var(--slider-shadow)] transition-all duration-300 hover:bg-black hover:shadow-[-4px_-4px_0_var(--slider-shadow)] md:right-8 lg:right-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
}
