import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

/** Empty state UI when the cart has no items. */
export function CartEmptyState() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Browse our products and find something you love!"
      action={{ label: "Start Shopping", href: "/products" }}
    />
  );
}
