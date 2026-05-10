import { HeroSlider } from "@/components/storefront/hero-slider";
import { TrustPromiseStrip } from "@/components/storefront/homepage-sections";
import { ProductStoryRailSection } from "@/components/storefront/product-story-rail-section";
import { getHomepageContent } from "@/modules/storefront/homepage-content";
import { getNewArrivals } from "@/modules/storefront/queries";

export const dynamic = "force-dynamic";

export default async function StorefrontHomePage() {
  const [content, storyProducts] = await Promise.all([
    getHomepageContent(),
    getNewArrivals(8),
  ]);

  return (
    <div className="bg-[var(--color-background)]">
      <HeroSlider slides={content.hero} />
      <TrustPromiseStrip />
      <ProductStoryRailSection products={storyProducts} />
    </div>
  );
}
