import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { PriceText } from "@/components/shared/price-text";
import { RatingStars } from "@/components/shared/rating-stars";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import type { ProductCardData } from "@/components/storefront/product-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";

interface ProductListViewProps {
  products?: ProductCardData[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

/** Horizontal list-style product display (used in wishlist, search results, comparison). */
export function ProductListView({
  products = [],
  loading = false,
  skeletonCount = 5,
  className,
}: ProductListViewProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-col divide-y divide-[var(--color-border)]", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col divide-y divide-[var(--color-border)]", className)}>
      {products.map((p) => (
        <div key={p.id} className="flex gap-4 py-4">
          <Link
            href={`/products/${p.slug}`}
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-alt)]"
          >
            <ImageWithFallback
              src={p.image}
              alt={p.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div>
              {p.categoryName && (
                <p className="text-xs text-[var(--color-text-muted)]">{p.categoryName}</p>
              )}
              <Link href={`/products/${p.slug}`}>
                <h3 className="font-medium leading-snug hover:text-[var(--color-accent)]">
                  {p.name}
                </h3>
              </Link>
              {p.rating !== undefined && (
                <RatingStars rating={p.rating} count={p.reviewCount} size="sm" className="mt-1" />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <PriceText price={p.price} originalPrice={p.originalPrice} />
              <AddToCartButton
                productId={p.id}
                variantId={p.variantId}
                name={p.name}
                slug={p.slug}
                image={p.image}
                price={p.price}
                originalPrice={p.originalPrice}
                inStock={p.inStock ?? true}
                size="sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
