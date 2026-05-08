"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import {
  NAVIGATION_DEFAULTS,
  type NavPanel,
} from "@/modules/storefront/navigation-defaults";

interface SiteHeaderProps {
  className?: string;
  /** Admin-controlled navigation panels. Falls back to built-in defaults if omitted. */
  panels?: NavPanel[];
}


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
  { label: "Attar", href: "/search?q=attar", tone: "from-[#f8f5ef] to-[#e9eee2]" },
  { label: "Islamic Books", href: "/search?q=islamic%20books", tone: "from-white to-[#f2f3ef]" },
] as const;

const premiumUnderline =
  "relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function SiteHeader({ className, panels }: SiteHeaderProps) {
  const navPanels: NavPanel[] = panels && panels.length > 0 ? panels : NAVIGATION_DEFAULTS.panels;
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

  const panel = navPanels.find((item) => item.id === activePanel);

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
            {navPanels.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  premiumUnderline,
                  "leading-none after:duration-500",
                  activePanel === item.id && "after:scale-x-100",
                )}
                onMouseEnter={() => setActivePanel(item.id)}
                onFocus={() => setActivePanel(item.id)}
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
          onMouseEnter={() => panel && setActivePanel(panel.id)}
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
        key={mobileOpen ? "mobile-open" : "mobile-closed"}
        open={mobileOpen}
        close={() => setMobileOpen(false)}
        panels={navPanels}
      />
    </>
  );
}

function gridColumns(count: number, max: number) {
  return `repeat(${Math.max(1, Math.min(count, max))}, minmax(0, 1fr))`;
}

function MegaPanel({ panel, close }: { panel: NavPanel; close: () => void }) {
  // â”€â”€ Template 1: feature-columns (image + heading + sub-links â€” used by NEW) â”€â”€
  if (panel.template === "feature-columns") {
    return (
      <div className="w-full px-4 pb-12 pt-9">
        <div
          className="mx-auto grid max-w-[1480px] gap-4"
          style={{ gridTemplateColumns: gridColumns(panel.columns.length, 6) }}
        >
          {panel.columns.map((col, idx) => (
            <div key={`${col.title}-${idx}`} className="group">
              <Link href={col.href} onClick={close} className="block">
                <div
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
                    !col.image && (col.tone ?? "from-[#f5f1e7] to-[#e7eadf]"),
                  )}
                >
                  {col.image ? (
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 310px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="w-28 text-center text-sm uppercase tracking-[0.18em] text-black/35">
                        Niyamah
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-5 text-center text-[15px] font-semibold">
                  <span className={premiumUnderline}>{col.title}</span>
                </p>
              </Link>
              {col.links.length > 0 && (
                <div className="mt-5 space-y-3 text-center text-[15px]">
                  {col.links.map((link) => (
                    <p key={link.href + link.label}>
                      <Link href={link.href} onClick={close}>
                        <span className={cn(premiumUnderline, "text-black/80")}>{link.label}</span>
                      </Link>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // â”€â”€ Template 2: mega-list (column heading + flat link list â€” Women / Men style) â”€â”€
  if (panel.template === "mega-list") {
    return (
      <div className="w-full px-4 pb-12 pt-10">
        <div
          className="mx-auto grid max-w-[1660px] gap-x-14 gap-y-8"
          style={{ gridTemplateColumns: gridColumns(panel.columns.length, 7) }}
        >
          {panel.columns.map((column, idx) => (
            <div key={`${column.title}-${idx}`} className="min-w-0">
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
                    key={link.href + link.label}
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

  // â”€â”€ Template 3: image-tiles (row of square images with label below â€” Art of Living style) â”€â”€
  return (
    <div className="w-full px-4 pb-12 pt-10">
      <div
        className="mx-auto grid max-w-[1480px] gap-6"
        style={{ gridTemplateColumns: gridColumns(panel.tiles.length, 6) }}
      >
        {panel.tiles.map((tile, idx) => (
          <Link key={`${tile.label}-${idx}`} href={tile.href} onClick={close} className="group block">
            <div
              className={cn(
                "relative aspect-square overflow-hidden bg-gradient-to-br",
                !tile.image && (tile.tone ?? "from-[#f5f1e7] to-[#e7eadf]"),
              )}
            >
              {tile.image ? (
                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 1024px) 33vw, 240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm uppercase tracking-[0.18em] text-black/35">Niyamah</span>
                </div>
              )}
            </div>
            <p className="mt-5 text-center text-[15px]">
              <span className={premiumUnderline}>{tile.label}</span>
            </p>
          </Link>
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
        "fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-white text-black transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "flex h-16 items-center justify-between px-4 transition-[opacity,transform] duration-500 md:px-6 lg:px-4",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <span onClick={close}>
          <Logo className="h-11" imageSize={40} />
        </span>
        <button type="button" onClick={close} aria-label="Close search">
          <X className="h-5 w-5 stroke-[1.8]" />
        </button>
      </div>

      <form
        className={cn(
          "relative mx-4 flex items-center after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-black after:transition-transform after:duration-700 after:ease-[cubic-bezier(0.22,1,0.36,1)] md:mx-6 lg:mx-4",
          open ? "after:scale-x-100" : "after:scale-x-0",
        )}
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
          className="h-11 flex-1 rounded-none border-0 bg-transparent text-[15px] outline-none ring-0 placeholder:text-black/55 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
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

      <div
        className={cn(
          "grid gap-6 px-4 py-9 transition-[opacity,transform] delay-100 duration-500 md:grid-cols-[360px_1fr] md:px-6 lg:px-4",
          open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
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
          <SearchProductRail close={close} />
        </section>
      </div>
    </div>
  );
}

function SearchProductRail({ close }: { close: () => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    scrollLeft: 0,
  });

  return (
    <div
      ref={railRef}
      className="flex w-full max-w-full snap-x gap-4 overflow-x-auto pb-20 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] active:cursor-grabbing md:pb-5 [&::-webkit-scrollbar]:hidden"
      onPointerDown={(event) => {
        const rail = railRef.current;
        if (!rail) return;
        dragState.current = {
          active: true,
          moved: false,
          pointerId: event.pointerId,
          startX: event.clientX,
          scrollLeft: rail.scrollLeft,
        };
        rail.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const rail = railRef.current;
        const state = dragState.current;
        if (!rail || !state.active || state.pointerId !== event.pointerId) return;
        const delta = event.clientX - state.startX;
        if (Math.abs(delta) > 3) {
          state.moved = true;
          event.preventDefault();
        }
        rail.scrollLeft = state.scrollLeft - delta;
      }}
      onPointerUp={(event) => {
        const rail = railRef.current;
        const state = dragState.current;
        if (!rail || state.pointerId !== event.pointerId) return;
        dragState.current.active = false;
        rail.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        dragState.current.active = false;
      }}
    >
      {MOST_SEARCHED.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(event) => {
            if (dragState.current.moved) {
              event.preventDefault();
              return;
            }
            close();
          }}
          draggable={false}
          className="group min-w-[220px] snap-start select-none md:min-w-[232px] xl:min-w-[248px]"
        >
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
  );
}

function MobileMenu({
  open,
  close,
  panels,
}: {
  open: boolean;
  close: () => void;
  panels: NavPanel[];
}) {
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const selectedPanel = panels.find((panel) => panel.id === selectedPanelId) ?? null;

  const choosePanel = (panel: NavPanel) => {
    setSelectedPanelId(panel.id);
    setSelectedColumnIndex(null);
  };

  const goBack = () => {
    if (selectedColumnIndex !== null) {
      setSelectedColumnIndex(null);
      return;
    }
    setSelectedPanelId(null);
  };

  const closeAll = () => {
    close();
    setSelectedPanelId(null);
    setSelectedColumnIndex(null);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] bg-white text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
        open ? "translate-x-0" : "-translate-x-full",
      )}
      aria-hidden={!open}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <span onClick={closeAll}>
          <Logo className="h-10" imageSize={38} />
        </span>
        <button type="button" onClick={closeAll} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[calc(100dvh-64px)] overflow-y-auto px-4 py-5">
        {!selectedPanel && (
          <nav>
            {panels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choosePanel(item)}
                className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-xl"
              >
                <span className={premiumUnderline}>{item.label}</span>
                <ChevronRight className="h-5 w-5 stroke-[1.6]" />
              </button>
            ))}
            <div className="mt-16 space-y-5 text-[15px]">
              <Link href="/faq" onClick={closeAll} className="block">
                <span className={premiumUnderline}>Customer Care</span>
              </Link>
              <Link href="/account" onClick={closeAll} className="block">
                <span className={premiumUnderline}>My Account</span>
              </Link>
              <Link href="/account/orders" onClick={closeAll} className="block">
                <span className={premiumUnderline}>Track Order</span>
              </Link>
              <a href="tel:01760982072" onClick={closeAll} className="block">
                <span className={premiumUnderline}>Call: 01760-982072</span>
              </a>
            </div>
          </nav>
        )}

        {selectedPanel && (
          <MobilePanel
            panel={selectedPanel}
            selectedColumnIndex={selectedColumnIndex}
            setSelectedColumnIndex={setSelectedColumnIndex}
            goBack={goBack}
            close={closeAll}
          />
        )}
      </div>
    </div>
  );
}

function MobilePanel({
  panel,
  selectedColumnIndex,
  setSelectedColumnIndex,
  goBack,
  close,
}: {
  panel: NavPanel;
  selectedColumnIndex: number | null;
  setSelectedColumnIndex: (index: number) => void;
  goBack: () => void;
  close: () => void;
}) {
  if (panel.template === "feature-columns") {
    return (
      <div>
        <MobileBack label="Back" onClick={goBack} />
        <div className="mt-8">
          <Link href={panel.href} onClick={close} className="text-base font-semibold">
            <span className={premiumUnderline}>{panel.label}</span>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
          {panel.columns.map((column, index) => (
            <div key={`${column.title}-${index}`}>
              <Link href={column.href} onClick={close} className="block">
                <MobileVisual
                  image={column.image}
                  tone={column.tone}
                  label={column.title}
                  ratio="portrait"
                />
              </Link>
              <Link href={column.href} onClick={close} className="mt-4 block text-sm font-semibold">
                <span className={premiumUnderline}>{column.title}</span>
              </Link>
              <div className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <Link key={link.href + link.label} href={link.href} onClick={close} className="block">
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

  if (panel.template === "image-tiles") {
    return (
      <div>
        <MobileBack label="Back" onClick={goBack} />
        <div className="mt-8">
          <Link href={panel.href} onClick={close} className="text-base font-semibold">
            <span className={premiumUnderline}>{panel.label}</span>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
          {panel.tiles.map((tile, index) => (
            <Link
              key={`${tile.label}-${index}`}
              href={tile.href}
              onClick={close}
              className="block"
            >
              <MobileVisual image={tile.image} tone={tile.tone} label={tile.label} ratio="square" />
              <p className="mt-3 text-sm">
                <span className={premiumUnderline}>{tile.label}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const selectedColumn =
    selectedColumnIndex !== null ? panel.columns[selectedColumnIndex] : null;

  if (selectedColumn) {
    return (
      <div>
        <MobileBack label={panel.label} onClick={goBack} />
        <div className="mt-8">
          <Link href={selectedColumn.href} onClick={close} className="text-base font-semibold">
            <span className={premiumUnderline}>{selectedColumn.title}</span>
          </Link>
        </div>
        <div className="mt-10 space-y-5 text-[15px]">
          <Link href={selectedColumn.href} onClick={close} className="block">
            <span className={premiumUnderline}>View all</span>
          </Link>
          {selectedColumn.links.map((link) => (
            <Link key={link.href + link.label} href={link.href} onClick={close} className="block">
              <span className={premiumUnderline}>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <MobileBack label="Back" onClick={goBack} />
      <div className="mt-8">
        <Link href={panel.href} onClick={close} className="text-base font-semibold">
          <span className={premiumUnderline}>{panel.label}</span>
        </Link>
      </div>
      <div className="mt-10 space-y-5 text-[15px]">
        {panel.columns.map((column, index) => (
          <button
            key={`${column.title}-button-${index}`}
            type="button"
            onClick={() => setSelectedColumnIndex(index)}
            className="flex w-full items-center justify-between text-left text-[15px]"
          >
            <span className={premiumUnderline}>{column.title}</span>
            <ChevronRight className="h-4 w-4 stroke-[1.6]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileBack({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 text-sm">
      <ChevronLeft className="h-4 w-4 stroke-[1.7]" />
      {label}
    </button>
  );
}

function MobileVisual({
  image,
  tone,
  label,
  ratio,
}: {
  image?: string;
  tone?: string;
  label: string;
  ratio: "square" | "portrait";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        ratio === "square" ? "aspect-square" : "aspect-[4/5]",
        !image && (tone ?? "from-[#f5f1e7] to-[#e7eadf]"),
      )}
    >
      {image ? (
        <Image src={image} alt={label} fill sizes="140px" className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center px-3 text-center">
          <span className="text-[10px] uppercase tracking-[0.16em] text-black/35">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
