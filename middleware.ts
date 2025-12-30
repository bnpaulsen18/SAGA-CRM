import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Specify runtime as nodejs to support bcryptjs and Prisma
export const runtime = "nodejs";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/preview/v1",
    "/preview/v2",
    "/preview/v3",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Protected routes - require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // Platform admin only routes
  const isPlatformAdminRoute = pathname.startsWith("/admin");

  // If user is not logged in and trying to access protected route
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access platform admin routes without platform admin role
  if (isPlatformAdminRoute && !user?.isPlatformAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is logged in and trying to access login/register pages
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    // Platform admins go to admin dashboard, others to regular dashboard
    const dashboardUrl = user?.isPlatformAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Optimize matcher to only run on routes that need auth
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/donations/:path*",
    "/contacts/:path*",
    "/campaigns/:path*",
    "/login",
    "/register",
  ],
};
