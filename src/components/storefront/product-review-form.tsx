"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ProductReviewFormProps {
  productId: string;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  className?: string;
}

/** Collects rating, title, and body for a new product review using react-hook-form + Zod. */
export function ProductReviewForm({ productId: _productId, onSubmit, className }: ProductReviewFormProps) {
  const [hovered, setHovered] = useState(0);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", body: "" },
  });

  const selectedRating = useWatch({ control: form.control, name: "rating" });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
        {/* Star rating picker */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHovered(val)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => field.onChange(val)}
                        className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6 transition-colors",
                            val <= (hovered || selectedRating)
                              ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                              : "text-[var(--color-border)]",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Summarize your experience…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share details about your experience with this product…"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
        >
          {form.formState.isSubmitting ? "Submitting…" : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
}
