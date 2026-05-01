import Link from "next/link";
import { Container } from "@/components/shared/container";
import { ProductGrid } from "@/components/storefront/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { productSearchRepository } from "@/modules/search/infrastructure/product-search.repository";
import type { ProductCardData } from "@/components/storefront/product-card";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata = { title: "Search results" };

const PAGE_SIZE = 20;

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const result = q
    ? await productSearchRepository.search(q, { page, limit: PAGE_SIZE })
    : { items: [], total: 0, page: 1, limit: PAGE_SIZE };

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  const products: ProductCardData[] = result.items.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    image: p.image ?? "/placeholder-product.png",
    price: Number(p.salePrice ?? p.price),
    ...(p.salePrice && { originalPrice: Number(p.price) }),
    inStock: true,
  }));

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="font-heading mb-2 text-3xl font-bold">Search</h1>

        {/* Search form */}
        <form action="/search" method="get" className="flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search for products…"
              className="pl-9"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          >
            Search
          </Button>
        </form>

        {q && (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {result.total} {result.total === 1 ? "result" : "results"} for{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">
              &ldquo;{q}&rdquo;
            </span>
          </p>
        )}
      </div>

      {!q ? (
        <EmptyState
          title="Type something to search"
          description="Find products by name, description, or category."
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={`We couldn't find anything for "${q}". Try a different keyword.`}
          action={
            <Button asChild variant="outline">
              <Link href="/products">Browse all products</Link>
            </Button>
          }
        />
      ) : (
        <>
          <ProductGrid products={products} columns={4} />
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                </Button>
              )}
              <span className="px-3 text-sm text-[var(--color-text-muted)]">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </Container>
  );
}
