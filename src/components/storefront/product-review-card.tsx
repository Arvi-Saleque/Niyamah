import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ReviewData {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

interface ProductReviewCardProps {
  review: ReviewData;
  className?: string;
}

/** Displays a single customer review with avatar, rating, and body text. */
export function ProductReviewCard({ review, className }: ProductReviewCardProps) {
  const initials = review.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] p-5", className)}>
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={review.authorAvatar} alt={review.authorName} />
          <AvatarFallback className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">{review.authorName}</span>
            {review.verifiedPurchase && (
              <span className="text-xs text-[var(--color-success)]">✓ Verified</span>
            )}
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">
              {new Date(review.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          <RatingStars rating={review.rating} showCount={false} size="sm" className="mt-1" />
          {review.title && <p className="mt-2 font-medium text-sm">{review.title}</p>}
          <p className="mt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {review.body}
          </p>
        </div>
      </div>
    </div>
  );
}
