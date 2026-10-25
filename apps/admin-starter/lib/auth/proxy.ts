import { NextResponse, type NextRequest } from "next/server";
import { createServerAuth } from "@evenkit/auth-next/server";
import { starterAuthSettings } from "./settings";

/** Refresh once and copy all cookie updates into both the forwarded request and response. */
export async function updateStarterSession(request: NextRequest): Promise<NextResponse> {
  const settings = starterAuthSettings();
  let response = NextResponse.next({ request });
  if (settings.mode === "demo") return response;
  type CookieUpdate = Parameters<NonNullable<Parameters<typeof createServerAuth>[1]["setAll"]>>[0][number];
  const updates = new Map<string, CookieUpdate>();
  const client = createServerAuth(settings.config, {
    getAll: () => request.cookies.getAll(),
    setAll(values) {
      for (const { name, value, options } of values) {
        request.cookies.set(name, value);
        updates.set(name, { name, value, options });
      }
      response = NextResponse.next({ request });
      for (const { name, value, options } of updates.values()) response.cookies.set(name, value, options);
    },
  });
  // The page verifies identity and policy again; a refresh failure must never authorize access.
  try { await client.auth.getUser(); } catch { /* The page supplies recovery UI. */ }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
