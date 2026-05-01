import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin } from "lucide-react";

interface TopBarProps {
  className?: string;
  promoText?: string;
  phone?: string;
  email?: string;
}

/** Slim announcement / contact bar above the main header. Admin-configurable promo text. */
export function TopBar({
  className,
  promoText = "Free delivery on orders above ৳1,000 | Cash on Delivery available",
  phone,
  email,
}: TopBarProps) {
  return (
    <div
      className={cn(
        "border-b border-[var(--color-border)] bg-[var(--color-text-primary)] text-white",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        {/* Promo text */}
        <p className="line-clamp-1 text-center font-medium tracking-wide opacity-90 sm:text-left">
          {promoText}
        </p>

        {/* Contact links — hidden on mobile */}
        <div className="hidden items-center gap-4 sm:flex">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1 opacity-80 transition-opacity hover:opacity-100"
            >
              <Phone className="h-3 w-3" />
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1 opacity-80 transition-opacity hover:opacity-100"
            >
              <Mail className="h-3 w-3" />
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
