import { z } from "zod";

// ─────────────────────────────────────────────
// Address
// ─────────────────────────────────────────────

export const addressCreateSchema = z.object({
  label: z.string().max(100).optional(),
  name: z.string().min(1).max(255),
  phone: z.string().min(7).max(50),
  addressLine1: z.string().min(1),
  addressLine2: z.string().nullable().optional(),
  district: z.string().min(1).max(100),
  area: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  postalCode: z.string().max(20).nullable().optional(),
  isDefault: z.boolean().default(false).optional(),
});

export const addressUpdateSchema = addressCreateSchema.partial();

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────

export const cartAddItemSchema = z.object({
  variantId: z.number().int().positive(),
  quantity: z.number().int().positive().max(99).default(1),
});

export const cartUpdateItemSchema = z.object({
  quantity: z.number().int().nonnegative().max(99),
});

// ─────────────────────────────────────────────
// Checkout
// ─────────────────────────────────────────────

export const checkoutSchema = z.object({
  cartId: z.number().int().positive().optional(),
  // Either userId (from session) or guest contact
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().min(7).max(50).optional(),
  // Shipping address (inline OR addressId)
  addressId: z.number().int().positive().optional(),
  shippingAddress: addressCreateSchema.optional(),
  shippingZoneId: z.number().int().positive().optional(),
  shippingRateId: z.number().int().positive(),
  paymentMethod: z.enum(["COD", "BKASH", "SSLCOMMERZ", "STRIPE"]).default("COD"),
  couponCode: z.string().max(100).optional(),
  note: z.string().max(1000).optional(),
  idempotencyKey: z.string().min(8).max(255),
});

// ─────────────────────────────────────────────
// Coupon
// ─────────────────────────────────────────────

export const couponCreateSchema = z.object({
  code: z.string().min(2).max(100),
  type: z.enum(["PERCENTAGE", "FLAT", "FREE_SHIPPING"]),
  value: z.number().nonnegative(),
  minOrderAmount: z.number().nonnegative().nullable().optional(),
  maxDiscountAmount: z.number().nonnegative().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  perUserLimit: z.number().int().positive().default(1).optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active").optional(),
});

export const couponUpdateSchema = couponCreateSchema.partial();

export const couponApplySchema = z.object({
  code: z.string().min(2).max(100),
  cartId: z.number().int().positive(),
});

// ─────────────────────────────────────────────
// Shipping
// ─────────────────────────────────────────────

export const shippingZoneCreateSchema = z.object({
  name: z.string().min(1).max(255),
  districts: z.array(z.string()).default([]),
  deliveryDaysMin: z.number().int().min(1).max(30).default(1),
  deliveryDaysMax: z.number().int().min(1).max(60).default(3),
});

export const shippingRateCreateSchema = z.object({
  zoneId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  price: z.number().nonnegative(),
  freeAboveAmount: z.number().nonnegative().nullable().optional(),
});

// ─────────────────────────────────────────────
// Order admin update
// ─────────────────────────────────────────────

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
  ]),
  note: z.string().max(1000).optional(),
});

export type AddressCreateInput = z.infer<typeof addressCreateSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CouponCreateInput = z.infer<typeof couponCreateSchema>;
export type CouponApplyInput = z.infer<typeof couponApplySchema>;
export type ShippingZoneCreateInput = z.infer<typeof shippingZoneCreateSchema>;
export type ShippingRateCreateInput = z.infer<typeof shippingRateCreateSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
