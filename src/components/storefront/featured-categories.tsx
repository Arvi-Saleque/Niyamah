import { CategoryGrid } from "@/components/storefront/category-grid";
import type { CategoryCardData } from "@/components/storefront/category-card";

interface FeaturedCategoriesProps {
  categories: CategoryCardData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/** Homepage featured categories section that delegates to CategoryGrid. */
export function FeaturedCategories({
  categories,
  title = "Shop by Category",
  subtitle,
  className,
}: FeaturedCategoriesProps) {
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
