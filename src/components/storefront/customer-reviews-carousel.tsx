"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Fatima Rahman",
    city: "Dhaka",
    product: "Color-Coded Tajweed Quran",
    rating: 5,
    quote:
      "The color-coding makes tajweed so much easier. Gifted it to my daughter and she hasn't put it down since. Packaging felt like a proper luxury gift.",
  },
  {
    name: "Ahmed Karim",
    city: "Chattogram",
    product: "Premium Velvet Prayer Mat",
    rating: 5,
    quote:
      "Exceptional quality. The velvet is soft, the size is perfect. WhatsApp support helped me pick the right colour and it arrived in two days — really impressed.",
  },
  {
    name: "Nusrat Jahan",
    city: "Sylhet",
    product: "Niyamah Eid Gift Box",
    rating: 5,
    quote:
      "Ordered as an Eid gift for my parents. They were so happy — the box looked premium and everything inside was high quality. Will order every Eid from now on.",
  },
  {
    name: "Md. Hasan",
    city: "Rajshahi",
    product: "Crystal Tasbih — 99 Beads",
    rating: 5,
    quote:
      "Beautiful tasbih. The crystal beads are smooth and the packaging made it feel like a luxury item. My father uses it every single day now.",
  },
  {
    name: "Salma Begum",
    city: "Khulna",
    product: "Oudh & Rose Attar Gift Set",
    rating: 5,
    quote:
      "The fragrance is incredible — long-lasting and authentic. Came with a handwritten note which was a lovely personal touch. Definitely ordering again.",
  },
  {
    name: "Tariq Hossain",
    city: "Cumilla",
    product: "Daily Dua & Hisnul Muslim",
    rating: 5,
    quote:
      "Compact, well-printed, and easy to carry. I keep it in my bag for daily duas. Great price for the quality — nothing like it in local shops.",
  },
];

const DURATION = 4800;

const slideVariants: Variants = {
  enter: (d: number) => ({
    x: d > 0 ? "52%" : "-52%",
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as any,
  },
  exit: (d: number) => ({
    x: d > 0 ? "-52%" : "52%",
    opacity: 0,
    scale: 0.97,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } as any,
  }),
};

export function CustomerReviewsCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  /* Imperative progress bar — no re-renders per frame */
  const runProgress = useCallback(
    (start: number, now: number) => {
      const pct = Math.min(((now - start) / DURATION) * 100, 100);
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
      if (pct < 100) {
        rafRef.current = requestAnimationFrame((t) => runProgress(start, t));
      }
    },
    [],
  );

  const startCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (progressRef.current) progressRef.current.style.width = "0%";

    const t0 = performance.now();
    startTimeRef.current = t0;
    rafRef.current = requestAnimationFrame((t) => runProgress(t0, t));

    timerRef.current = setInterval(() => {
      setDir(1);
      setActive((prev) => (prev + 1) % REVIEWS.length);
      if (progressRef.current) progressRef.current.style.width = "0%";
      const tn = performance.now();
      startTimeRef.current = tn;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame((t) => runProgress(tn, t));
    }, DURATION);
  }, [runProgress]);

  useEffect(() => {
    startCycle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startCycle]);

  const navigate = useCallback(
    (idx: number, d: 1 | -1) => {
      setDir(d);
      setActive(idx);
      startCycle();
    },
    [startCycle],
  );

  const next = () => navigate((active + 1) % REVIEWS.length, 1);
  const prev = () => navigate((active - 1 + REVIEWS.length) % REVIEWS.length, -1);

  const review = REVIEWS[active]!;
  const initials = review.name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("");

  return (
    <div className="relative">
      {/* ── Left arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous review"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/8 p-2 text-[#f5efe0] backdrop-blur-sm transition hover:bg-white/18 sm:p-2.5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* ── Right arrow ── */}
      <button
        onClick={next}
        aria-label="Next review"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/8 p-2 text-[#f5efe0] backdrop-blur-sm transition hover:bg-white/18 sm:p-2.5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Review stage ── */}
      <div className="overflow-hidden px-10 sm:px-16 lg:px-20">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={active}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="mx-auto max-w-2xl text-center"
          >
            {/* Decorative huge quote mark — purely visual */}
            <div
              aria-hidden
              className="select-none font-serif text-[110px] leading-none text-[#c9a24d]/12 sm:text-[150px]"
            >
              ❝
            </div>

            {/* Stars inline */}
            <div className="-mt-4 flex justify-center gap-0.5 sm:-mt-6">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#c9a24d] text-[#c9a24d]" />
              ))}
            </div>

            {/* Quote body */}
            <p className="mt-6 text-lg font-medium leading-8 text-[#f5efe0]/95 sm:text-xl sm:leading-9">
              &ldquo;{review.quote}&rdquo;
            </p>

            {/* Thin gold rule */}
            <div className="mx-auto mt-8 h-px w-14 bg-[#c9a24d]/35" />

            {/* Reviewer card */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Initials avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a24d]/40 bg-[#c9a24d]/15 text-xs font-black text-[#c9a24d]">
                {initials}
              </div>

              <div className="text-left">
                <p className="text-sm font-black text-[#f5efe0]">{review.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-[#c9e8d8]/55">
                  <MapPin className="h-2.5 w-2.5" />
                  {review.city}
                </p>
              </div>

              {/* Product badge */}
              <span className="rounded-full border border-[#c9a24d]/25 bg-[#c9a24d]/10 px-3 py-1 text-[10px] font-black tracking-wide text-[#c9a24d]">
                {review.product.split(" ").slice(0, 3).join(" ")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dots + auto-advance progress ── */}
      <div className="mt-9 flex flex-col items-center gap-3">
        {/* Dot row */}
        <div className="flex items-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              aria-label={`Review ${i + 1}`}
              onClick={() => navigate(i, i >= active ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "h-2 w-7 bg-[#c9a24d]"
                  : "h-2 w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Imperative progress strip */}
        <div className="h-[2px] w-24 overflow-hidden rounded-full bg-white/10">
          <div ref={progressRef} className="h-full w-0 rounded-full bg-[#c9a24d]/65" />
        </div>
      </div>
    </div>
  );
}
