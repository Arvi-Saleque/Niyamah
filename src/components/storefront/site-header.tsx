"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

type NavPanel =
  | {
      label: string;
      href: string;
      type: "features";
      items: Array<{ label: string; href: string; tone: string; links?: string[] }>;
    }
  | {
      label: string;
      href: string;
      type: "columns";
      columns: Array<{ title: string; href: string; links: Array<{ label: string; href: string }> }>;
    };

const NAV_PANELS: NavPanel[] = [
  {
    label: "New",
    href: "/products",
    type: "features",
    items: [
      {
        label: "New Arrivals",
        href: "/products?sort=new",
        tone: "from-[#f5f1e7] via-[#e7eadf] to-[#f8f5ef]",
        links: ["Quran", "Gift boxes", "Prayer mats", "Tasbih"],
      },
      {
        label: "Ramadan Edit",
        href: "/campaigns/ramadan",
        tone: "from-[#eaf6dd] via-[#f7f1e5] to-white",
        links: ["Daily recitation", "Family gifts", "Bundles"],
      },
      {
        label: "Premium Sets",
        href: "/category/gift-box",
        tone: "from-[#f3efe7] via-[#dfe8d8] to-[#faf7ee]",
        links: ["For parents", "For teachers", "For weddings"],
      },
      {
        label: "Learning Guides",
        href: "/blog",
        tone: "from-[#f7f7f7] via-[#e8eee5] to-[#f9f5ec]",
        links: ["Quran guide", "Gift guide", "Care guide"],
      },
    ],
  },
  {
    label: "Quran",
    href: "/category/quran",
    type: "columns",
    columns: [
      {
        title: "By Translation",
        href: "/category/quran",
        links: [
          { label: "Bengali Quran", href: "/category/bengali-quran" },
          { label: "English Quran", href: "/category/english-quran" },
          { label: "Arabic Quran", href: "/category/arabic-quran" },
          { label: "Word by Word", href: "/search?q=word%20by%20word%20quran" },
        ],
      },
      {
        title: "By Use",
        href: "/category/quran",
        links: [
          { label: "Daily recitation", href: "/search?q=daily%20quran" },
          { label: "For beginners", href: "/search?q=beginner%20quran" },
          { label: "For children", href: "/search?q=children%20quran" },
          { label: "Color coded", href: "/search?q=color%20coded%20quran" },
        ],
      },
      {
        title: "Format",
        href: "/products",
        links: [
          { label: "Pocket size", href: "/search?q=pocket%20quran" },
          { label: "Large print", href: "/search?q=large%20print%20quran" },
          { label: "Hardcover", href: "/search?q=hardcover%20quran" },
          { label: "Gift edition", href: "/search?q=gift%20quran" },
        ],
      },
      {
        title: "Highlights",
        href: "/products",
        links: [
          { label: "Best sellers", href: "/products?sort=best" },
          { label: "New arrivals", href: "/products?sort=new" },
          { label: "Under Tk 1000", href: "/search?q=quran%20under%201000" },
          { label: "View all", href: "/category/quran" },
        ],
      },
    ],
  },
  {
    label: "Gifts",
    href: "/category/gift-box",
    type: "features",
    items: [
      {
        label: "Gifts for Parents",
        href: "/search?q=gift%20for%20parents",
        tone: "from-[#f8f5ef] via-[#e7eadf] to-[#f1efe8]",
        links: ["Quran sets", "Prayer sets", "Tasbih"],
      },
      {
        label: "Gifts for Her",
        href: "/search?q=islamic%20gift%20for%20her",
        tone: "from-[#f2ebe3] via-[#f7f4ee] to-[#e4eadc]",
        links: ["Gift box", "Hijab pins", "Pocket Quran"],
      },
      {
        label: "Gifts for Him",
        href: "/search?q=islamic%20gift%20for%20him",
        tone: "from-[#e9eee2] via-[#f7f1e8] to-white",
        links: ["Tasbih", "Attar", "Prayer mat"],
      },
      {
        label: "Wedding Gifts",
        href: "/search?q=islamic%20wedding%20gift",
        tone: "from-[#faf7ee] via-[#e7eadf] to-[#f6f6f4]",
        links: ["Premium box", "Couple set", "Made to order"],
      },
    ],
  },
  {
    label: "Prayer",
    href: "/category/prayer-mat",
    type: "columns",
    columns: [
      {
        title: "Prayer Mats",
        href: "/category/prayer-mat",
        links: [
          { label: "View all", href: "/category/prayer-mat" },
          { label: "Travel mats", href: "/search?q=travel%20prayer%20mat" },
          { label: "Premium mats", href: "/search?q=premium%20prayer%20mat" },
          { label: "Gift mats", href: "/search?q=gift%20prayer%20mat" },
        ],
      },
      {
        title: "Dhikr",
        href: "/category/tasbih",
        links: [
          { label: "Tasbih", href: "/category/tasbih" },
          { label: "Digital counters", href: "/search?q=digital%20tasbih" },
          { label: "Stone beads", href: "/search?q=stone%20tasbih" },
          { label: "Gift tasbih", href: "/search?q=gift%20tasbih" },
        ],
      },
      {
        title: "Essentials",
        href: "/products",
        links: [
          { label: "Prayer caps", href: "/search?q=prayer%20cap" },
          { label: "Attar", href: "/search?q=attar" },
          { label: "Books", href: "/search?q=islamic%20books" },
          { label: "Bundles", href: "/search?q=prayer%20bundle" },
        ],
      },
    ],
  },
  {
    label: "Books",
    href: "/category/books",
    type: "columns",
    columns: [
      {
        title: "Learning",
        href: "/category/books",
        links: [
          { label: "Hadith", href: "/search?q=hadith" },
          { label: "Dua books", href: "/search?q=dua%20book" },
          { label: "Seerah", href: "/search?q=seerah" },
          { label: "Children's books", href: "/search?q=islamic%20children%20books" },
        ],
      },
      {
        title: "Guides",
        href: "/blog",
        links: [
          { label: "Quran buying guide", href: "/blog" },
          { label: "Gift guide", href: "/blog" },
          { label: "Prayer essentials", href: "/blog" },
          { label: "Care guide", href: "/blog" },
        ],
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    type: "features",
    items: [
      {
        label: "WhatsApp Support",
        href: "https://wa.me/8801760982072",
        tone: "from-[#e8f0e2] via-white to-[#f8f5ef]",
        links: ["Ask before ordering", "Confirm delivery", "COD support"],
      },
      {
        label: "Track Order",
        href: "/account/orders",
        tone: "from-[#f7f4ee] via-[#e9eee2] to-white",
        links: ["Order updates", "Courier status", "Returns"],
      },
      {
        label: "Visit Help",
        href: "/faq",
        tone: "from-white via-[#f2f3ef] to-[#faf7ee]",
        links: ["FAQ", "Delivery", "Refund policy"],
      },
    ],
  },
];

const SEARCH_SUGGESTIONS = [
  "Color coded Quran",
  "Gift for parents",
  "Prayer mat",
  "Tasbih",
  "Dua book",
];

const SEARCH_COLLECTIONS = [
  ["New arrivals", "/products?sort=new"],
  ["Premium gift boxes", "/category/gift-box"],
  ["Bengali Quran", "/category/bengali-quran"],
  ["Prayer essentials", "/category/prayer-mat"],
] as const;

const MOST_SEARCHED = [
  { label: "Color Coded Quran", href: "/search?q=color%20coded%20quran", tone: "from-[#f5f1e7] to-[#e4eadc]" },
  { label: "Gift Box", href: "/category/gift-box", tone: "from-[#f3efe7] to-[#f9f7f2]" },
  { label: "Prayer Mat", href: "/category/prayer-mat", tone: "from-[#e7eadf] to-[#f8f5ef]" },
  { label: "Tasbih", href: "/category/tasbih", tone: "from-[#f6f6f4] to-[#e3eadb]" },
  { label: "Dua Book", href: "/search?q=dua%20book", tone: "from-[#faf7ee] to-white" },
  { label: "Under Tk 1000", href: "/search?q=under%201000", tone: "from-[#ecefe6] to-[#f7f4ee]" },
] as const;

const premiumUnderline =
  "relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function SiteHeader({ className }: SiteHeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = searchOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
        setActivePanel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSearch = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setQuery("");
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(clean)}`);
  };

  const panel = NAV_PANELS.find((item) => item.label === activePanel);

  return (
    <>
      <header
        className={cn("sticky top-0 z-40 bg-white text-black", className)}
        onMouseLeave={() => setActivePanel(null)}
      >
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6 lg:px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
            <Logo
              className="h-11"
              linkClassName="hidden lg:inline-flex"
              imageSize={40}
            />
          </div>

          <nav className="hidden items-center justify-center gap-7 text-[15px] lg:flex">
            {NAV_PANELS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  premiumUnderline,
                  "leading-none after:duration-500",
                  activePanel === item.label && "after:scale-x-100",
                )}
                onMouseEnter={() => setActivePanel(item.label)}
                onFocus={() => setActivePanel(item.label)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Logo
            className="h-10"
            linkClassName="justify-self-center lg:hidden"
            imageSize={38}
          />

          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center"
              aria-label="Search"
              onClick={() => {
                setSearchOpen(true);
                setActivePanel(null);
              }}
            >
              <Search className="h-5 w-5 stroke-[1.8]" />
            </button>
            <a
              href="tel:01760982072"
              className="hidden h-9 w-9 items-center justify-center md:inline-flex"
              aria-label="Call Niyamah"
            >
              <Phone className="h-5 w-5 stroke-[1.8]" />
            </a>
            <Link
              href="/account/wishlist"
              className="hidden h-9 w-9 items-center justify-center md:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 stroke-[1.8]" />
            </Link>
            <Link
              href="/account"
              className="hidden h-9 w-9 items-center justify-center md:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
            </Link>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -right-1 top-0 text-[10px] font-semibold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "absolute left-0 right-0 top-full overflow-hidden border-b border-black/10 bg-white transition-[opacity,transform]",
            panel
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
          onMouseEnter={() => panel && setActivePanel(panel.label)}
        >
          {panel && <MegaPanel panel={panel} close={() => setActivePanel(null)} />}
        </div>
      </header>

      <SearchOverlay
        open={searchOpen}
        query={query}
        setQuery={setQuery}
        close={() => setSearchOpen(false)}
        submitSearch={submitSearch}
      />

      <MobileMenu
        open={mobileOpen}
        close={() => setMobileOpen(false)}
        openSearch={() => {
          setMobileOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}

function MegaPanel({ panel, close }: { panel: NavPanel; close: () => void }) {
  if (panel.type === "features") {
    return (
      <div className="w-full px-4 pb-12 pt-9">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3 lg:grid-cols-4">
          {panel.items.map((item) => (
            <Link key={item.label} href={item.href} onClick={close} className="group">
              <div className={cn("aspect-[4/5] bg-gradient-to-br", item.tone)}>
                <div className="flex h-full items-center justify-center">
                  <span className="w-28 text-center text-sm uppercase tracking-[0.18em] text-black/35">
                    Niyamah
                  </span>
                </div>
              </div>
              <p className="mt-5 text-center text-[15px] font-semibold">
                <span className={premiumUnderline}>{item.label}</span>
              </p>
              {item.links && (
                <div className="mt-5 space-y-3 text-center text-[15px]">
                  {item.links.map((link) => (
                    <p key={link}>
                      <span className={cn(premiumUnderline, "text-black/80")}>{link}</span>
                    </p>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-12 pt-10">
      <div
        className="mx-auto grid max-w-[1660px] gap-x-14 gap-y-8"
        style={{ gridTemplateColumns: `repeat(${Math.min(panel.columns.length, 7)}, minmax(0, 1fr))` }}
      >
        {panel.columns.map((column) => (
          <div key={column.title} className="min-w-0">
            <Link
              href={column.href}
              onClick={close}
              className="mb-7 block text-[15px] font-semibold"
            >
              <span className={premiumUnderline}>{column.title}</span>
            </Link>
            <div className="space-y-4 text-[15px]">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="block"
                >
                  <span className={premiumUnderline}>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchOverlay({
  open,
  query,
  setQuery,
  close,
  submitSearch,
}: {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  close: () => void;
  submitSearch: (value: string) => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] bg-white text-black transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-4">
        <span onClick={close}>
          <Logo className="h-11" imageSize={40} />
        </span>
        <button type="button" onClick={close} aria-label="Close search">
          <X className="h-5 w-5 stroke-[1.8]" />
        </button>
      </div>

      <form
        className="mx-4 flex items-center border-b border-black md:mx-6 lg:mx-4"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch(query);
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus={open}
          placeholder="What are you looking for?"
          className="h-10 flex-1 bg-transparent text-[15px] outline-none placeholder:text-black/55"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="mr-5"
          >
            <X className="h-4 w-4 stroke-[1.8]" />
          </button>
        )}
        <button type="submit" aria-label="Submit search">
          <Search className="h-5 w-5 stroke-[1.8]" />
        </button>
      </form>

      <div className="grid gap-6 px-4 py-9 md:grid-cols-[360px_1fr] md:px-6 lg:px-4">
        <aside className="border-black/15 pb-4 md:min-h-[385px] md:border-r md:pr-10">
          <p className="mb-6 text-[15px] uppercase tracking-[0.04em]">Suggestions</p>
          <div className="space-y-5 text-[15px]">
            {SEARCH_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                className="block text-left"
                onClick={() => submitSearch(item)}
              >
                <span className={premiumUnderline}>{item}</span>
              </button>
            ))}
          </div>

          <p className="mb-6 mt-12 text-[15px] uppercase tracking-[0.04em]">Collections</p>
          <div className="space-y-5 text-[15px]">
            {SEARCH_COLLECTIONS.map(([label, href]) => (
              <Link key={href} href={href} onClick={close} className="block">
                <span className={premiumUnderline}>{label}</span>
              </Link>
            ))}
          </div>
        </aside>

        <section className="min-w-0 md:pl-2">
          <p className="mb-5 text-[15px] uppercase tracking-[0.04em]">Most searched</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {MOST_SEARCHED.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className="group min-w-0">
                <div className={cn("aspect-[4/5] bg-gradient-to-br", item.tone)}>
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <span className="text-sm uppercase tracking-[0.18em] text-black/35">
                      Niyamah
                    </span>
                  </div>
                </div>
                <p className="mt-5 truncate text-[15px]">
                  <span className={premiumUnderline}>{item.label}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  close,
  openSearch,
}: {
  open: boolean;
  close: () => void;
  openSearch: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] bg-white text-black transition-transform lg:hidden",
        open ? "translate-x-0" : "-translate-x-full",
      )}
      aria-hidden={!open}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <span onClick={close}>
          <Logo className="h-10" imageSize={38} />
        </span>
        <button type="button" onClick={close} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="border-y border-black px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[15px]"
          onClick={openSearch}
        >
          What are you looking for?
          <Search className="h-5 w-5" />
        </button>
      </div>
      <nav className="px-4 py-5">
        {NAV_PANELS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={close}
            className="block border-b border-black/10 py-5 text-xl"
          >
            <span className={premiumUnderline}>{item.label}</span>
          </Link>
        ))}
        <div className="mt-8 space-y-5 text-[15px]">
          <Link href="/account" onClick={close} className="block">
            Account
          </Link>
          <Link href="/account/wishlist" onClick={close} className="block">
            Wishlist
          </Link>
          <a href="tel:01760982072" onClick={close} className="block">
            Call: 01760-982072
          </a>
        </div>
      </nav>
    </div>
  );
}
