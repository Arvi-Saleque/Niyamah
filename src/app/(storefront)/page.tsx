import { HeroSlider } from "@/components/storefront/hero-slider";
import {
  CustomerReviewsSection,
  DeliveryPromiseStrip,
  ShopByOccasionStrip,
  WhyTrustUsSection,
  TopCategoriesSection,
  ParallaxQuoteSection,
  StickyImageBreak,
} from "@/components/storefront/homepage-sections";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { BestSellersTrendingSection } from "@/components/storefront/best-sellers-trending-section";
import { TrendingNowSection } from "@/components/storefront/trending-now-section";
import { NewArrivalsSliderSection } from "@/components/storefront/new-arrivals-slider-section";
import { getHomepageContent } from "@/modules/storefront/homepage-content";
import { getBestSellers, getNewArrivals } from "@/modules/storefront/queries";

export const dynamic = "force-dynamic";

export default async function StorefrontHomePage() {
  const [content, storyProducts, bestSellers] = await Promise.all([
    getHomepageContent(),
    getNewArrivals(8),
    getBestSellers(6),
  ]);

  return (
    <div className="bg-[var(--color-background)]">
      <HeroSlider slides={content.hero} />
      <WhyTrustUsSection />
      <StickyImageBreak
        src="/images/fixed_bg/bg1.png"
        alt="Special Discount — Up to 30% off on Premium Quran collection"
      />
      <FlashSaleSection />
      <TopCategoriesSection />
      <ParallaxQuoteSection />
      <BestSellersTrendingSection products={bestSellers} />
      <ShopByOccasionStrip />
      <TrendingNowSection />
      <DeliveryPromiseStrip />
      <NewArrivalsSliderSection products={storyProducts} />
      <CustomerReviewsSection />
      {/* <TrustPromiseStrip /> */}
      {/* <ShopByPurposeSection /> */}
      {/* <FeaturedCollectionsSection /> */}
      {
      /*<ProductStoryRailSection
        products={storyProducts}
        eyebrow="Curated essentials"
        title="Signature Picks from Niyamah"
        subtitle="A focused edit of Quran, prayer essentials, books, and gifts with the richer book-opening product card treatment."
        ctaLabel="Shop Signature Picks"
      />*/
      }
      {/* <section className="bg-[#fffaf0] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <GiftBuilderSection whatsappPhone="8801760982072" />
        </div>
      </section> */}
      {/* <BestSellersRailSection products={bestSellers} /> */}
      {/* <GiftBoxStorySection /> */}
      {/* <NewArrivalsHomepageSection products={storyProducts} /> */}
      {/* <CategoryDeepDiveSection /> */}
      {/* <CustomerReviewsSection /> */}
      {/* <WhyNiyamahSection /> */}
      {/* <BlogPreviewSection /> */}
      {/* <LifestyleGallerySection /> */}
      {/* <FinalHomepageCtaSection /> */}
    </div>
  );
}
