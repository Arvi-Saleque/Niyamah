import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icon-registry";
import type { CategoryCardData } from "@/components/storefront/category-card";

interface ShopByNeedProps {
  className?: string;
  categories?: CategoryCardData[];
}

const WORSHIP_NEEDS = [
  {
    label: "For Quran Recitation",
    href: "/category/quran",
    icon: "book",
    subtitle: "Color-coded Quran, Bengali translation, large-print Quran",
    badge: "Popular",
  },
  {
    label: "For Prayer",
    href: "/category/prayer-mat",
    icon: "sparkles",
    subtitle: "Prayer mats, essentials, and peaceful daily worship items",
  },
  {
    label: "For Dhikr",
    href: "/category/tasbih",
    icon: "heart",
    subtitle: "Tasbih and remembrance essentials for everyday use",
  },
  {
    label: "Islamic Gifts",
    href: "/category/gift-box",
    icon: "gift",
    subtitle: "Meaningful gift boxes for parents, teachers, and family",
    badge: "Gift-ready",
  },
  {
    label: "For Family",
    href: "/products?intent=family",
    icon: "home",
    subtitle: "Useful Islamic products for home and loved ones",
  },
  {
    label: "Under Budget",
    href: "/products?max=1000",
    icon: "tag",
    subtitle: "Affordable picks under Tk 1000 without losing meaning",
    badge: "Value",
  },
] as const;

/** Intent-driven category pills that go beyond the standard product taxonomy. */
export function ShopByNeed({ className, categories = [] }: ShopByNeedProps) {
  const imagePool = categories.filter((category) => category.image);
  return (
    <section className={cn("space-y-7", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            Peaceful Shopping
          </p>
          <h2
            className="text-3xl font-semibold text-[#1c1710] md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shop by Worship Need
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#7a6a55]">
            Find what you need for recitation, prayer, gifting, and daily remembrance.
          </p>
        </div>
      </div>

      <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WORSHIP_NEEDS.map((need, index) => {
          const { label, href, icon, subtitle } = need;
          const badge = "badge" in need ? need.badge : undefined;
          const Icon = getIcon(icon);
          const image = imagePool[index % Math.max(imagePool.length, 1)]?.image;
          const featured = index === 0 || index === 1;
          const wide = index === 1;

          return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative overflow-hidden rounded-[28px] border border-[#e8d9be] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl",
              featured && "sm:row-span-2",
              wide && "lg:col-span-2 lg:row-span-1",
              index === 0 && "border-[#A0D020]/60 bg-[#F7FBEF]",
              index === 3 && "border-[#C9A24A]/60 bg-[#FBF7EE]",
            )}
          >
            {image && (
              <>
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-[0.28] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-white/30" />
              </>
            )}
            {badge && (
              <span
                className={cn(
                  "absolute right-4 top-4 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow",
                  index === 3 ? "bg-[#C9A24A]" : "bg-[#006B3A]"
                )}
              >
                {badge}
              </span>
            )}
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#043D25] text-white shadow-md">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3
                  className={cn(
                    "text-2xl font-semibold leading-tight text-[#1c1710]",
                    featured ? "md:text-3xl" : "md:text-2xl",
                  )}
                >
                  {label}
                </h3>
                <p className="mt-2 max-w-[250px] text-sm leading-5 text-[#6D7668]">
                  {subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#006B3A]">
                  Explore path
                  <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
                </span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
