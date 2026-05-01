import { ShieldCheck, Truck, RefreshCcw, HeadphonesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ৳2000" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Dedicated customer service" },
];

interface TrustBadgesProps {
  className?: string;
}

/** Row of USP/trust icons displayed below the hero or above the footer. */
export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
      {BADGES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] p-4">
          <div className="mt-0.5 rounded-lg bg-[var(--color-accent)]/10 p-2">
            <Icon className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
