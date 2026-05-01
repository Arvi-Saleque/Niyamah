"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  options?: Record<string, string>;
  inStock?: boolean;
  quantity?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
  fullWidth?: boolean;
}

/** Add to cart button with loading state and toast notification. */
export function AddToCartButton({
  productId,
  variantId,
  name,
  slug,
  image,
  price,
  originalPrice,
  options,
  inStock = true,
  quantity = 1,
  size = "default",
  className,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAdd = async () => {
    if (!inStock || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async
    addItem({
      id: variantId ?? productId,
      productId,
      variantId,
      name,
      slug,
      image,
      price,
      originalPrice,
      options,
      quantity,
    });
    setLoading(false);
    toast.success(`${name} added to cart`);
    openCart();
  };

  if (!inStock) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={cn(fullWidth && "w-full", className)}
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      size={size}
      onClick={handleAdd}
      disabled={loading}
      className={cn(
        "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {size !== "sm" && <ShoppingCart className="mr-2 h-4 w-4" />}
          {size === "sm" ? <ShoppingCart className="h-3.5 w-3.5" /> : "Add to Cart"}
        </>
      )}
    </Button>
  );
}
