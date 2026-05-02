"use client";

import { useState } from "react";
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle,
  CreditCard,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TrustItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  short: string;
  details: string;
}

const ITEMS: TrustItem[] = [
  {
    id: "cod",
    icon: CreditCard,
    title: "Cash on Delivery",
    short: "Pay when it arrives",
    details:
      "Pay in cash to the delivery agent on arrival. Available across all 64 districts of Bangladesh. Inspect your product before you pay — peace of mind, every order.",
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Fast Delivery",
    short: "1–3 days nationwide",
    details:
      "Same-day delivery inside Dhaka for orders placed before 2 PM. 1–2 days for major cities (Chattogram, Sylhet, Khulna). 2–3 days for all other districts. Free shipping on orders above ৳2,000.",
  },
  {
    id: "returns",
    icon: RefreshCcw,
    title: "7-Day Returns",
    short: "Easy & hassle-free",
    details:
      "Not happy? Return any item within 7 days of delivery — no questions asked. We'll arrange free pickup and refund within 48 hours of receiving the return.",
  },
  {
    id: "secure",
    icon: ShieldCheck,
    title: "Secure Checkout",
    short: "100% protected",
    details:
      "Bank-grade SSL encryption protects every transaction. We never store your card or banking details. All payments processed through PCI-DSS compliant gateways.",
  },
  {
    id: "support",
    icon: MessageCircle,
    title: "WhatsApp Support",
    short: "Chat anytime",
    details:
      "Need help? Reach our team on WhatsApp 9 AM – 11 PM, every day. Order updates, product questions, returns — all handled in minutes, not days.",
  },
  {
    id: "verified",
    icon: Star,
    title: "Verified Reviews",
    short: "Real buyers, real ratings",
    details:
      "Every review on Niyamah is from a verified buyer. We never edit, hide, or pay for reviews. What you see is what real customers experienced.",
  },
];

interface TrustSectionProps {
  className?: string;
}

/** Clickable trust badges — opens a dialog explaining each promise. */
export function TrustSection({ className }: TrustSectionProps) {
  const [open, setOpen] = useState<TrustItem | null>(null);

  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          Why Niyamah
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Promises We Keep
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Tap any badge for the full story.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ITEMS.map(({ id, icon: Icon, title, short, details }) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpen({ id, icon: Icon, title, short, details })}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {title}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{short}</p>
          </button>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-md">
          {open && (
            <>
              <DialogHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <open.icon className="h-6 w-6" />
                </div>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription className="text-[var(--color-text-secondary)] leading-relaxed">
                  {open.details}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
