import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

interface CategoryCardProps {
  category: CategoryCardData;
  className?: string;
  variant?: "image" | "minimal";
}

/** Single category display tile — image + name + optional product count. */
export function CategoryCard({ category, className, variant = "image" }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-accent)] hover:shadow-sm",
        className,
      )}
    >
      {variant === "image" && (
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
          {category.image ? (
            <Image src={category.image} alt={category.name} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">🏷️</div>
          )}
        </div>
      )}
      <p className="text-center text-sm font-medium group-hover:text-[var(--color-accent)]">
        {category.name}
      </p>
      {category.productCount !== undefined && (
        <p className="text-xs text-[var(--color-text-muted)]">{category.productCount} products</p>
      )}
    </Link>
  );
}
