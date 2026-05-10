"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
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

/* -------------------------------------------------------------------------- */
/*                              Sub-components                                */
/* -------------------------------------------------------------------------- */

function StockBadge({ status }: { status?: Product["stockStatus"] }) {
  if (!status) return null;
  const tone =
    status === "In Stock"
      ? "bg-emerald-500/90 text-white"
      : status === "Limited Stock"
        ? "bg-amber-500/90 text-white"
        : status === "Pre Order"
          ? "bg-sky-500/90 text-white"
          : "bg-rose-500/90 text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
        tone,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {status}
    </span>
  );
}

function RatingPill({
  rating,
  reviewCount,
}: {
  rating?: number;
  reviewCount?: number;
}) {
  if (!rating) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
      <Star className="h-3.5 w-3.5 fill-yellow-300 stroke-yellow-300" />
      {rating.toFixed(1)}
      {reviewCount ? (
        <span className="text-white/70">({reviewCount})</span>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Side Card                                   */
/* -------------------------------------------------------------------------- */

type SideCardProps = {
  product: Product;
  side: "left" | "right";
  onClick: () => void;
};

function SideCard({ product, side, onClick }: SideCardProps) {
  const isLeft = side === "left";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`View ${product.name}`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={{
        opacity: 0.7,
        x: isLeft ? "-18%" : "18%",
        rotateY: isLeft ? 14 : -14,
        scale: 0.86,
      }}
      whileHover={{ opacity: 0.95, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className={cn(
        "absolute top-1/2 hidden h-[78%] w-[34%] -translate-y-1/2 cursor-pointer overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 md:block",
        isLeft ? "left-0" : "right-0",
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(min-width: 768px) 34vw, 0px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute left-4 top-4">
        <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-left text-white">
        <h4 className="line-clamp-2 text-sm font-semibold">{product.name}</h4>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.rating ? (
            <span className="inline-flex items-center gap-1 text-xs text-white/80">
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

function ActiveCard({
  product,
  direction,
  onAddToCart,
  onViewDetails,
  onWishlist,
}: ActiveCardProps) {
  const outOfStock = product.stockStatus === "Out of Stock";
  const discount =
    product.discountPercent ??
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : undefined);

  return (
    <motion.article
      key={product.id}
      initial={{
        opacity: 0,
        x: direction >= 0 ? 80 : -80,
        rotateY: direction >= 0 ? -18 : 18,
        scale: 0.94,
      }}
      animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: direction >= 0 ? -80 : 80,
        rotateY: direction >= 0 ? 18 : -18,
        scale: 0.94,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="relative z-20 mx-auto h-full w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority
        sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
        className="object-cover"
      />
      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Top row */}
      <div className="absolute inset-x-5 top-5 flex items-start justify-between sm:inset-x-7 sm:top-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            {product.category}
          </span>
          {product.isNew ? (
            <span className="inline-flex rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              New Arrival
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {discount ? (
            <span className="inline-flex rounded-full bg-rose-500/95 px-3 py-1 text-xs font-bold text-white shadow-md">
              -{discount}%
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => onWishlist?.(product)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Quick view"
            onClick={() => onViewDetails?.(product)}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:inline-flex"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-4 text-white sm:inset-x-8 sm:bottom-8">
        <div className="flex flex-wrap items-center gap-2">
          <StockBadge status={product.stockStatus} />
          <RatingPill
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        <div className="max-w-2xl space-y-2">
          <h3 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            {product.name}
          </h3>
          {product.tagline ? (
            <p className="text-sm text-white/80 sm:text-base">
              {product.tagline}
            </p>
          ) : null}
        </div>

        {product.features && product.features.length > 0 ? (
          <ul className="hidden max-w-xl flex-wrap gap-2 sm:flex">
            {product.features.slice(0, 3).map((f) => (
              <li
                key={f}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur"
              >
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="text-2xl font-bold sm:text-3xl">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="text-sm text-white/60 line-through sm:text-base">
              {formatPrice(product.oldPrice, product.currency)}
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur">
            <Truck className="h-3.5 w-3.5" />
            Fast Delivery
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => onAddToCart?.(product)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition",
              outOfStock
                ? "cursor-not-allowed bg-white/20 text-white/60"
                : "bg-white text-neutral-900 hover:bg-white/90",
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
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
  title,
  subtitle,
  className,
  onAddToCart,
  onViewDetails,
  onWishlist,
}: ProductBookCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const total = products.length;

  const goNext = React.useCallback(() => {
    if (total === 0) return;
    setDirection(1);
    setActiveIndex((i) => getNextIndex(i, total));
  }, [total]);

  const goPrev = React.useCallback(() => {
    if (total === 0) return;
    setDirection(-1);
    setActiveIndex((i) => getPrevIndex(i, total));
  }, [total]);

  const goTo = React.useCallback(
    (next: number) => {
      if (total === 0) return;
      setDirection(next > activeIndex ? 1 : -1);
      setActiveIndex(((next % total) + total) % total);
    },
    [activeIndex, total],
  );

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (total === 0) {
    return (
      <section
        className={cn(
          "rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-neutral-500",
          className,
        )}
      >
        <p className="text-sm">No products available.</p>
      </section>
    );
  }

  const { prev, active, next } = getVisibleProducts(products, activeIndex);
  const themeColor = active?.themeColor ?? "#0f172a";

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-3xl px-4 py-10 sm:px-8 sm:py-14 md:py-16",
        className,
      )}
    >
      {/* Animated themed background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(120% 80% at 50% 0%, ${themeColor}33 0%, ${themeColor}12 40%, transparent 75%), linear-gradient(180deg, #fafafa 0%, #f1f5f9 100%)`,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_50%_50%,rgba(255,255,255,0.6),transparent)]"
      />

      {(title || subtitle) && (
        <header className="mb-8 flex flex-col items-center text-center">
          {title ? (
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
      )}

      <div
        className="relative mx-auto flex h-[520px] w-full max-w-6xl items-center justify-center sm:h-[560px] md:h-[600px]"
        style={{ perspective: "1600px" }}
      >
        {/* Side cards (only when more than 1 product) */}
        {prev && total > 1 ? (
          <SideCard product={prev} side="left" onClick={goPrev} />
        ) : null}
        {next && total > 1 ? (
          <SideCard product={next} side="right" onClick={goNext} />
        ) : null}

        {/* Active card */}
        <div
          className="relative h-full w-full sm:w-[80%] md:w-[65%]"
          style={{ transformStyle: "preserve-3d" }}
        >
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

        {/* Navigation arrows */}
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous product"
              className="absolute left-2 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl ring-1 ring-black/5 backdrop-blur transition hover:bg-white sm:left-4 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next product"
              className="absolute right-2 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl ring-1 ring-black/5 backdrop-blur transition hover:bg-white sm:right-4 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Dots indicator */}
      {total > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to product ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex
                  ? "w-8 bg-neutral-900"
                  : "w-2 bg-neutral-400 hover:bg-neutral-600",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ProductBookCarousel;
