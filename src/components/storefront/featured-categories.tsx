import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/storefront/category-grid";
import type { CategoryCardData } from "@/components/storefront/category-card";

interface FeaturedCategoriesProps {
  categories: CategoryCardData[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "grid" | "rail";
}

/** Homepage featured categories section with grid or compact rail presentation. */
export function FeaturedCategories({
  categories,
  title = "Shop by Category",
  subtitle,
  className,
  variant = "grid",
}: FeaturedCategoriesProps) {
  if (variant === "rail") {
    return (
      <section className={className}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#007A3D]">
              Quick Browse
            </p>
            <h2 className="text-2xl font-semibold text-[#162018] md:text-3xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-[#687464]">{subtitle}</p>}
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-full border border-[#D6DDCF] bg-white px-4 py-2 text-sm font-semibold text-[#007A3D] transition-colors hover:border-[#007A3D] hover:bg-[#EAF6DD]"
          >
            All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[24px] border border-[#D6DDCF] bg-white p-2 shadow-sm">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex min-w-[190px] items-center gap-3 rounded-[18px] p-2 transition-colors hover:bg-[#EAF6DD]"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#EAF6DD]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#007A3D]">
                      N
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#162018] group-hover:text-[#007A3D]">
                    {category.name}
                  </span>
                  <span className="block truncate text-xs text-[#687464]">
                    {category.productCount !== undefined
                      ? `${category.productCount} products`
                      : "Browse category"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <CategoryGrid
      categories={categories}
      title={title}
      subtitle={subtitle}
      columns={6}
      className={className}
    />
  );
}
