import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guards";
import { reviewRepository } from "@/modules/customer/infrastructure/review.repository";
import { Container } from "@/components/shared/container";
import { RatingStars } from "@/components/shared/rating-stars";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata = { title: "My reviews" };

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/account/reviews");

  const { items } = await reviewRepository.listForUser(user.userId, {
    limit: 50,
  });

  return (
    <Container className="py-8">
      <h1 className="font-heading mb-6 text-2xl font-bold">My reviews</h1>

      {items.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews you write will appear here."
          action={
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-[var(--color-border)] p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <RatingStars rating={r.rating} size="sm" showCount={false} />
                <StatusBadge status={r.status} />
              </div>
              {r.title && <h3 className="mb-1 font-semibold">{r.title}</h3>}
              <p className="text-sm text-[var(--color-text-primary)]">{r.body}</p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Posted {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
