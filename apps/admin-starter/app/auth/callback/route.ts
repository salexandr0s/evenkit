import { NextResponse } from "next/server";
import { verifyAccess } from "@evenkit/auth-next/server";
import { z } from "zod";
import { starterEligibility, starterReturnPath, starterServerClient } from "../../../lib/auth/server";
import { starterAuthSettings } from "../../../lib/auth/settings";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const settings = starterAuthSettings();
  const input = new URL(request.url);
  const returnTo = starterReturnPath(input.searchParams.get("returnTo"));
  const origin = settings.origin;
  const finish = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin), 303);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  };
  const invalid = `/session-expired?reason=invalid-link&returnTo=${encodeURIComponent(returnTo)}`;
  if (settings.mode === "demo") return finish(invalid);
  const code = z.string().min(1).max(4096).safeParse(input.searchParams.get("code"));
  if (!code.success || input.searchParams.has("error")) return finish(invalid);
  try {
    const client = await starterServerClient(true);
    const { error } = await client.auth.exchangeCodeForSession(code.data);
    if (error) return finish(invalid);
    // Recovery requires a verified user, but not application membership to change their own password.
    if (input.searchParams.get("flow") === "recovery") {
      const { data, error: userError } = await client.auth.getUser();
      if (userError || !data.user) return finish(invalid);
      return finish(`/reset-password?returnTo=${encodeURIComponent(returnTo)}`);
    }
    const access = await verifyAccess(client.auth, starterEligibility);
    if (access.status === "allowed") return finish(returnTo);
    await client.auth.signOut({ scope: "local" });
    return finish(access.status === "denied" ? "/access-denied" : invalid);
  } catch { return finish(`/session-expired?reason=unavailable&returnTo=${encodeURIComponent(returnTo)}`); }
}
