import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number; // 0–5
  count?: number; // review count
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };

/** Star rating display (read-only). Supports half stars visually via clip. */
export function RatingStars({
  rating,
  count,
  showCount = true,
  size = "md",
  className,
}: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(clamped);
          const partial = !filled && i < clamped;
          return (
            <Star
              key={i}
              className={cn(
                sizeMap[size],
                filled && "fill-[var(--color-accent)] text-[var(--color-accent)]",
                partial && "fill-[var(--color-accent-light)] text-[var(--color-accent)]",
                !filled && !partial && "fill-none text-[var(--color-border)]",
              )}
            />
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className={cn(textMap[size], "text-[var(--color-text-muted)]")}>({count})</span>
      )}
    </div>
  );
}
