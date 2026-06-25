import { RbacRepository, type AdminAccessContext } from "../infrastructure/rbac.repository";
import { getCurrentUser } from "@/lib/auth/guards";
import { apiError } from "@/lib/utils/api-response";

/**
 * Returns the resolved admin access context for the current user, if any.
 */
export async function getCurrentAdminAccess(): Promise<AdminAccessContext | null> {
  const session = await getCurrentUser();
  if (!session?.userId) return null;
  return RbacRepository.getAdminAccessContext(session.userId);
}

/**
 * Helper to check if a context has a specific permission.
 */
export function hasPermission(ctx: AdminAccessContext, permission: string): boolean {
  if (ctx.isOwner) return true; // Owner implicitly has all permissions
  return ctx.permissions.has(permission);
}

/**
 * Require a specific permission for an API route.
 */
export async function requirePermission(
  permission: string
): Promise<{ ctx: AdminAccessContext } | { error: Response }> {
  const session = await getCurrentUser();
  if (!session?.userId) {
    return { error: apiError("UNAUTHENTICATED", "Sign in required.", 401) };
  }
  const ctx = await RbacRepository.getAdminAccessContext(session.userId);
  if (!ctx) {
    return { error: apiError("FORBIDDEN", "Admin access required.", 403) };
  }
  if (!hasPermission(ctx, permission)) {
    return {
      error: apiError("FORBIDDEN", `Permission required: ${permission}`, 403),
    };
  }
  return { ctx };
}

/**
 * Require ANY of the specified permissions.
 */
export async function requireAnyPermission(
  permissions: string[]
): Promise<{ ctx: AdminAccessContext } | { error: Response }> {
  const session = await getCurrentUser();
  if (!session?.userId) {
    return { error: apiError("UNAUTHENTICATED", "Sign in required.", 401) };
  }
  const ctx = await RbacRepository.getAdminAccessContext(session.userId);
  if (!ctx) {
    return { error: apiError("FORBIDDEN", "Admin access required.", 403) };
  }
  if (ctx.isOwner) return { ctx };
  
  const hasAny = permissions.some((p) => ctx.permissions.has(p));
  if (!hasAny) {
    return {
      error: apiError("FORBIDDEN", `One of permissions required: ${permissions.join(", ")}`, 403),
    };
  }
  return { ctx };
}

import { redirect } from "next/navigation";

/**
 * Require a specific permission for a server-rendered page.
 * If unauthenticated, redirects to login.
 * If unauthorized, redirects to an access denied page.
 */
export async function requireAdminPage(permission: string): Promise<AdminAccessContext> {
  const session = await getCurrentUser();
  if (!session?.userId) {
    redirect("/login?redirect=/admin");
  }
  const ctx = await RbacRepository.getAdminAccessContext(session.userId);
  if (!ctx) {
    redirect("/login?redirect=/admin");
  }
  if (!hasPermission(ctx, permission)) {
    redirect("/admin/access-denied");
  }
  return ctx;
}

