"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { cn } from "@/lib/utils";
import {
  HERO_THEME_PRESETS,
  HOMEPAGE_DEFAULTS,
  type HeroSlideData,
  type HeroThemeName,
} from "@/modules/storefront/homepage-defaults";

interface HeroSliderProps {
  slides: HeroSlideData[];
  autoPlayMs?: number;
  className?: string;
}

type NormalizedHeroSlide = HeroSlideData & {
  eyebrow: string;
  productName: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  bigWord1: string;
  bigWord2: string;
  shortName: string;
  metadataLine: string;
  productImage: string;
  theme: HeroThemeName;
  infoItems: { label: string; value: string }[];
};

const PLACEHOLDER_TEXT = new Set(
  [
    "new product feature",
    "product",
    "featured product",
    "short product promise",
    "write a short customer-friendly message for this slide.",
  ].map((value) => value.toLowerCase()),
);

function isPlaceholder(value?: string | null) {
  if (!value) return false;
  const clean = value.trim().toLowerCase();
  return PLACEHOLDER_TEXT.has(clean) || clean.includes("write a short");
}

function limitText(value: string | undefined, fallback: string, max: number) {
  const clean = value?.trim();
  const safe = clean && !isPlaceholder(clean) ? clean : fallback;
  return safe.length > max ? `${safe.slice(0, Math.max(0, max - 1)).trim()}...` : safe;
}

function nonDraftSlide(slide: HeroSlideData) {
  return slide.status !== "draft";
}

function firstUsable(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim() && !isPlaceholder(value))?.trim();
}

function imageForSlide(slide: HeroSlideData, fallback: HeroSlideData) {
  const image = slide.productImage?.trim();
  if (image) return image;

  const key = `${slide.id} ${slide.productName ?? ""} ${slide.cardName ?? ""} ${slide.title ?? ""}`.toLowerCase();
  if (key.includes("gift")) return "/images/hero/hero-gift-box.png";
  if (key.includes("prayer") || key.includes("tasbih")) return "/images/hero/hero-prayer-mat.png";
  if (key.includes("quran") || key.includes("barakah")) return "/images/hero/hero-quran.png";

  return fallback.productImage || "/logo.png";
}

function legacyFallbackText(value: string | undefined, fallback: string) {
  const clean = value?.trim();
  return clean && !isPlaceholder(clean) ? clean : fallback;
}

function normalizeSlide(slide: HeroSlideData, index: number): NormalizedHeroSlide {
  const fallback = HOMEPAGE_DEFAULTS.hero[index % HOMEPAGE_DEFAULTS.hero.length] as HeroSlideData;
  const titleLine1 = limitText(
    firstUsable(slide.titleLine1, slide.title),
    fallback.titleLine1 || fallback.title,
    22,
  );
  const titleLine2 = limitText(
    firstUsable(slide.titleLine2, slide.highlight),
    fallback.titleLine2 || fallback.highlight || "With Meaning",
    22,
  );
  const description = limitText(
    firstUsable(slide.description, slide.subtitle),
    fallback.description || fallback.subtitle,
    120,
  );
  const productName = limitText(
    firstUsable(slide.productName, slide.subheading, slide.cardName),
    fallback.productName || "Islamic Essentials",
    30,
  );
  const cta = slide.ctaPrimary ?? fallback.ctaPrimary;

  return {
    ...slide,
    eyebrow: limitText(firstUsable(slide.eyebrow), fallback.eyebrow || "Niyamah Collection", 28),
    productName,
    titleLine1,
    titleLine2,
    title: titleLine1,
    highlight: titleLine2,
    description,
    subtitle: description,
    primaryButtonText: limitText(firstUsable(slide.primaryButtonText, cta?.label), "Shop Now", 18),
    primaryButtonLink: slide.primaryButtonLink || cta?.href || "/products",
    bigWord1: limitText(firstUsable(slide.bigWord1, slide.decoration, productName), "NIYAMAH", 12).toUpperCase(),
    bigWord2: limitText(firstUsable(slide.bigWord2, slide.highlight), "COLLECTION", 12).toUpperCase(),
    shortName: limitText(firstUsable(slide.shortName, slide.cardName, productName), productName, 18),
    metadataLine: limitText(firstUsable(slide.metadataLine, slide.badge), "Collection / New Arrival", 30),
    productImage: imageForSlide(slide, fallback),
    productImageAlt: slide.productImageAlt || productName,
    subheading: legacyFallbackText(slide.subheading, fallback.subheading || productName),
    theme: slide.theme && slide.theme in HERO_THEME_PRESETS ? slide.theme : fallback.theme || "cream",
    infoItems:
      slide.infoItems && slide.infoItems.length > 0
        ? slide.infoItems.slice(0, 3)
        : [
            { label: "Delivery", value: "1-3 days" },
            { label: "Payment", value: "COD" },
            { label: "Support", value: "WhatsApp" },
          ],
  };
}

function getVisibleSlides(slides: HeroSlideData[]) {
  const source = Array.isArray(slides) ? slides.filter(Boolean) : [];
  const visible = source.filter(nonDraftSlide);
  const curatedFallback = (HOMEPAGE_DEFAULTS.hero as HeroSlideData[]).filter(nonDraftSlide);
  return (visible.length > 0 ? visible : curatedFallback).map(normalizeSlide);
}

function slideNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function HeroSlider({ slides, autoPlayMs = 7200, className }: HeroSliderProps) {
  const safeSlides = useMemo(() => getVisibleSlides(slides), [slides]);
  const [current, setCurrent] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const max = safeSlides.length;
  const safeCurrent = max > 0 ? current % max : 0;
  const active = safeSlides[safeCurrent];

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

  useEffect(() => {
    thumbnailRefs.current[safeCurrent]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [safeCurrent]);

  if (!active) return null;

  const theme = HERO_THEME_PRESETS[active.theme];
  const rootStyle = {
    "--hero-bg": theme.bg,
    "--hero-text": theme.text,
    "--hero-muted": theme.muted,
    "--hero-accent": theme.accent,
    "--hero-button-bg": theme.buttonBg,
    "--hero-button-text": theme.buttonText,
    "--hero-panel": theme.panel,
    "--hero-word": theme.word,
    "--hero-shadow": theme.shadow,
  } as CSSProperties;

  return (
    <section
      className={cn(
        "allfather-product-slider relative isolate min-h-[calc(100svh-64px)] overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-text)]",
        className,
      )}
      style={rootStyle}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(30deg,currentColor_1px,transparent_1px),linear-gradient(150deg,currentColor_1px,transparent_1px)] [background-size:38px_38px]" />
      <div className="pointer-events-none absolute right-[7%] top-[10%] hidden h-[520px] w-[360px] rounded-t-full border border-[var(--hero-accent)]/35 lg:block" />

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id ?? safeCurrent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden pb-24 pt-20 md:pb-28">
            {[active.bigWord1, active.bigWord1, active.bigWord2, active.bigWord2].map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ x: index % 2 === 0 ? -80 : 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.08 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "block whitespace-nowrap font-black uppercase leading-[0.78] tracking-normal text-[var(--hero-word)]",
                  "text-[18vw] md:text-[13vw]",
                  index % 2 === 1 && "self-end",
                )}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <div className="relative z-10 mx-auto grid min-h-[calc(100svh-64px)] w-full max-w-[1500px] grid-rows-[auto_auto_1fr] gap-5 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[minmax(320px,0.95fr)_minmax(440px,1fr)_minmax(270px,0.85fr)] lg:grid-rows-1 lg:gap-x-8 lg:px-8 lg:pb-32 lg:pt-8 xl:px-10">
            <motion.aside
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-start justify-between gap-4 lg:col-start-3 lg:row-start-1 lg:block lg:pt-16"
            >
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--hero-muted)]">
                  {active.eyebrow}
                </p>
                <p className="mt-3 max-w-[15rem] text-xl font-semibold leading-tight text-[var(--hero-text)]">
                  {active.productName}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-accent)]">
                  {active.metadataLine}
                </p>
              </div>
              <div className="hidden h-px w-24 bg-[var(--hero-accent)] lg:mt-8 lg:block" />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 42, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative row-start-2 flex min-h-[320px] items-center justify-center sm:min-h-[430px] lg:col-start-1 lg:row-start-1 lg:min-h-[620px]"
            >
              <div className="absolute h-[280px] w-[280px] rounded-full bg-[var(--hero-accent)]/25 blur-[86px] sm:h-[360px] sm:w-[360px]" />
              <div className="absolute inset-x-[18%] bottom-[12%] h-12 rounded-full bg-black/15 blur-2xl" />
              <div className="relative h-[330px] w-full max-w-[620px] sm:h-[500px] lg:h-[580px] lg:max-w-[540px]">
                <ImageWithFallback
                  src={active.productImage}
                  alt={active.productImageAlt || active.productName}
                  fill
                  priority={safeCurrent === 0}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 620px"
                  className="scale-[1.08] object-contain drop-shadow-[0_35px_60px_var(--hero-shadow)] sm:scale-[1.12] lg:scale-[1.08]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.78, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="row-start-3 flex flex-col justify-center lg:col-start-2 lg:row-start-1 lg:pt-16"
            >
              <div className="max-w-xl lg:max-w-md">
                <p className="mb-3 text-sm font-bold text-[var(--hero-accent)]">
                  {active.subheading || active.productName}
                </p>
                <h1 className="font-black uppercase leading-[0.9] tracking-normal text-[clamp(3rem,11vw,5.7rem)] text-[var(--hero-text)] lg:text-[clamp(3.4rem,4.6vw,5.2rem)]">
                  <motion.span
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    {active.titleLine1}
                  </motion.span>
                  <motion.span
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-[var(--hero-accent)]"
                  >
                    {active.titleLine2}
                  </motion.span>
                </h1>
                <p className="mt-5 line-clamp-3 max-w-md text-base font-medium leading-7 text-[var(--hero-muted)]">
                  {active.description}
                </p>
                <motion.div
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7"
                >
                  <Link
                    href={active.primaryButtonLink}
                    className="inline-flex h-12 items-center justify-center bg-[var(--hero-button-bg)] px-6 text-sm font-black uppercase tracking-[0.18em] text-[var(--hero-button-text)] shadow-[0_18px_42px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {active.primaryButtonText}
                  </Link>
                </motion.div>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--hero-text)]/15 pt-4">
                  {active.infoItems.slice(0, 3).map((spec, index) => (
                    <div key={`${spec.label}-${index}`} className="min-w-0">
                      <p className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[var(--hero-muted)]">
                        {spec.label}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-[var(--hero-text)] md:text-base">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {max > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-[46%] z-40 hidden h-11 w-11 items-center justify-center border border-[var(--hero-text)]/15 bg-[var(--hero-panel)] text-[var(--hero-text)] backdrop-blur transition-colors hover:border-[var(--hero-accent)] lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-[46%] z-40 hidden h-11 w-11 items-center justify-center border border-[var(--hero-text)]/15 bg-[var(--hero-panel)] text-[var(--hero-text)] backdrop-blur transition-colors hover:border-[var(--hero-accent)] lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 right-4 z-40 hidden w-[min(38rem,calc(100vw-2rem))] overflow-hidden lg:block xl:right-6">
            <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-3 pr-1">
              {safeSlides.slice(0, 6).map((slide, index) => {
                const selected = index === safeCurrent;
                return (
                  <button
                    key={slide.id ?? index}
                    ref={(node) => {
                      thumbnailRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "group flex min-w-[152px] items-center gap-3 border p-2 text-left backdrop-blur transition-all duration-500",
                      selected
                        ? "min-w-[190px] border-[var(--hero-accent)] bg-white/70 shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
                        : "border-[var(--hero-text)]/10 bg-white/25 opacity-60 hover:opacity-100",
                    )}
                    aria-label={`Show ${slide.shortName}`}
                  >
                    <div className="relative h-14 w-14 shrink-0 bg-[var(--hero-panel)]">
                      <ImageWithFallback
                        src={slide.productImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-[var(--hero-text)]">
                        {slide.shortName}
                      </p>
                      <p className="mt-1 text-xs font-black tracking-[0.2em] text-[var(--hero-muted)]">
                        {slideNumber(index)}
                      </p>
                    </div>
                  </button>
                );
              })}
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-3 z-40 flex justify-center gap-2 lg:hidden">
            {safeSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-9 min-w-9 border px-3 text-xs font-black tracking-[0.16em] backdrop-blur transition-all",
                  index === safeCurrent
                    ? "border-[var(--hero-accent)] bg-[var(--hero-button-bg)] text-[var(--hero-button-text)]"
                    : "border-[var(--hero-text)]/15 bg-[var(--hero-panel)] text-[var(--hero-text)]",
                )}
                aria-label={`Show slide ${index + 1}`}
              >
                {slideNumber(index)}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
