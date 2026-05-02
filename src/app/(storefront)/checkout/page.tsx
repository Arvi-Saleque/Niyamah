"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutSteps, type CheckoutStep } from "@/components/storefront/checkout-steps";
import { AddressForm, type AddressFormValues } from "@/components/storefront/address-form";
import {
  DeliveryMethodSelector,
  type DeliveryMethod,
} from "@/components/storefront/delivery-method-selector";
import { PaymentMethodSelector } from "@/components/storefront/payment-method-selector";
import { OrderSummary } from "@/components/storefront/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";

interface ShippingRateRow {
  id: number;
  zoneId: number;
  name: string;
  price: string | number;
  freeAboveAmount: string | number | null;
}

const FALLBACK_RATE: DeliveryMethod = {
  id: "0",
  name: "Standard Delivery",
  description: "Nationwide",
  price: 80,
  estimatedDays: "3–5 days",
  icon: "standard",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [rates, setRates] = useState<DeliveryMethod[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>("");
  const [placing, setPlacing] = useState(false);

  // Fetch shipping rates
  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/shipping/rates")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const rows: ShippingRateRow[] = data?.data?.items ?? [];
        const methods: DeliveryMethod[] = rows.length
          ? rows.map((r) => ({
              id: String(r.id),
              name: r.name,
              description: "Delivered by courier",
              price: Number(r.price),
              estimatedDays: "3–5 days",
              icon: "standard",
            }))
          : [FALLBACK_RATE];
        setRates(methods);
        setSelectedRateId(methods[0]?.id ?? "");
      })
      .catch(() => {
        setRates([FALLBACK_RATE]);
        setSelectedRateId(FALLBACK_RATE.id);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedRate = useMemo(
    () => rates.find((r) => r.id === selectedRateId),
    [rates, selectedRateId],
  );

  const shippingCost = selectedRate?.price ?? 0;
  const total = subtotal + shippingCost;

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Add some products before checking out."
          action={
            <Button asChild className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
              <Link href="/products">Browse products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  async function handlePlaceOrder() {
    if (!address) {
      toast.error("Please enter a shipping address.");
      setStep("address");
      return;
    }
    if (!selectedRate) {
      toast.error("Please choose a delivery method.");
      return;
    }
    const shippingRateId = Number(selectedRate.id);
    if (!Number.isInteger(shippingRateId) || shippingRateId <= 0) {
      toast.error("Delivery rates are not configured yet.");
      return;
    }
    if (!session && !guestEmail) {
      toast.error("Please enter your email for order updates.");
      return;
    }

    setPlacing(true);
    try {
      const idempotencyKey = `co-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          shippingAddress: {
            name: address.name,
            phone: address.phone,
            addressLine1: address.addressLine1,
            ...(address.addressLine2 && { addressLine2: address.addressLine2 }),
            district: address.district,
            ...(address.city && { city: address.city }),
            ...(address.postalCode && { postalCode: address.postalCode }),
          },
          shippingRateId,
          paymentMethod: "COD",
          ...(session ? {} : { guestEmail, guestPhone: address.phone }),
          ...(address.note && { note: address.note }),
          idempotencyKey,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.error?.message ?? "Could not place order.");
        return;
      }
      const orderId = String(data.data?.orderId ?? "");
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading mb-2 text-3xl font-bold">Checkout</h1>
      <CheckoutSteps currentStep={step} className="mb-8" />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column — forms */}
        <div className="space-y-8">
          {/* Step 1: Contact (guest only) + Address */}
          {step === "address" && (
            <section className="space-y-6 rounded-xl border border-[var(--color-border)] p-6">
              {!session && status !== "loading" && (
                <div className="space-y-3">
                  <h2 className="font-heading text-lg font-semibold">Contact info</h2>
                  <div>
                    <Label htmlFor="guest-email">Email</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      placeholder="you@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Already have an account?{" "}
                      <Link href={`/login?callbackUrl=/checkout`} className="text-[var(--color-accent)] hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>
                  <Separator />
                </div>
              )}

              <div>
                <h2 className="font-heading mb-3 text-lg font-semibold">Shipping address</h2>
                <AddressForm
                  {...(address ? { defaultValues: address } : {})}
                  submitLabel="Continue to review"
                  onSubmit={(values) => {
                    setAddress(values);
                    setStep("review");
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </section>
          )}

          {/* Step 2: Review */}
          {step === "review" && (
            <>
              <section className="space-y-3 rounded-xl border border-[var(--color-border)] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold">Shipping address</h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep("address")}>
                    Change
                  </Button>
                </div>
                {address && (
                  <div className="text-sm text-[var(--color-text-muted)]">
                    <p className="font-medium text-[var(--color-text-primary)]">{address.name} · {address.phone}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.district}{address.city ? `, ${address.city}` : ""}{address.postalCode ? ` - ${address.postalCode}` : ""}</p>
                  </div>
                )}
              </section>

              <section className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
                <h2 className="font-heading text-lg font-semibold">Delivery method</h2>
                <DeliveryMethodSelector
                  methods={rates}
                  value={selectedRateId}
                  onChange={setSelectedRateId}
                />
              </section>

              <section className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
                <h2 className="font-heading text-lg font-semibold">Payment method</h2>
                <PaymentMethodSelector />
              </section>

              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-[var(--color-accent)] py-6 text-base text-white hover:bg-[var(--color-accent-dark)]"
              >
                {placing ? "Placing order…" : `Place Order — ৳${total.toFixed(0)}`}
              </Button>
            </>
          )}
        </div>

        {/* Right column — sticky summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shippingCost}
            total={total}
          />
        </aside>
      </div>
    </div>
  );
}
