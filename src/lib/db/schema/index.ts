import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  numeric,
  smallint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export const storePlanEnum = pgEnum("store_plan", [
  "free",
  "starter",
  "pro",
  "enterprise",
]);
export const storeStatusEnum = pgEnum("store_status", [
  "active",
  "inactive",
  "suspended",
]);

export const userRoleEnum = pgEnum("user_role", [
  "superadmin",
  "admin",
  "manager",
  "staff",
  "customer",
]);

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "COD",
  "BKASH",
  "SSLCOMMERZ",
  "STRIPE",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

export const couponTypeEnum = pgEnum("coupon_type", [
  "PERCENTAGE",
  "FLAT",
  "FREE_SHIPPING",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const returnRequestStatusEnum = pgEnum("return_request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export const blogPostStatusEnum = pgEnum("blog_post_status", [
  "draft",
  "published",
  "archived",
]);

export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "document",
]);

export const bannerStatusEnum = pgEnum("banner_status", [
  "active",
  "inactive",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "active",
  "ended",
]);

export const couponStatusEnum = pgEnum("coupon_status", ["active", "inactive"]);

export const otpPurposeEnum = pgEnum("otp_purpose", [
  "checkout",
  "phone_verification",
  "login",
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "PENDING",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
  "FAILED",
]);

export const blacklistReasonEnum = pgEnum("blacklist_reason", [
  "REPEATED_REFUSAL",
  "FAKE_ORDERS",
  "FRAUD",
  "ABUSE",
  "OTHER",
]);

// ─────────────────────────────────────────────
// Homepage / CMS Blocks
// ─────────────────────────────────────────────

export const homepageBlocks = pgTable(
  "homepage_blocks",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    blockKey: varchar("block_key", { length: 64 }).notNull(),
    data: json("data").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("homepage_blocks_store_key_uniq").on(t.storeId, t.blockKey),
  }),
);

// ─────────────────────────────────────────────
// Store & Tenant
// ─────────────────────────────────────────────

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  plan: storePlanEnum("plan").notNull().default("free"),
  status: storeStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  currency: varchar("currency", { length: 10 }).notNull().default("BDT"),
  language: varchar("language", { length: 10 }).notNull().default("en"),
  timezone: varchar("timezone", { length: 100 })
    .notNull()
    .default("Asia/Dhaka"),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  address: text("address"),
  logoUrl: varchar("logo_url", { length: 500 }),
  faviconUrl: varchar("favicon_url", { length: 500 }),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storeThemes = pgTable("store_themes", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  themeKey: varchar("theme_key", { length: 100 }).notNull().default("default"),
  config: json("config"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────
// Auth — Users, Accounts, Sessions
// ─────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified"),
    passwordHash: text("password_hash"),
    phone: varchar("phone", { length: 50 }),
    avatar: varchar("avatar", { length: 500 }),
    role: userRoleEnum("role").notNull().default("customer"),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// ─────────────────────────────────────────────
// RBAC — Roles, Permissions, Store Users
// ─────────────────────────────────────────────

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 150 }).notNull().unique(),
  description: text("description"),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const storeUsers = pgTable(
  "store_users",
  {
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: integer("role_id").references(() => roles.id, {
      onDelete: "set null",
    }),
  },
  (table) => [primaryKey({ columns: [table.storeId, table.userId] })],
);

// ─────────────────────────────────────────────
// Catalog — Categories, Brands, Products
// ─────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    parentId: integer("parent_id"),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    image: varchar("image", { length: 500 }),
    description: text("description"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: boolean("status").notNull().default(true),
  },
  (table) => [
    uniqueIndex("categories_store_slug_idx").on(table.storeId, table.slug),
    index("categories_parent_idx").on(table.parentId),
  ],
);

export const brands = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    logo: varchar("logo", { length: 500 }),
    description: text("description"),
    featured: boolean("featured").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    status: boolean("status").notNull().default(true),
  },
  (table) => [
    uniqueIndex("brands_store_slug_idx").on(table.storeId, table.slug),
  ],
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    brandId: integer("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    shortDescription: text("short_description"),
    description: text("description"),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    sku: varchar("sku", { length: 100 }),
    barcode: varchar("barcode", { length: 100 }),
    weight: numeric("weight", { precision: 8, scale: 2 }),
    status: productStatusEnum("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    bestSeller: boolean("best_seller").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    ogImage: varchar("og_image", { length: 500 }),
    tags: text("tags").array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("products_store_slug_idx").on(table.storeId, table.slug),
    index("products_store_idx").on(table.storeId),
    index("products_category_idx").on(table.categoryId),
    index("products_brand_idx").on(table.brandId),
    index("products_status_idx").on(table.status),
  ],
);

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const productVideos = pgTable("product_videos", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
});

export const variantOptionTypes = pgTable("variant_option_types", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
});

export const variantOptionValues = pgTable("variant_option_values", {
  id: serial("id").primaryKey(),
  optionTypeId: integer("option_type_id")
    .notNull()
    .references(() => variantOptionTypes.id, { onDelete: "cascade" }),
  value: varchar("value", { length: 100 }).notNull(),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }),
    barcode: varchar("barcode", { length: 100 }),
    priceOverride: numeric("price_override", { precision: 12, scale: 2 }),
    salePriceOverride: numeric("sale_price_override", {
      precision: 12,
      scale: 2,
    }),
    imageUrl: varchar("image_url", { length: 500 }),
    status: boolean("status").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("product_variants_product_idx").on(table.productId)],
);

export const productVariantOptions = pgTable(
  "product_variant_options",
  {
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    optionValueId: integer("option_value_id")
      .notNull()
      .references(() => variantOptionValues.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.variantId, table.optionValueId] })],
);

// ─────────────────────────────────────────────
// Inventory
// ─────────────────────────────────────────────

export const inventory = pgTable(
  "inventory",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    stockOnHand: integer("stock_on_hand").notNull().default(0),
    stockReserved: integer("stock_reserved").notNull().default(0),
    stockAvailable: integer("stock_available").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    trackStock: boolean("track_stock").notNull().default(true),
  },
  (table) => [
    uniqueIndex("inventory_variant_idx").on(table.variantId),
    index("inventory_store_idx").on(table.storeId),
  ],
);

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────

export const carts = pgTable(
  "carts",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sessionId: varchar("session_id", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("carts_user_idx").on(table.userId),
    index("carts_session_idx").on(table.sessionId),
  ],
);

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  variantId: integer("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  priceSnapshot: numeric("price_snapshot", {
    precision: 12,
    scale: 2,
  }).notNull(),
});

// ─────────────────────────────────────────────
// Addresses
// ─────────────────────────────────────────────

export const addresses = pgTable(
  "addresses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 100 }),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    district: varchar("district", { length: 100 }).notNull(),
    area: varchar("area", { length: 100 }),
    city: varchar("city", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (table) => [index("addresses_user_idx").on(table.userId)],
);

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    guestEmail: varchar("guest_email", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 50 }),
    shippingName: varchar("shipping_name", { length: 255 }),
    shippingPhone: varchar("shipping_phone", { length: 50 }),
    shippingAddressLine1: text("shipping_address_line1"),
    shippingAddressLine2: text("shipping_address_line2"),
    shippingDistrict: varchar("shipping_district", { length: 100 }),
    shippingArea: varchar("shipping_area", { length: 100 }),
    shippingCity: varchar("shipping_city", { length: 100 }),
    shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    shippingAmount: numeric("shipping_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    couponId: integer("coupon_id"),
    couponCode: varchar("coupon_code", { length: 100 }),
    note: text("note"),
    idempotencyKey: varchar("idempotency_key", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("orders_store_idx").on(table.storeId),
    index("orders_user_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    uniqueIndex("orders_idempotency_idx").on(table.idempotencyKey),
  ],
);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: integer("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  variantLabel: varchar("variant_label", { length: 255 }),
  sku: varchar("sku", { length: 100 }),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: orderStatusEnum("from_status"),
  toStatus: orderStatusEnum("to_status").notNull(),
  note: text("note"),
  actorId: text("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    method: paymentMethodEnum("method").notNull().default("COD"),
    status: paymentStatusEnum("status").notNull().default("UNPAID"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("BDT"),
    gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }),
    gatewayResponse: json("gateway_response"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("payments_order_idx").on(table.orderId),
    index("payments_store_idx").on(table.storeId),
  ],
);

// ─────────────────────────────────────────────
// Commerce — Coupons, Campaigns, Wishlists
// ─────────────────────────────────────────────

export const coupons = pgTable(
  "coupons",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 100 }).notNull(),
    type: couponTypeEnum("type").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }),
    maxDiscountAmount: numeric("max_discount_amount", {
      precision: 12,
      scale: 2,
    }),
    usageLimit: integer("usage_limit"),
    perUserLimit: integer("per_user_limit").notNull().default(1),
    usageCount: integer("usage_count").notNull().default(0),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    status: couponStatusEnum("status").notNull().default("active"),
  },
  (table) => [
    uniqueIndex("coupons_store_code_idx").on(table.storeId, table.code),
    index("coupons_store_idx").on(table.storeId),
  ],
);

export const couponUsage = pgTable(
  "coupon_usage",
  {
    id: serial("id").primaryKey(),
    couponId: integer("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    orderId: integer("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    usedAt: timestamp("used_at").notNull().defaultNow(),
  },
  (table) => [index("coupon_usage_coupon_idx").on(table.couponId)],
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    bannerImage: varchar("banner_image", { length: 500 }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    couponId: integer("coupon_id").references(() => coupons.id, {
      onDelete: "set null",
    }),
    status: campaignStatusEnum("status").notNull().default("draft"),
  },
  (table) => [
    uniqueIndex("campaigns_store_slug_idx").on(table.storeId, table.slug),
  ],
);

export const campaignProducts = pgTable(
  "campaign_products",
  {
    campaignId: integer("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.campaignId, table.productId] })],
);

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
});

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: serial("id").primaryKey(),
    wishlistId: integer("wishlist_id")
      .notNull()
      .references(() => wishlists.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: integer("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("wishlist_items_unique_idx").on(
      table.wishlistId,
      table.productId,
    ),
  ],
);

// ─────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    orderId: integer("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    rating: smallint("rating").notNull(),
    title: varchar("title", { length: 255 }),
    body: text("body"),
    status: reviewStatusEnum("status").notNull().default("PENDING"),
    verifiedPurchase: boolean("verified_purchase").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("reviews_product_idx").on(table.productId),
    index("reviews_store_idx").on(table.storeId),
    index("reviews_status_idx").on(table.status),
  ],
);

export const reviewImages = pgTable("review_images", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
});

// ─────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────

export const blogCategories = pgTable(
  "blog_categories",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex("blog_categories_store_slug_idx").on(
      table.storeId,
      table.slug,
    ),
  ],
);

export const blogTags = pgTable(
  "blog_tags",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
  },
  (table) => [
    uniqueIndex("blog_tags_store_slug_idx").on(table.storeId, table.slug),
  ],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").references(() => blogCategories.id, {
      onDelete: "set null",
    }),
    authorId: text("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    featuredImage: varchar("featured_image", { length: 500 }),
    status: blogPostStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    ogImage: varchar("og_image", { length: 500 }),
  },
  (table) => [
    uniqueIndex("blog_posts_store_slug_idx").on(table.storeId, table.slug),
    index("blog_posts_store_idx").on(table.storeId),
    index("blog_posts_status_idx").on(table.status),
  ],
);

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

// ─────────────────────────────────────────────
// Media & UI
// ─────────────────────────────────────────────

export const mediaLibrary = pgTable(
  "media_library",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    url: varchar("url", { length: 500 }).notNull(),
    publicId: varchar("public_id", { length: 255 }),
    filename: varchar("filename", { length: 255 }),
    size: integer("size"),
    type: mediaTypeEnum("type").notNull().default("image"),
    uploadedBy: text("uploaded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("media_library_store_idx").on(table.storeId)],
);

export const banners = pgTable(
  "banners",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    linkUrl: varchar("link_url", { length: 500 }),
    position: varchar("position", { length: 100 }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    status: bannerStatusEnum("status").notNull().default("active"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("banners_store_idx").on(table.storeId)],
);

export const sliders = pgTable("sliders", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  items: json("items").notNull().default([]),
});

// ─────────────────────────────────────────────
// Shipping
// ─────────────────────────────────────────────

export const shippingZones = pgTable(
  "shipping_zones",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    districts: text("districts").array(),
    deliveryDaysMin: smallint("delivery_days_min").notNull().default(1),
    deliveryDaysMax: smallint("delivery_days_max").notNull().default(3),
  },
  (table) => [index("shipping_zones_store_idx").on(table.storeId)],
);

export const shippingRates = pgTable("shipping_rates", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => shippingZones.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  freeAboveAmount: numeric("free_above_amount", { precision: 12, scale: 2 }),
});

// ─────────────────────────────────────────────
// System — Audit Logs, Notifications
// ─────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 150 }).notNull(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: varchar("entity_id", { length: 100 }),
    before: json("before"),
    after: json("after"),
    ip: varchar("ip", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_store_idx").on(table.storeId),
    index("audit_logs_actor_idx").on(table.actorId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    type: varchar("type", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_store_idx").on(table.storeId),
  ],
);

// ─────────────────────────────────────────────
// Return / Refund Requests
// ─────────────────────────────────────────────

export const returnRequests = pgTable(
  "return_requests",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reason: text("reason").notNull(),
    /** JSON array of { orderItemId: number, quantity: number }. */
    items: json("items").notNull(),
    status: returnRequestStatusEnum("status").notNull().default("PENDING"),
    adminNote: text("admin_note"),
    refundAmount: numeric("refund_amount", { precision: 12, scale: 2 }),
    resolvedBy: text("resolved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("return_requests_order_idx").on(table.orderId),
    index("return_requests_user_idx").on(table.userId),
    index("return_requests_status_idx").on(table.status),
    index("return_requests_store_idx").on(table.storeId),
  ],
);

// ─────────────────────────────────────────────
// Newsletter
// ─────────────────────────────────────────────

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    source: varchar("source", { length: 100 }),
    subscribed: boolean("subscribed").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at"),
  },
  (table) => [
    uniqueIndex("newsletter_store_email_idx").on(table.storeId, table.email),
    index("newsletter_store_idx").on(table.storeId),
  ],
);

// ─────────────────────────────────────────────
// OTP codes — phone/email verification (COD fraud control)
// ─────────────────────────────────────────────

export const otpCodes = pgTable(
  "otp_codes",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    /** Either phone or email — one of the two is set. */
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    /** bcrypt-hashed code; never store plaintext. */
    codeHash: text("code_hash").notNull(),
    purpose: otpPurposeEnum("purpose").notNull().default("checkout"),
    attempts: integer("attempts").notNull().default(0),
    consumedAt: timestamp("consumed_at"),
    expiresAt: timestamp("expires_at").notNull(),
    requesterIp: varchar("requester_ip", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("otp_codes_phone_idx").on(table.phone),
    index("otp_codes_email_idx").on(table.email),
    index("otp_codes_store_idx").on(table.storeId),
    index("otp_codes_expires_idx").on(table.expiresAt),
  ],
);

// ─────────────────────────────────────────────
// Customer blacklist — block repeat-refusal COD phones
// ─────────────────────────────────────────────

export const customerBlacklist = pgTable(
  "customer_blacklist",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    reason: blacklistReasonEnum("reason").notNull().default("OTHER"),
    note: text("note"),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("customer_blacklist_store_idx").on(table.storeId),
    index("customer_blacklist_phone_idx").on(table.phone),
    index("customer_blacklist_email_idx").on(table.email),
  ],
);

// ─────────────────────────────────────────────
// Shipments — courier dispatch tracking
// ─────────────────────────────────────────────

export const shipments = pgTable(
  "shipments",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** e.g. "steadfast", "pathao", "redx", "sundarban", "manual". */
    courier: varchar("courier", { length: 50 }).notNull(),
    /** Provider's consignment id / tracking number. */
    trackingCode: varchar("tracking_code", { length: 255 }),
    consignmentId: varchar("consignment_id", { length: 255 }),
    status: shipmentStatusEnum("status").notNull().default("PENDING"),
    codAmount: numeric("cod_amount", { precision: 12, scale: 2 }),
    note: text("note"),
    /** Raw provider response for debugging. */
    providerResponse: json("provider_response"),
    dispatchedBy: text("dispatched_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("shipments_order_idx").on(table.orderId),
    index("shipments_store_idx").on(table.storeId),
    index("shipments_tracking_idx").on(table.trackingCode),
  ],
);

// ─────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────

export const storesRelations = relations(stores, ({ many, one }) => ({
  settings: one(storeSettings, {
    fields: [stores.id],
    references: [storeSettings.storeId],
  }),
  themes: many(storeThemes),
  categories: many(categories),
  brands: many(brands),
  products: many(products),
  coupons: many(coupons),
  campaigns: many(campaigns),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  reviews: many(reviews),
  mediaLibrary: many(mediaLibrary),
  banners: many(banners),
  sliders: many(sliders),
  shippingZones: many(shippingZones),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
  storeUsers: many(storeUsers),
  roles: many(roles),
  blogCategories: many(blogCategories),
  blogTags: many(blogTags),
  blogPosts: many(blogPosts),
  inventory: many(inventory),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  addresses: many(addresses),
  reviews: many(reviews),
  storeUsers: many(storeUsers),
  notifications: many(notifications),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  images: many(productImages),
  videos: many(productVideos),
  variantOptionTypes: many(variantOptionTypes),
  variants: many(productVariants),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  campaignProducts: many(campaignProducts),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantOptions: many(productVariantOptions),
    inventory: many(inventory),
    cartItems: many(cartItems),
    orderItems: many(orderItems),
    wishlistItems: many(wishlistItems),
  }),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  payment: many(payments),
  couponUsage: many(couponUsage),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  store: one(stores, { fields: [carts.storeId], references: [stores.id] }),
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  store: one(stores, { fields: [coupons.storeId], references: [stores.id] }),
  usage: many(couponUsage),
  campaigns: many(campaigns),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  store: one(stores, { fields: [campaigns.storeId], references: [stores.id] }),
  coupon: one(coupons, {
    fields: [campaigns.couponId],
    references: [coupons.id],
  }),
  products: many(campaignProducts),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  store: one(stores, { fields: [reviews.storeId], references: [stores.id] }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
  images: many(reviewImages),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  store: one(stores, {
    fields: [blogPosts.storeId],
    references: [stores.id],
  }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  tags: many(blogPostTags),
}));

export const shippingZonesRelations = relations(
  shippingZones,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [shippingZones.storeId],
      references: [stores.id],
    }),
    rates: many(shippingRates),
  }),
);
