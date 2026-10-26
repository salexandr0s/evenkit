import type { NextRequest } from "next/server";
import { updateStarterSession } from "./lib/auth/proxy";

export function proxy(request: NextRequest) {
  return updateStarterSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/records/:path*", "/settings/:path*", "/team/:path*", "/notifications/:path*", "/documents/:path*", "/reset-password"],
};
