import { HeroSlider } from "@/components/storefront/hero-slider";
import { getHomepageContent } from "@/modules/storefront/homepage-content";

export const dynamic = "force-dynamic";

export default async function StorefrontHomePage() {
  const content = await getHomepageContent();

  return (
    <div className="bg-[var(--color-background)]">
      <HeroSlider slides={content.hero} />
    </div>
  );
}
