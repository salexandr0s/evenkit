import "server-only";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { parseAuthConfig, trustedOrigin, type AuthConfig } from "./config.js";

export { parseAuthConfig, trustedOrigin, type AuthConfig } from "./config.js";
export { verifyAccess, type AuthIdentity, type EligibilityPolicy, type AccessResult } from "./policy.js";

/** Create per request. Cookie writes belong in a Route Handler, Server Action, or proxy. */
export function createServerAuth(config: AuthConfig, cookies: CookieMethodsServer) {
  const parsed = parseAuthConfig(config);
  return createServerClient(parsed.url, parsed.publishableKey, { cookies });
}

/** Require a configured origin; never derive auth redirects from Host or Forwarded headers. */
export function isSameOrigin(request: Request, applicationOrigin: string): boolean {
  return request.headers.get("origin") === trustedOrigin(applicationOrigin);
}
