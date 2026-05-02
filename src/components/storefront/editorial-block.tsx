import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_DEFAULTS, type EditorialData } from "@/modules/storefront/homepage-defaults";
import type { CategoryCardData } from "@/components/storefront/category-card";

interface EditorialBlockProps {
  className?: string;
  data?: EditorialData;
  images?: CategoryCardData[];
}

/** Brand-story editorial 3-card section — premium magazine-feel storytelling. */
export function EditorialBlock({ className, data, images = [] }: EditorialBlockProps) {
  const d = data ?? HOMEPAGE_DEFAULTS.editorial;
  const imagePool = images.filter((image) => image.image);
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
          const image = imagePool[idx % Math.max(imagePool.length, 1)]?.image;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:p-8"
            >
              {image ? (
                <Image
                  src={image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br", card.gradient)} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/28 to-transparent" />

              <div className="relative text-white">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f2d58a]"
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

              <div className="relative text-white/[0.82]">
                <p className="text-sm leading-relaxed">{card.description}</p>
                <div
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all group-hover:gap-3",
                    isDark ? "bg-white text-[#1c1710]" : "bg-[#c6923a] text-white"
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
