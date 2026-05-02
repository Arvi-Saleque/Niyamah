import Link from "next/link";
import { Globe, Camera, Video } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Apparel", href: "/category/apparel" },
    { label: "Accessories", href: "/category/accessories" },
    { label: "Home & Living", href: "/category/home-living" },
  ],
  help: [
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "/refund" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

/** Full-width site footer with links, contact info, social icons, and copyright. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-text-primary)] text-white">
      <Container>
        {/* Main grid */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Logo variant="both" className="[&_span]:text-white [&_img]:brightness-0 [&_img]:invert" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Premium products delivered to your door. Cash on delivery across Bangladesh.
            </p>
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
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { heading: "Shop", links: footerLinks.shop },
            { heading: "Help", links: footerLinks.help },
            { heading: "Company", links: footerLinks.company },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/80">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 transition-colors hover:text-[var(--color-accent)]"
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
        <div className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Niyamah. All rights reserved.</p>
          <p>Designed & Built in Bangladesh 🇧🇩</p>
        </div>
      </Container>
    </footer>
  );
}
