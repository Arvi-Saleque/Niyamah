# Niyamah — Component Registry

All reusable components live under `src/components/`. Every UI element in the app must use a component from this registry — no raw inline HTML/JSX for anything that already has a component.

---

## Phase 1 — Design System Primitives (`src/components/shared/`)

| File                      | Description                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `container.tsx`           | Max-width wrapper with `size` prop (narrow / default / wide / full) + horizontal padding      |
| `section.tsx`             | Vertical spacing wrapper, `spacing` prop (sm/md/lg/xl), polymorphic `as` prop                 |
| `typography.tsx`          | `Heading` (Playfair Display, h1–h6, xs–4xl) + `Text` (Inter, body/lead/small/muted/secondary) |
| `logo.tsx`                | Brand logo — image, text, or both; links to `href`                                            |
| `section-header.tsx`      | Title + subtitle + optional CTA link with `align` prop                                        |
| `page-header.tsx`         | Page title + breadcrumb row + optional action buttons                                         |
| `breadcrumbs.tsx`         | Wraps shadcn Breadcrumb; exports `BreadcrumbItem` interface; optional Home icon               |
| `price-text.tsx`          | BDT-formatted price with sale strikethrough + discount pill                                   |
| `discount-badge.tsx`      | Red "-XX%" pill badge                                                                         |
| `rating-stars.tsx`        | 5-star display, supports partial stars, sizes sm/md/lg, optional count                        |
| `status-badge.tsx`        | Semantic colored badge for order/stock/publish statuses                                       |
| `stock-indicator.tsx`     | Maps stock number → In/Low/Out of Stock with icons                                            |
| `empty-state.tsx`         | Icon + title + description + optional CTA button                                              |
| `error-state.tsx`         | Error fallback UI with retry button                                                           |
| `skeleton-card.tsx`       | Card or list variant loading placeholder (shadcn Skeleton)                                    |
| `image-with-fallback.tsx` | next/image with `onError` fallback to placeholder                                             |
| `confirm-dialog.tsx`      | Wraps shadcn AlertDialog with trigger prop + destructive variant                              |
| `copy-button.tsx`         | Clipboard copy with 2-second checkmark confirmation                                           |
| `quantity-stepper.tsx`    | +/- controlled input with min/max; sizes sm/md                                                |
| `countdown-timer.tsx`     | Live dd:hh:mm:ss blocks from `endsAt`, fires `onExpire` callback                              |
| `pagination-controls.tsx` | Wraps shadcn Pagination with ellipsis logic                                                   |

---

## Phase 2 — Layout Components

| File                                        | Description                                                    |
| ------------------------------------------- | -------------------------------------------------------------- |
| `src/components/storefront/top-bar.tsx`     | Slim promo/contact bar above the main header                   |
| `src/components/storefront/site-header.tsx` | Sticky header — logo, search, cart badge, auth                 |
| `src/components/storefront/mega-menu.tsx`   | Horizontal nav with hover dropdown; exports `MegaMenuCategory` |
| `src/components/storefront/mobile-nav.tsx`  | Sheet slide-in mobile navigation                               |
| `src/components/storefront/site-footer.tsx` | Dark 4-column footer — brand + links + social + copyright      |
| `src/components/admin/admin-sidebar.tsx`    | Collapsible left sidebar with active-path highlighting         |
| `src/components/admin/admin-topbar.tsx`     | Admin top bar — search, notification bell, user dropdown       |

---

## Phase 3 — Product Components (`src/components/storefront/`)

| File                           | Description                                                             |
| ------------------------------ | ----------------------------------------------------------------------- |
| `product-card.tsx`             | Product grid tile — image, badges, wishlist, rating, price, add-to-cart |
| `product-grid.tsx`             | Responsive 2–5 column grid of ProductCards with loading state           |
| `product-list-view.tsx`        | Horizontal list layout — thumbnail, name, rating, price, add-to-cart    |
| `product-gallery.tsx`          | Main image + thumbnail strip with arrow navigation                      |
| `product-info.tsx`             | PDP name, rating, price, stock, short description, SKU block            |
| `product-variant-selector.tsx` | Text button or color swatch variant groups                              |
| `add-to-cart-button.tsx`       | Gold CTA — loading spinner, toast, opens cart drawer                    |
| `wishlist-button.tsx`          | Heart toggle button safe to use inside links                            |
| `product-quick-view.tsx`       | Dialog with 2-column gallery + info + qty + add-to-cart                 |
| `product-tabs.tsx`             | shadcn Tabs — Description / Specifications / Reviews                    |
| `product-specs-table.tsx`      | Standalone key-value specification table                                |
| `related-products.tsx`         | Horizontal scrollable row of related ProductCards                       |
| `product-review-card.tsx`      | Single review — avatar, name, rating, date, body                        |
| `product-review-form.tsx`      | react-hook-form + Zod — star picker, title, body                        |

---

## Phase 4 — Catalog / Search / Filter (`src/components/storefront/`)

| File                     | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `category-card.tsx`      | Image + name tile with link                                         |
| `category-grid.tsx`      | Responsive grid of CategoryCards                                    |
| `search-bar.tsx`         | Search input with clear button, navigates to `/search?q=`           |
| `search-suggestions.tsx` | Dropdown with live results and "see all" link                       |
| `filter-sidebar.tsx`     | Desktop left-rail — price range, brand, rating, in-stock checkboxes |
| `filter-drawer.tsx`      | Mobile Sheet version of FilterSidebar                               |
| `active-filters.tsx`     | Dismissible filter chips row                                        |
| `sort-dropdown.tsx`      | shadcn Select for sort order                                        |
| `price-range-slider.tsx` | Dual-thumb BDT price range slider                                   |

---

## Phase 5 — Cart (`src/components/storefront/`)

| File                         | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `mini-cart-button.tsx`       | Header icon with live item count badge                         |
| `cart-drawer.tsx`            | Right-side Sheet — cart items, free-shipping bar, checkout CTA |
| `cart-item.tsx`              | Single cart line — image, name, variant, qty stepper, remove   |
| `cart-summary.tsx`           | Subtotal, discount, shipping, total breakdown                  |
| `coupon-box.tsx`             | Code input + apply/remove with inline feedback                 |
| `free-shipping-progress.tsx` | Progress bar to free-shipping threshold                        |
| `cart-empty-state.tsx`       | Empty cart illustration + shop CTA                             |

---

## Phase 6 — Checkout + Auth

### Checkout (`src/components/storefront/`)

| File                           | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| `checkout-steps.tsx`           | Step indicator: Cart → Address → Review → Placed                           |
| `address-form.tsx`             | Shipping address form — name, phone, address, district, city, postal, note |
| `delivery-method-selector.tsx` | Radio card delivery option selector                                        |
| `payment-method-selector.tsx`  | COD-only locked selection card (v1)                                        |
| `order-summary.tsx`            | Read-only items + totals for checkout review step                          |
| `order-confirmation.tsx`       | Success screen — order ID, copy button, nav CTAs                           |

### Auth (`src/components/auth/`)

| File                       | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| `login-form.tsx`           | Email + password login with forgot-password link            |
| `register-form.tsx`        | Name, email, password, confirm password with Zod validation |
| `forgot-password-form.tsx` | Email input → sends Resend reset link, shows success state  |

---

## Phase 7 — Marketing / Homepage (`src/components/storefront/`)

| File                       | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `hero-slider.tsx`          | Full-width image carousel — auto-play, arrows, dot indicators |
| `campaign-banner.tsx`      | Promotional banner with hover scale + CTA overlay             |
| `flash-sale-section.tsx`   | Countdown timer + product grid sale band                      |
| `featured-categories.tsx`  | Homepage "Shop by Category" using CategoryGrid                |
| `trust-badges.tsx`         | 4 USP icons — shipping, payment, returns, support             |
| `testimonials-section.tsx` | Customer review grid with avatar, rating, quote               |
| `newsletter-box.tsx`       | Email subscription form with gold background                  |
| `best-seller-section.tsx`  | Best-sellers product grid section                             |
| `new-arrivals-section.tsx` | New arrivals product grid section                             |

---

## Phase 8 — Admin Dashboard (`src/components/admin/`)

| File                         | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| `stats-card.tsx`             | KPI card — value + optional % change trend icon                    |
| `data-table.tsx`             | Generic sortable, searchable, paginated table for all CRUD screens |
| `table-actions.tsx`          | Row-level view / edit / delete action dropdown                     |
| `product-form.tsx`           | Admin create/edit product — name, slug, SKU, price, stock, publish |
| `product-image-uploader.tsx` | Multi-image upload widget with FileReader preview grid             |
| `category-form.tsx`          | Admin create/edit category — name, slug, description               |
| `order-status-updater.tsx`   | Inline order status select + update button with optimistic UI      |
| `coupon-form.tsx`            | Create/edit coupon — code, type (% or fixed), value, expiry        |
| `banner-manager.tsx`         | List editor for hero banners — add/edit/toggle/remove              |
| `settings-form.tsx`          | General store settings — name, email, phone, address, SEO defaults |
| `notification-panel.tsx`     | Bell icon with unread count + popover notification list            |

---

## Zustand Stores

| File                           | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `src/stores/cart-store.ts`     | Client cart state with `persist` middleware     |
| `src/stores/wishlist-store.ts` | Client wishlist state with `persist` middleware |

---

## shadcn/ui Primitives (`src/components/ui/`)

All 34 shadcn primitives installed: `button`, `input`, `label`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `badge`, `avatar`, `separator`, `skeleton`, `dialog`, `sheet`, `drawer`, `dropdown-menu`, `tooltip`, `popover`, `alert-dialog`, `command`, `card`, `tabs`, `accordion`, `scroll-area`, `collapsible`, `navigation-menu`, `breadcrumb`, `pagination`, `form`, `slider`, `sonner`, `alert`, `progress`, `table`.
