"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { WishlistItem } from "@/stores/wishlist-store";

// Re-export type for convenience
export type { WishlistItem as WishlistProduct };

interface WishlistButtonProps {
  product: WishlistItem;
  size?: "sm" | "default";
  className?: string;
}

/** Heart toggle button — adds/removes a product from the wishlist. */
export function WishlistButton({ product, size = "default", className }: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.has(product.productId));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast(has ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full bg-white/80 shadow-sm hover:bg-white",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          has ? "fill-[var(--color-error)] text-[var(--color-error)]" : "text-[var(--color-text-secondary)]",
        )}
      />
    </Button>
  );
}
