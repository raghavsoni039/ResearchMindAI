/**
 * Next.js Middleware — Route Protection
 * All /dashboard/** routes require a valid Auth.js session.
 * Unauthenticated requests are redirected to /sign-in.
 * Auth.js API routes (/api/auth/**) are always public.
 */
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req as NextRequest & { auth: typeof req.auth };
  const isLoggedIn = !!session;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isSignIn = nextUrl.pathname === "/sign-in";

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || nextUrl.host;
  const protocol = req.headers.get("x-forwarded-proto") || (nextUrl.protocol.startsWith("http") ? nextUrl.protocol : "http:");
  const origin = `${protocol.endsWith(":") ? protocol : protocol + ":"}//${host}`;

  // Always allow auth routes through
  if (isAuthRoute) return NextResponse.next();

  // Redirect authenticated users away from /sign-in
  if (isSignIn && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // Block unauthenticated users from /dashboard
  if (isOnDashboard && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on every route except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
