import { PriceText } from "@/components/shared/price-text";
import { RatingStars } from "@/components/shared/rating-stars";
import { StockIndicator } from "@/components/shared/stock-indicator";
import { Heading, Text } from "@/components/shared/typography";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  sku?: string;
  shortDescription?: string;
  className?: string;
}

/** Displays title, rating, price, stock, SKU, and short description on the PDP. */
export function ProductInfo({
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  stock = 0,
  sku,
  shortDescription,
  className,
}: ProductInfoProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Heading as="h1" size="2xl">
        {name}
      </Heading>
      {rating !== undefined && (
        <RatingStars rating={rating} count={reviewCount} showCount size="md" />
      )}
      <PriceText price={price} originalPrice={originalPrice} size="xl" />
      <StockIndicator stock={stock} showCount />
      {shortDescription && (
        <Text variant="secondary" className="leading-relaxed">
          {shortDescription}
        </Text>
      )}
      {sku && (
        <p className="text-xs text-[var(--color-text-muted)]">
          SKU: <span className="font-medium">{sku}</span>
        </p>
      )}
    </div>
  );
}
