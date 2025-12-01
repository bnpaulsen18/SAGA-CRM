import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily disabled middleware - will add back with proper NextAuth v5 integration
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
