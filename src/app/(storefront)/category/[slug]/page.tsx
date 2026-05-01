import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGrid } from "@/components/storefront/product-grid";
import { listProductsForGrid } from "@/modules/storefront/queries";
import { categoryRepository } from "@/modules/catalog/infrastructure/category.repository";

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await categoryRepository.findBySlug(slug);
  if (!category) notFound();
  const result = await listProductsForGrid({ categorySlug: slug, limit: 24 });

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/products" },
          { label: category.name },
        ]}
      />
      <h1
        className="mb-2 mt-4 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {category.name}
      </h1>
      {category.description && (
        <p className="mb-6 max-w-3xl text-[var(--color-text-secondary)]">
          {category.description}
        </p>
      )}
      {result.items.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">
          No products in this category yet.
        </p>
      ) : (
        <ProductGrid products={result.items} columns={4} />
      )}
    </Container>
  );
}
