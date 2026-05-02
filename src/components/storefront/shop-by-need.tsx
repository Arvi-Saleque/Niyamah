import Link from "next/link";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icon-registry";
import { HOMEPAGE_DEFAULTS, type NeedsData } from "@/modules/storefront/homepage-content";

interface ShopByNeedProps {
  className?: string;
  data?: NeedsData;
}

/** Intent-driven category pills that go beyond the standard product taxonomy. */
export function ShopByNeed({ className, data }: ShopByNeedProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.needs;
  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {d.eyebrow}
          </p>
          <h2
            className="text-2xl font-semibold md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {d.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {d.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {d.tiles.map(({ label, href, icon, tone, badge }) => {
          const Icon = getIcon(icon);
          return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md",
              tone === "accent" &&
                "border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-accent-light)]/40 to-white hover:border-[var(--color-accent)]",
              tone === "danger" &&
                "border-red-200 bg-gradient-to-br from-red-50 to-white hover:border-red-400",
              (!tone || tone === "default") &&
                "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]"
            )}
          >
            {badge && (
              <span
                className={cn(
                  "absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow",
                  tone === "danger" ? "bg-red-500" : "bg-[var(--color-accent)]"
                )}
              >
                {badge}
              </span>
            )}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                tone === "accent"
                  ? "bg-[var(--color-accent)] text-white"
                  : tone === "danger"
                    ? "bg-red-500 text-white"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-accent)]"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
              {label}
            </span>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
