# Step 04: Single-Store RBAC Delivery Report

## Overview

We have successfully implemented Step 4 of the Niyamah SaaS product roadmap: **Staff roles and permissions for a single business**.

This step introduced a complete, granular Role-Based Access Control (RBAC) system while adhering strictly to the current single-store, single-business architecture constraint. Multi-tenant concepts (e.g., cross-tenant isolation, domains) were explicitly avoided.

## Key Accomplishments

1. **Schema Enhancements**: 
   - Added robust tracking to `roles` (isSystem, createdAt, updatedAt) and `store_users` (isActive, createdAt, updatedAt).
2. **Database Migrations**: 
   - Created `drizzle/0006_single_store_rbac.sql` to systematically insert a centralized set of baseline permissions (25+) and seed 9 predefined `SYSTEM_ROLES`. 
   - Backfilled existing 'superadmin' and 'admin' legacy users to the new `owner` role, guaranteeing continued access for original system operators.
3. **Authorization Engine**:
   - Developed `src/modules/auth/infrastructure/rbac.repository.ts` to perform optimized relational permission lookups.
   - Designed a new `requirePermission()` guard, offering granular access controls per route.
4. **API Security Rollout**:
   - Programmatically audited and upgraded 40+ Admin API routes to utilize the new permission guard system (e.g., `products.manage`, `orders.view`).
5. **Admin UI Protection**:
   - Integrated the RBAC service into `AdminLayout`, preventing unauthorized backend navigation.
   - Adapted `AdminSidebar` to filter UI elements by contextual permissions (using the new `ctx.permissions` payload).
   - Injected server-side capability checks onto 15+ administrative `page.tsx` routes to forcibly prevent unsanctioned rendering.
6. **Staff Management Module**:
   - Overhauled the legacy UI at `src/app/(admin)/admin/staff/page.tsx` into a robust interface.
   - Built accompanying endpoints for inviting users, updating their functional roles, and terminating access securely (with an absolute restriction protecting `Owner` accounts).

## Quality Gates Passed

- **ESLint**: Clean `npm run lint` execution.
- **TypeScript**: Clean `npm run typecheck` compilation.
- **Production Build**: Successful static generation using `npm run build` with mocked database strings.
- **RBAC Validator**: Executed a bespoke custom script (`npm run rbac:verify`) evaluating schema state and validating the presence of foundational authorization blocks (e.g., `admin.access`, `Owner` role).

## Documentation and Deliverables

Included alongside this report are two important files for tracking history:
1. `step-04-changes.patch`: A unified standard patch containing all codebase alterations for Step 4.
2. `step-04-single-store-rbac-verification-package.zip`: A snapshot of the updated system for independent review.

All outstanding Step 4 tasks have been satisfied.
