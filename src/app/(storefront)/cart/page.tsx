"use client";

import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CartItemRow } from "@/components/storefront/cart-item";
import { CartSummary } from "@/components/storefront/cart-summary";
import { CartEmptyState } from "@/components/storefront/cart-empty-state";
import { FreeShippingProgress } from "@/components/storefront/free-shipping-progress";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <CartEmptyState />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1
        className="mb-6 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Your Cart
      </h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <div className="space-y-4">
          <FreeShippingProgress subtotal={subtotal} threshold={2000} />
          <CartSummary subtotal={subtotal} total={subtotal} />
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
