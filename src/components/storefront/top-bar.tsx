import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icon-registry";
import { HOMEPAGE_DEFAULTS, type TickerItem } from "@/modules/storefront/homepage-defaults";

interface TopBarProps {
  className?: string;
  /** Phone shown on the right (desktop only) */
  phone?: string;
  items?: TickerItem[];
}

/** Slim animated announcement bar: trust ticker + optional contact phone. */
export function TopBar({ className, phone, items }: TopBarProps) {
  const tickerItems = items?.length ? items : HOMEPAGE_DEFAULTS.ticker.items;
  // Duplicate items so the marquee loop appears seamless
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-[#0A2418] bg-[#043D25] text-[#FAF7EE]",
        className
      )}
    >
      <div className="mx-auto flex h-8 max-w-7xl items-center gap-4 px-4 text-xs sm:px-6 lg:px-8">
        {/* Ticker */}
        <div className="relative flex-1 overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#043D25] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#043D25] to-transparent" />

          <div className="flex w-max gap-10 animate-marquee whitespace-nowrap">
            {loop.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <span
                  key={i}
                className="flex items-center gap-2 font-medium tracking-wide opacity-90"
              >
                  <Icon className="h-3 w-3 text-[#A6D920]" />
                  {item.text}
                </span>
              );
            })}
          </div>
        </div>

        {/* Contact phone — desktop only */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="hidden shrink-0 items-center gap-1 opacity-80 transition-opacity hover:opacity-100 sm:flex"
          >
            📞 {phone}
          </a>
        )}
      </div>
    </div>
  );
}
