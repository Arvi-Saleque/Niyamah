"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  gallery?: string[];
  tagline?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  currency?: string;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  stockStatus?: "In Stock" | "Limited Stock" | "Out of Stock" | "Pre Order";
  isNew?: boolean;
  isFeatured?: boolean;
  features?: string[];
  themeColor?: string;
};

export type ProductBookCarouselProps = {
  products: Product[];
  /** Eyebrow label above the heading */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatPrice(value: number, currency = "BDT") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

function getPrevIndex(current: number, total: number) {
  return (current - 1 + total) % total;
}

function getNextIndex(current: number, total: number) {
  return (current + 1) % total;
}

function getVisibleProducts(products: Product[], activeIndex: number) {
  const total = products.length;
  if (total === 0) return { prev: null, active: null, next: null };
  return {
    prev: total > 1 ? products[getPrevIndex(activeIndex, total)] : null,
    active: products[activeIndex],
    next: total > 1 ? products[getNextIndex(activeIndex, total)] : null,
  };
}

/**
 * Run a state-updating callback while keeping window scroll position stable.
 * Prevents page jumps when re-render shifts focus to an off-screen button.
 */
function preserveScroll(callback: () => void) {
  if (typeof window === "undefined") { callback(); return; }
  const x = window.scrollX;
  const y = window.scrollY;
  callback();
  requestAnimationFrame(() => {
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
  });
}

/* -------------------------------------------------------------------------- */
/*                              Sub-components                                */
/* -------------------------------------------------------------------------- */

function StockBadge({ status }: { status?: Product["stockStatus"] }) {
  if (!status || status === "In Stock") return null;
  const tone =
    status === "Limited Stock"
      ? "bg-amber-500/90 text-white"
      : status === "Pre Order"
        ? "bg-sky-500/90 text-white"
        : "bg-rose-500/90 text-white";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm", tone)}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Side Card                                  */
/* -------------------------------------------------------------------------- */

type SideCardProps = {
  product: Product;
  side: "left" | "right";
  onSelect: (event: React.SyntheticEvent) => void;
};

function SideCard({ product, side, onSelect }: SideCardProps) {
  const isLeft = side === "left";
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseDown={(e) => e.preventDefault()}
      aria-label={`View ${product.name}`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={{
        opacity: 0.72,
        x: isLeft ? "-15%" : "15%",
        y: 0,
        rotateY: isLeft ? 18 : -18,
        scale: 0.84,
      }}
      whileHover={{ opacity: 1, y: -10, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 180, damping: 28 }}
      className={cn(
        "group/side absolute top-1/2 hidden h-[76%] w-[34%] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] ring-1 ring-black/10 md:block",
        isLeft ? "left-0" : "right-0",
      )}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: isLeft ? "right center" : "left center",
      }}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(min-width: 768px) 34vw, 0px"
        className="object-cover transition-transform duration-700 group-hover/side:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/15" />
      {/* Page-edge inner shadow facing center */}
      <div className={cn("pointer-events-none absolute inset-y-0 w-8", isLeft ? "right-0 bg-gradient-to-l from-black/50 to-transparent" : "left-0 bg-gradient-to-r from-black/50 to-transparent")} />
      {/* Paper top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
      {/* Inner ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

      <div className="absolute left-4 top-4">
        <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-5 text-left text-white">
        <h4 className="line-clamp-2 text-sm font-bold leading-snug">{product.name}</h4>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm font-bold">{formatPrice(product.price, product.currency)}</span>
          {product.rating ? (
            <span className="inline-flex items-center gap-1 text-xs text-white/75">
              <Star className="h-3 w-3 fill-yellow-300 stroke-yellow-300" />
              {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Active Card                                   */
/* -------------------------------------------------------------------------- */

type ActiveCardProps = {
  product: Product;
  direction: number;
  onAddToCart?: (p: Product) => void;
  onViewDetails?: (p: Product) => void;
  onWishlist?: (p: Product) => void;
};

function ActiveCard({ product, direction, onAddToCart, onViewDetails, onWishlist }: ActiveCardProps) {
  const outOfStock = product.stockStatus === "Out of Stock";
  const discount =
    product.discountPercent ??
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : undefined);

  return (
    <motion.article
      key={product.id}
      initial={{ opacity: 0, x: direction >= 0 ? 90 : -90, rotateY: direction >= 0 ? -20 : 20, scale: 0.93 }}
      animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction >= 0 ? -90 : 90, rotateY: direction >= 0 ? 20 : -20, scale: 0.93 }}
      transition={{ type: "spring", stiffness: 160, damping: 26 }}
      className="group/active relative z-20 mx-auto h-full w-full overflow-hidden rounded-[2rem] shadow-[0_32px_90px_-18px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
    >
      {/* Image */}
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority
        sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-out will-change-transform group-hover/active:scale-[1.05]"
      />

      {/* ── Depth layers ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />

      {/* Book spine */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-[7px] w-[1.5px] bg-white/18 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-y-0 left-[12px] w-px bg-black/50" />

      {/* Paper edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Right curl hint */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/35 to-transparent" />

      {/* Inner ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

      {/* ── Top row ── */}
      <div className="absolute inset-x-5 top-5 flex items-start justify-between sm:inset-x-8 sm:top-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
            {product.category}
          </span>
          {product.isNew ? (
            <span className="inline-flex rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              New Arrival
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {discount ? (
            <span className="inline-flex rounded-full bg-rose-500 px-3 py-1 text-xs font-black text-white shadow-md">
              -{discount}%
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Add to wishlist"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onWishlist?.(product)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-white/28"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Bottom editorial content ── */}
      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3.5 text-white sm:inset-x-8 sm:bottom-8">
        {/* Level 3: rating + stock */}
        <div className="flex flex-wrap items-center gap-2">
          {product.rating ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-300 stroke-yellow-300" />
              {product.rating.toFixed(1)}
              {product.reviewCount ? <span className="text-white/65">({product.reviewCount})</span> : null}
            </span>
          ) : null}
          {product.stockStatus === "In Stock" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              In Stock
            </span>
          ) : null}
          <StockBadge status={product.stockStatus} />
        </div>

        {/* Level 1: name + tagline */}
        <div className="max-w-lg space-y-1.5">
          <h3 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-[2.25rem]">
            {product.name}
          </h3>
          {product.tagline ? (
            <p className="text-sm leading-relaxed text-white/75 sm:text-[0.9375rem]">{product.tagline}</p>
          ) : null}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 ? (
          <ul className="hidden flex-wrap gap-1.5 sm:flex">
            {product.features.slice(0, 3).map((f) => (
              <li key={f} className="rounded-full border border-white/20 bg-white/8 px-3 py-[5px] text-xs text-white/80 backdrop-blur-sm">
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Level 2: price */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-black sm:text-3xl">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="text-sm text-white/55 line-through sm:text-base">
              {formatPrice(product.oldPrice, product.currency)}
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-sm">
            <Truck className="h-3 w-3" />
            Fast Delivery
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {/* Primary: dark + shine */}
          <button
            type="button"
            disabled={outOfStock}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onAddToCart?.(product)}
            className={cn(
              "group/cta relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-bold shadow-lg transition duration-300",
              outOfStock
                ? "cursor-not-allowed bg-white/20 text-white/50"
                : "bg-stone-950 text-white hover:-translate-y-0.5 hover:shadow-xl",
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </span>
            {!outOfStock && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
              />
            )}
          </button>

          {/* Secondary: glass */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onViewDetails?.(product)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/12 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/22"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function ProductBookCarousel({
  products,
  eyebrow = "Featured Collection",
  title,
  subtitle,
  className,
  onAddToCart,
  onViewDetails,
  onWishlist,
}: ProductBookCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const containerRef = React.useRef<HTMLElement | null>(null);

  const total = products.length;

  const goNext = React.useCallback(
    (event?: React.SyntheticEvent) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (total === 0) return;
      preserveScroll(() => { setDirection(1); setActiveIndex((i) => getNextIndex(i, total)); });
    },
    [total],
  );

  const goPrev = React.useCallback(
    (event?: React.SyntheticEvent) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (total === 0) return;
      preserveScroll(() => { setDirection(-1); setActiveIndex((i) => getPrevIndex(i, total)); });
    },
    [total],
  );

  const goTo = React.useCallback(
    (next: number, event?: React.SyntheticEvent) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (total === 0) return;
      preserveScroll(() => {
        setDirection(next > activeIndex ? 1 : -1);
        setActiveIndex(((next % total) + total) % total);
      });
    },
    [activeIndex, total],
  );

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const root = containerRef.current;
      if (!root) return;
      const focused = document.activeElement;
      if (!(focused instanceof Node) || !root.contains(focused)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goPrev(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (total === 0) {
    return (
      <section className={cn("rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-neutral-500", className)}>
        <p className="text-sm">No products available.</p>
      </section>
    );
  }

  const { prev, active, next } = getVisibleProducts(products, activeIndex);
  const themeColor = active?.themeColor ?? "#0f172a";

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-[2rem] px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 md:px-10 md:pb-16 md:pt-16",
        className,
      )}
    >
      {/* ── Background system ── */}
      {/* Warm parchment base */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-gradient-to-br from-[#f7f1e7] via-[#fffaf3] to-[#ead9c1]" />

      {/* Active product theme glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        animate={{ background: `radial-gradient(circle at 50% 60%, ${themeColor}28 0%, ${themeColor}0d 40%, transparent 68%)` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Blurred decorative circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `${themeColor}18` }}
      />

      {/* Top-left light bounce */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_40%)]" />

      {/* Subtle dot-grid grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.032] [background-image:radial-gradient(circle,#000_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* ── Section header ── */}
      <div className="mx-auto mb-10 flex max-w-6xl items-end justify-between gap-4 px-1">
        <div>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700/80 sm:text-[0.8125rem]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Desktop counter */}
        {total > 1 ? (
          <span className="hidden shrink-0 font-mono text-sm tabular-nums text-stone-400 sm:block">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-1.5 text-stone-300">/</span>
            {String(total).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      {/* ── Carousel track ── */}
      <div
        className="relative mx-auto flex h-[500px] w-full max-w-6xl items-center justify-center sm:h-[540px] md:h-[590px]"
        style={{ perspective: "1800px" }}
      >
        {prev && total > 1 ? <SideCard product={prev} side="left" onSelect={goPrev} /> : null}
        {next && total > 1 ? <SideCard product={next} side="right" onSelect={goNext} /> : null}

        {/* Active card + page-stack layers */}
        <div
          className="relative h-full w-full sm:w-[78%] md:w-[62%]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Stack layer 2 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-[2rem] bg-stone-200/70 shadow-lg ring-1 ring-black/5" />
          {/* Stack layer 1 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-[2rem] bg-stone-100/90 shadow-md ring-1 ring-black/5" />

          <AnimatePresence mode="wait" custom={direction}>
            {active ? (
              <ActiveCard
                key={active.id}
                product={active}
                direction={direction}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
                onWishlist={onWishlist}
              />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Floating arrows */}
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Previous product"
              className="absolute left-1 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/75 text-stone-900 shadow-lg backdrop-blur-xl transition duration-200 hover:scale-105 hover:bg-white sm:left-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Next product"
              className="absolute right-1 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/75 text-stone-900 shadow-lg backdrop-blur-xl transition duration-200 hover:scale-105 hover:bg-white sm:right-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* ── Dot strip + mobile counter + bottom-right arrows ── */}
      {total > 1 ? (
        <div className="mt-7 flex items-center justify-between gap-4 px-1">
          <span className="font-mono text-xs tabular-nums text-stone-400 sm:hidden">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5 mx-auto">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Go to product ${i + 1}`}
                onClick={(e) => goTo(i, e)}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "h-2 w-7 bg-stone-800"
                    : "h-2 w-2 bg-stone-300 hover:bg-stone-500",
                )}
              />
            ))}
          </div>

          {/* Bottom-right prev / next arrows */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Previous product"
              className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition duration-200 hover:scale-105 hover:border-stone-300 hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Next product"
              className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition duration-200 hover:scale-105 hover:border-stone-300 hover:shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProductBookCarousel;
