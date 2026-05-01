import { cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";

interface ProductGridProps {
  products?: ProductCardData[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

const colMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

/** Responsive grid of ProductCards with optional skeleton loading state. */
export function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
  columns = 4,
  className,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-4", colMap[columns], className)}>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)
        : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
