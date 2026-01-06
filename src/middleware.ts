import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Frontend-only branch: no server-side auth.
  // Keep middleware as a no-op so it doesn't block Vercel deployments.
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
