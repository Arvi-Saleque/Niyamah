"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Gift,
  HeartHandshake,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ProductCardData } from "@/components/storefront/product-card";
import type { CategoryCardData } from "@/components/storefront/category-card";
import { SearchDiscoveryPanel } from "@/components/storefront/search-discovery-panel";
import type { DiscoveryData } from "@/modules/storefront/homepage-defaults";
import { cn, formatCurrency } from "@/lib/utils";

interface PremiumVisualHeroProps {
  discovery?: DiscoveryData;
  products: ProductCardData[];
  categories: CategoryCardData[];
  className?: string;
}

const QUICK_PATHS: {
  label: string;
  href: string;
  helper: string;
  icon: LucideIcon;
}[] = [
  { label: "Quran", href: "/category/quran", helper: "Recitation", icon: BookOpen },
  {
    label: "Bengali Quran",
    href: "/category/bengali-quran",
    helper: "Translation",
    icon: BookOpen,
  },
  { label: "Gift Box", href: "/category/gift-box", helper: "Ready gift", icon: Gift },
  { label: "Prayer Mat", href: "/category/prayer-mat", helper: "Salah", icon: BadgeCheck },
  { label: "Tasbih", href: "/category/tasbih", helper: "Dhikr", icon: HeartHandshake },
  { label: "All Products", href: "/products", helper: "Browse all", icon: Search },
];

const TRUST_CHIPS = [
  { label: "COD available", icon: PackageCheck },
  { label: "Verified Islamic products", icon: ShieldCheck },
  { label: "WhatsApp order help", icon: MessageCircle },
] as const;

function findProduct(
  products: ProductCardData[],
  terms: string[],
  fallbackIndex: number,
) {
  const matched = products.find((product) => {
    const haystack = `${product.name} ${product.categoryName ?? ""}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });

  return matched ?? products[fallbackIndex] ?? products[0];
}

function ProductImage({
  product,
  className,
  sizes,
  priority,
}: {
  product?: ProductCardData;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#EAF6DD]", className)}>
      {product?.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-[#007A3D]">
          Niyamah Islamic Essentials
        </div>
      )}
    </div>
  );
}

export function PremiumVisualHero({
  discovery,
  products,
  categories,
  className,
}: PremiumVisualHeroProps) {
  const quranProduct = findProduct(products, ["quran", "koran"], 0);
  const giftProduct = findProduct(products, ["gift", "box"], 1);
  const prayerProduct = findProduct(products, ["prayer", "mat", "jainamaz", "jaynamaz"], 2);
  const tasbihProduct = findProduct(products, ["tasbih", "dhikr"], 3);

  const featuredProduct = quranProduct ?? products[0];
  const helperCategories = categories.slice(0, 3);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,#FAF7EE_0%,#F0F5EA_58%,#EAF6DD_100%)]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_18%_0%,rgba(0,122,61,0.12),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 md:pb-8 md:pt-12 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D6DDCF] bg-white/82 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#007A3D] shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted Islamic Shop
            </div>

            <h1 className="text-4xl font-semibold leading-[1.04] text-[#162018] sm:text-5xl lg:text-6xl">
              Quran, Prayer &amp;
              <span className="block text-[#007A3D]">Meaningful Gifts</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#687464] md:text-lg">
              Assalamu Alaikum. Shop Quran, Bengali Quran, tasbih, prayer mats,
              and gift boxes with simple ordering, COD, and fast support in
              Bangladesh.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/category/quran"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#007A3D] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,122,61,0.22)] transition-colors hover:bg-[#043D25]"
              >
                Shop Quran Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/category/gift-box"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#007A3D] bg-white px-6 text-sm font-semibold text-[#007A3D] transition-colors hover:bg-[#EAF6DD]"
              >
                Explore Gift Boxes
              </Link>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {TRUST_CHIPS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-[#D6DDCF] bg-white/72 px-3 py-2 text-xs font-semibold text-[#162018] shadow-sm backdrop-blur"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6DD] text-[#007A3D]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {discovery && (
              <div id="discover" className="mt-6">
                <SearchDiscoveryPanel data={discovery} variant="hero" />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="group relative overflow-hidden rounded-[34px] border border-[#D6DDCF] bg-white/74 p-3 shadow-[0_28px_70px_rgba(4,61,37,0.14)] backdrop-blur">
              <div className="grid gap-3 md:grid-cols-[1.05fr,0.95fr]">
                <Link
                  href={featuredProduct ? `/products/${featuredProduct.slug}` : "/products"}
                  className="group/card relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#EAF6DD]"
                >
                  <ProductImage
                    product={featuredProduct}
                    sizes="(max-width: 1024px) 90vw, 34vw"
                    priority
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#043D25]/88 via-[#043D25]/30 to-transparent p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#BFE8C6]">
                      Start with Quran
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-2xl font-semibold leading-tight">
                      {featuredProduct?.name ?? "Premium Quran Collection"}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {featuredProduct ? formatCurrency(featuredProduct.price) : "COD available"}
                    </p>
                  </div>
                </Link>

                <div className="grid gap-3">
                  {[
                    { label: "Gift-ready", product: giftProduct, href: "/category/gift-box" },
                    { label: "Prayer essentials", product: prayerProduct, href: "/category/prayer-mat" },
                    { label: "Dhikr picks", product: tasbihProduct, href: "/category/tasbih" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.product ? `/products/${item.product.slug}` : item.href}
                      className="group/card grid min-h-[128px] grid-cols-[92px,1fr] overflow-hidden rounded-[22px] border border-[#D6DDCF] bg-white p-2 transition-all hover:border-[#007A3D] hover:shadow-md"
                    >
                      <ProductImage
                        product={item.product}
                        sizes="120px"
                        className="h-full min-h-[112px] rounded-[18px]"
                      />
                      <div className="flex min-w-0 flex-col justify-center px-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#007A3D]">
                          {item.label}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#162018]">
                          {item.product?.name ?? "Browse collection"}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#687464]">
                          {item.product ? formatCurrency(item.product.price) : "Explore now"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {helperCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-2 rounded-2xl border border-[#D6DDCF] bg-white/76 p-2 text-sm font-semibold text-[#162018] shadow-sm transition-colors hover:border-[#007A3D] hover:text-[#007A3D]"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#EAF6DD]">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="truncate">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[#D6DDCF] bg-white/80 p-2 shadow-sm backdrop-blur">
          <div className="flex gap-2 overflow-x-auto">
            {QUICK_PATHS.map(({ label, href, helper, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex min-w-[154px] items-center gap-3 rounded-[18px] px-3 py-2 transition-colors hover:bg-[#EAF6DD]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6DD] text-[#007A3D] transition-colors group-hover:bg-[#007A3D] group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#162018]">
                    {label}
                  </span>
                  <span className="block truncate text-xs text-[#687464]">{helper}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
