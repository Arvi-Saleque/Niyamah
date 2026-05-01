import { notFound } from "next/navigation";
import Script from "next/script";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductInfo } from "@/components/storefront/product-info";
import { ProductTabs } from "@/components/storefront/product-tabs";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { productRepository } from "@/modules/catalog/infrastructure/product.repository";
import { reviewRepository } from "@/modules/customer/infrastructure/review.repository";
import { productLd, breadcrumbLd } from "@/lib/marketing/json-ld";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://niyamah.com.bd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle ?? `${product.name} — Niyamah`,
    description: product.seoDescription ?? product.shortDescription ?? "",
    openGraph: {
      images: product.ogImage ?? product.images?.[0]?.url,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product || product.status !== "published") notFound();

  const stats = await reviewRepository.statsForProduct(product.id);

  const price = Number(product.salePrice ?? product.price);
  const originalPrice = product.salePrice ? Number(product.price) : undefined;
  const images = product.images?.length
    ? product.images.map((i) => i.url)
    : ["/placeholder.svg"];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.name },
  ];

  return (
    <Container className="py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} productName={product.name} />
        <div className="space-y-6">
          <ProductInfo
            name={product.name}
            price={price}
            {...(originalPrice !== undefined && { originalPrice })}
            rating={stats.average}
            reviewCount={stats.total}
            {...(product.shortDescription && { shortDescription: product.shortDescription })}
            {...(product.sku && { sku: product.sku })}
          />
          <div className="flex items-center gap-3">
            <AddToCartButton
              productId={String(product.id)}
              variantId={product.variants?.[0] ? String(product.variants[0].id) : undefined}
              name={product.name}
              slug={product.slug}
              image={images[0] ?? "/placeholder.svg"}
              price={price}
              {...(originalPrice !== undefined && { originalPrice })}
              size="lg"
            />
            <WishlistButton
              product={{
                id: String(product.id),
                productId: String(product.id),
                name: product.name,
                slug: product.slug,
                image: images[0] ?? "/placeholder.svg",
                price,
                ...(originalPrice !== undefined && { originalPrice }),
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs
          description={product.description ?? ""}
        />
      </div>

      {/* SEO: structured data */}
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productLd({
              name: product.name,
              description: product.shortDescription ?? "",
              image: images,
              ...(product.sku && { sku: product.sku }),
              url: `${SITE_URL}/products/${product.slug}`,
              price,
              priceCurrency: "BDT",
              availability: "InStock",
              ratingValue: stats.average,
              reviewCount: stats.total,
            }),
          ),
        }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd({
              items: breadcrumbs.map((b) => ({
                name: b.label,
                url: b.href ? `${SITE_URL}${b.href}` : `${SITE_URL}/products/${product.slug}`,
              })),
            }),
          ),
        }}
      />
    </Container>
  );
}
