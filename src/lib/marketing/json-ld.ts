/**
 * JSON-LD schema.org generators for SEO.
 * All generators produce a plain object suitable for JSON.stringify into a
 * <script type="application/ld+json"> tag.
 */

export interface OrganizationLdInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export function organizationLd(input: OrganizationLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    ...(input.logo && { logo: input.logo }),
    ...(input.sameAs && input.sameAs.length > 0 && { sameAs: input.sameAs }),
  };
}

export interface BreadcrumbLdInput {
  items: { name: string; url: string }[];
}

export function breadcrumbLd(input: BreadcrumbLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: input.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export interface ProductLdInput {
  name: string;
  description?: string;
  image?: string[];
  sku?: string;
  brand?: string;
  url: string;
  price: number;
  priceCurrency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
}

export function productLd(input: ProductLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && input.image.length > 0 && { image: input.image }),
    ...(input.sku && { sku: input.sku }),
    ...(input.brand && {
      brand: { "@type": "Brand", name: input.brand },
    }),
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: input.priceCurrency,
      price: input.price.toFixed(2),
      availability: `https://schema.org/${input.availability ?? "InStock"}`,
    },
    ...(input.ratingValue !== undefined &&
      input.reviewCount !== undefined &&
      input.reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: input.ratingValue.toFixed(1),
          reviewCount: input.reviewCount,
        },
      }),
  };
}

export interface ReviewLdInput {
  itemName: string;
  author: string;
  rating: number;
  body: string;
  datePublished: string;
}

export function reviewLd(input: ReviewLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: input.itemName },
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.rating,
      bestRating: 5,
    },
    author: { "@type": "Person", name: input.author },
    reviewBody: input.body,
    datePublished: input.datePublished,
  };
}

export interface FAQLdInput {
  items: { question: string; answer: string }[];
}

export function faqLd(input: FAQLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export interface ArticleLdInput {
  headline: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  url: string;
}

export function articleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    ...(input.image && { image: [input.image] }),
    ...(input.author && {
      author: { "@type": "Person", name: input.author },
    }),
    datePublished: input.datePublished,
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.description && { description: input.description }),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}
