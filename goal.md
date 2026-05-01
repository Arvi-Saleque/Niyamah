# Niyamah — Complete E-Commerce Template (Version 1)
### Premium · Admin-Controlled · SaaS-Ready Architecture

---

## Vision

Build a complete, premium, uniquely designed e-commerce website as a general template.
Version 1 is a single-store, fully functional, production-ready platform.
The architecture is designed from day one so that multi-tenant SaaS can be activated later without rewriting anything.

Target market: Bangladesh (BDT, Bangla/English support, bKash/SSLCommerz slot-in ready)
Payment in v1: Cash on Delivery only
AI features: Excluded from v1, architecture does not block them later

---

## Final Tech Stack

| Layer | Decision | Reason |
|---|---|---|
| Framework | Next.js 15 App Router + TypeScript (strict) | SSR, SEO, Server Components, API routes |
| Styling | Tailwind CSS v4 + shadcn/ui + Framer Motion + Lucide Icons | Speed, polish, animations |
| Database | PostgreSQL | ACID, relational, MVCC — critical for orders and inventory |
| ORM | Drizzle ORM | Faster runtime, SQL-like control, edge/serverless compatible |
| Auth | Auth.js v5 (NextAuth v5) | Custom control, RBAC-friendly, open source |
| UI State | Zustand | Cart drawer, filters, wishlist, quick view state |
| Server State | TanStack Query | Caching, pagination, infinite scroll, revalidation |
| Search | Meilisearch | Instant search, typo tolerance, great free tier |
| Images | Cloudinary | Free CDN tier, transformations, bulk upload |
| Cache / Rate Limit | Upstash Redis | Rate limiting, sessions, OTP, cart cache, job queue |
| Background Jobs | Inngest | Serverless event-driven jobs — email, analytics, search sync |
| Email | Resend | Transactional emails, clean API, free tier |
| Validation | Zod | End-to-end type-safe validation at every API boundary |
| Payment (v1) | Cash on Delivery only | Architecture is payment-method-agnostic |
| Analytics | GA4 + GTM + Meta Pixel + Meta CAPI | Dual browser + server tracking |
| Hosting | Vercel + Neon PostgreSQL | Serverless, auto-scaling, free tiers |
| Admin panel | /admin route inside same Next.js app | One codebase, one deployment |

---

## Architecture: Modular Monolith (Clean Architecture)

### Philosophy

- One Next.js codebase now
- Each module is fully self-contained — its own domain, use cases, repository, and API
- No direct database calls from UI or pages
- All business logic lives in use cases
- Any module can be extracted into a real microservice later without touching others

### Request Flow

```
Browser / Admin UI
      ↓
Next.js Page / Server Component
      ↓
API Route Handler (validation via Zod, auth guard, rate limit)
      ↓
Use Case / Application Service
      ↓
Repository (Drizzle queries only)
      ↓
PostgreSQL / Redis / Meilisearch / Cloudinary
```

### Folder Structure

```
src/
  app/
    (storefront)/              ← Public store pages and layouts
    (admin)/admin/             ← Admin dashboard (/admin/*)
    (auth)/                    ← Login, register, reset password
    api/
      v1/                      ← All REST API routes versioned

  modules/
    auth/
    catalog/                   ← products, variants, categories, brands
    cart/
    checkout/
    orders/
    inventory/
    customers/
    coupons/
    campaigns/
    reviews/
    blog/
    search/
    marketing/                 ← GA4 events, Meta CAPI
    shipping/
    store/                     ← settings, themes, store config
    media/

  components/
    ui/                        ← shadcn base components (Button, Input, Dialog, etc.)
    storefront/                ← ProductCard, MegaMenu, CartDrawer, HeroSection
    admin/                     ← DataTable, StatsCard, SideNav, AdminForm
    shared/                    ← used by both storefront and admin

  lib/
    db/                        ← Drizzle client and full schema
    redis/                     ← Upstash Redis client and helpers
    meilisearch/               ← Search client and index helpers
    cloudinary/                ← Upload helpers
    auth/                      ← Auth.js config
    validations/               ← All Zod schemas
    utils/                     ← cn(), formatPrice(), slugify(), etc.

  types/                       ← Global TypeScript types and enums
  hooks/                       ← useCart, useWishlist, useSearch, etc.
  config/                      ← Site config, nav config, feature flags
```

### Module Internal Structure (example: orders)

```
modules/orders/
  domain/
    order.entity.ts            ← Order type, status enum, business rules
    order-item.entity.ts
  application/
    create-order.usecase.ts    ← Full transactional checkout logic
    update-order-status.usecase.ts
    cancel-order.usecase.ts
  infrastructure/
    order.repository.ts        ← All Drizzle queries for orders
  api/
    route.ts                   ← Next.js route handler
    dto.ts                     ← Zod request/response schemas
```

---

## Database Design

### SaaS-Ready Rule

Every major table carries a `store_id` column.
Version 1 operates with one store.
Version 2 activates multi-tenancy by routing through `store_id` — zero schema migration needed.

### Tables

**Store & Auth**
- `stores` — id, name, slug, domain, plan, status, created_at
- `store_settings` — store_id, currency, language, timezone, contact_email, etc.
- `store_themes` — store_id, theme_key, config (JSON)
- `users` — id, name, email, password_hash, phone, avatar, role, verified, created_at
- `accounts` — Auth.js OAuth accounts table
- `sessions` — Auth.js sessions table
- `store_users` — store_id, user_id, role_id (staff assignment)
- `roles` — id, store_id, name, description
- `permissions` — id, key, description
- `role_permissions` — role_id, permission_id

**Catalog**
- `categories` — id, store_id, parent_id (self-ref for nesting), name, slug, image, description, seo_title, seo_description, sort_order, status
- `brands` — id, store_id, name, slug, logo, description, featured, seo_title, seo_description, status
- `products` — id, store_id, category_id, brand_id, name, slug, short_description, description, price, sale_price, cost_price, sku, barcode, weight, status (draft/published/archived), featured, best_seller, seo_title, seo_description, og_image, tags, created_at
- `product_images` — id, product_id, url, alt, sort_order, is_primary
- `product_videos` — id, product_id, url, thumbnail
- `variant_option_types` — id, product_id, name (e.g. "Color", "Size")
- `variant_option_values` — id, option_type_id, value (e.g. "Black", "M")
- `product_variants` — id, product_id, sku, barcode, price_override, sale_price_override, image_url, status, sort_order (linked to option values via junction)
- `product_variant_options` — variant_id, option_value_id

**Inventory**
- `inventory` — id, store_id, variant_id, stock_on_hand, stock_reserved, stock_available, low_stock_threshold, track_stock

**Cart**
- `carts` — id, store_id, user_id (nullable for guest), session_id, created_at, updated_at
- `cart_items` — id, cart_id, variant_id, quantity, price_snapshot

**Orders**
- `orders` — id, store_id, user_id, guest_email, guest_phone, status, subtotal, discount_amount, shipping_amount, total, coupon_id, coupon_code, note, idempotency_key, created_at
- `order_items` — id, order_id, variant_id, product_name, variant_label, sku, quantity, unit_price, total_price, image_url
- `order_status_history` — id, order_id, from_status, to_status, note, actor_id, created_at
- `addresses` — id, user_id, store_id, label, name, phone, address_line1, address_line2, district, area, city, postal_code, is_default

**Payments**
- `payments` — id, store_id, order_id, method (COD/BKASH/SSLCOMMERZ/STRIPE), status (UNPAID/PENDING/PAID/FAILED/REFUNDED/PARTIALLY_REFUNDED), amount, currency, gateway_transaction_id, gateway_response, created_at

**Commerce**
- `coupons` — id, store_id, code, type (PERCENTAGE/FLAT/FREE_SHIPPING), value, min_order_amount, max_discount_amount, usage_limit, per_user_limit, start_date, end_date, status
- `coupon_usage` — id, coupon_id, user_id, order_id, used_at
- `campaigns` — id, store_id, name, slug, description, banner_image, start_date, end_date, coupon_id, status
- `campaign_products` — campaign_id, product_id
- `wishlists` — id, user_id, store_id
- `wishlist_items` — id, wishlist_id, product_id, variant_id, added_at

**Reviews**
- `reviews` — id, store_id, product_id, user_id, order_id, rating, title, body, status (PENDING/APPROVED/REJECTED), verified_purchase, created_at
- `review_images` — id, review_id, url

**Blog**
- `blog_categories` — id, store_id, name, slug
- `blog_tags` — id, store_id, name, slug
- `blog_posts` — id, store_id, category_id, author_id, title, slug, excerpt, content, featured_image, status, published_at, seo_title, seo_description, og_image
- `blog_post_tags` — post_id, tag_id

**Media & UI**
- `media_library` — id, store_id, url, public_id, filename, size, type, uploaded_by, created_at
- `banners` — id, store_id, title, image_url, link_url, position, start_date, end_date, status, sort_order
- `sliders` — id, store_id, title, items (JSON array of slides)

**Shipping**
- `shipping_zones` — id, store_id, name, districts (array), delivery_days_min, delivery_days_max
- `shipping_rates` — id, zone_id, name, price, free_above_amount

**System**
- `audit_logs` — id, store_id, actor_id, action, entity_type, entity_id, before (JSON), after (JSON), ip, created_at
- `notifications` — id, store_id, user_id, type, title, body, read, created_at

### Order Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                  ↘ CANCELLED
                                          ↘ RETURNED → REFUNDED
```

### Payment Status for COD

```
Order created  →  status: CONFIRMED  |  payment: UNPAID  |  method: COD
After delivery →  payment: PAID
```

---

## API Design

### Rules

- All routes under `/api/v1/`
- Proper HTTP verbs: GET (read), POST (create), PATCH (partial update), PUT (full replace), DELETE (remove)
- Proper status codes: 200, 201, 400, 401, 403, 404, 409, 422, 429, 500
- Pagination: `?page=1&limit=20`
- Filtering: `?category=shoes&brand=nike&minPrice=500&maxPrice=3000&inStock=true`
- Sorting: `?sort=price_asc | price_desc | newest | popular | best_selling`
- Centralized error response: `{ success: false, error: { code, message, details } }`
- Centralized success response: `{ success: true, data, meta }`
- Idempotency-Key header required on POST /checkout, POST /orders, POST /payments/initiate
- OpenAPI / Swagger docs generated from Zod schemas

### Key Endpoints

```
Products
GET    /api/v1/products
GET    /api/v1/products/:slug
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

Categories / Brands
GET    /api/v1/categories
POST   /api/v1/categories
PATCH  /api/v1/categories/:id

Cart
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
POST   /api/v1/cart/merge             ← merge guest cart on login

Checkout
POST   /api/v1/checkout               ← idempotency-key required

Orders
GET    /api/v1/orders                  ← admin: all  |  customer: own
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status
POST   /api/v1/orders/:id/cancel

Inventory
GET    /api/v1/inventory
PATCH  /api/v1/inventory/:variantId

Coupons
POST   /api/v1/coupons/validate
GET    /api/v1/coupons                 ← admin
POST   /api/v1/coupons                 ← admin

Reviews
GET    /api/v1/products/:id/reviews
POST   /api/v1/products/:id/reviews
PATCH  /api/v1/reviews/:id/status     ← admin moderation

Search
GET    /api/v1/search?q=iphone&page=1

Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

---

## Engineering Patterns in Use

| Pattern | Where applied |
|---|---|
| Repository Pattern | All database access — only repositories touch Drizzle |
| Use Case / Service Pattern | All business logic — one use case per operation |
| DTO Pattern | All API inputs and outputs typed and validated with Zod |
| Strategy Pattern | Shipping rate calculation, discount calculation, payment method selection |
| Observer / Event Pattern | Marketing events (GA4, Meta CAPI), notifications, search sync |
| Idempotency Pattern | POST /checkout, POST /payments |
| Inventory Reservation | stock_reserved incremented on checkout, released on cancel |
| RBAC | All admin and staff routes protected by role and permission checks |
| Rate Limiting | Login, OTP, checkout, coupon-apply, public API — via Redis token bucket |
| Audit Logging | Every admin write action logged to audit_logs |
| API Versioning | All routes under /api/v1/ |
| Transactional Checkout | Entire order creation wrapped in a single PostgreSQL transaction |

---

## Checkout Transaction Flow

Server re-validates everything — never trust frontend data.

```
POST /api/v1/checkout  (with Idempotency-Key header)
  ↓
1. Check idempotency key — if already processed, return previous result
2. Re-fetch all cart items with real prices from database
3. Re-validate coupon (valid, not expired, usage limit not reached)
4. Re-validate stock availability for each variant
5. Calculate: subtotal, discount, shipping charge, final total
6. BEGIN PostgreSQL transaction
   a. Create order record
   b. Create order items
   c. Reduce inventory (stock_on_hand - qty, stock_reserved - qty, stock_available stays same)
   d. Create payment record (status: UNPAID, method: COD)
   e. Increment coupon usage count
   f. Clear cart
   g. Create order status history entry
7. COMMIT transaction
8. Publish ORDER_CREATED event (async via Inngest)
   → Send confirmation email
   → Fire GA4 purchase event
   → Fire Meta CAPI purchase event
   → Update Meilisearch if needed
9. Return order confirmation
```

If any step from 6a to 6g fails → full rollback.

---

## Storefront Design & Pages

### Design System

| Token | Value |
|---|---|
| Background | #FAFAF8 (warm white) |
| Surface | #FFFFFF / #F5F4F1 (cards, panels) |
| Border | #E8E5DF (soft warm) |
| Text Primary | #1A1814 (near-black warm) |
| Text Secondary | #6B655C (warm gray) |
| Accent | #C9A96E (warm gold — CTAs, badges, highlights) |
| Error | #D44E4E |
| Success | #4A8C6F |
| Heading Font | Playfair Display (editorial headings) |
| Body Font | Inter or Geist (UI and body) |
| Base Spacing | 4px scale, generous whitespace |
| Border Radius | 8px default / 12px cards / 4px small buttons |
| Shadows | Ultra-subtle warm box shadows only |
| Animations | Framer Motion — fade-slide-in, smooth drawer, hover lift, accordion |

### Homepage Layout

```
┌─────────────────────────────────────────┐
│  Sticky Header: Logo | Nav | Search | Account | Wishlist | Cart  │
├─────────────────────────────────────────┤
│  HERO SECTION                           │
│  Full-width cinematic banner            │
│  Large heading + subtext + CTA button   │
│  Optional countdown for active campaign │
├─────────────────────────────────────────┤
│  FEATURED CATEGORIES                    │
│  Grid of category cards with image      │
├─────────────────────────────────────────┤
│  NEW ARRIVALS                           │
│  Horizontal scroll product row          │
├─────────────────────────────────────────┤
│  BEST SELLERS                           │
│  Product grid 4-col with ratings        │
├─────────────────────────────────────────┤
│  FLASH SALE BLOCK                       │
│  Countdown timer + limited products     │
├─────────────────────────────────────────┤
│  BRAND STORY / TRUST SECTION            │
│  Editorial image + text layout          │
├─────────────────────────────────────────┤
│  TRUST BADGES                           │
│  Free delivery / Easy return / Genuine  │
├─────────────────────────────────────────┤
│  FEATURED COLLECTION                    │
│  Campaign-driven product section        │
├─────────────────────────────────────────┤
│  CUSTOMER REVIEWS WALL                  │
│  Masonry grid of review cards           │
├─────────────────────────────────────────┤
│  NEWSLETTER SIGNUP                      │
│  Email input with warm background       │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  Links | Social | Payment badges | Info │
└─────────────────────────────────────────┘
```

### Navigation

- Sticky top header with blur backdrop
- Mega menu for categories (hover reveals full category tree with images)
- Floating search modal (Meilisearch instant results as you type)
- Cart drawer (slide-in from right, never a redirect)
- Mobile: hamburger → full-screen slide menu

### Product Listing Page

- URL: `/products`, `/category/[slug]`, `/brand/[slug]`, `/search?q=`
- Left sidebar filters (desktop) / bottom sheet filters (mobile):
  - Category, Brand, Price range slider, Rating stars, Color swatches, Size, Stock (in stock only), Discount
- Sort dropdown: Newest, Price low-high, Price high-low, Popularity, Best Selling
- Grid/List view toggle
- Product card: image with hover second-image, name, price/sale price, rating, quick-add-to-cart, wishlist heart
- Quick view modal (product details without leaving listing)
- Pagination + "Load more" option

### Product Detail Page

- URL: `/products/[slug]`
- Image gallery: thumbnails + main image + zoom on hover
- Product video if available
- Title, brand badge, rating summary (click → scroll to reviews)
- Price with sale price strikethrough, discount badge
- Variant selector: color swatches + size buttons (grayed out if out of stock)
- Stock badge: In Stock / Only 3 left / Out of Stock
- Quantity selector
- Add to Cart button (large, accent color)
- Buy Now button (secondary)
- Delivery info block (estimated delivery by district)
- Return policy + warranty info (accordion)
- Tabs: Description | Specifications | Reviews | Q&A
- Reviews section: star breakdown, list of reviews with verified badge, photos
- Related products row
- Recently viewed row

### Cart Page + Drawer

- Cart drawer: slide-in on every add-to-cart, shows all items, subtotal, checkout CTA
- Full cart page `/cart`: quantity stepper, remove button, product image, variant label
- Free shipping progress bar ("Spend 200৳ more for free delivery")
- Coupon code input with instant validation
- Order summary: subtotal, discount, shipping, total
- Recommended add-ons section
- Checkout CTA

### Checkout Flow

- Step 1: Contact info (name, email, phone) — pre-filled if logged in
- Step 2: Shipping address (full BD district + area selector with searchable dropdown)
- Step 3: Delivery method (standard / express based on zone)
- Step 4: Payment method (Cash on Delivery only in v1)
- Step 5: Order review (all items, totals, address, method)
- Step 6: Place Order → success page
- Guest checkout allowed — no forced login
- Login prompt shown as optional ("Log in to track your order easily")

### Customer Account Dashboard

- Sidebar nav: Overview | Orders | Addresses | Wishlist | Reviews | Profile | Support
- Orders: table with status badges, view details, reorder, return request
- Order detail: status timeline, items, tracking, invoice download
- Address book: add/edit/delete, set default
- Wishlist: grid of saved products
- Reviews: my reviews with edit option
- Profile: name, email, phone, avatar, password change

---

## Admin Panel Design & Pages

### Admin Layout

```
┌──────────┬───────────────────────────────────┐
│          │  Top Bar: Search | Notifications | Profile  │
│  Sidebar │                                   │
│  Nav     │  Page Content Area                │
│          │                                   │
│  Icons   │                                   │
│  +       │                                   │
│  Labels  │                                   │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

- Sidebar: collapsible, grouped sections
- Dark sidebar option (deep warm charcoal) with main area in light neutral
- All data tables use TanStack Table: sortable columns, row selection, bulk actions, pagination
- All forms use react-hook-form + Zod validation
- All charts use Recharts

### Admin Dashboard (Overview)

- Summary cards: Today's Revenue, Orders, New Customers, Conversion Rate
- Revenue chart: 7d / 30d / 12m toggle
- Order status breakdown (donut chart)
- Recent orders table (last 10)
- Top selling products (last 30 days)
- Low stock alerts panel
- Recent customer registrations

### Admin: Products

- Searchable, filterable data table
- Bulk actions: publish, archive, delete, assign category
- Create/Edit product form:
  - Basic info (name, slug auto-generated, short desc, full desc via TipTap rich editor)
  - Pricing (price, sale price, cost price, tax class)
  - Media (drag-and-drop image upload to Cloudinary, reorder, set primary)
  - Variants builder: add option types (Color, Size) → generate variant matrix → set price/stock per variant
  - Inventory: per-variant stock management
  - Shipping: weight, dimensions
  - SEO: title, description, OG image
  - Status toggle: draft / published / archived
  - Featured / Best Seller toggles

### Admin: Categories

- Visual tree view with expand/collapse
- Drag-and-drop reordering
- Inline create/edit
- Category banner image upload
- SEO fields

### Admin: Orders

- Advanced filters: status, date range, payment method, customer
- Order detail page:
  - Customer info + address
  - Order items with images
  - Financial breakdown
  - Status update dropdown with note field
  - COD risk score badge (color-coded: low/medium/high)
  - Order status history timeline
  - Print invoice button
  - Internal notes

### Admin: Inventory

- Table: product variant, SKU, stock_on_hand, stock_reserved, stock_available, low_stock_threshold
- Color-coded rows: red = out of stock, yellow = low stock
- Manual adjustment form with reason (received stock, damaged, correction)
- Export to CSV

### Admin: Customers

- Table with search, filter by segment
- Segments: All / VIP / New / Inactive / High Risk (COD cancellations)
- Customer detail: full profile, order history, total spent, addresses, coupons used, reviews

### Admin: Coupons

- Create coupon wizard:
  - Type: Percentage / Flat / Free Shipping
  - Value, minimum order, maximum discount cap
  - Usage limit (total + per user)
  - Date range
  - Applicable products/categories (optional restriction)
- Coupon list with usage progress bar
- Quick toggle active/inactive

### Admin: Campaigns

- Create campaign: name, slug, start/end dates, banner image, linked coupon, product group
- Auto-generates a `/campaigns/[slug]` landing page on storefront
- Landing page sections: hero, product grid, countdown timer, coupon reveal

### Admin: Reviews

- Moderation queue (pending reviews first)
- Approve / Reject / Delete actions
- Filter by product, rating, status
- View reviewer's order to verify purchase

### Admin: Blog

- TipTap rich text editor with image insert
- SEO fields per post
- Category + tag assignment
- Schedule publish date
- Draft / Published / Archived status

### Admin: Shipping Zones

- Create zone: name, select districts (multi-select), delivery time range
- Set shipping rates per zone: flat rate, free above amount threshold

### Admin: Staff & Roles

- Invite staff by email
- Roles: Super Admin / Admin / Manager / Staff (pre-built)
- Custom roles with permission toggles
- Each permission mapped to a specific module action (e.g. orders:update-status, products:create)

### Admin: SEO Manager

- Default store meta (title template, default description, default OG image)
- Per-page overrides for static pages
- Sitemap preview and regenerate button
- Robots.txt editor
- Redirect manager (301/302 from old URLs)

### Admin: Analytics

- Sales: revenue over time, average order value, orders per day
- Products: top viewed, top sold, high-view/low-conversion list
- Customers: new vs returning, geographic distribution by district
- Search terms: top searched, searches with no results
- Conversion funnel: views → cart → checkout → order

### Admin: Audit Logs

- Every admin action recorded: actor, action type, entity, before/after values, IP, timestamp
- Filterable by actor, action type, date range
- Read-only — cannot delete

### Admin: COD Risk Scoring

- System calculates a risk score per order based on:
  - Phone number's order history (cancellation rate)
  - Number of orders in short time from same phone
  - Address completeness
  - High-value COD order
- Badge on order: Low / Medium / High risk
- High-risk orders flagged for manual review before confirmation

---

## SEO System

Every product, category, brand, and blog page includes:

- Dynamic `<title>` and `<meta description>` via Next.js metadata API
- Canonical URL
- Open Graph image (product OG image or auto-generated)
- Twitter Card image
- Product JSON-LD schema (name, price, availability, brand, rating, image)
- Breadcrumb JSON-LD schema
- Review JSON-LD schema
- FAQ JSON-LD schema on relevant pages
- Sitemap.xml auto-generated (products, categories, brands, blog posts)
- robots.txt
- Clean SEO-friendly URLs: `/products/wireless-gaming-headphone` not `/products/12345`
- Image alt text on every product image
- Google Merchant Center feed generator (v1 basic, full in later phase)
- Facebook Catalog feed generator

---

## Analytics & Marketing Tracking

### Events Tracked

```
view_item             ← product detail page view
view_item_list        ← listing page viewed
select_item           ← product clicked from listing
add_to_cart           ← item added to cart
remove_from_cart      ← item removed
view_cart             ← cart page / drawer opened
begin_checkout        ← checkout step 1
add_shipping_info     ← checkout step 2
add_payment_info      ← checkout step 4
purchase              ← order confirmed
refund                ← order refunded
search                ← search query submitted
sign_up               ← new customer registered
login                 ← customer logged in
```

### Dual Tracking Strategy

| Event trigger | Browser | Server |
|---|---|---|
| Page views | GTM + GA4 + Meta Pixel | — |
| Add to cart | GTM event layer | — |
| Purchase | GTM event layer | Meta CAPI (server) + GA4 Measurement Protocol |

Server-side tracking via Inngest job on ORDER_CREATED event — fires after transaction commits.

---

## Development Phases

### Phase 1 — Engineering Foundation
- Next.js 15 project scaffold, TypeScript strict, ESLint, Prettier, path aliases
- Drizzle schema design and migrations, Neon PostgreSQL connection
- Auth.js v5 — email/password + Google OAuth
- RBAC system (roles, permissions, middleware guards)
- Store model with store_id
- Global API error handler, standardized response wrapper
- Zod validation middleware for all API routes
- Upstash Redis setup + rate limiting middleware
- Environment config and feature flags

### Phase 2 — Core Catalog
- Products CRUD with full variant system (option types + matrix builder)
- Categories (nested, with parent_id)
- Brands
- Cloudinary image upload integration
- Meilisearch product indexing + sync via Inngest
- Admin CRUD pages for all catalog entities
- Media library

### Phase 3 — Commerce Engine
- Guest cart (localStorage + Zustand) and logged-in cart (PostgreSQL)
- Cart merge on login
- Transactional checkout use case (full flow with rollback)
- Inventory reservation system
- Idempotency key implementation
- COD order creation
- Order management admin (status update, history)
- Order confirmation email via Resend
- COD risk scoring

### Phase 4 — Customer Experience
- Customer account dashboard (orders, addresses, profile)
- Wishlist
- Reviews + ratings with moderation
- Meilisearch instant search with filter support
- Address book with BD district/area selector
- Order tracking page with status timeline

### Phase 5 — Marketing & SEO
- Coupon system (create, validate, apply, usage tracking)
- Campaign system with auto-generated landing pages
- GA4 + GTM + Meta Pixel + Meta CAPI integration
- Full JSON-LD schema implementation
- Dynamic sitemap generation
- Blog system with TipTap editor + SEO fields
- Newsletter signup (email capture to Resend list)
- Abandoned cart tracking (via Redis session + Inngest job)

### Phase 6 — Polish & SaaS Prep
- Full admin analytics dashboard (Recharts)
- Audit logs system
- Shipping zones and rates management
- Banner and slider management
- Staff invitation and role management
- Lighthouse audit (target: 90+ all categories)
- OWASP Top 10 security hardening pass
- OpenAPI / Swagger documentation generation
- SaaS multi-store architecture activation layer (feature-flagged)
- Load testing and query optimization

---

## What Is Excluded from Version 1

The following are architecturally planned but not built in v1:

- AI shopping assistant, AI admin agent, AI product data generator
- WhatsApp Commerce automation (basic link only)
- Visual search, voice search
- Multi-tenant SaaS UI (store creation, subscription plans, custom domains)
- Online payment gateways (bKash, SSLCommerz, Stripe — slots exist in schema)
- Influencer / affiliate system
- Customer loyalty points and tiers
- Mobile PWA admin app
- Shoppable stories / reels section
- Smart bundle engine (manual bundles only via related products)
- Live social proof counters
- Personalized homepage (returns same homepage for all users in v1)

---

## Notes for SaaS Conversion (Version 2)

When ready to go multi-tenant:

1. Add store creation flow (signup → create store → pick theme → go live)
2. Activate `store_id` tenant routing middleware — all DB queries already scoped
3. Add custom domain routing via Vercel's wildcard DNS
4. Add subscription plan table + billing (Stripe Billing)
5. Add super-admin dashboard (manage all stores, plans, usage)
6. Extract heavy modules into separate services if traffic demands it
7. Add per-store feature flags (enable/disable modules by plan)

Zero schema migrations required for SaaS activation — the data model is already multi-tenant.

Instruction for implemenation 
1. must push after each small potion with proper commit messages.
2. maintain a update.md where after each portion write in which file 
what you have implemented so that later we can understand the
work flow and what is done untill then

remebember that

You are working on this project as a senior full-stack developer.

Use clean, production-ready code.
For frontend, keep responsive design and reusable components.
For backend, keep controller/service/repository separation.
Validate input properly.
Add error handling.
Update types/interfaces if needed.

Review this change as a senior software engineer.
Focus on:
- security issues
- broken edge cases
- bad architecture
- unnecessary code
- performance problems
- missing validation



