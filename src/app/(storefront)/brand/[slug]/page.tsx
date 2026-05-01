import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGrid } from "@/components/storefront/product-grid";
import { listProductsForGrid } from "@/modules/storefront/queries";

export const revalidate = 60;

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [brand] = await db
    .select()
    .from(brands)
    .where(and(eq(brands.storeId, DEFAULT_STORE_ID), eq(brands.slug, slug)))
    .limit(1);
  if (!brand || !brand.status) notFound();

  const result = await listProductsForGrid({ brandSlug: slug, limit: 24 });

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/products" },
          { label: brand.name },
        ]}
      />
      <h1
        className="mb-2 mt-4 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {brand.name}
      </h1>
      {brand.description && (
        <p className="mb-6 max-w-3xl text-[var(--color-text-secondary)]">
          {brand.description}
        </p>
      )}
      {result.items.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">
          No products available for this brand yet.
        </p>
      ) : (
        <ProductGrid products={result.items} columns={4} />
      )}
    </Container>
  );
}
