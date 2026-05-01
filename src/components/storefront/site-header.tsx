"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

/** Main site header: logo, search bar, cart icon, auth actions. */
export function SiteHeader({ className }: SiteHeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm",
        className,
      )}
    >
      <Container>
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Logo className="shrink-0" />

          {/* Search — desktop */}
          <div className="hidden flex-1 lg:flex">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="search"
                placeholder="Search products…"
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Mobile search */}
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth */}
            <Button variant="ghost" size="icon" aria-label="Account" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu — handled by MobileNav */}
            <Button variant="ghost" size="icon" className="ml-1 md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
