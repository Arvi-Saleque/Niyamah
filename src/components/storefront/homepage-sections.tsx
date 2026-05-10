import Link from "next/link";
import { CustomerReviewsCarousel } from "@/components/storefront/customer-reviews-carousel";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { PriceText } from "@/components/shared/price-text";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { ProductCardData } from "@/components/storefront/product-card";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gift,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";

const sectionShell = "mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8";

/* -------------------------------------------------------------------------- */
/*                          Why Trust Us Section                              */
/* -------------------------------------------------------------------------- */

export function WhyTrustUsSection() {
  const pillars = [
    {
      num: "01",
      icon: ShieldCheck,
      title: "100% Authentic Products",
      body: "Every item is sourced directly from trusted manufacturers and verified suppliers. No middlemen, no counterfeits — just genuine quality you can feel.",
      stat: "100%",
      statLabel: "Authentic",
    },
    {
      num: "02",
      icon: Truck,
      title: "Fast Delivery Across Bangladesh",
      body: "Same-day dispatch on weekdays. Cash on Delivery available nationwide so you never have to pre-pay before you trust us.",
      stat: "1–3",
      statLabel: "Day Delivery",
    },
    {
      num: "03",
      icon: Star,
      title: "Loved by 10,000+ Customers",
      body: "Thousands of families have chosen Niyamah for Quran gifts, prayer essentials, and everyday Islamic living. Real reviews, real people.",
      stat: "10K+",
      statLabel: "Happy Buyers",
    },
    {
      num: "04",
      icon: RotateCcw,
      title: "7-Day Hassle-Free Return",
      body: "Not satisfied? Return within 7 days with zero questions asked. We stand behind every product we ship.",
      stat: "7-Day",
      statLabel: "Free Return",
    },
    {
      num: "05",
      icon: MessageCircle,
      title: "WhatsApp Support — Always Human",
      body: "No chatbots. Our team is available on WhatsApp to help you choose the right product, confirm stock, or resolve any order issue.",
      stat: "24 / 7",
      statLabel: "Live Support",
    },
    {
      num: "06",
      icon: Zap,
      title: "Curated for Meaningful Living",
      body: "We don't list thousands of generic products. Every item on Niyamah is handpicked for worship, gifting, and everyday Islamic purpose.",
      stat: "Hand",
      statLabel: "Curated",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b2a1d] py-16 text-[#fff8e8] sm:py-20 lg:py-24">
      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(217,184,108,1)_1px,transparent_1px),linear-gradient(90deg,rgba(217,184,108,1)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Radial glow top-right */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#d9b86c]/14 blur-3xl" />
      {/* Radial glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1e6b47]/45 blur-3xl" />

      <div className={sectionShell}>
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d9b86c]/55 bg-[#d9b86c]/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#f0c96a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f0c96a]" />
              Why Choose Niyamah
            </span>
            <h2
              className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
              style={{ color: "#fff8e8" }}
            >
              Trusted by Thousands{" "}
              <em className="not-italic" style={{ color: "#f0c96a" }}>
                Every Day
              </em>
            </h2>
            <p className="mt-4 max-w-lg text-base font-medium leading-7 text-[#d7f2e3] sm:text-lg">
              We built Niyamah on one principle — if it is not something we would gift our own family, we do not sell it.
            </p>
          </div>
          {/* Big trust number */}
          <div className="hidden shrink-0 flex-col items-end text-right lg:flex">
            <span className="select-none font-mono text-7xl font-black leading-none text-[#fff8e8]/20">10K</span>
            <span className="-mt-2 text-sm font-bold uppercase tracking-widest text-[#f0c96a]">Orders Delivered</span>
          </div>
        </div>

        {/* Pillar list — alternating ledger rows */}
        <div className="divide-y divide-[#fff8e8]/15">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className="group flex flex-col gap-5 py-8 transition-colors duration-300 hover:bg-[#fff8e8]/[0.055] sm:flex-row sm:items-center sm:gap-10 sm:px-4"
              >
                {/* Number */}
                <span className="font-mono text-sm font-black text-[#f0c96a]/85 sm:w-10 sm:shrink-0">
                  {p.num}
                </span>

                {/* Icon circle */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#f0c96a]/55 bg-[#f0c96a]/14 text-[#f0c96a] transition-colors duration-300 group-hover:bg-[#f0c96a]/24">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3
                    className="text-lg font-black sm:text-xl"
                    style={{ color: "#fff8e8" }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-base font-medium leading-7 text-[#d7f2e3]">
                    {p.body}
                  </p>
                </div>

                {/* Right stat */}
                <div className="hidden shrink-0 flex-col items-end text-right sm:flex">
                  <span className="font-mono text-3xl font-black text-[#f0c96a]">
                    {p.stat}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d7f2e3]">
                    {p.statLabel}
                  </span>
                </div>

                {/* Connector dot (desktop only) */}
                <div
                  className={`hidden h-2 w-2 shrink-0 rounded-full sm:block ${
                    i % 2 === 0 ? "bg-[#f0c96a]" : "bg-[#5ac284]"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#d9b86c]/55 bg-[#fff8e8]/[0.08] px-6 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] sm:flex-row sm:px-8">
          <p className="text-base font-semibold text-[#fff8e8]">
            Still have questions? We are one message away.
          </p>
          <a
            href="https://wa.me/8801760982072"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#f0c96a] px-6 py-2.5 text-sm font-black text-[#0b2a1d] shadow-md transition hover:bg-[#ffd777] hover:shadow-lg"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                     Sticky Full-Screen Image Break                        */
/* -------------------------------------------------------------------------- */

/**
 * Full-screen image break with a completely fixed background.
 * The image never moves — the next section slides over it as you scroll.
 * Uses background-attachment:fixed (the same technique as parallax hero sections).
 */
export function StickyImageBreak({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="h-screen w-full"
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                     Parallax Quote / Refreshment Break                    */
/* -------------------------------------------------------------------------- */

const QUOTES = [
  {
    icon: "✦",
    quote: "The best gift you can give is one that carries meaning long after the moment has passed.",
    author: "On Gifting with Purpose",
  },
  {
    icon: "◈",
    quote: "A home filled with good books, prayer, and intention is a home filled with light.",
    author: "On Everyday Living",
  },
  {
    icon: "✦",
    quote: "Quality is never an accident. It is always the result of intention, sincere effort, and care.",
    author: "On What We Curate",
  },
];

export function ParallaxQuoteSection() {
  return (
    <div
      className="relative py-24 sm:py-32 lg:py-40"
      style={{
        backgroundImage: "url('/images/fixed_bg/bg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0c2d1e]/82" />

      {/* Gold rule top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24d]/60 to-transparent" />
      {/* Gold rule bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a24d]/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <p className="mb-12 text-center text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a24d]">
          Why Niyamah
        </p>

        {/* Quote cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-10 text-center backdrop-blur-sm"
            >
              {/* Decorative icon */}
              <span className="text-2xl text-[#c9a24d]">{q.icon}</span>

              {/* Gold divider */}
              <div className="h-px w-10 bg-[#c9a24d]/60" />

              {/* Quote */}
              <p className="text-base font-medium italic leading-8 text-[#f5efe0] sm:text-lg">
                &ldquo;{q.quote}&rdquo;
              </p>

              {/* Attribution */}
              <p className="text-[11px] font-black uppercase tracking-widest text-[#c9a24d]/75">
                — {q.author}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p className="mt-16 text-center text-sm font-medium leading-8 text-[#c9e8d8] sm:text-base">
          Every product at Niyamah is chosen with care —<br className="hidden sm:block" />
          to bring meaning into your home, your worship, and your gifts.
        </p>

      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        Top Categories Section                              */
/* -------------------------------------------------------------------------- */

export function TopCategoriesSection() {
  const categories = [
    {
      label: "Quran & Books",
      eyebrow: "Most Gifted",
      copy: "Color-coded Tajweed Quran, Bengali translation editions, Dua books, and Islamic learning for every age.",
      href: "/category/quran",
      count: "40+ Products",
      accentBg: "#1a3d2b",
      accentText: "#c9a24d",
      borderColor: "#2a5c3f",
      emoji: "📖",
      tags: ["Tajweed Quran", "Gift Edition", "Dua Books"],
    },
    {
      label: "Prayer Essentials",
      eyebrow: "Top Seller",
      copy: "Handwoven prayer mats, crystal tasbih, prayer caps, and everything for a beautiful salah corner.",
      href: "/category/prayer-mat",
      count: "30+ Products",
      accentBg: "#2d1a0e",
      accentText: "#f59e0b",
      borderColor: "#5c3a1a",
      emoji: "🕌",
      tags: ["Prayer Mat", "Tasbih", "Prayer Cap"],
    },
    {
      label: "Gift Boxes & Sets",
      eyebrow: "Perfect Gift",
      copy: "Ready-to-gift Islamic sets for Eid, weddings, new babies, and every meaningful occasion.",
      href: "/category/gift-box",
      count: "20+ Products",
      accentBg: "#1a1a3d",
      accentText: "#a78bfa",
      borderColor: "#3d3a6e",
      emoji: "🎁",
      tags: ["Eid Gift", "Wedding Gift", "New Baby"],
    },
    {
      label: "Attar & Fragrance",
      eyebrow: "Premium Pick",
      copy: "Pure Oudh, rose, musk, and exclusive Niyamah blends in elegant gift-ready packaging.",
      href: "/category/attar",
      count: "15+ Products",
      accentBg: "#3d1a1a",
      accentText: "#fb923c",
      borderColor: "#6e3a2a",
      emoji: "🌹",
      tags: ["Oudh", "Rose Attar", "Gift Set"],
    },
    {
      label: "Islamic Décor",
      eyebrow: "Home & Heart",
      copy: "Calligraphy frames, wall art, Ayatul Kursi prints, and pieces that bring barakah into any space.",
      href: "/category/decor",
      count: "25+ Products",
      accentBg: "#0e2233",
      accentText: "#38bdf8",
      borderColor: "#1a4060",
      emoji: "🖼️",
      tags: ["Wall Art", "Calligraphy", "Ayatul Kursi"],
    },
    {
      label: "Kids & Learning",
      eyebrow: "For Young Minds",
      copy: "Fun Quran learning kits, activity books, and Islamic story books for curious young readers.",
      href: "/category/books",
      count: "18+ Products",
      accentBg: "#1a3320",
      accentText: "#4ade80",
      borderColor: "#2a5c36",
      emoji: "🌙",
      tags: ["Learning Kit", "Activity Book", "Stories"],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8f1e3] py-16 sm:py-20 lg:py-24">
      {/* Subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle,#c9a24d_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className={sectionShell + " relative"}>
        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24d]/50 bg-[#123d2a] px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#c9a24d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a24d]" />
              Browse by Category
            </span>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#123d2a] sm:text-5xl">
              Find What You&apos;re{" "}
              <em className="not-italic text-[#c9a24d]">Looking For</em>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#52675b] sm:text-lg">
              Six handpicked categories covering every Islamic essential — from
              daily worship to meaningful gifting.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#123d2a] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#123d2a] transition hover:bg-[#123d2a] hover:text-[#f8f1e3]"
          >
            All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-[0_8px_40px_rgba(18,61,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,61,42,0.15)]"
              style={{ borderColor: cat.borderColor + "55" }}
            >
              {/* Coloured top bar */}
              <div
                className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                style={{
                  background: `linear-gradient(90deg, ${cat.accentText}, ${cat.accentBg})`,
                }}
              />

              <div className="flex flex-1 flex-col p-6">
                {/* Top row: emoji + eyebrow badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl shadow-sm"
                    style={{ background: cat.accentBg }}
                  >
                    {cat.emoji}
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                    style={{
                      background: cat.accentBg,
                      color: cat.accentText,
                    }}
                  >
                    {cat.eyebrow}
                  </span>
                </div>

                {/* Title + copy */}
                <h3 className="mt-5 text-2xl font-black leading-tight text-[#123d2a] transition-colors duration-300 group-hover:text-[#0a2a1c]">
                  {cat.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#52675b]">
                  {cat.copy}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold text-[#52675b]"
                      style={{ borderColor: cat.borderColor + "55" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer: count + CTA */}
                <div className="mt-5 flex items-center justify-between border-t pt-4"
                  style={{ borderColor: cat.borderColor + "33" }}
                >
                  <span className="text-xs font-bold text-[#52675b]">
                    {cat.count}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: cat.accentText === "#c9a24d" ? "#8a6422" : cat.accentText }}
                  >
                    Shop Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom banner — full-width CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl bg-[#123d2a] px-6 py-6 sm:flex-row sm:px-10">
          <div>
            <p className="text-lg font-black text-[#f5efe0]">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <p className="mt-1 text-sm text-[#c9e8d8]/80">
              Chat with us on WhatsApp — we&apos;ll help you pick the right product.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <a
              href="https://wa.me/8801760982072"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a24d] px-6 py-3 text-sm font-black text-[#123d2a] transition hover:bg-[#d4b05a]"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a24d]/40 px-6 py-3 text-sm font-black text-[#f5efe0] transition hover:border-[#c9a24d] hover:bg-white/10"
            >
              All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustPromiseStrip() {
  const promises = [
    { label: "COD Available", icon: ShieldCheck },
    { label: "1-3 Day Delivery", icon: Truck },
    { label: "Gift Packaging", icon: Gift },
    { label: "7-Day Return", icon: RotateCcw },
    { label: "WhatsApp Support", icon: MessageCircle },
  ];

  return (
    <section className="border-y border-[#d9c38b]/45 bg-[#fbf6e9]">
      <div className={sectionShell}>
        <div className="grid divide-y divide-[#d9c38b]/45 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          {promises.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex min-h-20 items-center justify-center gap-3 px-3 py-4 text-center"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9a24d]/45 bg-white text-[#123d2a] shadow-[0_10px_28px_rgba(18,61,42,0.08)]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#123d2a]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomepageSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c9a24d]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-black leading-tight text-[#123d2a] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-6 text-[#52675b] sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function TextCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#123d2a] underline decoration-[#c9a24d] decoration-2 underline-offset-4"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export const purposeIcons = {
  book: BookOpen,
  gift: Gift,
  heart: HeartHandshake,
  package: PackageCheck,
  check: CheckCircle2,
};

export function ShopByPurposeSection() {
  const purposes = [
    {
      title: "For Daily Recitation",
      copy: "Color-coded Quran and reading companions for a calmer everyday routine.",
      href: "/category/quran",
      icon: BookOpen,
    },
    {
      title: "For Parents",
      copy: "Thoughtful Quran, tasbih, and gift-ready essentials selected with care.",
      href: "/products?intent=parents",
      icon: HeartHandshake,
    },
    {
      title: "For Prayer Room",
      copy: "Prayer mats, tasbih, and room essentials for a peaceful worship corner.",
      href: "/category/prayer-mat",
      icon: PackageCheck,
    },
    {
      title: "For Islamic Gift",
      copy: "Beautifully packed sets for teachers, friends, family, and loved ones.",
      href: "/category/gift-box",
      icon: Gift,
    },
    {
      title: "For Kids Learning",
      copy: "Easy learning books and Quran resources for young curious readers.",
      href: "/category/books",
      icon: BookOpen,
    },
    {
      title: "For Ramadan / Eid",
      copy: "Premium seasonal gifts and worship essentials for meaningful occasions.",
      href: "/products?occasion=ramadan-eid",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="bg-[#f8f1e3] py-16 sm:py-20">
      <div className={sectionShell}>
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <HomepageSectionHeader
            eyebrow="Shop with intention"
            title="Shop by Purpose"
            subtitle="Choose the reason behind the purchase first, then discover the products that match the moment."
          />
          <TextCta href="/products">Browse all products</TextCta>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {purposes.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group min-h-56 border border-[#d9c38b]/45 bg-white/58 p-5 shadow-[0_18px_50px_rgba(18,61,42,0.06)] transition-all hover:-translate-y-1 hover:border-[#c9a24d] hover:bg-white"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#123d2a] text-[#f8f1e3] transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 text-2xl font-black leading-tight text-[#123d2a]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#52675b]">
                  {item.copy}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#8a6422]">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCollectionsSection() {
  const collections = [
    {
      title: "Color Coded Quran",
      label: "Premium Quran",
      copy: "Easy recitation support, premium print, and gift-ready editions.",
      href: "/category/quran",
      image: "/images/hero/hero-quran.png",
    },
    {
      title: "Gift Boxes",
      label: "Meaningful Gifts",
      copy: "Curated Quran, tasbih, prayer essentials, and thoughtful packaging.",
      href: "/category/gift-box",
      image: "/images/hero/hero-gift-box.png",
    },
    {
      title: "Prayer Essentials",
      label: "Daily Worship",
      copy: "Prayer mats, tasbih, and essentials for home and travel worship.",
      href: "/category/prayer-mat",
      image: "/images/hero/hero-prayer-mat.png",
    },
    {
      title: "Islamic Books",
      label: "Learn & Reflect",
      copy: "Dua books, learning guides, and thoughtful reads for every home.",
      href: "/category/books",
      image: "/images/hero/hero-quran.png",
    },
  ];

  return (
    <section className="bg-[#fffaf0] py-16 sm:py-20">
      <div className={sectionShell}>
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <HomepageSectionHeader
            eyebrow="Collection gateway"
            title="Featured Collections"
            subtitle="Four clear paths into the store, designed for quick discovery without marketplace clutter."
          />
          <TextCta href="/products">Shop all collections</TextCta>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative min-h-[360px] overflow-hidden bg-[#123d2a] shadow-[0_24px_70px_rgba(18,61,42,0.15)]"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-10 opacity-74 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(18,61,42,0.94),rgba(18,61,42,0.62)_48%,rgba(18,61,42,0.2))]" />
              <div className="relative z-10 flex min-h-[360px] max-w-md flex-col justify-end p-6 text-[#f8f1e3] sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9b86c]">
                  {item.label}
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#f8f1e3]/75">
                  {item.copy}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#d9b86c]">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestSellersRailSection({ products }: { products: ProductCardData[] }) {
  const items = products.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#f8f1e3] py-16 sm:py-20">
      <div className={sectionShell}>
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <HomepageSectionHeader
            eyebrow="Customer proof"
            title="Most Loved by Customers"
            subtitle="Bestselling picks with simple social proof for buyers who want a trusted place to start."
          />
          <TextCta href="/products?sort=popular">View best sellers</TextCta>
        </div>

        <div className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((product, index) => (
            <article
              key={product.id}
              className="group relative min-w-[265px] snap-start border border-[#d9c38b]/45 bg-white shadow-[0_18px_52px_rgba(18,61,42,0.08)] sm:min-w-[320px]"
            >
              <div className="absolute left-4 top-4 z-20 bg-[#123d2a] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                #{index + 1}
              </div>
              <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-[#efe6d2]">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="320px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="bg-[#fbf6e9] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#8a6422]">
                    {index % 2 === 0 ? "Popular Gift" : "Daily Use"}
                  </span>
                  {product.reviewCount ? (
                    <span className="text-xs font-semibold text-[#52675b]">
                      {product.reviewCount} reviews
                    </span>
                  ) : null}
                </div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-tight text-[#123d2a]">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-[#52675b]">
                  Trusted pick for meaningful Islamic shopping.
                </p>
                <div className="mt-4">
                  <PriceText price={product.price} originalPrice={product.originalPrice} size="md" />
                </div>
                <div className="mt-4 flex gap-2">
                  <AddToCartButton
                    productId={product.id}
                    variantId={product.variantId}
                    name={product.name}
                    slug={product.slug}
                    image={product.image}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    inStock={product.inStock ?? true}
                    size="sm"
                    className="flex-1 rounded-none bg-[#123d2a] text-white hover:bg-[#0b2d1e]"
                    fullWidth
                  />
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex h-10 items-center justify-center border border-[#123d2a]/25 px-3 text-xs font-black uppercase tracking-[0.12em] text-[#123d2a]"
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GiftBoxStorySection() {
  const checks = [
    "Gift-ready packaging",
    "Custom note option",
    "Premium product selection",
    "Nationwide delivery",
  ];

  return (
    <section className="bg-[#123d2a] py-16 text-[#f8f1e3] sm:py-20">
      <div className={sectionShell}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden bg-[#0b2d1e]">
            <ImageWithFallback
              src="/images/hero/hero-gift-box.png"
              alt="Niyamah gift box"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10 drop-shadow-[0_35px_70px_rgba(0,0,0,0.35)]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(217,184,108,0.22),transparent_42%)]" />
          </div>
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9b86c]">
              Premium gift story
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              A Gift That Carries Barakah
            </h2>
            <p className="mt-5 text-base leading-7 text-[#f8f1e3]/75">
              Beautifully packed Quran, tasbih, prayer mat, and Islamic essentials,
              ready to gift to parents, teachers, and loved ones.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {checks.map((item) => (
                <div key={item} className="flex items-center gap-3 border border-white/12 bg-white/6 p-3">
                  <CheckCircle2 className="h-5 w-5 text-[#d9b86c]" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/category/gift-box"
              className="mt-8 inline-flex h-12 items-center justify-center bg-[#d9b86c] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#123d2a]"
            >
              Build a Gift Box
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsHomepageSection({ products }: { products: ProductCardData[] }) {
  const items = products.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#fffaf0] py-16 sm:py-20">
      <div className={sectionShell}>
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <HomepageSectionHeader
            eyebrow="Freshly added"
            title="Freshly Added to Niyamah"
            subtitle="New products kept in a clean shopping grid for quick browsing."
          />
          <TextCta href="/products?sort=new">See all new arrivals</TextCta>
        </div>
        <ProductGrid products={items} columns={3} />
      </div>
    </section>
  );
}

export function CategoryDeepDiveSection() {
  const banners = [
    {
      title: "Quran Collection",
      copy: "Color-coded, Bengali translation, premium print, and gift editions.",
      href: "/category/quran",
      image: "/images/hero/hero-quran.png",
    },
    {
      title: "Prayer Collection",
      copy: "Prayer mats, tasbih, and worship essentials for everyday salah.",
      href: "/category/prayer-mat",
      image: "/images/hero/hero-prayer-mat.png",
    },
    {
      title: "Books Collection",
      copy: "Dua books, learning guides, and Islamic reading for every home.",
      href: "/category/books",
      image: "/images/hero/hero-quran.png",
    },
  ];

  return (
    <section className="bg-[#f8f1e3] py-16 sm:py-20">
      <div className={sectionShell}>
        <HomepageSectionHeader
          eyebrow="Browse deeper"
          title="Explore the Main Collections"
          subtitle="Wide category banners for shoppers who want to understand the store before choosing a product."
        />
        <div className="mt-9 grid gap-4">
          {banners.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group grid min-h-[220px] overflow-hidden border border-[#d9c38b]/45 bg-white shadow-[0_18px_60px_rgba(18,61,42,0.07)] md:grid-cols-[1fr,260px]"
            >
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c9a24d]">
                  Collection
                </p>
                <h3 className="mt-3 text-3xl font-black text-[#123d2a]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#52675b]">
                  {item.copy}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#123d2a]">
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="relative min-h-[180px] bg-[#efe6d2]">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="260px"
                  className="object-contain p-6 transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*          Small Break 1 — Shop by Occasion (between BestSellers & Trending) */
/* -------------------------------------------------------------------------- */

const OCCASIONS = [
  { label: "As a Gift",       href: "/products?occasion=gift",    emoji: "🎁" },
  { label: "Daily Worship",   href: "/products?occasion=worship", emoji: "🕌" },
  { label: "For Kids",        href: "/products?occasion=kids",    emoji: "👦" },
  { label: "For Her",         href: "/products?occasion=her",     emoji: "🌸" },
  { label: "Ramadan",         href: "/products?occasion=ramadan", emoji: "🌙" },
  { label: "Home Decor",      href: "/products?occasion=decor",   emoji: "🏡" },
  { label: "Books & Learning",href: "/products?occasion=books",   emoji: "📖" },
  { label: "Fragrance",       href: "/products?occasion=attar",   emoji: "✨" },
];

export function ShopByOccasionStrip() {
  return (
    <div className="bg-[#f8f1e3] py-7 sm:py-8">
      <div className={sectionShell}>
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#52675b]">
          Shop by Occasion
        </p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a24d]/35 bg-white px-4 py-2 text-xs font-black text-[#123d2a] transition hover:border-[#c9a24d] hover:bg-[#fdf5e6] hover:shadow-sm"
            >
              <span>{o.emoji}</span>
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*       Small Break 2 — Delivery Promise (between Trending & New Arrivals)   */
/* -------------------------------------------------------------------------- */

export function DeliveryPromiseStrip() {
  const promises = [
    { icon: Truck,        stat: "1–3 Days",   label: "Delivery" },
    { icon: PackageCheck, stat: "COD",         label: "Cash on Delivery" },
    { icon: RotateCcw,    stat: "7 Days",      label: "Free Returns" },
    { icon: ShieldCheck,  stat: "100%",        label: "Authentic Products" },
  ];

  return (
    <div className="bg-[#0c2d1e] py-6 sm:py-7">
      <div className={sectionShell}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {promises.map(({ icon: Icon, stat, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#c9a24d]/15">
                <Icon className="h-4 w-4 text-[#c9a24d]" />
              </div>
              <div>
                <p className="text-sm font-black text-[#f5efe0]">{stat}</p>
                <p className="text-[11px] text-[#c9e8d8]/70">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*              Customer Reviews — full premium redesign                      */
/* -------------------------------------------------------------------------- */

export function CustomerReviewsSection() {
  return (
    <section className="bg-[#0c2d1e] py-16 sm:py-20 lg:py-24">
      <div className={sectionShell}>

        {/* ── Header ── */}
        <div className="mb-14 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c9a24d]">
            Real Customers · Verified Orders · No Incentives
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-[#f5efe0] sm:text-5xl">
            Words We Didn&rsquo;t Write
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#c9e8d8]/70">
            Every review below comes from a real purchase across Bangladesh —
            unedited, unpaid, unprompted.
          </p>

          {/* Overall rating */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#c9a24d] text-[#c9a24d]" />
              ))}
            </div>
            <span className="text-xl font-black text-[#f5efe0]">4.9</span>
            <span className="text-sm text-[#c9e8d8]/50">· 1,200+ orders</span>
          </div>
        </div>

        {/* ── Carousel (client component) ── */}
        <CustomerReviewsCarousel />

        {/* ── CTA ── */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded border border-[#c9a24d]/40 bg-[#c9a24d]/10 px-7 py-3 text-sm font-black text-[#c9a24d] transition hover:bg-[#c9a24d]/20"
          >
            Shop What They Loved
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}


export function WhyNiyamahSection() {
  const reasons = [
    {
      title: "Selected Islamic Essentials",
      copy: "Products chosen for worship, learning, gifting, and daily meaning.",
      icon: BookOpen,
    },
    {
      title: "Meaningful Gift Curation",
      copy: "Gift boxes and bundles that feel thoughtful before they are opened.",
      icon: Gift,
    },
    {
      title: "COD Across Bangladesh",
      copy: "Cash on Delivery support that keeps checkout familiar and trusted.",
      icon: Truck,
    },
    {
      title: "Friendly WhatsApp Support",
      copy: "Ask questions, confirm choices, and get guidance before ordering.",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="bg-[#f8f1e3] py-16 sm:py-20">
      <div className={sectionShell}>
        <HomepageSectionHeader
          eyebrow="Brand promise"
          title="Why Shop from Niyamah?"
          subtitle="A quieter value section that explains the care behind the store."
          align="center"
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="border border-[#d9c38b]/45 bg-white/68 p-5 text-center shadow-[0_18px_50px_rgba(18,61,42,0.06)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#123d2a] text-[#f8f1e3]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight text-[#123d2a]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#52675b]">
                  {item.copy}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BlogPreviewSection() {
  const posts = [
    {
      title: "How to Choose a Quran Gift",
      copy: "A practical guide for choosing print, translation, packaging, and purpose.",
      href: "/blog/how-to-choose-quran-gift",
    },
    {
      title: "Best Islamic Gifts for Parents",
      copy: "Meaningful gift ideas for mothers and fathers, from Quran to tasbih.",
      href: "/blog/islamic-gifts-for-parents",
    },
    {
      title: "Prayer Mat Buying Guide",
      copy: "What to consider for comfort, material, use, and gifting.",
      href: "/blog/prayer-mat-buying-guide",
    },
    {
      title: "Benefits of Color-Coded Quran",
      copy: "Why color support can help with recitation flow and learning confidence.",
      href: "/blog/benefits-color-coded-quran",
    },
  ];

  return (
    <section className="bg-[#fffaf0] py-16 sm:py-20">
      <div className={sectionShell}>
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <HomepageSectionHeader
            eyebrow="Buying guides"
            title="Learn Before You Buy"
            subtitle="Helpful education makes the store feel expert, calm, and trustworthy."
          />
          <TextCta href="/blog">Read all guides</TextCta>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => (
            <Link
              key={post.title}
              href={post.href}
              className="group flex min-h-[260px] flex-col justify-between border border-[#d9c38b]/45 bg-white p-5 shadow-[0_18px_50px_rgba(18,61,42,0.06)] transition-all hover:-translate-y-1 hover:border-[#c9a24d]"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c9a24d]">
                  Guide {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-2xl font-black leading-tight text-[#123d2a]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#52675b]">
                  {post.copy}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#123d2a]">
                Read Guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LifestyleGallerySection() {
  const moments = [
    { label: "Quran desk", image: "/images/hero/hero-quran.png" },
    { label: "Gift box", image: "/images/hero/hero-gift-box.png" },
    { label: "Prayer corner", image: "/images/hero/hero-prayer-mat.png" },
    { label: "Tasbih closeup", image: "/images/hero/hero-prayer-mat.png" },
  ];

  return (
    <section className="bg-[#f8f1e3] py-16 sm:py-20">
      <div className={sectionShell}>
        <HomepageSectionHeader
          eyebrow="Lifestyle gallery"
          title="Niyamah Moments"
          subtitle="Small visual moments that show the products in a warmer, more lived-in way."
          align="center"
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moments.map((moment, index) => (
            <figure
              key={`${moment.label}-${index}`}
              className="group relative aspect-[4/5] overflow-hidden bg-[#efe6d2] shadow-[0_18px_50px_rgba(18,61,42,0.08)]"
            >
              <ImageWithFallback
                src={moment.image}
                alt={moment.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain p-8 transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[#123d2a]/88 p-4 text-xs font-black uppercase tracking-[0.18em] text-[#f8f1e3]">
                {moment.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalHomepageCtaSection() {
  return (
    <section className="bg-[#123d2a] py-16 text-center text-[#f8f1e3] sm:py-20">
      <div className={sectionShell}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9b86c]">
          Shop with meaning
        </p>
        <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Bring Barakah Into Everyday Life
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f8f1e3]/75">
          Shop Quran, prayer essentials, Islamic books, and meaningful gifts,
          delivered across Bangladesh.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center bg-[#d9b86c] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#123d2a]"
          >
            Shop All Products
          </Link>
          <a
            href="https://wa.me/8801760982072"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center border border-[#d9b86c]/55 px-6 text-sm font-black uppercase tracking-[0.16em] text-[#f8f1e3]"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
