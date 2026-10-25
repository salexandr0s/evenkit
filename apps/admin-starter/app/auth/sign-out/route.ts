import { NextResponse } from "next/server";
import { isSameOrigin } from "@evenkit/auth-next/server";
import { starterServerClient } from "../../../lib/auth/server";
import { starterAuthSettings } from "../../../lib/auth/settings";

export async function POST(request: Request) {
  const settings = starterAuthSettings();
  const origin = settings.origin;
  if (!isSameOrigin(request, origin)) return new Response("Origin not allowed.", { status: 403, headers: { "Cache-Control": "no-store" } });
  let destination = "/login?signedOut=1";
  if (settings.mode === "supabase") {
    try {
      const client = await starterServerClient(true);
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) destination = "/session-expired?reason=signout-failed";
    } catch { destination = "/session-expired?reason=signout-failed"; }
  }
  const response = NextResponse.redirect(new URL(destination, origin), 303);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
