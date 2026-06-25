import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Auth proxy:
 *  - /admin/*       → requires logged-in user
 *  - /account/*     → requires logged-in user
 *  - /api/v1/admin  → requires logged-in user (returns 401 JSON on failure)
 *
 * All other routes pass through unchanged.
 * Actual RBAC checks (403 Forbidden) are performed inside the route handlers and layouts.
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
    process.env.AUTH_SECRET ? { req, secret: process.env.AUTH_SECRET } : { req },
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/v1/admin/:path*"],
};
