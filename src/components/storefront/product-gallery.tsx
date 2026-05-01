"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

/** Main product image + thumbnail strip for the product detail page. */
export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const src = images[selected] ?? "/images/placeholder-product.png";

  const prev = () => setSelected((i) => (i - 1 + images.length) % images.length);
  const next = () => setSelected((i) => (i + 1) % images.length);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-surface-alt)]">
        <Image
          src={src}
          alt={`${productName} — image ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 shadow hover:bg-white"
              onClick={prev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 shadow hover:bg-white"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                i === selected
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-border)] opacity-60 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
