import { Container } from "@/components/shared/container";
import { EditorialHero, type EditorialSlide } from "@/components/storefront/editorial-hero";
import { HomepageIntentBar } from "@/components/storefront/homepage-intent-bar";
import { SearchDiscoveryPanel } from "@/components/storefront/search-discovery-panel";
import { ShopByNeed } from "@/components/storefront/shop-by-need";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { HomepageProductTabs } from "@/components/storefront/homepage-product-tabs";
import { TrustSection } from "@/components/storefront/trust-section";
import { EditorialBlock } from "@/components/storefront/editorial-block";
import { NewsletterSubscribe } from "@/components/storefront/newsletter-subscribe";
import {
  TestimonialsSection,
  type Testimonial,
} from "@/components/storefront/testimonials-section";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
} from "@/modules/storefront/queries";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const revalidate = 300;

const HERO_SLIDES: EditorialSlide[] = [
  {
    id: "signature",
    eyebrow: "New Collection · 2026",
    title: "Niyamah",
    highlight: "Signature",
    subtitle:
      "Soft, elegant, curated essentials for modern lifestyle — handpicked from the best of Bangladesh.",
    badge: "New Drop",
    ctaPrimary: { label: "Shop Collection", href: "/products" },
    ctaSecondary: { label: "View Offers", href: "/products?intent=offer" },
    rightGradient: "from-[#e8d5a8] via-[#d4ba85] to-[#b8893d]",
    decoration: "NEW",
    popularLinks: [
      { label: "Women", href: "/category/apparel?gender=women" },
      { label: "Gifts", href: "/products?intent=gift" },
      { label: "Home", href: "/category/home-living" },
      { label: "New Drop", href: "/products?intent=new" },
    ],
  },
  {
    id: "eid",
    eyebrow: "Limited Time",
    title: "Eid Premium",
    highlight: "Drop",
    subtitle:
      "Up to 30% off our most-loved festive picks — refined craftsmanship for every celebration.",
    badge: "Up to 30% off",
    ctaPrimary: { label: "Explore Eid Drop", href: "/products?intent=eid" },
    ctaSecondary: { label: "Gift Ideas", href: "/products?intent=gift" },
    rightGradient: "from-[#1a1814] via-[#3a342a] to-[#7d5b22]",
    decoration: "EID",
    popularLinks: [
      { label: "Festive Wear", href: "/category/apparel" },
      { label: "Premium", href: "/products?premium=1" },
      { label: "Gifts under ৳1500", href: "/products?max=1500" },
    ],
  },
  {
    id: "essentials",
    eyebrow: "The Edit",
    title: "Everyday",
    highlight: "Essentials",
    subtitle:
      "Pieces that earn their place in your wardrobe. Soft fabrics, honest prices, made to last.",
    ctaPrimary: { label: "Shop Essentials", href: "/category/apparel" },
    ctaSecondary: { label: "Best Sellers", href: "/products?sort=popular" },
    rightGradient: "from-[#f3efe6] via-[#ebe5d6] to-[#c9c0a8]",
    decoration: "EDIT",
    popularLinks: [
      { label: "Daily Wear", href: "/products?intent=daily" },
      { label: "Office", href: "/products?intent=office" },
      { label: "Under ৳999", href: "/products?max=999" },
    ],
  },
];

const HOMEPAGE_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ayesha Rahman",
    rating: 5,
    body: "Beautiful packaging and the fabric quality is top-notch. Cash on delivery worked smoothly in Dhaka.",
    location: "Dhaka",
  },
  {
    id: "t2",
    name: "Tanvir Hossain",
    rating: 5,
    body: "Niyamah's craftsmanship truly stands out. Will definitely order again — the gift box was exceptional.",
    location: "Chattogram",
  },
  {
    id: "t3",
    name: "Sumaiya Islam",
    rating: 4,
    body: "Quick delivery and the product matched the photos exactly. Highly recommend Niyamah!",
    location: "Sylhet",
  },
];

// Flash sale ends 48h from page render (revalidates every 5 min)
const flashSaleEndsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

export default async function StorefrontHomePage() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getFeaturedCategories(6),
    getNewArrivals(8),
    getBestSellers(8),
  ]);

  return (
    <div className="bg-[var(--color-background)]">
      {/* === 1. Editorial Hero === */}
      <Container className="pt-6 md:pt-8">
        <EditorialHero slides={HERO_SLIDES} />
      </Container>

      {/* === 2. Intent Bar === */}
      <Container className="py-6 md:py-8">
        <HomepageIntentBar />
      </Container>

      {/* === 3. Search Discovery Panel === */}
      <Container id="discover">
        <SearchDiscoveryPanel />
      </Container>

      <Container className="space-y-16 py-12 md:space-y-20 md:py-16">
        {/* === 4. Shop by Need === */}
        <ShopByNeed />

        {/* === 5. Featured Categories === */}
        {categories.length > 0 && (
          <div id="categories">
            <FeaturedCategories categories={categories} />
          </div>
        )}

        {/* === 6. Flash Sale === */}
        {bestSellers.length > 0 && (
          <div id="flash-sale">
            <FlashSaleSection
              products={bestSellers.slice(0, 5)}
              endsAt={flashSaleEndsAt}
              title="Flash Sale · Ending Soon"
            />
          </div>
        )}

        {/* === 7. Product Tabs (For You / New / Best / Trending) === */}
        <HomepageProductTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* === 8. Trust Section === */}
        <TrustSection />

        {/* === 9. Editorial Block === */}
        <div id="editorial">
          <EditorialBlock />
        </div>

        {/* === 10. Testimonials === */}
        <TestimonialsSection testimonials={HOMEPAGE_TESTIMONIALS} />

        {/* === 12. WhatsApp CTA === */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[#1a1814] via-[#2a241c] to-[#3a342a] p-8 text-white md:p-12">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#25D366]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#25D366]/20 px-3 py-1 text-xs font-semibold text-[#25D366]">
                <MessageCircle className="h-3 w-3" /> WhatsApp Commerce
              </div>
              <h2
                className="mb-3 text-3xl font-bold md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Need help before ordering?
              </h2>
              <p className="text-white/70 leading-relaxed">
                Chat with us on WhatsApp — ask product questions, share your cart,
                or confirm a Cash-on-Delivery order in seconds.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#1DAE54]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Now
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* === 13. Newsletter === */}
        <NewsletterSubscribe />
      </Container>
    </div>
  );
}
