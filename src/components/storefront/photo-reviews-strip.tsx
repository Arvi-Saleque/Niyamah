import Link from "next/link";
import Image from "next/image";
import { Star, Camera } from "lucide-react";
import type { PhotoReviewItem } from "@/modules/storefront/queries";
import { cn } from "@/lib/utils";

interface PhotoReviewsStripProps {
  reviews: PhotoReviewItem[];
  className?: string;
}

/** Instagram-style horizontal strip of photo reviews linked to product pages. */
export function PhotoReviewsStrip({ reviews, className }: PhotoReviewsStripProps) {
  if (reviews.length === 0) return null;

  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
          <Camera className="h-3 w-3" /> Real Customers
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Loved & shared by you
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Photos from verified buyers. Tap to shop the look.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="flex gap-4">
          {reviews.map((r) => (
            <Link
              key={r.reviewId}
              href={`/product/${r.productSlug}`}
              className="group relative flex h-64 w-48 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Image
                src={r.imageUrl}
                alt={r.productName}
                fill
                sizes="192px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Rating badge top-right */}
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-primary)] backdrop-blur">
                <Star className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                {r.rating}
              </div>
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="line-clamp-1 text-xs font-semibold">{r.productName}</p>
                {r.body && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-white/80">
                    &ldquo;{r.body}&rdquo;
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
