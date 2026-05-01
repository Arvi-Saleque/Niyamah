"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center" | "right";
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayMs?: number;
  className?: string;
}

/** Full-width hero banner carousel with auto-play, arrow controls, and dot indicators. */
export function HeroSlider({ slides, autoPlayMs = 5000, className }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [next, autoPlayMs, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current]!;
  const alignClass = { left: "items-start text-left", center: "items-center text-center", right: "items-end text-right" }[slide.align ?? "left"];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {/* Image */}
      <div className="relative aspect-[21/9] w-full">
        <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="object-cover" />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className={cn("absolute inset-0 flex flex-col justify-center px-10 py-8 gap-4", alignClass)}>
        <h2 className="font-heading text-3xl font-bold text-white drop-shadow lg:text-5xl">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="max-w-md text-white/80 text-sm lg:text-base">{slide.subtitle}</p>
        )}
        {slide.ctaHref && slide.ctaLabel && (
          <Button asChild className="w-fit bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
            <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
          </Button>
        )}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === current ? "w-5 bg-[var(--color-accent)]" : "w-1.5 bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
