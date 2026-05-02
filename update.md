# Niyamah — Implementation Log

This file tracks every implementation milestone. Each entry records which files were
created/modified and what was implemented, so the current state of the project is always
clear at a glance.

---

## Phase 0 — Repository Bootstrap

**Commit:** `first commit`

| File | What was done |
|------|---------------|
| `.gitignore` | Comprehensive ignore rules: node_modules, .next, dist, .env*, drizzle/meta, coverage, logs, OS/editor files, Meilisearch data, planning docs |
| `goal.md` | Full project plan: tech stack, architecture, DB schema (all tables), API design, storefront pages, admin panel sections, design tokens, dev phases, SaaS notes |
| `logo.png` | Brand logo asset |

---

## Phase 1 — Engineering Foundation

**Commit:** `feat: project scaffold — Next.js 16, config files, folder structure`

### Config Files

| File | What was done |
|------|---------------|
| `package.json` | Project manifest with all runtime + dev dependencies, npm scripts (dev / build / start / lint / lint:fix / format / db:generate / db:migrate / db:studio / db:push), `"overrides": { "postcss": ">=8.5.3" }` security mitigation |
| `next.config.ts` | Next.js 16 config: Cloudinary remote image pattern, security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy) |
| `tsconfig.json` | TypeScript strict mode + noUncheckedIndexedAccess + noImplicitOverride + noUnusedLocals/Parameters + exactOptionalPropertyTypes. Path aliases: @/*, @/components/*, @/lib/*, @/modules/*, @/hooks/*, @/types/*, @/config/* |
| `eslint.config.mjs` | ESLint v9 flat config — next/core-web-vitals + next/typescript, no-unused-vars (with _ prefix ignore), consistent-type-imports, no-explicit-any warn |
| `.prettierrc` | semi, double quotes, tabWidth 2, trailing comma all, printWidth 100, prettier-plugin-tailwindcss |
| `postcss.config.mjs` | Tailwind v4 style — `@tailwindcss/postcss: {}` plugin |
| `drizzle.config.ts` | Schema at `./src/lib/db/schema/index.ts`, migrations to `./drizzle`, dialect postgresql, reads DATABASE_URL from env |
| `.env.example` | All required environment variables documented with comments |

### App Entry Points

| File | What was done |
|------|---------------|
| `src/app/globals.css` | Tailwind v4 `@import "tailwindcss"`, `@theme` block with full design token set (colors: background, surface, border, text, accent, semantic; typography: --font-heading Playfair Display + --font-body Inter; border radius scale), base resets, scrollbar styling, focus-visible ring, selection highlight |
| `src/app/layout.tsx` | Root layout — loads Inter + Playfair Display via next/font/google, exports `metadata` (title template, OG, Twitter, robots) and `viewport` config, mounts font CSS variables on `<html>` |
| `src/app/page.tsx` | Root page — delegates to (storefront) route group |
| `src/app/(storefront)/layout.tsx` | Storefront shell layout — flex column, min-h-screen, placeholder for Header + Footer |
| `src/app/(storefront)/page.tsx` | Storefront home placeholder — centered brand mark, "coming soon" message |
| `src/app/(admin)/admin/layout.tsx` | Admin shell layout — side-by-side flex, surface-alt background, placeholder for Sidebar + Topbar |
| `src/app/(admin)/admin/page.tsx` | Admin dashboard placeholder |
| `src/app/(auth)/layout.tsx` | Auth card layout — centered max-w-md card with border + shadow |
| `src/app/api/v1/.gitkeep` | Reserves the REST API v1 namespace |

### Folder Structure (Placeholders)

| Directory | Purpose |
|-----------|---------|
| `src/modules/auth/` | Authentication module (domain / application / infrastructure) |
| `src/modules/catalog/` | Products, categories, variants |
| `src/modules/cart/` | Session + persistent cart |
| `src/modules/checkout/` | Checkout flow, idempotency, order creation |
| `src/modules/orders/` | Order management, status transitions |
| `src/modules/inventory/` | Stock tracking, reservations |
| `src/modules/customers/` | Customer profiles, addresses |
| `src/modules/coupons/` | Discount codes, validation |
| `src/modules/campaigns/` | Promotional campaigns |
| `src/modules/reviews/` | Product reviews, moderation |
| `src/modules/blog/` | CMS-lite blog |
| `src/modules/search/` | Meilisearch integration |
| `src/modules/marketing/` | Email capture, banners |
| `src/modules/shipping/` | Shipping zones, rates |
| `src/modules/store/` | Store settings, themes |
| `src/modules/media/` | Cloudinary asset management |
| `src/components/ui/` | Primitive UI components (Button, Input, etc.) |
| `src/components/storefront/` | Storefront-specific composed components |
| `src/components/admin/` | Admin panel components |
| `src/components/shared/` | Components shared across storefront + admin |
| `src/lib/db/schema/` | Drizzle ORM schema files |
| `src/lib/redis/` | Upstash Redis client + helpers |
| `src/lib/meilisearch/` | Meilisearch client + index helpers |
| `src/lib/cloudinary/` | Cloudinary config + upload helpers |
| `src/lib/auth/` | Auth.js v5 config + adapters |
| `src/lib/validations/` | Shared Zod schemas |
| `src/lib/utils/` | General utility functions |
| `src/hooks/` | Custom React hooks |
| `src/types/` | Shared TypeScript types / interfaces |
| `src/config/` | App-wide constants and configuration objects |

---

---

## Phase 2 — Complete Reusable Component System

**Commit:** `feat: reusable component system — 88 components across 8 phases`

### Setup

| File | What was done |
|---|---|
| `package.json` | Removed conflicting `overrides` block that broke shadcn init |
| `components.json` | shadcn/ui v4.6 init — style: default, rsc: true, tsx: true, aliases set |
| `src/app/globals.css` | Added `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`, `@custom-variant dark` |
| `src/components/ui/` | All 34 shadcn primitives installed: button, input, label, textarea, select, checkbox, radio-group, switch, badge, avatar, separator, skeleton, dialog, sheet, drawer, dropdown-menu, tooltip, popover, alert-dialog, command, card, tabs, accordion, scroll-area, collapsible, navigation-menu, breadcrumb, pagination, form, slider, sonner, alert, progress, table |
| `src/lib/utils.ts` | Extended with `formatCurrency(BDT)`, `discountPercent`, `truncate`, `slugify` |
| `src/stores/cart-store.ts` | Zustand cart store with `persist` middleware — addItem, removeItem, updateQuantity, clearCart, openCart/closeCart, totalItems(), totalPrice() |
| `src/stores/wishlist-store.ts` | Zustand wishlist store with `persist` middleware — addItem, removeItem, toggle, has() |

### Phase 1 — Design System Primitives (21 components in `src/components/shared/`)

container, section, typography (Heading + Text), logo, section-header, page-header, breadcrumbs, price-text, discount-badge, rating-stars, status-badge, stock-indicator, empty-state, error-state, skeleton-card, image-with-fallback, confirm-dialog, copy-button, quantity-stepper, countdown-timer, pagination-controls

### Phase 2 — Layout Components (7 components)

`src/components/storefront/`: top-bar, site-header, mega-menu, mobile-nav, site-footer  
`src/components/admin/`: admin-sidebar, admin-topbar

### Phase 3 — Product Components (14 components in `src/components/storefront/`)

product-card, product-grid, product-list-view, product-gallery, product-info, product-variant-selector, add-to-cart-button, wishlist-button, product-quick-view, product-tabs, product-specs-table, related-products, product-review-card, product-review-form

### Phase 4 — Catalog / Filter / Search (9 components in `src/components/storefront/`)

category-card, category-grid, search-bar, search-suggestions, filter-sidebar, filter-drawer, active-filters, sort-dropdown, price-range-slider

### Phase 5 — Cart (7 components in `src/components/storefront/`)

mini-cart-button, cart-drawer, cart-item, cart-summary, coupon-box, free-shipping-progress, cart-empty-state

### Phase 6 — Checkout + Auth (9 components)

`src/components/storefront/`: checkout-steps, address-form, delivery-method-selector, payment-method-selector (COD v1), order-summary, order-confirmation  
`src/components/auth/`: login-form, register-form, forgot-password-form

### Phase 7 — Marketing / Homepage (9 components in `src/components/storefront/`)

hero-slider, campaign-banner, flash-sale-section, featured-categories, trust-badges, testimonials-section, newsletter-box, best-seller-section, new-arrivals-section

### Phase 8 — Admin Dashboard (11 components in `src/components/admin/`)

stats-card, data-table, table-actions, product-form, product-image-uploader, category-form, order-status-updater, coupon-form, banner-manager, settings-form, notification-panel

### Documentation

| File | What was done |
|---|---|
| `components.md` | Full component registry — all 88 components with file path, phase, and description |
| `goal.md` | Added Component-First Development Rule — always use components, never raw inline JSX |

---

## Phase 3 — Backend: Engineering Foundation

**Commit:** `feat(backend/phase-1): engineering foundation — Drizzle schema (47 tables), DB client, Auth.js v5 credentials, Redis client, rate limiter, API response helpers, register endpoint, migration SQL`

### Database

| File | What was done |
|---|---|
| `src/lib/db/schema/index.ts` | Full Drizzle ORM schema — 47 tables, 14 pg enums, all relations declared. Tables: stores, store_settings, store_themes, users, accounts, sessions, verification_tokens, roles, permissions, role_permissions, store_users, categories, brands, products, product_images, product_videos, variant_option_types, variant_option_values, product_variants, product_variant_options, inventory, carts, cart_items, addresses, orders, order_items, order_status_history, payments, coupons, coupon_usage, campaigns, campaign_products, wishlists, wishlist_items, reviews, review_images, blog_categories, blog_tags, blog_posts, blog_post_tags, media_library, banners, sliders, shipping_zones, shipping_rates, audit_logs, notifications |
| `src/lib/db/index.ts` | Neon PostgreSQL connection singleton via `@neondatabase/serverless` + Drizzle ORM client. Throws on missing DATABASE_URL. |
| `drizzle/0000_organic_thunderbolts.sql` | Auto-generated migration SQL covering all 47 tables + 14 enums + all FK constraints + all indexes |
| `drizzle.config.ts` | Updated to load `.env.local` via `dotenv` config — ensures drizzle-kit can read DATABASE_URL in local dev |

### Auth

| File | What was done |
|---|---|
| `src/lib/auth/index.ts` | Auth.js v5 config — Credentials provider (email + password only, Google skipped for v1). JWT session strategy. RBAC: user `role` injected into JWT token and session. DrizzleAdapter wired to all 4 Auth.js tables (users, accounts, sessions, verification_tokens). Custom sign-in page at `/login`. |
| `src/lib/validations/auth.ts` | Zod schemas: `loginSchema` (email + password), `registerSchema` (name, email, strong password, optional phone), `forgotPasswordSchema`, `resetPasswordSchema` (with confirm-password refinement). Exported TypeScript inference types for all schemas. |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js route handler — exports GET + POST from `handlers` |

### API Layer

| File | What was done |
|---|---|
| `src/lib/utils/api-response.ts` | Centralized `apiSuccess()` and `apiError()` helpers. Fully typed generic responses matching the project API contract: `{ success: true, data, meta? }` and `{ success: false, error: { code, message, details? } }` |
| `src/app/api/v1/auth/register/route.ts` | `POST /api/v1/auth/register` — rate-limited (5 req/hr/IP), Zod-validated, duplicate email check, bcrypt password hash (cost 12), nanoid user ID, returns 201 on success |

### Infrastructure

| File | What was done |
|---|---|
| `src/lib/redis/index.ts` | Upstash Redis singleton — returns `null` gracefully when credentials not configured (safe for local dev without Redis) |
| `src/lib/redis/rate-limit.ts` | IP-based sliding-window rate limiter using `@upstash/ratelimit`. Falls back to allow-all when Redis is null. Used by all sensitive endpoints (register, login, checkout, coupon-apply) |

### Dependencies Added

| Package | Purpose |
|---|---|
| `bcryptjs` + `@types/bcryptjs` | Password hashing at cost factor 12 |
| `nanoid` | Cryptographically random user ID generation |
| `@auth/drizzle-adapter` | Auth.js v5 ↔ Drizzle ORM adapter |

### DB Push

All 47 tables + 14 enums pushed to Neon PostgreSQL via `npx drizzle-kit push` ✓

---

## Phase 3 — Hardening (Audit Fixes)

**Commit:** `fix(backend/phase-3): hardening — Toaster mount, admin middleware guard, auth pages (login/register/forgot), modular auth, REST login & forgot-password endpoints`

Audit of phases 0–3 surfaced 5 gaps. All fixed below.

### Layout & Providers

| File | What was done |
|---|---|
| `src/app/layout.tsx` | Mounted `<Toaster richColors position="top-right" closeButton />` from `@/components/ui/sonner`. Wrapped `{children}` in new `<Providers>` so `useSession()` / `signIn()` work in client components |
| `src/app/providers.tsx` | New client-only wrapper exporting `<Providers>` with `next-auth/react` `SessionProvider` |

### Middleware

| File | What was done |
|---|---|
| `src/middleware.ts` | NEW. Edge middleware reading the JWT via `getToken({ secret: AUTH_SECRET })`. Protects `/admin/*` (redirect to `/login?callbackUrl=...` if anonymous, redirect to `/` if role not in `{superadmin, admin, manager, staff}`), `/account/*` (any signed-in user), and `/api/v1/admin/*` (returns 401/403 JSON). `matcher` scoped to those three path patterns |

### Modular Auth (Clean Architecture)

| File | What was done |
|---|---|
| `src/modules/auth/domain/user.entity.ts` | NEW. `User`, `NewUser`, and `UserRole` types derived from `userRoleEnum` |
| `src/modules/auth/infrastructure/user.repository.ts` | NEW. Single source of DB access for `users`: `findByEmail`, `findById`, `create`, `updatePassword`, `markVerified`. Email always normalized to lowercase |
| `src/modules/auth/application/register-user.usecase.ts` | NEW. `registerUserUseCase()` — uniqueness check via repo, bcrypt hash (cost 12), nanoid id, role `customer`. Throws typed `EmailAlreadyTakenError` |
| `src/app/api/v1/auth/register/route.ts` | REFACTORED. Removed all direct Drizzle / bcrypt / nanoid imports. Now delegates to `registerUserUseCase`. Restores Repository Pattern compliance |

### Auth Pages

| File | What was done |
|---|---|
| `src/app/(auth)/login/page.tsx` | NEW. Wires existing `<LoginForm />` to `signIn('credentials', { email, password, redirect: false })`. Honours `?callbackUrl=`, toasts on error, `router.push` + `router.refresh()` on success |
| `src/app/(auth)/register/page.tsx` | NEW. Wires `<RegisterForm />` to `POST /api/v1/auth/register`, then auto-`signIn('credentials', ...)` so the user lands signed in. Falls back to `/login` if auto-signin fails |
| `src/app/(auth)/forgot-password/page.tsx` | NEW. Wires `<ForgotPasswordForm />` to `POST /api/v1/auth/forgot-password`. Always toasts the same generic message to prevent email enumeration |

### REST Auth Endpoints

| File | What was done |
|---|---|
| `src/app/api/v1/auth/login/route.ts` | NEW. `POST /api/v1/auth/login`. Rate-limited 10/min/IP, Zod-validated, looks up user via repo, `bcryptjs.compare`, returns `{ user: { id, name, email, role } }` on success. For mobile/external clients (web uses `signIn` cookie flow) |
| `src/app/api/v1/auth/forgot-password/route.ts` | NEW. `POST /api/v1/auth/forgot-password`. Rate-limited 3/hr/IP, Zod-validated, generic success response (no enumeration). Email dispatch wired in Phase 5 (Resend) |

---

## Next Up — Phase 4: Core Catalog API

- [ ] `src/modules/catalog/` — domain entities, repositories, use cases for products, categories, brands
- [ ] `src/app/api/v1/products/` — full CRUD (GET list, GET by slug, POST, PATCH, DELETE)
- [ ] `src/app/api/v1/categories/` — full CRUD with nested category support
- [ ] `src/app/api/v1/brands/` — full CRUD
- [ ] `src/lib/validations/catalog.ts` — Zod schemas for all catalog DTOs
- [ ] `src/lib/cloudinary/index.ts` — Cloudinary upload helper
- [ ] `src/app/api/v1/media/upload/route.ts` — image upload endpoint
- [ ] Auth middleware guard for all admin-only routes
- [ ] Seed script — default store row (id: 1) + admin user

---

## Phase 4 — Core Catalog

**Commit:** `feat(backend/phase-4): core catalog (cloudinary uploads, categories/brands/products CRUD, PostgreSQL FTS search, seed script)`

### Infrastructure

| File | What was done |
|---|---|
| `src/lib/cloudinary/index.ts` | NEW. `uploadToCloudinary(file, opts)` + `deleteFromCloudinary(publicId)` using the official `cloudinary` SDK. Reads `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET`; throws if not configured |
| `src/lib/utils/slug.ts` | NEW. `toSlug()` (ASCII, strict) + `uniqueSlug(base, existsCheck)` for collision-free URL generation |
| `src/lib/auth/guards.ts` | NEW. `getCurrentUser()`, `requireAdmin()`, `requireUser()` — server-side route guards returning `{ ctx } | { error: Response }`. Admin tier = superadmin/admin/manager/staff |
| `src/lib/constants/store.ts` | NEW. `DEFAULT_STORE_ID = 1` for the single-tenant Niyamah deployment (multi-tenant resolution lands in Phase 9) |

### Validation

| File | What was done |
|---|---|
| `src/lib/validations/catalog.ts` | NEW. Zod schemas: `categoryCreate/Update`, `brandCreate/Update`, `productCreate/Update` (with nested `images[]` + `variants[]` + per-variant `options[]` + `initialStock`), `listQuery` (page/limit/q/categoryId/brandId/status/featured/sort) |

### Catalog Module (Repository Pattern)

| File | What was done |
|---|---|
| `src/modules/catalog/infrastructure/category.repository.ts` | NEW. `list / findById / findBySlug / create / update / remove / tree` with auto-slug + uniqueness, parentId chains, sort order |
| `src/modules/catalog/infrastructure/brand.repository.ts` | NEW. Full CRUD with auto-slug + featured flag |
| `src/modules/catalog/infrastructure/product.repository.ts` | NEW. Transactional `create()` inserts product + images + variants + per-variant inventory rows + variant option types/values; `findById/findBySlug` hydrates images + variants; `update()` replaces images when provided; supports paginated list with q/category/brand/status/featured filters and 6 sort modes |

### Search Module (PostgreSQL FTS — swappable)

| File | What was done |
|---|---|
| `src/modules/search/infrastructure/product-search.repository.ts` | NEW. PostgreSQL full-text search using weighted `setweight + to_tsvector` over name/short_description/description, `plainto_tsquery`, ranked by `ts_rank_cd`. Returns hits with primary image and pagination. Isolated module so future swap to Meilisearch/Algolia touches only this file |

### API Routes

| File | What was done |
|---|---|
| `src/app/api/v1/categories/route.ts` | `GET` (public list) + `POST` (admin create). Uses `listQuerySchema` |
| `src/app/api/v1/categories/[id]/route.ts` | `GET / PATCH (admin) / DELETE (admin)` |
| `src/app/api/v1/brands/route.ts` | `GET` + `POST (admin)` |
| `src/app/api/v1/brands/[id]/route.ts` | `GET / PATCH (admin) / DELETE (admin)` |
| `src/app/api/v1/products/route.ts` | `GET` (public list, paginated meta) + `POST (admin)` |
| `src/app/api/v1/products/[id]/route.ts` | `GET / PATCH (admin) / DELETE (admin)` |
| `src/app/api/v1/products/slug/[slug]/route.ts` | Public `GET` by slug — hydrates images + variants for PDP |
| `src/app/api/v1/admin/media/upload/route.ts` | Admin-only multipart upload to Cloudinary. Limits: 8 MB / image+video MIME allowlist / 30 uploads per 10 min per IP |
| `src/app/api/v1/search/route.ts` | Public `GET /api/v1/search?q=…&page=&limit=&categoryId=&brandId=` — 60 req/min/IP, returns ranked hits with full pagination meta |

### Seed

| File | What was done |
|---|---|
| `src/lib/db/seed.ts` | NEW. `npm run db:seed` — idempotent: creates store id=1 `Niyamah` (with settings + theme), superadmin `admin@niyamah.com.bd` (bcrypt cost 12), 2 brands (Niyamah, Heritage), 3 root categories (Apparel, Accessories, Home & Living) |
| `package.json` | Added scripts: `db:seed` → `tsx --env-file=.env.local src/lib/db/seed.ts`; added deps `cloudinary`, `slugify`, `tsx` (dev) |

### Verified

- `npm run db:seed` ran successfully against Neon — store, admin user, brands, categories all created.

---

## Phase 5 — Commerce Engine

**Commit:** `feat(backend/phase-5): commerce engine — cart, addresses, shipping, coupons, transactional checkout (COD), Resend emails, Inngest 30-min stock release`

### Validation

| File | What was done |
|---|---|
| `src/lib/validations/commerce.ts` | NEW. Zod schemas: `addressCreate/Update`, `cartAddItemSchema`, `cartUpdateItemSchema`, `checkoutSchema` (cartId / guestEmail / addressId or inline shippingAddress / shippingRateId / paymentMethod default COD / couponCode / idempotencyKey min 8), `couponCreate/Update`, `couponApplySchema`, `shippingZoneCreate`, `shippingRateCreate`, `orderStatusUpdateSchema`. All matching exported types |

### Cart Module

| File | What was done |
|---|---|
| `src/modules/commerce/infrastructure/cart.repository.ts` | NEW. `findOrCreate({userId, sessionId})`, `addItem`, `updateItem` (qty 0 deletes), `removeItem`, `clear`, `mergeGuestIntoUser`, exported `load`. Effective price chain: `salePriceOverride > priceOverride > salePrice > basePrice`; persists into `cart_items.priceSnapshot`. Returns hydrated `CartView` with subtotal + line totals + primary image |
| `src/lib/session/guest.ts` | NEW. `getOrCreateSessionId()` mints/reads `niyamah_sid` http-only cookie (nanoid 24, 1-yr, sameSite lax, secure in prod) for guest cart tracking |
| `src/app/api/v1/cart/route.ts` | `GET` returns/creates cart for current user/session. `POST` adds an item |
| `src/app/api/v1/cart/items/[itemId]/route.ts` | `PATCH` updates quantity (0 deletes), `DELETE` removes |
| `src/app/api/v1/cart/merge/route.ts` | `POST` (requireUser) — merges the guest cart into the signed-in user's cart on login |

### Address Module

| File | What was done |
|---|---|
| `src/modules/commerce/infrastructure/address.repository.ts` | NEW. `listForUser`, `findForUser`, `create / update / remove`. Toggling `isDefault: true` first clears default flag on user's other addresses |
| `src/app/api/v1/addresses/route.ts` | `GET` (requireUser) lists, `POST` (requireUser) creates |
| `src/app/api/v1/addresses/[id]/route.ts` | `GET / PATCH / DELETE` scoped to current user |

### Shipping Module

| File | What was done |
|---|---|
| `src/modules/commerce/infrastructure/shipping.repository.ts` | NEW. `listZones / createZone`, `listRates(zoneId?) / createRate`, `findRate`, `findZoneForDistrict`, `computePrice(rate, subtotal)` honouring `freeAboveAmount` |
| `src/app/api/v1/shipping/zones/route.ts` | Public `GET` lists zones (needed at checkout); admin `POST` creates |
| `src/app/api/v1/shipping/rates/route.ts` | Public `GET ?zoneId=` lists rates; admin `POST` creates |

### Coupon Module

| File | What was done |
|---|---|
| `src/modules/commerce/infrastructure/coupon.repository.ts` | NEW. `list / findByCode / create / remove`, `validateForCart({code, subtotal, userId})` returning `{amount, freeShipping, couponId, code}` — enforces status, date window, min order, total usage limit, per-user limit (joined via `couponUsage`); supports PERCENTAGE (with maxDiscount cap), FLAT, FREE_SHIPPING. `recordUsage()` writes `coupon_usage` + increments `coupons.usageCount`. Throws typed `CouponError` |
| `src/app/api/v1/admin/coupons/route.ts` | Admin `GET` list + `POST` create |
| `src/app/api/v1/coupons/apply/route.ts` | Public `POST` — preview discount against a cart (rate-limited 20/min/IP). Read-only |

### Checkout — Transactional (the heart of the engine)

| File | What was done |
|---|---|
| `src/modules/commerce/application/place-order.usecase.ts` | NEW. Full transactional checkout. Steps: (1) idempotency check on `orders.idempotencyKey`; (2) load + validate cart; (3) resolve shipping address (existing addressId for users, or inline `shippingAddress`); (4) resolve shipping rate; (5) validate + apply coupon if any; (6) `db.transaction`: SELECT inventory FOR UPDATE → verify stock → reserve (`stockReserved += qty`, `stockAvailable -= qty`) → insert order → insert order_items (snapshot productName / sku / unitPrice / totalPrice / primary imageUrl) → insert payment row (COD = PENDING, others UNPAID) → insert order_status_history (PENDING) → clear cart_items; (7) record coupon usage post-commit; (8) returns `{orderId, status, total, paymentMethod, paymentStatus}`. Throws typed `CheckoutError` |
| `src/app/api/v1/checkout/route.ts` | `POST` rate-limited 5/min/IP, validates `checkoutSchema`, resolves user-or-guest cart, requires `guestEmail` for guests. Calls `placeOrderUseCase`. On success, hydrates the order and dispatches (best-effort) the Resend confirmation email and the Inngest `checkout/inventory.reserved` event |

### Orders Module

| File | What was done |
|---|---|
| `src/modules/commerce/infrastructure/order.repository.ts` | NEW. `listForUser(userId, page, limit)`, `listAdmin({page,limit,status})`, `findByIdForUser`, `findByIdAdmin`, `findByIdempotencyKey`, `hydrate()` (joins items + status history + payments). `updateStatus(id, {status, note}, actorId)` runs in a tx and writes an audit-trail row to `order_status_history` |
| `src/app/api/v1/orders/route.ts` | `GET` (requireUser) — paginated list of the current user's orders |
| `src/app/api/v1/orders/[id]/route.ts` | `GET` (requireUser) — admin sees any order; customer sees their own. Returns hydrated order |
| `src/app/api/v1/admin/orders/route.ts` | Admin `GET` — paginated list with optional `?status=` filter |
| `src/app/api/v1/admin/orders/[id]/status/route.ts` | Admin `PATCH` — transitions status, writes `order_status_history`, fires best-effort Resend status email |

### Email + Background Jobs

| File | What was done |
|---|---|
| `src/lib/resend/index.ts` | NEW. Lazy-cached Resend client (returns null + warns when `RESEND_API_KEY` absent so dev never fails). `sendOrderConfirmationEmail({to, order})` and `sendOrderStatusEmail({to, orderId, newStatus, note})` with branded HTML (Playfair heading, accent #C9A96E, BDT pricing). HTML-escapes all interpolated values (XSS-safe) |
| `src/lib/inngest/client.ts` | NEW. Single `inngest` client (id `niyamah`) + typed `InngestEvents` registry covering `checkout/inventory.reserved`, `marketing/cart.abandoned`, `marketing/newsletter.subscribed` |
| `src/inngest/functions/release-reserved-stock.ts` | NEW. Inngest function listening on `checkout/inventory.reserved`. Sleeps 30 min, then if order still PENDING and (non-COD) UNPAID: in a tx restores `stockAvailable` / decrements `stockReserved` for each line and marks the order CANCELLED. COD orders are skipped (admin confirms manually) |
| `src/app/api/inngest/route.ts` | NEW. Mounts the Inngest serve handler at `/api/inngest` (GET/POST/PUT) registering `releaseReservedStock` |

### Schema Notes Used

- `orders.idempotencyKey` unique index enforces idempotent checkout retries.
- `inventory.stockReserved` + `stockAvailable` columns drive the reserve/release flow.
- `order_status_history` provides the full audit trail (fromStatus → toStatus, note, actorId).
- `payments` row is created at checkout (COD = `PENDING`); future gateway callbacks flip to `PAID` / `FAILED`.

### Pending in Later Phases

- Cart merge UI hook on login (server endpoint shipped here; client wiring in Phase 8)
- Coupon admin UI (Phase 7) — backend CRUD ready
- Shipping admin UI (Phase 9) — backend CRUD ready
- Mock gateways (bKash / SSLCommerz) — schema + payment_method enum already in place

---

## Next Up — Phase 6: Customer Experience

- [ ] Wishlist module + API
- [ ] Reviews module with admin moderation queue
- [ ] BD district / area picker data set
- [ ] Customer account dashboard, order tracking, profile


## Phase 6 — Customer Experience

**Commit:** `feat(backend/phase-6): customer experience — wishlist, reviews + moderation, profile, BD locations picker, public order tracking`

### Validation + Data

| File | What was done |
|---|---|
| `src/lib/validations/customer.ts` | NEW. Zod schemas: `wishlistAddSchema`, `reviewCreateSchema` (rating 1-5, body 5-4000 chars, up to 5 image URLs), `reviewModerateSchema`, `profileUpdateSchema` (name/phone/avatar), `passwordChangeSchema` |
| `src/lib/bd/districts.ts` | NEW. Embedded BD geographic dataset — 8 divisions, 64 districts with Bangla names + sample upazilas/areas. Helpers: `getDistrictsByDivision`, `getAreasForDistrict` |

### Customer Module

| File | What was done |
|---|---|
| `src/modules/customer/infrastructure/wishlist.repository.ts` | NEW. `getOrCreate / list / add / remove / has` plus `userBoughtProduct` (used to flag verified-purchase reviews). Returns hydrated list with primary image |
| `src/modules/customer/infrastructure/review.repository.ts` | NEW. `listForProduct` (paginated, APPROVED-only by default), `statsForProduct` (total + average + 1-5 distribution), `create` (transactional with `review_images`, status=PENDING, verifiedPurchase auto-detected), `listForModeration` (admin), `moderate`, `remove` |
| `src/modules/customer/infrastructure/profile.repository.ts` | NEW. `getProfile / updateProfile / changePassword` (bcrypt verify + rehash cost 12). Throws typed `IncorrectPasswordError` |

### API Routes

| File | What was done |
|---|---|
| `src/app/api/v1/wishlist/route.ts` | `GET` (requireUser) hydrated list, `POST` add (idempotent — returns `added: false` on duplicate) |
| `src/app/api/v1/wishlist/[productId]/route.ts` | `DELETE` remove by productId |
| `src/app/api/v1/products/[productId]/reviews/route.ts` | `GET` public paginated list + stats (rating distribution); `POST` (requireUser, 5/min/IP) creates review (auto-flags verifiedPurchase if user has a delivered order containing the product) |
| `src/app/api/v1/admin/reviews/route.ts` | Admin `GET` moderation queue with `?status=PENDING\|APPROVED\|REJECTED` |
| `src/app/api/v1/admin/reviews/[id]/route.ts` | Admin `PATCH` set status, `DELETE` remove |
| `src/app/api/v1/me/route.ts` | `GET` (requireUser) full profile, `PATCH` dual-mode: profile fields OR password change (detected via payload shape) |
| `src/app/api/v1/bd/locations/route.ts` | Public `GET` — divisions list, or `?division=` returns districts, `?district=` returns areas, `?all=true` returns full dataset |
| `src/app/api/v1/track/route.ts` | Public `GET` order tracking — verifies ownership via `orderId + phone` (or `+ email`); returns status timeline + items only — no PII leak |

### Pending in Later Phases

- BD picker UI components (Phase 8)
- Wishlist + reviews UI wiring (Phase 8)
- Customer dashboard pages (Phase 8)

---

## Next Up — Phase 7: Marketing & SEO

- [ ] Coupons admin UI (backend ready in P5)
- [ ] Campaigns module + auto-generated landing pages
- [ ] GA4 + GTM + Meta Pixel client; Meta CAPI server-side
- [ ] JSON-LD schemas (Product, Breadcrumb, Review, FAQ)
- [ ] sitemap.xml + robots.txt
- [ ] Blog module (TipTap content stored as JSON/HTML)
- [ ] Newsletter signup + Resend list
- [ ] Inngest abandoned-cart job (24h after last update)

## Phase 7 — Marketing & SEO

**Commit:** `feat(backend/phase-7): marketing & SEO — campaigns, blog, newsletter, sitemap, JSON-LD, analytics + Meta CAPI, abandoned-cart job`

> **DB migration required:** new `newsletter_subscribers` table. Run `npm run db:push` before deploying.

### Validation + Libraries

| File | What was done |
|---|---|
| `src/lib/validations/marketing.ts` | NEW. Zod schemas: `campaignCreateSchema`, `campaignUpdateSchema`, `blogCategoryCreateSchema`, `blogTagCreateSchema`, `blogPostCreateSchema`, `blogPostUpdateSchema`, `newsletterSubscribeSchema`, `bannerCreateSchema`. Slug regex enforced |
| `src/lib/marketing/json-ld.ts` | NEW. schema.org generators: `organizationLd`, `breadcrumbLd`, `productLd` (with offer + aggregateRating), `reviewLd`, `faqLd`, `articleLd` |
| `src/lib/marketing/analytics.ts` | NEW. Client-side helpers for GA4 / GTM dataLayer + Meta Pixel `fbq`. Reads NEXT_PUBLIC_* env at runtime; safe no-op when not configured. `analytics.viewItem / addToCart / beginCheckout / purchase` cover the standard funnel |
| `src/lib/db/schema/index.ts` | + `newsletterSubscribers` table (storeId, email unique-per-store, name, source, subscribed flag, unsubscribedAt) |
| `src/lib/resend/index.ts` | + `sendGenericEmail({to, subject, html})` no-op-on-missing-key helper |

### Modules

| File | What was done |
|---|---|
| `src/modules/marketing/infrastructure/campaign.repository.ts` | NEW. `list / findBySlug / findById / findBySlugWithProducts` (hydrates products + primary image + linked coupon), `create` transactional with `campaignProducts` link table, `update` (partial + replace product list), `remove`. Throws typed `CampaignError` |
| `src/modules/marketing/infrastructure/newsletter.repository.ts` | NEW. `subscribe` (idempotent — re-activates if previously unsubscribed), `unsubscribe`, `list` admin. Email lowercased + trimmed |
| `src/modules/blog/infrastructure/blog.repository.ts` | NEW. Categories/Tags CRUD, Posts `listPosts` (paginated, status/category/tag filters), `findPostBySlug` (joins author + category + tags), `createPost` (transactional with tag links, auto-sets publishedAt on publish), `updatePost` (partial), `deletePost`, `listPublishedSlugs` for sitemap |

### API Routes

| File | What was done |
|---|---|
| `src/app/api/v1/admin/campaigns/route.ts` | Admin `GET` paginated list + filter, `POST` create |
| `src/app/api/v1/admin/campaigns/[id]/route.ts` | Admin `GET` / `PATCH` / `DELETE` |
| `src/app/api/v1/campaigns/[slug]/route.ts` | Public `GET` — returns hydrated campaign only when `status` ∈ active/ended (hides drafts & scheduled) |
| `src/app/api/v1/admin/blog/posts/route.ts` | Admin paginated `GET` + `POST` create |
| `src/app/api/v1/admin/blog/posts/[id]/route.ts` | Admin `GET` / `PATCH` / `DELETE` |
| `src/app/api/v1/blog/categories/route.ts` | Public `GET` list, admin-guarded `POST` |
| `src/app/api/v1/blog/tags/route.ts` | Public `GET` list, admin-guarded `POST` |
| `src/app/api/v1/blog/posts/route.ts` | Public `GET` paginated published posts; `?category=` and `?tag=` filters |
| `src/app/api/v1/blog/posts/[slug]/route.ts` | Public `GET` — published only |
| `src/app/api/v1/newsletter/subscribe/route.ts` | Public `POST` — rate-limited 5/min/IP via `rateLimit()` |
| `src/app/api/v1/newsletter/unsubscribe/route.ts` | Public `POST` |

### SEO Routes

| File | What was done |
|---|---|
| `src/app/sitemap.ts` | Next.js metadata route — emits static + dynamic URLs (published products / categories / brands / blog posts) batched via Promise.all |
| `src/app/robots.ts` | Disallows `/admin`, `/api/`, `/account/`, `/checkout/`, `/auth/`. References sitemap |

### Background Jobs (Inngest)

| File | What was done |
|---|---|
| `src/inngest/functions/abandoned-cart.ts` | NEW. Triggers on `cart/updated`; sleeps 24h; if cart still has items AND `updatedAt` unchanged, sends email reminder via `sendGenericEmail`. Debounce 1h per cartId. Skips guest carts |
| `src/inngest/functions/meta-capi.ts` | NEW. Triggers on `commerce/order.created`; SHA-256 hashes email/phone; POSTs `Purchase` event to Meta Graph API. No-op when META_ACCESS_TOKEN / META_PIXEL_ID not set |
| `src/app/api/inngest/route.ts` | Registered both new functions alongside existing `releaseReservedStock` |

### Event Wiring

| File | What was done |
|---|---|
| `src/app/api/v1/cart/route.ts` | `POST` now dispatches `cart/updated` event after add (best-effort) |
| `src/app/api/v1/checkout/route.ts` | After order creation now dispatches `commerce/order.created` event with hashed PII inputs for Meta CAPI (best-effort) |

### Env Vars Used (all optional / no-op when absent)

- `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
- `META_ACCESS_TOKEN`, `META_PIXEL_ID`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY` (existing)

### Pending in Later Phases

- Coupon admin CRUD UI (Phase 8)
- Campaign product picker UI (Phase 8)
- TipTap blog editor + admin pages (Phase 8)
- `<JsonLd>` component to inject scripts on PDP / blog pages (Phase 8)
- Analytics `<Provider>` script tags in root layout (Phase 8)
- Newsletter signup form component (Phase 8)
- Banner/slider admin (Phase 9)

---

## Next Up — Phase 8: Frontend Wiring

- [ ] Storefront pages: home, /products, /category/[slug], /brand/[slug], /products/[slug], /cart, /checkout, /account/*, /blog, /campaigns/[slug]
- [ ] Admin pages: dashboard (Recharts), products, categories, orders, coupons, reviews, blog, customers, shipping, banners
- [ ] Wire 88 prebuilt components into pages, connect to Phase 1-7 APIs

---

## Phase 8 — Frontend Wiring (Storefront Pages + Admin Shell)

**Commit:** `feat(frontend/phase-8): storefront pages (home, listing, PDP, cart, blog, campaigns, account) + admin shell & list pages wired to Phase 1-7 APIs`

### Server-side data helpers

| File | What was done |
|---|---|
| `src/modules/storefront/queries.ts` | NEW. `getNewArrivals`, `getBestSellers`, `getFeaturedCategories`, `listAllBrands`, `listProductsForGrid({page,limit,categorySlug?,brandSlug?,q?})`. Hydrates primary image via batched `inArray` on `productImages`. Maps `salePrice ?? price` for display, `originalPrice` only when `salePrice` set. Conditional spreads under strict `exactOptionalPropertyTypes` |

### Storefront layout + components

| File | What was done |
|---|---|
| `src/app/(storefront)/layout.tsx` | Replaced placeholder. Now mounts `<TopBar /> <SiteHeader /> <main> <SiteFooter />` |
| `src/components/storefront/newsletter-subscribe.tsx` | NEW client wrapper. Wraps `<NewsletterBox>` and POSTs to `/api/v1/newsletter/subscribe` with sonner toasts |

### Storefront pages

| File | What was done |
|---|---|
| `src/app/(storefront)/page.tsx` | Home page — hero band + `FeaturedCategories` + `NewArrivalsSection` + `BestSellerSection` + `TrustBadges` + `NewsletterSubscribe` (data fetched in parallel via Promise.all). `revalidate=300` |
| `src/app/(storefront)/products/page.tsx` | All-products listing. Reads searchParams, calls `listProductsForGrid`, renders `ProductGrid` |
| `src/app/(storefront)/products/[slug]/page.tsx` | Product Detail Page. `productRepository.findBySlug`, renders `ProductGallery` + `ProductInfo` + `AddToCartButton` + `WishlistButton` + `ProductTabs`. Injects `productLd` + `breadcrumbLd` JSON-LD via `next/script`. `generateMetadata` for SEO |
| `src/app/(storefront)/category/[slug]/page.tsx` | Category landing — `categoryRepository.findBySlug` + `listProductsForGrid` |
| `src/app/(storefront)/cart/page.tsx` | Client cart page. Uses `useCartStore` for items/subtotal. Renders `CartItemRow[]` + `FreeShippingProgress` + `CartSummary` + checkout CTA. `CartEmptyState` when empty |
| `src/app/(storefront)/blog/page.tsx` | Blog index — `blogRepository.listPosts({status:'published'})` |
| `src/app/(storefront)/blog/[slug]/page.tsx` | Article — `findPostBySlug` + `articleLd` JSON-LD |
| `src/app/(storefront)/campaigns/[slug]/page.tsx` | Campaign landing — `campaignRepository.findBySlugWithProducts` + `ProductGrid` |

### Account area

| File | What was done |
|---|---|
| `src/app/(storefront)/account/layout.tsx` | Auth-guarded shell with side nav (Overview, Orders, Wishlist, Addresses, Profile). Redirects to `/login` when no session |
| `src/app/(storefront)/account/page.tsx` | Overview cards |
| `src/app/(storefront)/account/orders/page.tsx` | Lists current user's orders (filter by `DEFAULT_STORE_ID`) |
| `src/app/(storefront)/account/wishlist/page.tsx` | Client wishlist UI backed by `useWishlistStore` |

### Admin shell + pages

| File | What was done |
|---|---|
| `src/app/(admin)/layout.tsx` | Replaced placeholder. `getCurrentUser()` guard — redirects non-admin to `/`. Mounts `AdminSidebar` + `AdminTopbar` |
| `src/app/(admin)/admin/page.tsx` | Dashboard. 4 `StatsCard`s — Orders Today / Revenue Today / Total Products / Customers. Computed via direct Drizzle aggregate queries scoped to `DEFAULT_STORE_ID` |
| `src/app/(admin)/admin/products/page.tsx` | Products list (server table) with `+ New product` link |
| `src/app/(admin)/admin/categories/page.tsx` | Categories list |
| `src/app/(admin)/admin/orders/page.tsx` | Orders list with status badge |
| `src/app/(admin)/admin/customers/page.tsx` | Customers list |
| `src/app/(admin)/admin/coupons/page.tsx` | Coupons list |
| `src/app/(admin)/admin/reviews/page.tsx` | Reviews moderation queue |
| `src/app/(admin)/admin/blog/page.tsx` | Blog posts list |
| `src/app/(admin)/admin/campaigns/page.tsx` | Campaigns list |

### Notes / Known follow-ups (Phase 9)

- Admin CRUD forms (product/category/coupon/blog/campaign) wire through but are not yet rendered — placeholder `new` / `[id]` routes left intentionally for Phase 9 once admin form components are reviewed.
- Brand landing (`/brand/[slug]`) skipped because `brandRepository.findBySlug` is not yet exposed; will land with brand picker UI in Phase 9.
- Multi-step checkout, profile/password forms, and address book reuse the existing API routes from Phase 5/6 — UI wiring is queued for Phase 9 polish along with admin CRUD forms.
- Analytics provider script tags in root `app/layout.tsx` deferred to Phase 9.


---

## Phase 9 — Polish & SaaS Prep

**Commit:** `feat(phase-9): audit log helper, multi-tenant store resolver, analytics provider script tags, brand landing page`

### Cross-cutting helpers

| File | What was done |
|---|---|
| `src/lib/audit/record.ts` | NEW. `recordAudit({actorId, action, entityType, entityId, before, after, ip, storeId})` — best-effort insert into `audit_logs`. Swallows errors so write paths are never blocked. To be invoked from admin route handlers on create/update/delete |
| `src/lib/tenant/resolve-store.ts` | NEW. `resolveStoreId()` — reads `x-store-id` header (set by future middleware) or matches `host` against `stores.domain`. Falls back to `DEFAULT_STORE_ID`. Foundation for full multi-tenant resolution; current Phase 1-8 code still uses the constant directly |

### Analytics wiring

| File | What was done |
|---|---|
| `src/components/shared/analytics-provider.tsx` | NEW. Renders GTM, GA4, and Meta Pixel `<Script>` tags conditionally based on `analyticsConfig` env values. Uses `next/script` `afterInteractive` strategy |
| `src/app/layout.tsx` | Mounts `<AnalyticsProvider />` after `<Toaster />` so script tags load on every route |

### Storefront

| File | What was done |
|---|---|
| `src/app/(storefront)/brand/[slug]/page.tsx` | NEW brand landing — direct `brands` query + `listProductsForGrid({brandSlug})` |

### Deferred to follow-up work

These items remain on the SaaS-prep backlog but are out of scope for this commit because they require additional schema or third-party UI work:

- Banner / slider admin UI (table `banners` exists, repository + API + page TBD)
- Shipping zones admin UI (table `shippingZones` exists, repository + API + page TBD)
- Staff invitation flow (`storeUsers` invites + role management UI)
- OpenAPI spec generation utility from existing Zod schemas
- Lighthouse 90+ audit pass and full OWASP review (manual / tooling step)
- Multi-tenant **middleware** that injects `x-store-id` based on host — helper is now in place; middleware lands when first multi-tenant deployment is provisioned
- Audit log invocation from every admin write (helper now in place; callers will be wired alongside the admin form pages)


---

## Hotfix � Dynamic Route Param Name Conflict

**Commit:** `b7a22f9`

| File | What was done |
|------|---------------|
| `src/app/api/v1/products/[id]/reviews/route.ts` | Renamed from `[productId]/reviews/route.ts` ? `[id]/reviews/route.ts`; updated `params` type and destructuring from `{ productId }` to `{ id }` to resolve Next.js App Router error: *"You cannot use different slug names for the same dynamic path (`id` !== `productId`)"* |




---

## Phase 10 — Auth Reset Password Flow

**Commit:** `

| File | What was done |
|------|---------------|
| `src/lib/auth/password-reset.ts` | New: `generateResetToken()`, `storeResetToken()`, `consumeResetToken()` — single-use tokens via Upstash Redis with 30 min TTL |
| `src/app/api/v1/auth/forgot-password/route.ts` | Now generates and stores a reset token when the user exists (still returns generic success to prevent email enumeration) |
| `src/app/api/v1/auth/reset-password/route.ts` | New: validates token + new password, hashes with bcryptjs cost 12, calls `userRepository.updatePassword` |
| `src/components/auth/reset-password-form.tsx` | New: react-hook-form + Zod, password strength validation, success state |
| `src/app/(auth)/reset-password/page.tsx` | New: reads `?token=` query, posts to API, handles missing-token state |



---

## Phase 11 — Checkout Flow + Order Success

| File | What was done |
|------|---------------|
| `src/app/(storefront)/checkout/page.tsx` | New: multi-step checkout (Address → Review), reuses `CheckoutSteps`, `AddressForm`, `DeliveryMethodSelector`, `PaymentMethodSelector`, `OrderSummary`. Loads shipping rates from `/api/v1/shipping/rates`, generates idempotency key, syncs client cart to server before placing order, posts to `/api/v1/checkout`, redirects to success page on 201, clears cart |
| `src/app/(storefront)/checkout/success/page.tsx` | New: server component, reads `?orderId`, renders `OrderConfirmation` |
| `src/app/(storefront)/cart/page.tsx` | Bug fix: `s.subtotal()` → `s.totalPrice()` (matched cart-store API) |



---

## Phase 12 — Account Pages (Order Detail, Addresses, Profile, Reviews)

| File | What was done |
|------|---------------|
| `src/app/(storefront)/account/orders/[id]/page.tsx` | New: server component, ownership-checked via `orderRepository.findByIdForUser`, renders items + status timeline + payment info + financial breakdown |
| `src/app/(storefront)/account/addresses/page.tsx` | New: client list/CRUD using `/api/v1/addresses` and `AddressForm`, `ConfirmDialog` for delete, edit-in-place pattern |
| `src/app/(storefront)/account/profile/page.tsx` | New: react-hook-form for personal info (name/phone) + change password, both posting to `PATCH /api/v1/me` |
| `src/app/(storefront)/account/reviews/page.tsx` | New: server component listing all reviews by current user with rating + status badge |
| `src/modules/customer/infrastructure/review.repository.ts` | Added: `listForUser(userId, opts)` for the My Reviews page |
| `src/app/(storefront)/account/layout.tsx` | Added `My Reviews` link to the sidebar nav |



---

## Phase 13 — Search Results Page

| File | What was done |
|------|---------------|
| `src/app/(storefront)/search/page.tsx` | New: server component, accepts `?q=&page=`, calls `productSearchRepository.search()` (PostgreSQL FTS via `ts_rank_cd`), maps results to `ProductCardData` and renders `ProductGrid`. Includes search input form, result count, prev/next pagination, empty/no-query states |



---

## Phase 14 — Admin Product Create/Edit

| File | What was done |
|------|---------------|
| `src/app/(admin)/admin/products/new/page.tsx` | New: client page using `ProductForm` + `ProductImageUploader`, posts to `POST /api/v1/products`, redirects to edit page on success |
| `src/app/(admin)/admin/products/[id]/page.tsx` | New: client page that fetches via `GET /api/v1/products/[id]`, prefills form, `PATCH` on save, `DELETE` via `ConfirmDialog` |



---

## Phase 15 — Admin Categories & Brands CRUD + Sidebar

| File | What was done |
|------|---------------|
| `src/app/(admin)/admin/categories/page.tsx` | Rewrote: full CRUD, dialog with `CategoryForm`, list with edit + delete actions |
| `src/app/(admin)/admin/brands/page.tsx` | New: list + dialog using new `BrandForm`, full CRUD against `/api/v1/brands` |
| `src/components/admin/brand-form.tsx` | New: RHF + Zod form for brand fields (name/slug/logo/description/featured) |
| `src/components/admin/admin-sidebar.tsx` | Added Brands link to nav |
| `src/app/(admin)/admin/layout.tsx` | Wired `AdminSidebar` into layout |



---

## Phase 16 — Admin Order Detail

| File | What was done |
|------|---------------|
| `src/app/(admin)/admin/orders/[id]/page.tsx` | New: server component, hydrated order via `orderRepository.findByIdAdmin`, renders items + status history + payments + summary + customer/shipping aside |
| `src/components/admin/admin-order-actions.tsx` | New: client wrapper around `OrderStatusUpdater` that maps lowercase UI status ↔ uppercase API enum and calls `PATCH /api/v1/admin/orders/[id]/status` |



---

## Phase 17 — Admin Coupons & Campaigns CRUD

| File | What was done |
|------|---------------|
| `src/app/(admin)/admin/coupons/page.tsx` | Rewrote: list + create dialog using `CouponForm`, delete via `ConfirmDialog`. UI `percentage|fixed` mapped to API `PERCENTAGE|FLAT` |
| `src/app/api/v1/admin/coupons/[id]/route.ts` | New: `DELETE` endpoint using `couponRepository.remove` |
| `src/app/(admin)/admin/campaigns/page.tsx` | Rewrote: full CRUD with `CampaignForm` dialog, datetime inputs, status select |
| `src/components/admin/campaign-form.tsx` | New: RHF + Zod form (name/slug/description/banner/start/end/status) |



---

## Phase 18 — Admin Blog Editor

| File | What was done |
|------|---------------|
| `src/components/admin/blog-post-form.tsx` | New: RHF + Zod editor for blog posts (title/slug/excerpt/content/featuredImage/SEO/status). Plain markdown/HTML textarea (no TipTap dependency added) |
| `src/app/(admin)/admin/blog/page.tsx` | Rewrote: list + 'New post' button + clickable rows |
| `src/app/(admin)/admin/blog/new/page.tsx` | New: client page POST `/api/v1/admin/blog/posts` |
| `src/app/(admin)/admin/blog/[id]/page.tsx` | New: client edit page, GETs full post, PATCH on save, DELETE via ConfirmDialog |



---

## Phase 19 — Admin customer detail, reviews moderation, inventory
| File | What was done |
|------|---------------|
| src/app/(admin)/admin/customers/page.tsx | Rewrote to query users (role=customer) with link to detail page |
| src/app/(admin)/admin/customers/[id]/page.tsx | New: profile + order history with totals |
| src/app/(admin)/admin/reviews/page.tsx | Rewrote as client w/ status tabs + approve/reject/reset/delete |
| src/app/(admin)/admin/inventory/page.tsx | New: list inventory rows (low-stock first) |
| src/components/admin/inventory-row.tsx | New: editable row with stock, threshold, tracked toggle, save |
| src/app/api/v1/admin/inventory/[id]/route.ts | New: PATCH to update inventory; recomputes stockAvailable |



---

## Phase 20 — Admin shipping, settings, banners, audit, staff, analytics
| File | What was done |
|------|---------------|
| src/app/(admin)/admin/page.tsx | Fixed dashboard (was importing non-existent customers); added recent orders panel |
| src/app/(admin)/admin/settings/page.tsx | New: store settings form (uses SettingsForm) |
| src/app/api/v1/admin/settings/route.ts | New: GET/PATCH store_settings (auto-creates row) |
| src/app/(admin)/admin/media/page.tsx | New: banner manager UI (uses BannerManager) with diff-based save |
| src/app/api/v1/admin/banners/route.ts | New: GET/POST banners |
| src/app/api/v1/admin/banners/[id]/route.ts | New: PATCH/DELETE banner |
| src/app/(admin)/admin/shipping/page.tsx | New: zones + rates CRUD with dialogs |
| src/app/api/v1/admin/shipping/zones/route.ts | New: GET (zones+rates) / POST zone |
| src/app/api/v1/admin/shipping/zones/[id]/route.ts | New: PATCH/DELETE zone |
| src/app/api/v1/admin/shipping/rates/route.ts | New: POST rate |
| src/app/api/v1/admin/shipping/rates/[id]/route.ts | New: DELETE rate |
| src/app/(admin)/admin/audit/page.tsx | New: audit log viewer (paginated) |
| src/app/(admin)/admin/staff/page.tsx | New: staff/role manager |
| src/app/api/v1/admin/staff/[id]/route.ts | New: PATCH user role |
| src/app/api/v1/admin/users/route.ts | New: GET admin user list |
| src/app/(admin)/admin/analytics/page.tsx | New: 30-day revenue/orders, AOV, daily bar chart, top products, status breakdown |
| src/components/admin/admin-sidebar.tsx | Added Analytics, Staff, Audit logs links |


---

## Phase 21 — Storefront polish + COD risk + Inngest emails
| File | What was done |
|------|---------------|
| src/app/(storefront)/about/page.tsx | New: brand story page |
| src/app/(storefront)/contact/page.tsx | New: contact form (mailto fallback) |
| src/app/(storefront)/faq/page.tsx | New: FAQ accordion |
| src/app/(storefront)/terms/page.tsx | New: terms of service |
| src/app/(storefront)/privacy/page.tsx | New: privacy policy |
| src/app/(storefront)/refund/page.tsx | New: refund/return policy |
| src/lib/inngest/client.ts | Extended event registry (cart/updated, commerce/order.created, .high-risk, .status-changed) |
| src/modules/commerce/application/cod-risk.ts | New: assessCodRisk heuristic scorer |
| src/app/api/v1/checkout/route.ts | Wired COD risk + emits high-risk event |
| src/inngest/functions/order-status-email.ts | New: handles commerce/order.status-changed |
| src/inngest/functions/high-risk-order-alert.ts | New: ops alert for high-risk COD orders |
| src/app/api/inngest/route.ts | Registered new functions |
| src/app/api/v1/admin/orders/[id]/status/route.ts | Emits status-changed event (registered + guest) |
| src/app/(storefront)/page.tsx | Mounted TestimonialsSection |


---

## Phase 22 — Production build fixes & primitive enhancements
| File | What was done |
|------|---------------|
| next.config.ts | Set typescript.ignoreBuildErrors and eslint.ignoreDuringBuilds for unblock |
| src/components/ui/button.tsx | Added asChild support (base-ui render bridge) |
| src/components/ui/dialog.tsx | Added asChild to DialogTrigger and DialogClose |
| src/components/ui/dropdown-menu.tsx | Added asChild to DropdownMenuTrigger and DropdownMenuItem |
| src/components/ui/form.tsx | New: react-hook-form + Slot wrappers (Form/FormField/FormItem/FormLabel/FormControl/FormDescription/FormMessage) |
| src/components/shared/status-badge.tsx | Now case-insensitive + neutral fallback for unknown statuses |
| src/components/shared/empty-state.tsx | action prop now accepts ReactNode in addition to descriptor |
| src/components/storefront/site-footer.tsx | Replaced removed lucide brand icons (Facebook/Instagram/Youtube) with Globe/Camera/Video |
| src/components/storefront/add-to-cart-button.tsx | Optional props now allow undefined (exactOptionalPropertyTypes) |
| src/components/admin/*-form.tsx | defaultValues prop now accepts undefined |
| src/components/admin/banner-manager.tsx | Removed unused useState import |
| src/inngest/functions/*.ts | Migrated to Inngest v4 createFunction({id, triggers}) signature |
| src/inngest/functions/order-status-email.ts | New: handles commerce/order.status-changed |
| src/inngest/functions/high-risk-order-alert.ts | New: ops alert for high-risk orders |
| src/app/api/v1/admin/banners/*.ts | Removed 'scheduled' from banner status enum (DB constraint) |
| src/app/api/v1/admin/reviews/route.ts | Removed unused import |
| src/app/(storefront)/cart/page.tsx | Hydration guard for zustand-persisted cart |
| src/app/(storefront)/products/[slug]/page.tsx | Removed invalid specs={[]} prop |
| src/app/(storefront)/blog/page.tsx | Use posts.items (paginated response) |
| src/app/(storefront)/faq/page.tsx | Removed unsupported type/collapsible props |
| src/app/(auth)/login/page.tsx | Wrapped useSearchParams in Suspense boundary |
| src/app/(auth)/reset-password/page.tsx | Wrapped useSearchParams in Suspense boundary |
| src/app/(admin)/admin/orders/[id]/page.tsx | Use schema field names (discountAmount, shippingAmount); show coupon + note instead of fictional fields |


---

## Phase 23 - Hardening pass: build, schema, checkout correctness
| File | What was done |
|------|---------------|
| next.config.ts | Removed ignored TypeScript/build checks so production build fails on real type errors |
| eslint.config.mjs / package.json | Migrated lint script to ESLint CLI for Next 16 and kept React Compiler-only advisories as warnings |
| src/lib/db/schema/index.ts / drizzle/0001_checkout_hardening.sql | Added order shipping snapshot fields and newsletter subscriber migration support |
| src/modules/commerce/application/place-order.usecase.ts | Re-priced cart lines at checkout, locked stock with inArray, saved shipping snapshot, confirmed orders transactionally, and moved coupon usage inside the transaction |
| src/modules/commerce/infrastructure/cart.repository.ts | Added server-side stock validation and quantity checks when adding items |
| src/components/storefront/add-to-cart-button.tsx | Writes to the server cart before updating the client drawer |
| src/modules/storefront/queries.ts / src/modules/search/infrastructure/product-search.repository.ts | Product cards now include primary variant id, variant price overrides, and real stock state |
| src/app/(storefront)/checkout/page.tsx | Removed duplicate cart sync loop and validates shipping rate id before placing an order |
| src/app/(storefront)/products/[slug]/page.tsx | Uses selected variant stock/id for Add to Cart and structured availability |
| src/lib/auth/index.ts / src/proxy.ts | Simplified credentials JWT auth path and renamed middleware to Next 16 proxy convention |
| .env.example / src/lib/db/seed.ts | Removed example default admin credentials and require explicit seed admin password |
