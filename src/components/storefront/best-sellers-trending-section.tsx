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
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ProductStoryCard,
  type ProductStoryCardData,
  type ProductStoryTone,
} from "@/components/storefront/product-story-card";
import type { ProductCardData } from "@/components/storefront/product-card";

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
const TRENDING_TONES: ProductStoryTone[] = [
  {
    bg: "#0f2a1d",
    panel: "#0a1e15",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#c9a24d",
    badgeBg: "#c9a24d",
    badgeText: "#0f2a1d",
  },
  {
    bg: "#1a2a40",
    panel: "#121e30",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#60a5fa",
    badgeBg: "#2563eb",
    badgeText: "#ffffff",
  },
  {
    bg: "#2a1a0e",
    panel: "#1e1208",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.70)",
    accent: "#fb923c",
    badgeBg: "#ea580c",
    badgeText: "#ffffff",
  },
  {
    bg: "#1e1030",
    panel: "#160c24",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#c084fc",
    badgeBg: "#7c3aed",
    badgeText: "#ffffff",
  },
  {
    bg: "#0e2626",
    panel: "#091c1c",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.70)",
    accent: "#2dd4bf",
    badgeBg: "#0d9488",
    badgeText: "#ffffff",
  },
  {
    bg: "#2a1a1a",
    panel: "#1e1212",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#f87171",
    badgeBg: "#dc2626",
    badgeText: "#ffffff",
  },
];

const SOCIAL_PROOF = [
  { badge: "#1 Best Seller", label: "Top Pick",        sold: "240+ sold" },
  { badge: "Trending Now",   label: "Rising Fast",     sold: "180+ sold" },
  { badge: "Customer Fav",   label: "Loved By Many",   sold: "320+ sold" },
  { badge: "Hot Pick",       label: "This Week",       sold: "150+ sold" },
  { badge: "Staff Pick",     label: "Editor's Choice", sold: "200+ sold" },
  { badge: "Most Gifted",    label: "Gift Favourite",  sold: "270+ sold" },
];

// Fallback demo products when real products are not yet in DB
const DEMO_PRODUCTS: ProductStoryCardData[] = [
  {
    id: "bs-1",
    slug: "color-coded-tajweed-quran",
    name: "Color-Coded Tajweed Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80",
    price: 849,
    originalPrice: 1099,
    categoryName: "Quran & Books",
  },
  {
    id: "bs-2",
    slug: "velvet-prayer-mat-premium",
    name: "Premium Velvet Prayer Mat",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80",
    price: 699,
    originalPrice: 999,
    categoryName: "Prayer Essentials",
  },
  {
    id: "bs-3",
    slug: "niyamah-eid-gift-box",
    name: "Niyamah Eid Gift Box",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    price: 1499,
    categoryName: "Gift Sets",
    isNew: true,
  },
  {
    id: "bs-4",
    slug: "crystal-tasbih-99-beads",
    name: "Crystal Tasbih â€” 99 Beads",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=600&q=80",
    price: 349,
    originalPrice: 549,
    categoryName: "Prayer Accessories",
  },
  {
    id: "bs-5",
    slug: "oudh-rose-attar",
    name: "Oudh & Rose Attar Gift Set",
    image: "https://images.unsplash.com/photo-1575450064490-87da28af9308?w=600&q=80",
    price: 899,
    originalPrice: 1299,
    categoryName: "Attar & Fragrance",
  },
  {
    id: "bs-6",
    slug: "islamic-dua-book-daily",
    name: "Daily Dua & Hisnul Muslim",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=80",
    price: 299,
    originalPrice: 449,
    categoryName: "Books",
  },
];

function toStoryCard(product: ProductCardData, index: number): ProductStoryCardData {
  const proof = SOCIAL_PROOF[index % SOCIAL_PROOF.length];
  return {
    ...product,
    tone: TRENDING_TONES[index % TRENDING_TONES.length],
    badge: proof.badge,
    storyLabel: proof.label,
  };
}

function StarRow() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-[#c9a24d] text-[#c9a24d]" />
      ))}
    </div>
  );
}

// â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface BestSellersTrendingSectionProps {
  products?: ProductCardData[];
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function BestSellersTrendingSection({ products }: BestSellersTrendingSectionProps) {
  const rawProducts = products && products.length > 0 ? products : DEMO_PRODUCTS;
  const items: ProductStoryCardData[] = rawProducts
    .slice(0, 6)
    .map((p, i) => toStoryCard(p, i));

  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hovered = useRef(false);
  const isVisible = useRef(false);

  const active = items[activeIndex] ?? items[0];
  const proof = SOCIAL_PROOF[activeIndex % SOCIAL_PROOF.length];

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
    "--story-bg": active.tone?.bg ?? "#0f2a1d",
    "--story-text": active.tone?.text ?? "#ffffff",
    "--story-muted": active.tone?.muted ?? "rgba(255,255,255,0.72)",
    "--story-accent": active.tone?.accent ?? "#c9a24d",
  } as CSSProperties;

  if (items.length === 0 || !active) return null;

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
            <p className="text-xs font-black uppercase text-white/70">
              Best Sellers &amp; Trending
            </p>
            <h2 className="mt-2 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              What Everyone{" "}
              <em className="not-italic" style={{ color: "var(--story-accent)" }}>
                Is Buying.
              </em>
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/72 sm:text-base">
              Real purchases, real trust â€” the products Bangladesh keeps coming back for.
            </p>
          </div>

          {/* Live social-proof card for active product */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm lg:min-w-[240px]">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: "var(--story-accent)" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--story-accent)" }}>
                Currently viewing
              </span>
            </div>
            <p className="line-clamp-1 text-sm font-black text-white">
              {active.name}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <StarRow />
              <span className="text-xs text-white/60">{proof.sold}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${65 + (activeIndex * 7) % 30}%`,
                  background: `var(--story-accent)`,
                }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold text-white/55">
              {65 + (activeIndex * 7) % 30}% of stock sold
            </p>
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

      {/* Sold / trending bar for active product */}
      <div className="relative z-10 mx-auto mt-5 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--story-accent)" }}>
            <TrendingUp className="h-3 w-3" />
            {proof.sold}
          </span>
          <StarRow />
        </div>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${65 + (activeIndex * 7) % 30}%`,
              background: `var(--story-accent)`,
            }}
          />
        </div>
      </div>

      {/* Bottom row: CTA + arrows â€” same layout as Signature Picks */}
      <div className="relative z-10 mx-auto mt-6 max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">
              Over 10,000 happy customers across Bangladesh.
            </p>
            <p className="text-xs text-white/55">
              Every product listed here has been ordered, reviewed, and reordered.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products?sort=best-sellers"
              className="hidden sm:inline-flex items-center gap-2 rounded border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              View All Best Sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Previous product"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => preserveScroll(() => setActiveIndex((c) => (c - 1 + total) % total))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/28"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next product"
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
