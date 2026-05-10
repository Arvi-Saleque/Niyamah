"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  ProductStoryCard,
  type ProductStoryCardData,
  type ProductStoryTone,
} from "@/components/storefront/product-story-card";
import type { ProductCardData } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";

interface ProductStoryRailSectionProps {
  products: ProductCardData[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  autoPlayMs?: number;
  className?: string;
}

const STORY_TONES: ProductStoryTone[] = [
  {
    bg: "#43bba9",
    panel: "#286d6b",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#f0449f",
    badgeBg: "#ef166f",
    badgeText: "#ffffff",
  },
  {
    bg: "#d7d9c9",
    panel: "#7b8274",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#e0509e",
    badgeBg: "#f08a1f",
    badgeText: "#ffffff",
  },
  {
    bg: "#164f55",
    panel: "#123f48",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.68)",
    accent: "#f45ab0",
    badgeBg: "#f08a1f",
    badgeText: "#ffffff",
  },
  {
    bg: "#18325b",
    panel: "#15284d",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    accent: "#f253a6",
    badgeBg: "#e60058",
    badgeText: "#ffffff",
  },
];

function preserveScroll(callback: () => void) {
  if (typeof window === "undefined") { callback(); return; }
  const x = window.scrollX;
  const y = window.scrollY;
  callback();
  requestAnimationFrame(() => {
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
  });
}

function enrichProducts(products: ProductCardData[]) {
  return products.slice(0, 8).map<ProductStoryCardData>((product, index) => ({
    ...product,
    badge: product.isNew
      ? "New"
      : product.originalPrice && product.originalPrice > product.price
        ? "Offer"
        : "Pick",
    storyLabel: product.categoryName ?? (index % 2 === 0 ? "Featured Product" : "Niyamah Essential"),
    tone: STORY_TONES[index % STORY_TONES.length],
  }));
}

export function ProductStoryRailSection({
  products,
  title = "Featured For Your Home",
  eyebrow = "Niyamah Stories",
  subtitle = "Browse Quran, prayer essentials, and meaningful gifts with a focused look at what is fresh this week.",
  ctaHref = "/products",
  ctaLabel = "View All",
  autoPlayMs = 5200,
  className,
}: ProductStoryRailSectionProps) {
  const items = useMemo(() => enrichProducts(products), [products]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const active = items[activeIndex] ?? items[0];

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const safeIndex = (index + items.length) % items.length;
      setActiveIndex((current) => (current === safeIndex ? current : safeIndex));
    },
    [items.length],
  );

  const next = useCallback(() => {
    if (items.length < 2) return;
    preserveScroll(() => setActiveIndex((current) => (current + 1) % items.length));
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length < 2) return;
    preserveScroll(() => setActiveIndex((current) => (current - 1 + items.length) % items.length));
  }, [items.length]);

  const calculateTrackX = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const windowWidth = window.innerWidth;
    const gap = windowWidth >= 640 ? 16 : 12;
    const padding = windowWidth >= 1024 ? 32 : windowWidth >= 640 ? 24 : 16;
    const openWidth = Math.min(windowWidth * 0.78, 520);
    const closedWidth = Math.min(windowWidth * 0.28, 160);
    const viewportCenter = viewport.clientWidth / 2;
    const activeCenter =
      padding + activeIndex * (closedWidth + gap) + openWidth / 2;

    setTrackX(viewportCenter - activeCenter);
  }, [activeIndex]);

  useLayoutEffect(() => {
    calculateTrackX();
  }, [calculateTrackX, items.length]);

  useEffect(() => {
    window.addEventListener("resize", calculateTrackX);
    return () => window.removeEventListener("resize", calculateTrackX);
  }, [calculateTrackX]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (items.length < 2 || autoPlayMs <= 0 || !isSectionVisible) return;
    const id = window.setInterval(next, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, isSectionVisible, items.length, next]);

  if (items.length === 0 || !active) return null;

  const sectionStyle = {
    "--story-bg": active.tone?.bg,
    "--story-text": active.tone?.text,
    "--story-muted": active.tone?.muted,
    "--story-accent": active.tone?.accent,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className={cn(
        "relative isolate overflow-hidden bg-[var(--story-bg)] py-14 text-[var(--story-text)] transition-colors duration-700 [contain:paint] [overflow-anchor:none] sm:py-18 lg:py-20",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(0deg,currentColor_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase text-white/70">
              {eyebrow}
            </p>
            <h2 className="mt-2 max-w-[38rem] text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/72 sm:text-base">
              {subtitle}
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex h-11 w-fit items-center justify-center rounded border border-white/35 bg-white/12 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 h-[392px] overflow-hidden [overflow-anchor:none] sm:h-[452px]"
      >
        <motion.div
          className="flex h-full w-max items-center gap-3 px-4 [overflow-anchor:none] [perspective:1200px] sm:gap-4 sm:px-6 lg:px-8"
          animate={{ x: trackX }}
          transition={{ duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((product, index) => (
            <div key={product.id}>
              <ProductStoryCard
                product={product}
                index={index}
                active={index === activeIndex}
                onSelect={() => goTo(index)}
              />
            </div>
          ))}
        </motion.div>
      </div>
      {/* Bottom-right arrows */}
      {items.length > 1 ? (
        <div className="relative z-10 mx-auto mt-6 flex max-w-[1500px] justify-end gap-2 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Previous product"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { preserveScroll(() => setActiveIndex((c) => (c - 1 + items.length) % items.length)); }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next product"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { preserveScroll(() => setActiveIndex((c) => (c + 1) % items.length)); }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
