"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  ProductStoryCard,
  type ProductStoryCardData,
  type ProductStoryTone,
} from "@/components/storefront/product-story-card";
import type { ProductCardData } from "@/components/storefront/product-card";

function preserveScroll(callback: () => void) {
  if (typeof window === "undefined") { callback(); return; }
  const x = window.scrollX;
  const y = window.scrollY;
  callback();
  requestAnimationFrame(() => {
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
  });
}

const FRESH_TONES: ProductStoryTone[] = [
  { bg: "#0a1f2e", panel: "#071625", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#38bdf8", badgeBg: "#0284c7", badgeText: "#ffffff" },
  { bg: "#0f1f10", panel: "#0a1a0b", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#86efac", badgeBg: "#16a34a", badgeText: "#ffffff" },
  { bg: "#1a0f2e", panel: "#130a24", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#a78bfa", badgeBg: "#7c3aed", badgeText: "#ffffff" },
  { bg: "#1f1a0a", panel: "#181408", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#fcd34d", badgeBg: "#ca8a04", badgeText: "#ffffff" },
  { bg: "#1f0a0e", panel: "#18080b", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#fca5a5", badgeBg: "#dc2626", badgeText: "#ffffff" },
  { bg: "#0a1f1f", panel: "#071818", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#5eead4", badgeBg: "#0d9488", badgeText: "#ffffff" },
];

const ARRIVAL_LABELS = [
  "Just In",
  "New Drop",
  "Fresh Pick",
  "Just Landed",
  "New Arrival",
  "Latest",
];

const DEMO_PRODUCTS: ProductStoryCardData[] = [
  {
    id: "na-1",
    slug: "leather-quran-cover-premium",
    name: "Premium Leather Quran Cover",
    image: "https://images.unsplash.com/photo-1589834390005-5d4d9a910f24?w=600&q=80",
    price: 649,
    categoryName: "Quran Accessories",
    badge: "Just In",
    isNew: true,
    tone: FRESH_TONES[0]!,
  },
  {
    id: "na-2",
    slug: "embroidered-prayer-cap",
    name: "Hand-Embroidered Prayer Cap",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80",
    price: 299,
    categoryName: "Prayer Essentials",
    badge: "New Drop",
    isNew: true,
    tone: FRESH_TONES[1]!,
  },
  {
    id: "na-3",
    slug: "islamic-art-print-bismillah",
    name: "Bismillah Calligraphy Print",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=80",
    price: 499,
    categoryName: "Home Decor",
    badge: "Fresh Pick",
    isNew: true,
    tone: FRESH_TONES[2]!,
  },
  {
    id: "na-4",
    slug: "scented-prayer-beads-oud",
    name: "Scented Oud Prayer Beads",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=600&q=80",
    price: 449,
    categoryName: "Prayer Accessories",
    badge: "New Arrival",
    isNew: true,
    tone: FRESH_TONES[3]!,
  },
  {
    id: "na-5",
    slug: "childrens-islamic-storybook",
    name: "Children's Islamic Story Book",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    price: 349,
    categoryName: "Books",
    badge: "Just Landed",
    isNew: true,
    tone: FRESH_TONES[4]!,
  },
  {
    id: "na-6",
    slug: "rose-water-facial-mist",
    name: "Rose Water Facial Mist",
    image: "https://images.unsplash.com/photo-1592136957897-b2b6ca21e10d?w=600&q=80",
    price: 299,
    categoryName: "Beauty & Care",
    badge: "Latest",
    isNew: true,
    tone: FRESH_TONES[5]!,
  },
];

interface NewArrivalsSliderSectionProps {
  products?: ProductCardData[];
}

export function NewArrivalsSliderSection({ products }: NewArrivalsSliderSectionProps) {
  const rawProducts = products && products.length > 0 ? products : DEMO_PRODUCTS;
  const items: ProductStoryCardData[] = rawProducts.slice(0, 6).map((p, i) => ({
    ...p,
    isNew: true,
    tone: FRESH_TONES[i % FRESH_TONES.length] as ProductStoryTone,
    badge: ARRIVAL_LABELS[i % ARRIVAL_LABELS.length],
  }));

  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hovered = useRef(false);
  const isVisible = useRef(false);

  const active = (items[activeIndex] ?? items[0]) as ProductStoryCardData;

  const next = useCallback(() => {
    preserveScroll(() => setActiveIndex((c) => (c + 1) % total));
  }, [total]);

  const calculateTrackX = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const w = window.innerWidth;
    const gap = w >= 640 ? 16 : 12;
    const padding = w >= 1024 ? 32 : w >= 640 ? 24 : 16;
    const openWidth = Math.min(w * 0.78, 520);
    const closedWidth = Math.min(w * 0.28, 160);
    const viewportCenter = viewport.clientWidth / 2;
    const activeCenter = padding + activeIndex * (closedWidth + gap) + openWidth / 2;
    setTrackX(viewportCenter - activeCenter);
  }, [activeIndex]);

  useLayoutEffect(() => { calculateTrackX(); }, [calculateTrackX, total]);

  useEffect(() => {
    window.addEventListener("resize", calculateTrackX);
    return () => window.removeEventListener("resize", calculateTrackX);
  }, [calculateTrackX]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = Boolean(entry?.isIntersecting); },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (total < 2) return;
    const id = window.setInterval(() => {
      if (!hovered.current && isVisible.current) next();
    }, 2000);
    return () => window.clearInterval(id);
  }, [total, next]);

  const sectionStyle = {
    "--story-bg": active.tone?.bg ?? "#0a1f2e",
    "--story-text": active.tone?.text ?? "#ffffff",
    "--story-muted": active.tone?.muted ?? "rgba(255,255,255,0.72)",
    "--story-accent": active.tone?.accent ?? "#38bdf8",
  } as CSSProperties;

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="relative isolate overflow-hidden bg-[var(--story-bg)] py-14 text-[var(--story-text)] transition-colors duration-700 [contain:paint] [overflow-anchor:none] sm:py-18 lg:py-20"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(0deg,currentColor_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-white/70">
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--story-accent)" }} />
              Fresh Arrivals
            </p>
            <h2 className="mt-2 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Just{" "}
              <em className="not-italic" style={{ color: "var(--story-accent)" }}>
                Arrived.
              </em>
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/72 sm:text-base">
              The latest additions to Niyamah — handpicked, quality-checked, and ready to ship.
            </p>
          </div>

          {/* New arrival spotlight card */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm lg:min-w-[220px]">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: "var(--story-accent)" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--story-accent)" }}>
                New This Week
              </span>
            </div>
            <p className="line-clamp-1 text-sm font-black text-white">{active.name}</p>
            <p className="mt-1 text-xs text-white/55">{active.categoryName}</p>
            <div
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
              style={{ background: "var(--story-accent)", color: "#0a0a0a" }}
            >
              <Sparkles className="h-2.5 w-2.5" />
              {active.badge ?? "New Arrival"}
            </div>
          </div>
        </div>
      </div>

      {/* Slider viewport */}
      <div
        ref={viewportRef}
        className="relative z-10 h-[392px] overflow-hidden [overflow-anchor:none] sm:h-[452px]"
      >
        <motion.div
          className="flex h-full w-max items-center gap-3 px-4 [overflow-anchor:none] sm:gap-4 sm:px-6 lg:px-8"
          animate={{ x: trackX }}
          transition={{ duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((product, index) => (
            <div key={product.id}>
              <ProductStoryCard
                product={product}
                index={index}
                active={index === activeIndex}
                onSelect={() => preserveScroll(() => setActiveIndex(index))}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dot pagination */}
      <div className="relative z-10 mx-auto mt-5 flex justify-center gap-2 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to product ${i + 1}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => preserveScroll(() => setActiveIndex(i))}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "24px" : "6px",
              background: i === activeIndex ? "var(--story-accent)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* Bottom row */}
      <div className="relative z-10 mx-auto mt-4 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">New products added every week.</p>
            <p className="text-xs text-white/55">Be the first to shop the latest Islamic essentials.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products?sort=new"
              className="hidden sm:inline-flex items-center gap-2 rounded border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              View All New Arrivals
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => preserveScroll(() => setActiveIndex((c) => (c - 1 + total) % total))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => preserveScroll(() => setActiveIndex((c) => (c + 1) % total))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
