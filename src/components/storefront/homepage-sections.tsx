import Link from "next/link";
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
