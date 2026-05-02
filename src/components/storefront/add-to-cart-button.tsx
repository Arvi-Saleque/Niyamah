"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string | undefined;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number | undefined;
  options?: Record<string, string> | undefined;
  inStock?: boolean | undefined;
  quantity?: number | undefined;
  size?: "sm" | "default" | "lg" | undefined;
  className?: string | undefined;
  fullWidth?: boolean | undefined;
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
    const numericVariantId = Number(variantId ?? productId);
    if (!Number.isInteger(numericVariantId) || numericVariantId <= 0) {
      toast.error("This product is not available for cart yet.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: numericVariantId, quantity }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error?.message ?? "Could not add item.");
      }
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
      toast.success(`${name} added to cart`);
      openCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add item.");
    } finally {
      setLoading(false);
    }
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
