import Link from "next/link";
import { cn, discountPercent } from "@/lib/utils";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { PriceText } from "@/components/shared/price-text";
import { DiscountBadge } from "@/components/shared/discount-badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { WishlistButton } from "@/components/storefront/wishlist-button";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  categoryName?: string;
  isNew?: boolean;
  inStock?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

/** The primary product display card used in grids, sliders, and search results. */
export function ProductCard({ product, className }: ProductCardProps) {
  const pct =
    product.originalPrice ? discountPercent(product.originalPrice, product.price) : 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-md",
        className,
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[var(--color-surface-alt)]">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badges overlay */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {pct > 0 && <DiscountBadge percent={pct} />}
          {product.isNew && (
            <span className="rounded bg-[var(--color-accent)] px-2 py-0.5 text-xs font-bold text-white">
              NEW
            </span>
          )}
        </div>
        {/* Wishlist */}
        <div className="absolute right-2 top-2">
          <WishlistButton
            product={{
              id: product.id,
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.image,
              price: product.price,
              originalPrice: product.originalPrice,
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        {product.categoryName && (
          <p className="mb-0.5 text-xs text-[var(--color-text-muted)]">{product.categoryName}</p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]">
            {product.name}
          </h3>
        </Link>
        {product.rating !== undefined && (
          <RatingStars rating={product.rating} count={product.reviewCount} size="sm" className="mt-1" />
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <PriceText price={product.price} originalPrice={product.originalPrice} size="sm" showDiscount={false} />
          <AddToCartButton
            productId={product.id}
            name={product.name}
            slug={product.slug}
            image={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            inStock={product.inStock ?? true}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
