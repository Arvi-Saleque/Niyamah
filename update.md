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
