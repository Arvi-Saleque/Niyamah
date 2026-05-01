import { CountdownTimer } from "@/components/shared/countdown-timer";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { ProductCardData } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";

interface FlashSaleSectionProps {
  products: ProductCardData[];
  endsAt: string | Date;
  title?: string;
  className?: string;
}

/** Homepage flash-sale band with countdown timer above a product grid. */
export function FlashSaleSection({
  products,
  endsAt,
  title = "Flash Sale",
  className,
}: FlashSaleSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-end gap-4">
        <SectionHeader title={title} className="mb-0 flex-1" />
        <CountdownTimer endsAt={endsAt} />
      </div>
      <ProductGrid products={products} columns={5} />
    </section>
  );
}
