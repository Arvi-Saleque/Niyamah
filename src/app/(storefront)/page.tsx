import { Container } from "@/components/shared/container";
import { EditorialHero } from "@/components/storefront/editorial-hero";
import { HomepageIntentBar } from "@/components/storefront/homepage-intent-bar";
import { SearchDiscoveryPanel } from "@/components/storefront/search-discovery-panel";
import { ShopByNeed } from "@/components/storefront/shop-by-need";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { HomepageProductTabs } from "@/components/storefront/homepage-product-tabs";
import { TrustSection } from "@/components/storefront/trust-section";
import { EditorialBlock } from "@/components/storefront/editorial-block";
import { NewsletterSubscribe } from "@/components/storefront/newsletter-subscribe";
import { TestimonialsSection } from "@/components/storefront/testimonials-section";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
} from "@/modules/storefront/queries";
import { getHomepageContent } from "@/modules/storefront/homepage-content";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const revalidate = 300;

export default async function StorefrontHomePage() {
  const [categories, newArrivals, bestSellers, content] = await Promise.all([
    getFeaturedCategories(6),
    getNewArrivals(8),
    getBestSellers(8),
    getHomepageContent(),
  ]);

  // Flash sale ends N hours from page render (revalidates every 5 min)
  const flashSaleEndsAt = new Date(
    Date.now() + content.flashSale.hoursFromNow * 60 * 60 * 1000,
  ).toISOString();

  return (
    <div className="bg-[var(--color-background)]">
      {/* === 1. Editorial Hero === */}
      <Container className="pt-6 md:pt-8">
        <EditorialHero slides={content.hero} />
      </Container>

      {/* === 2. Intent Bar === */}
      <Container className="py-6 md:py-8">
        <HomepageIntentBar />
      </Container>

      {/* === 3. Search Discovery Panel === */}
      <Container id="discover">
        <SearchDiscoveryPanel data={content.discovery} />
      </Container>

      <Container className="space-y-16 py-12 md:space-y-20 md:py-16">
        {/* === 4. Shop by Need === */}
        <ShopByNeed data={content.needs} />

        {/* === 5. Featured Categories === */}
        {categories.length > 0 && (
          <div id="categories">
            <FeaturedCategories categories={categories} />
          </div>
        )}

        {/* === 6. Flash Sale === */}
        {content.flashSale.enabled && bestSellers.length > 0 && (
          <div id="flash-sale">
            <FlashSaleSection
              products={bestSellers.slice(0, 5)}
              endsAt={flashSaleEndsAt}
              title={content.flashSale.title}
            />
          </div>
        )}

        {/* === 7. Product Tabs === */}
        <HomepageProductTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* === 8. Trust Section === */}
        <TrustSection data={content.trust} />

        {/* === 9. Editorial Block === */}
        <div id="editorial">
          <EditorialBlock data={content.editorial} />
        </div>

        {/* === 10. Testimonials === */}
        <TestimonialsSection testimonials={content.testimonials.items} />

        {/* === 11. WhatsApp CTA === */}
        {content.whatsapp.enabled && (
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
                  {content.whatsapp.ctaTitle}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {content.whatsapp.ctaSubtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a
                  href={`https://wa.me/${content.whatsapp.phoneNumber}?text=${encodeURIComponent(content.whatsapp.defaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#1DAE54]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {content.whatsapp.ctaPrimaryLabel}
                </a>
                <Link
                  href={content.whatsapp.ctaSecondaryHref}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
                >
                  {content.whatsapp.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* === 12. Newsletter === */}
        <NewsletterSubscribe />
      </Container>
    </div>
  );
}
