import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import type { ProductCardData } from "@/components/storefront/product-card";
import { cn, formatCurrency } from "@/lib/utils";

interface FlashSaleSectionProps {
  products: ProductCardData[];
  endsAt?: string | Date;
  durationHours?: number;
  title?: string;
  stockClaimedPct?: number;
  className?: string;
}

export function FlashSaleSection({
  products,
  endsAt,
  durationHours,
  title = "Today’s Best Islamic Essentials",
  stockClaimedPct,
  className,
}: FlashSaleSectionProps) {
  const pct = Math.min(100, Math.max(0, Math.round(stockClaimedPct ?? 68)));
  const preview = products.slice(0, 3);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[32px] bg-[#17130d] text-white shadow-xl",
        className,
      )}
    >
      <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[0.9fr,1.1fr] lg:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#c6923a]">
              <Flame className="h-3.5 w-3.5" />
              Friday Special
            </div>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/[0.68]">
              Premium Quran, gift boxes, tasbih, and prayer essentials selected
              for recitation, worship, and meaningful gifting.
            </p>
          </div>

          <div className="space-y-5">
            <CountdownTimer endsAt={endsAt} durationHours={durationHours} />
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/70">
                <span>{pct}% of sale stock claimed</span>
                <span>{100 - pct}% remaining</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.12]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c6923a] to-[#f2d58a]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <Link
              href="/products?intent=offer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#c6923a] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9a7029]"
            >
              Shop Offers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px]">
          {preview.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className={cn(
                "absolute block w-[54%] max-w-[260px] overflow-hidden rounded-[26px] border border-white/15 bg-white p-3 text-[#1c1710] shadow-2xl transition-transform hover:-translate-y-1",
                index === 0 && "left-0 top-10 rotate-[-5deg]",
                index === 1 && "right-4 top-0 rotate-[4deg]",
                index === 2 && "bottom-0 left-[24%] rotate-[1deg]",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#f3efe6]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 line-clamp-1 text-sm font-semibold">{product.name}</p>
              <p className="mt-1 text-sm font-bold text-[#9a7029]">
                {formatCurrency(product.price)}
              </p>
            </Link>
          ))}

          <div className="absolute right-0 top-[46%] rounded-2xl bg-[#c6923a] px-4 py-3 text-center shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
              Up to
            </p>
            <p className="text-2xl font-black">35% Off</p>
          </div>
        </div>
      </div>
    </section>
  );
}
