# Step 1: Lint Cleanup Report

## Overview
This report details the work done to resolve all ESLint warnings and errors across the Niyamah codebase without modifying any business logic, API contracts, database structures, or UI designs.

## Initial State
- Ran `npm run lint` upon setup.
- Discovered 48 problems (20 errors, 28 warnings).

## Major Issues Fixed

1. **`react-hooks/set-state-in-effect`**
   - **Problem**: Next.js/React strictly discourages synchronous `setState` inside `useEffect` as it can trigger cascading renders.
   - **Fix**: Wrapped state-updating asynchronous `load()` and `refresh()` calls in IIFEs (`void (async () => { await load(); })();`). Also properly handled manual `setState` in `site-header.tsx` during search debounce processing.
   - **Files modified**:
     - `src/app/(admin)/admin/brands/page.tsx`
     - `src/app/(admin)/admin/campaigns/page.tsx`
     - `src/app/(admin)/admin/categories/page.tsx`
     - `src/app/(admin)/admin/coupons/page.tsx`
     - `src/app/(admin)/admin/media/page.tsx`
     - `src/app/(admin)/admin/reviews/page.tsx`
     - `src/app/(admin)/admin/shipping/page.tsx`
     - `src/app/(admin)/admin/staff/page.tsx`
     - `src/app/(storefront)/account/addresses/page.tsx`
     - `src/components/admin/notification-bell.tsx`
     - `src/components/admin/notifications-inbox.tsx`
     - `src/components/storefront/site-header.tsx`

2. **`react-hooks/refs`**
   - **Problem**: Passing `field.ref` and other `field` object properties directly during render in `react-hook-form` wrappers.
   - **Fix**: Destructured `field: { name, value, onChange, onBlur, ref }` in the component props so that the refs are safely extracted before the render function consumes them.
   - **Files modified**:
     - `src/components/admin/coupon-form.tsx`
     - `src/components/admin/product-form.tsx`

3. **`react-hooks/preserve-manual-memoization`**
   - **Problem**: React Compiler was dropping memoization on callbacks because the inferred dependencies (e.g. `setActiveIndex`) did not match the manual dependency array (`[total]`).
   - **Fix**: Added the inferred state setters (e.g. `setActiveIndex`) into the `useCallback` dependency arrays, which safely aligns inferred and manual dependencies.
   - **Files modified**:
     - `src/components/storefront/best-sellers-trending-section.tsx`
     - `src/components/storefront/new-arrivals-slider-section.tsx`
     - `src/components/storefront/trending-now-section.tsx`

4. **`react-hooks/incompatible-library`**
   - **Problem**: `form.watch("rating")` from `react-hook-form` isn't safely memoizable by React Compiler.
   - **Fix**: Switched to using `useWatch({ control: form.control, name: "rating" })` which is compiler-compatible.
   - **Files modified**:
     - `src/components/storefront/product-review-form.tsx`

5. **`@typescript-eslint/no-unused-expressions`**
   - **Problem**: Using ternary operators for side effects (e.g., `has(item) ? removeItem() : addItem()`).
   - **Fix**: Replaced the ternary operators with proper `if/else` statements.
   - **Files modified**:
     - `src/components/storefront/search-bar.tsx`
     - `src/stores/wishlist-store.ts`

6. **Variable accessing before initialization & Unused Variables**
   - **Problem**: A recursive function expression assigned to a `const` inside `useCallback` triggered `Cannot access variable before it is declared`. Unused imports were present in storefront sections.
   - **Fix**: Re-structured `const runProgress` into a named internal `function runProgressInternal` to fix recursive callback access. Cleaned up unused variables and imports in storefront `page.tsx` and `product-story-rail-section.tsx`.
   - **Files modified**:
     - `src/components/storefront/customer-reviews-carousel.tsx`
     - `src/components/storefront/homepage-sections.tsx`
     - `src/components/storefront/product-story-rail-section.tsx`
     - `src/app/(storefront)/page.tsx`

## Final Result
Running `npm run lint` yields no errors and no warnings across the entire repository. Zero global rules disabled, UI and business logic fully preserved.
