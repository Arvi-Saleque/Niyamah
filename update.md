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

## Next Up — Phase 3 Backend (Server-side)

- [ ] `src/lib/db/schema/index.ts` — Drizzle schema (all tables from goal.md)
- [ ] `src/lib/db/index.ts` — Neon PostgreSQL connection singleton
- [ ] `src/lib/auth/index.ts` — Auth.js v5 config (credentials + Google provider)
- [ ] `src/lib/redis/index.ts` — Upstash Redis client singleton
- [ ] Database migrations (drizzle-kit generate + push)
- [ ] Auth routes: `/api/auth/[...nextauth]/route.ts`
- [ ] Module implementations: catalog, cart, checkout, orders
