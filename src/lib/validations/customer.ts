import { z } from "zod";

export const wishlistAddSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().optional(),
});
export type WishlistAddInput = z.infer<typeof wishlistAddSchema>;

export const reviewCreateSchema = z.object({
  productId: z.number().int().positive(),
  orderId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(200).optional(),
  body: z.string().min(5).max(4000),
  images: z.array(z.string().url()).max(5).optional(),
});
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;

export const reviewModerateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
export type ReviewModerateInput = z.infer<typeof reviewModerateSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+0-9\s-]+$/)
    .optional(),
  avatar: z.string().url().optional(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(128),
});
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
