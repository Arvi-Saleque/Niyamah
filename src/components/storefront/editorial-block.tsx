import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_DEFAULTS, type EditorialData } from "@/modules/storefront/homepage-content";

interface EditorialBlockProps {
  className?: string;
  data?: EditorialData;
}

/** Brand-story editorial 3-card section — premium magazine-feel storytelling. */
export function EditorialBlock({ className, data }: EditorialBlockProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.editorial;
  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          {d.eyebrow}
        </p>
        <h2
          className="text-2xl font-semibold md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {d.title}
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-[var(--color-text-secondary)]">
          {d.subtitle}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {d.cards.map((card, idx) => {
          const isDark = card.isDark ?? idx === 2;
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
