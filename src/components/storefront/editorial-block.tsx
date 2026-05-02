import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorialCard {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  /** CSS gradient string for background */
  gradient: string;
  /** Optional product/category emoji or short label as decoration */
  decoration?: string;
}

const CARDS: EditorialCard[] = [
  {
    eyebrow: "The Edit",
    title: "Everyday Essentials",
    description:
      "Soft, breathable, made to last. Pieces that earn their place in your wardrobe — every single day.",
    href: "/category/apparel",
    cta: "Shop Essentials",
    gradient: "from-[#f3efe6] via-[#ebe5d6] to-[#e2dccc]",
    decoration: "ESSENTIALS",
  },
  {
    eyebrow: "Wrap & Send",
    title: "Gift Collection",
    description:
      "Thoughtful choices, beautifully packaged. Curated gifts for birthdays, weddings, and every reason in between.",
    href: "/products?intent=gift",
    cta: "Find a Gift",
    gradient: "from-[#e8d5a8] via-[#d4ba85] to-[#b8893d]",
    decoration: "GIFT",
  },
  {
    eyebrow: "Top Shelf",
    title: "Premium Picks",
    description:
      "When good isn&rsquo;t good enough. Our finest craftsmanship, finest fabrics, finest finishes — for moments that matter.",
    href: "/products?premium=1",
    cta: "Explore Premium",
    gradient: "from-[#1a1814] via-[#3a342a] to-[#7d5b22]",
    decoration: "PREMIUM",
  },
];

interface EditorialBlockProps {
  className?: string;
}

/** Brand-story editorial 3-card section — premium magazine-feel storytelling. */
export function EditorialBlock({ className }: EditorialBlockProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          The Niyamah Edit
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Curated Collections
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-[var(--color-text-secondary)]">
          More than products — stories you wear, gifts you give, moments you keep.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {CARDS.map((card, idx) => {
          const isDark = idx === 2;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:p-8"
            >
              {/* Gradient background */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110",
                  card.gradient
                )}
              />
              {/* Decorative typography */}
              <div className="pointer-events-none absolute -bottom-4 -right-4 select-none text-7xl font-black uppercase tracking-tighter text-white/10 md:text-8xl">
                {card.decoration}
              </div>

              <div className={cn("relative", isDark ? "text-white" : "text-[var(--color-text-primary)]")}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.25em]",
                    isDark ? "text-[var(--color-accent-light)]" : "text-[var(--color-accent-dark)]"
                  )}
                >
                  {card.eyebrow}
                </p>
                <h3
                  className="mt-3 text-2xl font-bold leading-tight md:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {card.title}
                </h3>
              </div>

              <div className={cn("relative", isDark ? "text-white/80" : "text-[var(--color-text-secondary)]")}>
                <p className="text-sm leading-relaxed">{card.description}</p>
                <div
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all group-hover:gap-3",
                    isDark
                      ? "bg-white text-[var(--color-text-primary)]"
                      : "bg-[var(--color-text-primary)] text-white"
                  )}
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
