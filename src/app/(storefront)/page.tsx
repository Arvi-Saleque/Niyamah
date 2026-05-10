import { HeroSlider } from "@/components/storefront/hero-slider";
import {
  BestSellersRailSection,
  BlogPreviewSection,
  CategoryDeepDiveSection,
  CustomerReviewsSection,
  FeaturedCollectionsSection,
  GiftBoxStorySection,
  LifestyleGallerySection,
  NewArrivalsHomepageSection,
  ShopByPurposeSection,
  TrustPromiseStrip,
  WhyNiyamahSection,
} from "@/components/storefront/homepage-sections";
import { GiftBuilderSection } from "@/components/storefront/gift-builder-section";
import { ProductStoryRailSection } from "@/components/storefront/product-story-rail-section";
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
      <TrustPromiseStrip />
      <ShopByPurposeSection />
      <FeaturedCollectionsSection />
      <ProductStoryRailSection
        products={storyProducts}
        eyebrow="Curated essentials"
        title="Signature Picks from Niyamah"
        subtitle="A focused edit of Quran, prayer essentials, books, and gifts with the richer book-opening product card treatment."
        ctaLabel="Shop Signature Picks"
      />
      <section className="bg-[#fffaf0] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <GiftBuilderSection whatsappPhone="8801760982072" />
        </div>
      </section>
      <BestSellersRailSection products={bestSellers} />
      <GiftBoxStorySection />
      <NewArrivalsHomepageSection products={storyProducts} />
      <CategoryDeepDiveSection />
      <CustomerReviewsSection />
      <WhyNiyamahSection />
      <BlogPreviewSection />
      <LifestyleGallerySection />
    </div>
  );
}
