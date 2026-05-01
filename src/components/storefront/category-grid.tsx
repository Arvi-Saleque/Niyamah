import { cn } from "@/lib/utils";
import { CategoryCard, type CategoryCardData } from "@/components/storefront/category-card";
import { SectionHeader } from "@/components/shared/section-header";

interface CategoryGridProps {
  categories: CategoryCardData[];
  title?: string;
  subtitle?: string;
  columns?: 4 | 5 | 6 | 8;
  className?: string;
}

const colMap = {
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
  8: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8",
};

/** Homepage categories section — grid of CategoryCards. */
export function CategoryGrid({
  categories,
  title,
  subtitle,
  columns = 6,
  className,
}: CategoryGridProps) {
  return (
    <div className={className}>
      {title && <SectionHeader title={title} subtitle={subtitle} align="center" />}
      <div className={cn("grid gap-4", colMap[columns])}>
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
