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
  variantId?: string;
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
        "group relative overflow-hidden rounded-[22px] border border-[#DED6BF] bg-white transition-all hover:-translate-y-1 hover:border-[#007A3D] hover:shadow-xl",
        className,
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#EAF6DD]">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <p className="mb-1 text-xs font-medium text-[#687464]">{product.categoryName}</p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#162018] hover:text-[#007A3D]">
            {product.name}
          </h3>
        </Link>
        {product.rating !== undefined && (
          <RatingStars rating={product.rating} count={product.reviewCount} size="sm" className="mt-1" />
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <PriceText price={product.price} originalPrice={product.originalPrice} size="sm" showDiscount={false} />
        </div>
        <div className="mt-3">
          <AddToCartButton
            productId={product.id}
            variantId={product.variantId}
            name={product.name}
            slug={product.slug}
            image={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            inStock={product.inStock ?? true}
            size="sm"
            className="w-full"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
