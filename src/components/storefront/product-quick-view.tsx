"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductInfo } from "@/components/storefront/product-info";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface QuickViewProduct {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  sku?: string;
  shortDescription?: string;
}

interface ProductQuickViewProps {
  product: QuickViewProduct;
  open: boolean;
  onClose: () => void;
}

/** Popup dialog with a mini product detail page — image gallery, info, add-to-cart. */
export function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const [qty, setQty] = useState(1);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="flex flex-col gap-4 p-6">
            <ProductInfo
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              stock={product.stock}
              sku={product.sku}
              shortDescription={product.shortDescription}
            />
            <div className="flex items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} max={product.stock} />
              <AddToCartButton
                productId={product.id}
                name={product.name}
                slug={product.slug}
                image={product.images[0] ?? ""}
                price={product.price}
                originalPrice={product.originalPrice}
                inStock={(product.stock ?? 0) > 0}
                quantity={qty}
                fullWidth
              />
            </div>
            <Button variant="ghost" size="sm" asChild className="self-start gap-1">
              <Link href={`/products/${product.slug}`} onClick={onClose}>
                View Full Details <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
