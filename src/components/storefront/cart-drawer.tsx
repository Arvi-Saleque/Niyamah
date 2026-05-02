"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cart-store";
import { CartItemRow } from "@/components/storefront/cart-item";
import { CartSummary } from "@/components/storefront/cart-summary";
import { CartEmptyState } from "@/components/storefront/cart-empty-state";
import { FreeShippingProgress } from "@/components/storefront/free-shipping-progress";

/** Sliding cart panel — opens from the right side via zustand isOpen state. */
export function CartDrawer() {
  const { isOpen, closeCart, items, totalPrice, clearCart } = useCartStore();
  const subtotal = totalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-80 flex-col p-0">
        <SheetHeader className="border-b border-[var(--color-border)] px-5 py-4">
          <SheetTitle>Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-5">
            <CartEmptyState />
          </div>
        ) : (
          <>
            <FreeShippingProgress currentTotal={subtotal} className="mx-4 mt-3" />
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y divide-[var(--color-border)]">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-[var(--color-border)] px-5 py-4 space-y-4">
              <CartSummary subtotal={subtotal} total={subtotal} />
              <Button asChild className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
                <Link href="/checkout" onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-[var(--color-text-muted)]" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
