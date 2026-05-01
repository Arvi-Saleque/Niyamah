import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

/** Empty state UI when the cart has no items. */
export function CartEmptyState() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-10 w-10 text-[var(--color-text-muted)]" />}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Browse our products and find something you love!"
      action={{ label: "Start Shopping", href: "/shop" }}
    />
  );
}
