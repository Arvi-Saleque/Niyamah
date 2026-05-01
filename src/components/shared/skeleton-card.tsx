import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  /** Show a horizontal list-view skeleton instead of grid card */
  variant?: "card" | "list";
}

/** Loading placeholder matching the shape of a ProductCard or list row. */
export function SkeletonCard({ className, variant = "card" }: SkeletonCardProps) {
  if (variant === "list") {
    return (
      <div className={cn("flex gap-4 p-3", className)}>
        <Skeleton className="h-24 w-24 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-[var(--color-border)]", className)}>
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}
