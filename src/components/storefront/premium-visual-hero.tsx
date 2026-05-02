"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Heart,
  Home,
  Sparkles,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ProductCardData } from "@/components/storefront/product-card";
import type { CategoryCardData } from "@/components/storefront/category-card";
import type {
  DiscoveryData,
} from "@/modules/storefront/homepage-defaults";
import { cn, formatCurrency } from "@/lib/utils";

interface PremiumVisualHeroProps {
  discovery?: DiscoveryData;
  products: ProductCardData[];
  categories: CategoryCardData[];
  className?: string;
}

const INTENTS: {
  label: string;
  href: string;
  query: string;
  icon: LucideIcon;
}[] = [
  { label: "Quran", href: "/category/quran", query: "quran", icon: Star },
  { label: "Gift Box", href: "/category/gift-box", query: "gift box", icon: Gift },
  { label: "Prayer Mat", href: "/category/prayer-mat", query: "prayer mat", icon: BadgeCheck },
  { label: "Tasbih", href: "/category/tasbih", query: "tasbih", icon: Home },
  { label: "Under Tk 1000", href: "/products?max=1000", query: "under 1000", icon: Wallet },
];

export function PremiumVisualHero({
  products,
  categories,
  className,
}: PremiumVisualHeroProps) {
  const mainProduct = products[0];
  const secondProduct = products[1] ?? products[0];
  const thirdProduct = products[2] ?? products[1] ?? products[0];

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,#FAF7EE_0%,#EFE6D2_55%,#EAF4D5_100%)] pt-10 md:pt-14",
        className,
      )}
    >
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-8">
        <div className="relative z-10 max-w-2xl py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8d9be] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d5b22] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Islamic Essentials
          </div>

          <h1 className="text-5xl font-semibold leading-[0.98] text-[#1c1710] md:text-6xl lg:text-7xl">
            Bring Barakah
            <span className="block text-[#006B3A]">
              Into Daily Life
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#6f604d] md:text-lg">
            Shop authentic Quran, prayer essentials, tasbih, and Islamic gifts
            with Cash on Delivery, fast support, and carefully selected products
            for your home, worship, and loved ones.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/category/quran"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#006B3A] px-6 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#043D25]"
            >
              Shop Quran Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category/gift-box"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#006B3A] bg-white px-6 text-sm font-semibold text-[#006B3A] transition-colors hover:bg-[#EAF4D5]"
            >
              Explore Gift Boxes
            </Link>
          </div>

          <div className="mt-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#687464]">
              I am shopping for
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {INTENTS.map((intent) => {
                const Icon = intent.icon;
                return (
                  <Link
                    key={intent.label}
                    href={intent.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DED6BF] bg-white px-4 py-2 text-sm font-semibold text-[#162018] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#A6D920] hover:text-[#007A3D]"
                  >
                    <Icon className="h-4 w-4" />
                    {intent.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px] lg:min-h-[650px]">
          <div className="absolute left-8 top-8 hidden h-40 w-40 rounded-full border border-[#A0D020]/45 lg:block" />
          <div className="absolute right-5 top-0 h-[78%] w-[68%] overflow-hidden rounded-[36px] bg-[#EFE6D2] shadow-[0_32px_80px_rgba(4,61,37,0.18)]">
            {mainProduct?.image && (
              <Image
                src={mainProduct.image}
                alt={mainProduct.name}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 44vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="absolute bottom-20 left-0 h-[42%] w-[45%] overflow-hidden rounded-[28px] border-[10px] border-[#fbf7ef] bg-white shadow-[0_24px_60px_rgba(75,54,24,0.2)]">
            {secondProduct?.image && (
              <Image
                src={secondProduct.image}
                alt={secondProduct.name}
                fill
                sizes="320px"
                className="object-cover"
              />
            )}
          </div>

          <div className="absolute bottom-6 right-8 w-[300px] max-w-[78vw] rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(40,29,15,0.22)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#f3efe6]">
                {thirdProduct?.image && (
                  <Image
                    src={thirdProduct.image}
                    alt={thirdProduct.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#f3ead9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7d5b22]">
                  <Star className="h-3 w-3 fill-[#c6923a] text-[#c6923a]" />
                  4.8 Customer Favorite
                </div>
                <p className="line-clamp-2 text-sm font-semibold text-[#1c1710]">
                  {thirdProduct?.name ?? "Niyamah signature pick"}
                </p>
                <p className="mt-1 text-sm font-bold text-[#7d5b22]">
                  {thirdProduct ? formatCurrency(thirdProduct.price) : "From Tk 850"}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute left-3 top-16 rounded-2xl border border-[#DED6BF] bg-white px-4 py-3 shadow-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6D7668]">
              Verified Products
            </p>
            <p className="text-lg font-bold text-[#006B3A]">COD Available</p>
          </div>

          <div className="absolute right-0 top-[48%] hidden rounded-2xl bg-[#043D25] px-4 py-3 text-white shadow-xl md:block">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Heart className="h-4 w-4 text-[#A0D020]" />
              WhatsApp Support
            </div>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mx-auto -mt-2 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto rounded-[24px] border border-[#e8d9be] bg-white/84 p-3 shadow-sm backdrop-blur">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group inline-flex min-w-[150px] items-center gap-3 rounded-[18px] px-2 py-2 transition-colors hover:bg-[#f6efe3]"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#f3efe6]">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1c1710]">
                    {category.name}
                  </p>
                  <p className="text-xs text-[#8a765d]">Explore now</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
