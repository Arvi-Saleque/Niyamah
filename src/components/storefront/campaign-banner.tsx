import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CampaignBannerData {
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "wide" | "split";
}

interface CampaignBannerProps {
  banner: CampaignBannerData;
  className?: string;
}

/** Promotional campaign banner for homepage or category pages. */
export function CampaignBanner({ banner, className }: CampaignBannerProps) {
  return (
    <Link href={banner.ctaHref ?? "#"} className={cn("group relative block overflow-hidden rounded-2xl", className)}>
      <div className="relative aspect-[3/1] w-full">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-8 gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          {banner.subtitle}
        </p>
        <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">{banner.title}</h3>
        {banner.ctaLabel && (
          <span className="mt-1 inline-block rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white w-fit">
            {banner.ctaLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
