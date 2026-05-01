import { SectionHeader } from "@/components/shared/section-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { ProductCardData } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";

interface NewArrivalsSectionProps {
  products: ProductCardData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/** Homepage new arrivals section wrapping the standard ProductGrid. */
export function NewArrivalsSection({
  products,
  title = "New Arrivals",
  subtitle,
  className,
}: NewArrivalsSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <SectionHeader title={title} subtitle={subtitle} />
      <ProductGrid products={products} columns={4} />
    </section>
  );
}
