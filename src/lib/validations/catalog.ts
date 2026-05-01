import { z } from "zod";

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1).max(255).optional(),
  parentId: z.number().int().positive().nullable().optional(),
  image: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().max(255).nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0).optional(),
  status: z.boolean().default(true).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// ─────────────────────────────────────────────
// Brands
// ─────────────────────────────────────────────

export const brandCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1).max(255).optional(),
  logo: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  featured: z.boolean().default(false).optional(),
  seoTitle: z.string().max(255).nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  status: z.boolean().default(true).optional(),
});

export const brandUpdateSchema = brandCreateSchema.partial();

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(255).nullable().optional(),
  sortOrder: z.number().int().default(0).optional(),
  isPrimary: z.boolean().default(false).optional(),
});

export const productVariantSchema = z.object({
  sku: z.string().max(100).nullable().optional(),
  barcode: z.string().max(100).nullable().optional(),
  priceOverride: z.number().nonnegative().nullable().optional(),
  salePriceOverride: z.number().nonnegative().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  status: z.boolean().default(true).optional(),
  sortOrder: z.number().int().default(0).optional(),
  options: z
    .array(
      z.object({
        type: z.string().min(1).max(100),
        value: z.string().min(1).max(100),
      }),
    )
    .optional(),
  initialStock: z.number().int().nonnegative().default(0).optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1).max(255).optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  brandId: z.number().int().positive().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().nullable().optional(),
  costPrice: z.number().nonnegative().nullable().optional(),
  sku: z.string().max(100).nullable().optional(),
  barcode: z.string().max(100).nullable().optional(),
  weight: z.number().nonnegative().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false).optional(),
  bestSeller: z.boolean().default(false).optional(),
  seoTitle: z.string().max(255).nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImage: z.string().url().nullable().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(productImageSchema).optional(),
  variants: z.array(productVariantSchema).optional(),
  initialStock: z.number().int().nonnegative().default(0).optional(),
});

export const productUpdateSchema = productCreateSchema.partial().omit({
  variants: true,
  initialStock: true,
});

// ─────────────────────────────────────────────
// Listing query
// ─────────────────────────────────────────────

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z
    .enum(["newest", "oldest", "price-asc", "price-desc", "name-asc", "name-desc"])
    .default("newest"),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type BrandCreateInput = z.infer<typeof brandCreateSchema>;
export type BrandUpdateInput = z.infer<typeof brandUpdateSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
