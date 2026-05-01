import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Heading, Text } from "@/components/shared/typography";
import { ProductGrid } from "@/components/storefront/product-grid";
import { campaignRepository } from "@/modules/marketing/infrastructure/campaign.repository";

export const revalidate = 60;

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await campaignRepository.findBySlugWithProducts(slug);
  if (!data) notFound();
  const { campaign, products } = data;

  const productCards = products
    .filter((p) => p.status === "published")
    .map((p) => {
      const display = Number(p.salePrice ?? p.price);
      const original = p.salePrice ? Number(p.price) : undefined;
      return {
        id: String(p.id),
        slug: p.slug,
        name: p.name,
        image: p.image ?? "/placeholder.svg",
        price: display,
        ...(original !== undefined && { originalPrice: original }),
      };
    });

  return (
    <Container className="py-10">
      <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-8 text-center">
        <Heading as="h1" size="2xl" className="mb-3">
          {campaign.name}
        </Heading>
        {campaign.description && (
          <Text variant="muted" className="mx-auto max-w-2xl">
            {campaign.description}
          </Text>
        )}
      </div>

      {productCards.length === 0 ? (
        <Text variant="muted">No products in this campaign yet.</Text>
      ) : (
        <ProductGrid products={productCards} columns={4} />
      )}
    </Container>
  );
}
