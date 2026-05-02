import Link from "next/link";
import { Globe, Camera, Video, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  shop: [
    { label: "Quran", href: "/category/quran" },
    { label: "Bengali Quran", href: "/category/bengali-quran" },
    { label: "Gift Box", href: "/category/gift-box" },
    { label: "Prayer Mat", href: "/category/prayer-mat" },
    { label: "Tasbih", href: "/category/tasbih" },
    { label: "All Products", href: "/products" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Order Tracking", href: "/account/orders" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Return Policy", href: "/refund" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const HOTLINE = "01760-982072";
const WHATSAPP_URL = "https://wa.me/8801760982072";

/** Full-width Islamic-themed site footer with brand, shop, support, and company links. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[#0A2418] bg-[#11160F] text-white">
      <Container>
        {/* Main grid */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo variant="both" className="[&_span]:text-white [&_img]:brightness-0 [&_img]:invert" />
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Niyamah is your trusted home for Quran, prayer essentials, tasbih, and meaningful Islamic gifts &mdash; delivered with Cash on Delivery across Bangladesh.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <a
                href={`tel:${HOTLINE.replace(/-/g, "")}`}
                className="flex items-center gap-2 text-white/80 transition-colors hover:text-[#BFE8C6]"
              >
                <Phone className="h-4 w-4 text-[#BFE8C6]" />
                Hotline: {HOTLINE}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 transition-colors hover:text-[#BFE8C6]"
              >
                <MessageCircle className="h-4 w-4 text-[#BFE8C6]" />
                WhatsApp Order Support
              </a>
            </div>

            <div className="mt-5 flex gap-3">
              {[
                { icon: Globe, href: "#", label: "Facebook" },
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Video, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-[#BFE8C6] hover:text-[#BFE8C6]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { heading: "Shop", links: footerLinks.shop },
            { heading: "Support", links: footerLinks.support },
            { heading: "Company", links: footerLinks.company },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/65 transition-colors hover:text-[#BFE8C6]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/55 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Niyamah. All rights reserved.</p>
          <p>Built with care in Bangladesh &middot; Cash on Delivery available nationwide</p>
        </div>
      </Container>
    </footer>
  );
}
