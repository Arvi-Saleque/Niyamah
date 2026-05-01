"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

interface MiniCartButtonProps {
  className?: string;
  /** If provided, clicking opens the drawer instead of navigating. */
  onOpenCart?: () => void;
}

/** Header cart icon with live item-count badge sourced from zustand cart store. */
export function MiniCartButton({ className, onOpenCart }: MiniCartButtonProps) {
  const totalItems = useCartStore((s) => s.totalItems());

  const handleClick = () => {
    if (onOpenCart) {
      onOpenCart();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cart"
      className={cn("relative", className)}
      onClick={handleClick}
      asChild={!onOpenCart}
    >
      {onOpenCart ? (
        <>
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </>
      ) : (
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      )}
    </Button>
  );
}
