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

## Next Up — Phase 1 Continued

- [ ] `src/lib/db/schema/index.ts` — Drizzle schema (all tables from goal.md)
- [ ] `src/lib/db/index.ts` — Neon PostgreSQL connection singleton
- [ ] `src/lib/auth/index.ts` — Auth.js v5 config (credentials + Google provider)
- [ ] `src/lib/redis/index.ts` — Upstash Redis client singleton
- [ ] `src/lib/utils/index.ts` — `cn()` helper + formatCurrency (BDT)
- [ ] Database migrations (drizzle-kit generate + push)
- [ ] Auth routes: `/api/auth/[...nextauth]/route.ts`
- [ ] Register / Login pages with react-hook-form + Zod validation
