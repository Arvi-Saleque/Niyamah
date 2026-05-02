import { Container } from "@/components/shared/container";
import { PremiumVisualHero } from "@/components/storefront/premium-visual-hero";
import { ShopByNeed } from "@/components/storefront/shop-by-need";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { HomepageProductTabs } from "@/components/storefront/homepage-product-tabs";
import { TrustSection } from "@/components/storefront/trust-section";
import { NewsletterSubscribe } from "@/components/storefront/newsletter-subscribe";
import { TestimonialsSection } from "@/components/storefront/testimonials-section";
import { PhotoReviewsStrip } from "@/components/storefront/photo-reviews-strip";
import { GiftBuilderSection } from "@/components/storefront/gift-builder-section";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
  getRecentPhotoReviews,
} from "@/modules/storefront/queries";
import { getHomepageContent } from "@/modules/storefront/homepage-content";
import Link from "next/link";
import { BookOpen, MessageCircle, Truck } from "lucide-react";

export const revalidate = 300;

export default async function StorefrontHomePage() {
  const [categories, newArrivals, bestSellers, photoReviews, content] = await Promise.all([
    getFeaturedCategories(6),
    getNewArrivals(8),
    getBestSellers(8),
    getRecentPhotoReviews(10),
    getHomepageContent(),
  ]);
  const discovery = {
    ...content.discovery,
    eyebrow: "Quick Finder",
    title: "What are you looking for?",
    subtitle: "Search Quran, gift boxes, tasbih, prayer mats, and Islamic essentials.",
    placeholder: "Search Quran, tasbih, prayer mat, gift box...",
    trending: [
      "Color coded Quran",
      "Gift for parents",
      "Tasbih",
      "Prayer mat",
      "Under Tk 1000",
    ],
  };

  return (
    <div className="bg-[var(--color-background)]">
      {/* === 1. Premium Visual Hero === */}
      <PremiumVisualHero
        discovery={discovery}
        products={newArrivals}
        categories={categories}
      />

      {/* === 2. Trust Ribbon === */}
      <Container className="py-8 md:py-10">
        <TrustSection data={content.trust} />
      </Container>

      <Container className="space-y-14 py-10 md:space-y-20 md:py-14">
        {/* === 3. Shop by Need === */}
        <ShopByNeed categories={categories} />

        {/* === 4. Featured Categories === */}
        {categories.length > 0 && (
          <div id="categories">
            <FeaturedCategories
              categories={categories}
              title="Popular Categories"
              subtitle="Quickly choose Quran, gift, prayer, or dhikr items."
              variant="rail"
            />
          </div>
        )}

        {/* === 5. Flash Sale === */}
        {content.flashSale.enabled && bestSellers.length > 0 && (
          <div id="flash-sale">
            <FlashSaleSection
              products={bestSellers.slice(0, 5)}
              durationHours={content.flashSale.hoursFromNow}
              title="Premium Quran & Gift Box Collection"
            />
          </div>
        )}

        {/* === 6. Product Tabs === */}
        <HomepageProductTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* === 7. Gift Builder === */}
        {content.whatsapp.enabled && (
          <GiftBuilderSection whatsappPhone={content.whatsapp.phoneNumber} />
        )}

        {/* === 8. Learn Before You Buy === */}
        <section className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#007A3D]">
              Learning Guides
            </p>
            <h2 className="text-3xl font-semibold text-[#162018] md:text-4xl">
              Learn Before You Buy
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#687464]">
              Helpful guides for choosing Quran, Islamic gifts, and worship essentials.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { title: "How to Choose a Quran for Daily Recitation", category: "Quran Guide" },
              { title: "Best Islamic Gifts for Parents", category: "Gift Guide" },
              { title: "Why Color-Coded Quran Helps Beginners", category: "Quran Guide" },
              { title: "How to Care for Prayer Mats and Tasbih", category: "Care Guide" },
            ].map((item) => (
              <Link
                key={item.title}
                href="/blog"
                className="group flex min-h-[200px] flex-col rounded-[24px] border border-[#D6DDCF] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#007A3D] hover:shadow-lg"
              >
                <span className="mb-2 inline-block self-start rounded-full bg-[#EAF6DD] px-2.5 py-0.5 text-[11px] font-semibold text-[#007A3D]">
                  {item.category}
                </span>
                <BookOpen className="mb-4 mt-1 h-7 w-7 text-[#007A3D]" />
                <h3 className="flex-1 text-base font-semibold leading-6 text-[#162018]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm font-semibold text-[#007A3D] group-hover:underline">
                  Read Guide -&gt;
                </p>
              </Link>
            ))}
          </div>
        </section>

        {photoReviews.length > 0 && <PhotoReviewsStrip reviews={photoReviews} />}

        {/* === 9. Customer Reviews === */}
        <TestimonialsSection testimonials={content.testimonials.items} />

        {/* === 10. WhatsApp Support + Track Order === */}
        {content.whatsapp.enabled && (
          <section className="relative overflow-hidden rounded-3xl border border-[#0A2418] bg-gradient-to-br from-[#043D25] via-[#07512F] to-[#11160F] p-8 text-white md:p-12">
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#BFE8C6]">
                  <MessageCircle className="h-3 w-3" /> WhatsApp + Track Order
                </div>
                <h2
                  className="mb-3 text-3xl font-bold md:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Need Help Before Ordering?
                </h2>
                <p className="text-white/75 leading-relaxed">
                  Ask about Quran size, gift box details, delivery charge, or Cash-on-Delivery on WhatsApp &mdash; or track an existing order in seconds.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Ask about Quran size",
                    "Ask about gift box",
                    "Confirm delivery charge",
                    "Track my order",
                  ].map((chip) => (
                    <a
                      key={chip}
                      href={`https://wa.me/${content.whatsapp.phoneNumber}?text=${encodeURIComponent(chip)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:border-[#BFE8C6] hover:text-[#BFE8C6]"
                    >
                      {chip}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a
                  href={`https://wa.me/${content.whatsapp.phoneNumber}?text=${encodeURIComponent(content.whatsapp.defaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#0A5F36]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/account/orders"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#FAF7EE]/40 bg-[#FAF7EE]/10 px-6 py-3 text-sm font-semibold text-[#FAF7EE] backdrop-blur transition-all hover:bg-[#FAF7EE] hover:text-[#043D25]"
                >
                  <Truck className="h-4 w-4" />
                  Track Order
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* === 11. Newsletter === */}
        <NewsletterSubscribe />
      </Container>
    </div>
  );
}
