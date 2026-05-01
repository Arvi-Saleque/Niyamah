import type { MetadataRoute } from "next";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, categories, brands, blogPosts } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://niyamah.com.bd";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [productRows, categoryRows, brandRows, postRows] = await Promise.all([
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(
        and(
          eq(products.storeId, DEFAULT_STORE_ID),
          eq(products.status, "published"),
        ),
      ),
    db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.storeId, DEFAULT_STORE_ID)),
    db
      .select({ slug: brands.slug })
      .from(brands)
      .where(eq(brands.storeId, DEFAULT_STORE_ID)),
    db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.storeId, DEFAULT_STORE_ID),
          eq(blogPosts.status, "published"),
        ),
      ),
  ]);

  const dynamicUrls: MetadataRoute.Sitemap = [
    ...productRows.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categoryRows.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...brandRows.map((b) => ({
      url: `${SITE_URL}/brand/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...postRows.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticUrls, ...dynamicUrls];
}
