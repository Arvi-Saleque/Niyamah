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

## Next Up — Phase 5: Commerce Engine

- [ ] Cart module (server-side carts, merge guest→user on login)
- [ ] Transactional checkout (inventory reservation, idempotency-key)
- [ ] Orders + status history + COD payment flow
- [ ] Shipping zones + rates calculation (BD districts)
- [ ] Resend email integration (order confirmation, status updates)
- [ ] Inngest job: release reserved stock after 30 min if unpaid
