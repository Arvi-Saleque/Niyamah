import { auth } from "@/lib/auth";
import { apiError } from "@/lib/utils/api-response";
import type { UserRole } from "@/modules/auth/domain/user.entity";

const ADMIN_ROLES = new Set<UserRole>([
  "superadmin",
  "admin",
  "manager",
  "staff",
]);

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Returns the current session info or null.
 */
export async function getCurrentUser(): Promise<AuthContext | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    role: ((session.user as { role?: UserRole }).role) ?? "customer",
  };
}

/**
 * Guard helper for API routes — returns either the auth context or an
 * already-formed apiError Response. Caller does:
 *
 *   const guard = await requireAdmin();
 *   if ("error" in guard) return guard.error;
 *   const ctx = guard.ctx;
 */
export async function requireAdmin(): Promise<
  { ctx: AuthContext } | { error: Response }
> {
  const ctx = await getCurrentUser();
  if (!ctx) {
    return { error: apiError("UNAUTHENTICATED", "Sign in required.", 401) };
  }
  if (!ADMIN_ROLES.has(ctx.role)) {
    return {
      error: apiError(
        "FORBIDDEN",
        "Admin permission required.",
        403,
      ),
    };
  }
  return { ctx };
}

export async function requireUser(): Promise<
  { ctx: AuthContext } | { error: Response }
> {
  const ctx = await getCurrentUser();
  if (!ctx) {
    return { error: apiError("UNAUTHENTICATED", "Sign in required.", 401) };
  }
  return { ctx };
}
