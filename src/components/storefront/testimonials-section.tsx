import { Star } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  body: string;
  location?: string;
  purchasedItem?: string;
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
    <section className={cn("grid gap-6 lg:grid-cols-[320px,1fr]", className)}>
      <div className="rounded-[28px] bg-[#043D25] p-6 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#BFE8C6]">
          Customer Love
        </p>
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
        <div className="mt-8">
          <div className="flex items-end gap-2">
            <span className="text-6xl font-semibold leading-none">4.8</span>
            <span className="pb-2 text-sm text-white/65">/ 5</span>
          </div>
          <div className="mt-3 flex gap-1 text-[#BFE8C6]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">
            Trusted by customers across Bangladesh. Verified reviews from real Quran, gift box, and prayer essential orders.
          </p>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-xs text-white/65">
            <p>✓ Verified reviews from real orders</p>
            <p>✓ COD supported across Bangladesh</p>
            <p>✓ 2,000+ happy customers</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => {
          const initials = t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div key={t.id} className="space-y-4 rounded-[24px] border border-[#D6DDCF] bg-white p-5 shadow-sm">
              <RatingStars rating={t.rating} showCount={false} size="sm" />
              <p className="text-sm leading-6 text-[#162018]">&ldquo;{t.body}&rdquo;</p>
              <div className="flex items-center gap-2 pt-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-[#162018]">{t.name}</p>
                  {t.location && (
                    <p className="text-xs text-[#687464]">
                      Verified buyer &middot; {t.location}
                    </p>
                  )}
                  {t.purchasedItem && (
                    <p className="text-[10px] text-[#687464]">Purchased: {t.purchasedItem}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
