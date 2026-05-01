import { Container } from "@/components/shared/container";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { NewArrivalsSection } from "@/components/storefront/new-arrivals-section";
import { BestSellerSection } from "@/components/storefront/best-seller-section";
import { TrustBadges } from "@/components/storefront/trust-badges";
import { NewsletterSubscribe } from "@/components/storefront/newsletter-subscribe";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
} from "@/modules/storefront/queries";

export const revalidate = 300;

export default async function StorefrontHomePage() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getFeaturedCategories(6),
    getNewArrivals(8),
    getBestSellers(8),
  ]);

  return (
    <div>
      {/* Hero band */}
      <section
        className="relative overflow-hidden border-b border-[var(--color-border)]"
        style={{ background: "var(--color-surface-alt)" }}
      >
        <Container className="py-16 text-center md:py-24">
          <p
            className="mb-4 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-accent)" }}
          >
            Premium · Bangladesh
          </p>
          <h1
            className="mb-6 text-5xl font-semibold md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Niyamah
          </h1>
          <p
            className="mx-auto max-w-xl text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Curated essentials with refined craftsmanship — delivered across
            Bangladesh with cash-on-delivery.
          </p>
        </Container>
      </section>

      <Container className="space-y-16 py-12 md:py-16">
        {categories.length > 0 && (
          <FeaturedCategories categories={categories} />
        )}
        {newArrivals.length > 0 && <NewArrivalsSection products={newArrivals} />}
        {bestSellers.length > 0 && <BestSellerSection products={bestSellers} />}
        <TrustBadges />
        <NewsletterSubscribe />
      </Container>
    </div>
  );
}
