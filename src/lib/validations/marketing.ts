import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

export const campaignCreateSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(slugRegex, "Lowercase letters, digits, dashes only."),
  description: z.string().max(2000).optional(),
  bannerImage: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  couponId: z.number().int().positive().optional(),
  status: z.enum(["draft", "active", "ended"]).default("draft"),
  productIds: z.array(z.number().int().positive()).default([]),
});
export type CampaignCreateInput = z.infer<typeof campaignCreateSchema>;

export const campaignUpdateSchema = campaignCreateSchema.partial();
export type CampaignUpdateInput = z.infer<typeof campaignUpdateSchema>;

export const blogCategoryCreateSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(slugRegex),
});
export type BlogCategoryCreateInput = z.infer<typeof blogCategoryCreateSchema>;

export const blogTagCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(slugRegex),
});
export type BlogTagCreateInput = z.infer<typeof blogTagCreateSchema>;

export const blogPostCreateSchema = z.object({
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(slugRegex),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  featuredImage: z.string().url().optional(),
  categoryId: z.number().int().positive().optional(),
  tagIds: z.array(z.number().int().positive()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  ogImage: z.string().url().optional(),
});
export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;

export const blogPostUpdateSchema = blogPostCreateSchema.partial();
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;

export const newsletterSubscribeSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(255).optional(),
  source: z.string().max(100).optional(),
});
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

export const bannerCreateSchema = z.object({
  title: z.string().min(2).max(255),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  position: z.string().max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.number().int().default(0),
});
export type BannerCreateInput = z.infer<typeof bannerCreateSchema>;
