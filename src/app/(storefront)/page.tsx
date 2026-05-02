import { Container } from "@/components/shared/container";
import { PremiumVisualHero } from "@/components/storefront/premium-visual-hero";
import { SearchDiscoveryPanel } from "@/components/storefront/search-discovery-panel";
import { ShopByNeed } from "@/components/storefront/shop-by-need";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { HomepageProductTabs } from "@/components/storefront/homepage-product-tabs";
import { TrustSection } from "@/components/storefront/trust-section";
import { NewsletterSubscribe } from "@/components/storefront/newsletter-subscribe";
import { TestimonialsSection } from "@/components/storefront/testimonials-section";
import { PhotoReviewsStrip } from "@/components/storefront/photo-reviews-strip";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
  getRecentPhotoReviews,
} from "@/modules/storefront/queries";
import { getHomepageContent } from "@/modules/storefront/homepage-content";
import Link from "next/link";
import { BookOpen, Gift, MessageCircle, PackageSearch, Truck, Wallet } from "lucide-react";

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

      {/* === 2. Floating Search Discovery === */}
      <Container id="discover" className="relative z-10 -mt-8 md:-mt-12">
        <SearchDiscoveryPanel data={discovery} />
      </Container>

      {/* === 3. Trust Ribbon === */}
      <Container className="py-8 md:py-12">
        <TrustSection data={content.trust} />
      </Container>

      <Container className="space-y-14 py-10 md:space-y-20 md:py-14">
        {/* === 4. Shop by Need === */}
        <ShopByNeed categories={categories} />

        {/* === 5. Featured Categories === */}
        {categories.length > 0 && (
          <div id="categories">
            <FeaturedCategories
              categories={categories}
              title="Popular Categories"
              subtitle="Browse the main shelves when you already know the product family."
            />
          </div>
        )}

        {/* === 6. Flash Sale === */}
        {content.flashSale.enabled && bestSellers.length > 0 && (
          <div id="flash-sale">
            <FlashSaleSection
              products={bestSellers.slice(0, 5)}
              durationHours={content.flashSale.hoursFromNow}
              title="Premium Quran & Gift Box Collection"
            />
          </div>
        )}

        {/* === 7. Product Tabs === */}
        <HomepageProductTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* === 8. Gift Builder === */}
        {content.whatsapp.enabled && (
          <section className="grid gap-6 rounded-[32px] border border-[#DED6BF] bg-[#EFE6D2] p-5 shadow-sm md:grid-cols-[1fr,420px] md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#006B3A]">
                <Gift className="h-3.5 w-3.5" />
                Gift Builder
              </div>
              <h2 className="text-3xl font-semibold text-[#172018] md:text-4xl">
                Build a Meaningful Islamic Gift
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6D7668]">
                Choose a recipient, budget, and purpose. We will suggest the
                right Quran, tasbih, prayer mat, or gift box through WhatsApp.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Parents", "Teacher", "Friend", "Family", "Under Tk 1000", "Premium"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#006B3A]/25 bg-[#FAF7EE] px-4 py-2 text-center text-sm font-semibold text-[#006B3A]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              {[
                {
                  icon: Gift,
                  label: "Quran Gift",
                  text: "I need a Quran gift box",
                },
                {
                  icon: Wallet,
                  label: "Budget Gift",
                  text: "Find Islamic gift under Tk 1000",
                },
                {
                  icon: PackageSearch,
                  label: "Prayer Gift",
                  text: "Suggest prayer mat and tasbih gift",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={`https://wa.me/${content.whatsapp.phoneNumber}?text=${encodeURIComponent(item.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-[#DED6BF] bg-white p-3 transition-all hover:border-[#006B3A]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF4D5] text-[#006B3A] group-hover:bg-[#006B3A] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#172018]">
                        {item.label}
                      </span>
                      <span className="line-clamp-1 text-xs text-[#6D7668]">
                        {item.text}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* === 9. Learn Before You Buy === */}
        <section className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              Learning Guides
            </p>
            <h2 className="text-3xl font-semibold text-[#172018] md:text-4xl">
              Learn Before You Buy
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#6D7668]">
              Helpful guides for choosing Quran, Islamic gifts, and worship essentials.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "How to choose a Quran for daily recitation",
              "Best Islamic gifts for parents",
              "Why color-coded Quran helps beginners",
              "How to care for prayer mats and tasbih",
            ].map((title) => (
              <Link
                key={title}
                href="/blog"
                className="rounded-[24px] border border-[#DED6BF] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#006B3A] hover:shadow-lg"
              >
                <BookOpen className="mb-5 h-5 w-5 text-[#006B3A]" />
                <h3 className="text-base font-semibold leading-6 text-[#172018]">
                  {title}
                </h3>
                <p className="mt-4 text-sm font-semibold text-[#006B3A]">
                  Read Guide -&gt;
                </p>
              </Link>
            ))}
          </div>
        </section>

        {photoReviews.length > 0 && <PhotoReviewsStrip reviews={photoReviews} />}

        {/* === 10. Customer Reviews === */}
        <TestimonialsSection testimonials={content.testimonials.items} />

        {/* === 11. WhatsApp Support + Track Order === */}
        {content.whatsapp.enabled && (
          <section className="relative overflow-hidden rounded-3xl border border-[#0A2418] bg-gradient-to-br from-[#043D25] via-[#0A4D2E] to-[#11160F] p-8 text-white md:p-12">
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#25D366]/20 px-3 py-1 text-xs font-semibold text-[#A6D920]">
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
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:border-[#A6D920] hover:text-[#A6D920]"
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
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#1DAE54]"
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

        {/* === 12. Newsletter === */}
        <NewsletterSubscribe />
      </Container>
    </div>
  );
}
