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
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import {
  ProductStoryCard,
  type ProductStoryCardData,
  type ProductStoryTone,
} from "@/components/storefront/product-story-card";

// â”€â”€ Scroll-preserving helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function preserveScroll(callback: () => void) {
  if (typeof window === "undefined") { callback(); return; }
  const x = window.scrollX;
  const y = window.scrollY;
  callback();
  requestAnimationFrame(() => {
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
  });
}

// â”€â”€ Tones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FIRE_TONES: ProductStoryTone[] = [
  {
    bg: "#6b1414",
    panel: "#4d0f0f",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#ff6b35",
    badgeBg: "#dc2626",
    badgeText: "#ffffff",
  },
  {
    bg: "#7c2d12",
    panel: "#5c220e",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#fbbf24",
    badgeBg: "#ea580c",
    badgeText: "#ffffff",
  },
  {
    bg: "#1a0e3d",
    panel: "#150b35",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.70)",
    accent: "#f59e0b",
    badgeBg: "#7c3aed",
    badgeText: "#ffffff",
  },
  {
    bg: "#14532d",
    panel: "#0f3d22",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#c9a24d",
    badgeBg: "#16a34a",
    badgeText: "#ffffff",
  },
  {
    bg: "#0c1a3d",
    panel: "#091228",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.70)",
    accent: "#60a5fa",
    badgeBg: "#2563eb",
    badgeText: "#ffffff",
  },
];

// â”€â”€ Flash sale products (demo â€” swap with real DB data) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FLASH_PRODUCTS: ProductStoryCardData[] = [
  {
    id: "fs-1",
    slug: "color-coded-tajweed-quran",
    name: "Color-Coded Tajweed Quran (15 Line)",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80",
    price: 549,
    originalPrice: 999,
    categoryName: "Quran & Books",
    badge: "45% OFF",
    storyLabel: "Flash Deal",
    inStock: true,
    tone: FIRE_TONES[0]!,
  },
  {
    id: "fs-2",
    slug: "handwoven-velvet-prayer-mat",
    name: "Handwoven Velvet Prayer Mat",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80",
    price: 699,
    originalPrice: 1199,
    categoryName: "Prayer Essentials",
    badge: "42% OFF",
    storyLabel: "Limited Stock",
    inStock: true,
    tone: FIRE_TONES[1]!,
  },
  {
    id: "fs-3",
    slug: "crystal-tasbih-99-beads",
    name: "Crystal Tasbih â€” 99 Beads",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=600&q=80",
    price: 349,
    originalPrice: 599,
    categoryName: "Prayer Accessories",
    badge: "42% OFF",
    storyLabel: "Fast Moving",
    inStock: true,
    tone: FIRE_TONES[2]!,
  },
  {
    id: "fs-4",
    slug: "niyamah-eid-gift-box-deluxe",
    name: "Niyamah Eid Gift Box Deluxe",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    price: 1499,
    originalPrice: 2499,
    categoryName: "Gift Sets",
    badge: "40% OFF",
    storyLabel: "Best Seller",
    isNew: true,
    inStock: true,
    tone: FIRE_TONES[3]!,
  },
  {
    id: "fs-5",
    slug: "oudh-rose-attar-gift-set",
    name: "Oudh & Rose Attar Gift Set",
    image: "https://images.unsplash.com/photo-1575450064490-87da28af9308?w=600&q=80",
    price: 899,
    originalPrice: 1499,
    categoryName: "Attar & Fragrance",
    badge: "40% OFF",
    storyLabel: "Flash Deal",
    inStock: true,
    tone: FIRE_TONES[4]!,
  },
];

const CLAIMED = [68, 82, 55, 91, 73];

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function FlashSaleSection() {
  const items = FLASH_PRODUCTS;
  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hovered = useRef(false);
  const isVisible = useRef(false);

  const active = (items[activeIndex] ?? items[0]) as ProductStoryCardData;

  const goTo = useCallback((index: number) => {
    const safe = ((index % total) + total) % total;
    preserveScroll(() => setActiveIndex(safe));
  }, [total]);

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
    "--story-bg": active.tone?.bg ?? "#6b1414",
    "--story-text": active.tone?.text ?? "#ffffff",
    "--story-muted": active.tone?.muted ?? "rgba(255,255,255,0.72)",
    "--story-accent": active.tone?.accent ?? "#ff6b35",
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="relative isolate overflow-hidden bg-[var(--story-bg)] py-14 text-[var(--story-text)] transition-colors duration-700 [contain:paint] [overflow-anchor:none] sm:py-18 lg:py-20"
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      {/* Grid pattern â€” same as Signature Picks */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(0deg,currentColor_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(220,38,38,0.5)]">
              <Flame className="h-3.5 w-3.5" />
              Flash Sale â€” Today Only
            </span>
            <h2 className="mt-2 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Deals So Hot,{" "}
              <em className="not-italic text-red-300">They Expire.</em>
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/72 sm:text-base">
              Hand-selected Islamic essentials â€” up to{" "}
              <strong className="text-white">45% off</strong> for a few hours only.
            </p>
          </div>
          {/* Countdown */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-300">
              <Flame className="h-3.5 w-3.5" />
              Sale ends in
            </p>
            <CountdownTimer
              durationHours={24}
              className="[&_.rounded-md]:!bg-black/40 [&_.rounded-md]:!text-white [&_.text-xs]:!text-white/60"
            />
          </div>
        </div>
      </div>

      {/* Slider viewport â€” identical to Signature Picks */}
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

      {/* Active product urgency bar */}
      <div className="relative z-10 mx-auto mt-5 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {(() => {
          const claimed = CLAIMED[activeIndex] ?? 68;
          return (
            <>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-red-300">
                  {claimed}% Claimed
                </span>
                <span className="text-xs text-white/55">
                  {100 - claimed} units left
                </span>
              </div>
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
                  style={{ width: `${claimed}%` }}
                />
              </div>
            </>
          );
        })()}
      </div>

      {/* Bottom row: CTA + arrows â€” same layout as Signature Picks */}
      <div className="relative z-10 mx-auto mt-6 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">
              Flash deals reset every 24 hours.
            </p>
            <p className="text-xs text-white/55">
              Quantities are strictly limited â€” once gone, they&apos;re gone.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products?sale=true"
              className="hidden sm:inline-flex items-center gap-2 rounded border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              View All Flash Deals
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Previous deal"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => preserveScroll(() => setActiveIndex((c) => (c - 1 + total) % total))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next deal"
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

