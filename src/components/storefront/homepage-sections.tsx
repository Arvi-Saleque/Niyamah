import Link from "next/link";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gift,
  HeartHandshake,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const sectionShell = "mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8";

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
