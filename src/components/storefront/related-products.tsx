import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RelatedProductsProps {
  products: ProductCardData[];
  title?: string;
  className?: string;
}

/** Horizontal scrolling row of related product cards on the PDP. */
export function RelatedProducts({
  products,
  title = "You May Also Like",
  className,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn(className)}>
      <SectionHeader title={title} />
      <ScrollArea>
        <div className="flex gap-4 pb-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} className="w-52 shrink-0" />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
