import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  body: string;
  location?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  className?: string;
}

/** Homepage testimonials/reviews grid. */
export function TestimonialsSection({
  testimonials,
  title = "What Our Customers Say",
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("space-y-8", className)}>
      <SectionHeader title={title} align="center" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => {
          const initials = t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div key={t.id} className="rounded-xl border border-[var(--color-border)] p-5 space-y-3">
              <RatingStars rating={t.rating} showCount={false} size="sm" />
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">&ldquo;{t.body}&rdquo;</p>
              <div className="flex items-center gap-2 pt-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  {t.location && <p className="text-xs text-[var(--color-text-muted)]">{t.location}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
