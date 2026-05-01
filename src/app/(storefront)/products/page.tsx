import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGrid } from "@/components/storefront/product-grid";
import { listProductsForGrid } from "@/modules/storefront/queries";

interface SearchParams {
  page?: string;
  q?: string;
  brand?: string;
}

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const opts: { page: number; limit: number; q?: string; brandSlug?: string } = {
    page,
    limit: 24,
  };
  if (sp.q) opts.q = sp.q;
  if (sp.brand) opts.brandSlug = sp.brand;
  const result = await listProductsForGrid(opts);

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
      <h1
        className="mb-6 mt-4 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        All Products
      </h1>
      {result.items.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No products found.</p>
      ) : (
        <ProductGrid products={result.items} columns={4} />
      )}
    </Container>
  );
}
