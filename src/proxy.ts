import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = new Set(["superadmin", "admin", "manager", "staff"]);

/**
 * Auth proxy:
 *  - /admin/*       → requires logged-in user with an admin-tier role
 *  - /account/*     → requires any logged-in user
 *  - /api/v1/admin  → requires admin role (returns 403 JSON on failure)
 *
 * All other routes pass through unchanged.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAccountPage = pathname.startsWith("/account");
  const isAdminApi = pathname.startsWith("/api/v1/admin");

  if (!isAdminPage && !isAccountPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = await getToken(
    process.env.AUTH_SECRET
      ? { req, secret: process.env.AUTH_SECRET }
      : { req },
  );

  // Not signed in
  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHENTICATED", message: "Authentication required." },
        },
        { status: 401 },
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin authorization
  if (isAdminPage || isAdminApi) {
    const role = (token.role as string | undefined) ?? "customer";
    if (!ADMIN_ROLES.has(role)) {
      if (isAdminApi) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You do not have permission to access this resource.",
            },
          },
          { status: 403 },
        );
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/v1/admin/:path*"],
};
