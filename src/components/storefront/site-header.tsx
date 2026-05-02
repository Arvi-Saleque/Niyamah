"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { MobileNav } from "@/components/storefront/mobile-nav";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

const NAV_ITEMS = [
  ["Quran", "/category/quran"],
  ["Bengali Quran", "/category/bengali-quran"],
  ["Gift Box", "/category/gift-box"],
  ["Prayer Mat", "/category/prayer-mat"],
  ["Tasbih", "/category/tasbih"],
  ["All Products", "/products"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ className }: SiteHeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(clean)}`);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-[#DED6BF]/90 bg-[#FAF7EE]/88 backdrop-blur-xl",
          className,
        )}
      >
        <Container>
          <div className="flex h-[72px] items-center gap-5">
            <Logo className="shrink-0" imageSize={46} />

            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {NAV_ITEMS.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-[#162018] transition-colors hover:bg-white hover:text-[#007A3D]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden h-10 min-w-[280px] items-center gap-2 rounded-full border border-[#DED6BF] bg-white px-4 text-left text-sm text-[#687464] shadow-sm transition-colors hover:border-[#007A3D] lg:flex"
              >
                <Search className="h-4 w-4" />
                Search Quran, gift box, tasbih...
              </button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
                <Link href="/account/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" aria-label="Account" asChild>
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Cart"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#007A3D] text-[10px] font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>

              <MobileNav />
            </div>
          </div>
        </Container>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/35 p-4 backdrop-blur-sm transition-opacity",
          searchOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setSearchOpen(false)}
      >
        <div
          className={cn(
            "mx-auto mt-16 max-w-2xl overflow-hidden rounded-[28px] border border-[#DED6BF] bg-white shadow-2xl transition-transform",
            searchOpen ? "translate-y-0" : "-translate-y-4",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
            className="flex items-center gap-2 border-b border-[#DED6BF] p-3"
          >
            <Search className="ml-2 h-5 w-5 text-[#007A3D]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search Quran, gift box, tasbih..."
              className="h-11 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-full p-2 text-[#687464] hover:bg-[#EAF6DD]"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            <SearchGroup
              title="Popular searches"
              items={[
                "Color coded Quran",
                "Gift box",
                "Tasbih",
                "Prayer mat",
              ]}
              onPick={submitSearch}
            />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#687464]">
                Categories
              </p>
              <div className="grid gap-2">
                {([
                  ["Quran", "/category/quran"],
                  ["Bengali Quran", "/category/bengali-quran"],
                  ["Gift Box", "/category/gift-box"],
                  ["Prayer Mat", "/category/prayer-mat"],
                  ["Tasbih", "/category/tasbih"],
                  ["All Products", "/products"],
                ] as const).map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-xl border border-[#DED6BF] px-3 py-2 text-sm font-semibold text-[#162018] hover:border-[#007A3D] hover:bg-[#EAF6DD]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchGroup({
  title,
  items,
  onPick,
}: {
  title: string;
  items: string[];
  onPick: (item: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#687464]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className="rounded-full border border-[#DED6BF] bg-[#FAF7EE] px-3 py-2 text-xs font-semibold text-[#162018] hover:border-[#007A3D] hover:text-[#007A3D]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

