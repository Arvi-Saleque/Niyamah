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
import { ArrowRight, ChevronLeft, ChevronRight, Flame, TrendingUp } from "lucide-react";
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

const HOT_TONES: ProductStoryTone[] = [
  { bg: "#2d1a00", panel: "#1f1200", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#fbbf24", badgeBg: "#d97706", badgeText: "#ffffff" },
  { bg: "#2a0e0e", panel: "#1e0a0a", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#f87171", badgeBg: "#dc2626", badgeText: "#ffffff" },
  { bg: "#1e0b2a", panel: "#160820", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#c084fc", badgeBg: "#7c3aed", badgeText: "#ffffff" },
  { bg: "#0e1e32", panel: "#0a1626", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#60a5fa", badgeBg: "#2563eb", badgeText: "#ffffff" },
  { bg: "#122a14", panel: "#0c1e0e", text: "#ffffff", muted: "rgba(255,255,255,0.72)", accent: "#86efac", badgeBg: "#16a34a", badgeText: "#ffffff" },
];

const HOT_RANKS = [
  { rank: "#1", soldThisWeek: "312 sold this week" },
  { rank: "#2", soldThisWeek: "287 sold this week" },
  { rank: "#3", soldThisWeek: "241 sold this week" },
  { rank: "#4", soldThisWeek: "198 sold this week" },
  { rank: "#5", soldThisWeek: "176 sold this week" },
];

const DEMO_PRODUCTS: ProductStoryCardData[] = [
  {
    id: "tn-1",
    slug: "color-coded-tajweed-quran",
    name: "Color-Coded Tajweed Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80",
    price: 849,
    originalPrice: 1099,
    categoryName: "Quran & Books",
    badge: "#1 This Week",
    tone: HOT_TONES[0]!,
  },
  {
    id: "tn-2",
    slug: "premium-velvet-prayer-mat",
    name: "Premium Velvet Prayer Mat",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80",
    price: 699,
    originalPrice: 999,
    categoryName: "Prayer Essentials",
    badge: "Trending",
    tone: HOT_TONES[1]!,
  },
  {
    id: "tn-3",
    slug: "niyamah-eid-gift-box",
    name: "Niyamah Eid Gift Box",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    price: 1499,
    categoryName: "Gift Sets",
    badge: "Hot Pick",
    tone: HOT_TONES[2]!,
  },
  {
    id: "tn-4",
    slug: "crystal-tasbih-99-beads",
    name: "Crystal Tasbih — 99 Beads",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=600&q=80",
    price: 349,
    originalPrice: 549,
    categoryName: "Prayer Accessories",
    badge: "Fan Fav",
    tone: HOT_TONES[3]!,
  },
  {
    id: "tn-5",
    slug: "oudh-rose-attar-gift-set",
    name: "Oudh & Rose Attar Gift Set",
    image: "https://images.unsplash.com/photo-1575450064490-87da28af9308?w=600&q=80",
    price: 899,
    originalPrice: 1299,
    categoryName: "Attar & Fragrance",
    badge: "Rising",
    tone: HOT_TONES[4]!,
  },
];

interface TrendingNowSectionProps {
  products?: ProductCardData[];
}

export function TrendingNowSection({ products }: TrendingNowSectionProps) {
  const rawProducts = products && products.length > 0 ? products : DEMO_PRODUCTS;
  const items: ProductStoryCardData[] = rawProducts.slice(0, 5).map((p, i) => ({
    ...p,
    tone: HOT_TONES[i % HOT_TONES.length] as ProductStoryTone,
    badge: HOT_RANKS[i % HOT_RANKS.length]!.rank + " This Week",
  }));

  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hovered = useRef(false);
  const isVisible = useRef(false);

  const active = (items[activeIndex] ?? items[0]) as ProductStoryCardData;
  const hotRank = HOT_RANKS[activeIndex % HOT_RANKS.length]!;

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
    "--story-bg": active.tone?.bg ?? "#2d1a00",
    "--story-text": active.tone?.text ?? "#ffffff",
    "--story-muted": active.tone?.muted ?? "rgba(255,255,255,0.72)",
    "--story-accent": active.tone?.accent ?? "#fbbf24",
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
              <Flame className="h-3.5 w-3.5" style={{ color: "var(--story-accent)" }} />
              Trending This Week
            </p>
            <h2 className="mt-2 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              This Week&rsquo;s{" "}
              <em className="not-italic" style={{ color: "var(--story-accent)" }}>
                Hottest.
              </em>
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/72 sm:text-base">
              Products our customers keep returning to — week after week, order after order.
            </p>
          </div>

          {/* Rank info card */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm lg:min-w-[220px]">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: "var(--story-accent)" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--story-accent)" }}>
                Trending Rank
              </span>
            </div>
            <p className="text-3xl font-black text-white">{hotRank.rank}</p>
            <p className="mt-1 line-clamp-1 text-sm font-bold text-white">{active.name}</p>
            <p className="mt-1 text-xs text-white/55">{hotRank.soldThisWeek}</p>
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

      {/* Rank bar */}
      <div className="relative z-10 mx-auto mt-5 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {HOT_RANKS.map((r, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => preserveScroll(() => setActiveIndex(i))}
              className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-black transition-all"
              style={
                i === activeIndex
                  ? { background: "var(--story-accent)", color: "#0a0a0a" }
                  : { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }
              }
            >
              {r.rank}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 mx-auto mt-4 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Loved by customers across Bangladesh.</p>
            <p className="text-xs text-white/55">Highest repeat-purchase rate in our catalogue.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products?sort=trending"
              className="hidden sm:inline-flex items-center gap-2 rounded border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              View All Trending
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
