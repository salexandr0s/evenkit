import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerAuth, verifyAccess, type EligibilityPolicy } from "@evenkit/auth-next/server";
import { authReturnUrl, safeReturnPath } from "@evenkit/auth-next/paths";
import { starterAuthSettings } from "./settings";

export function starterReturnPath(value: unknown): string {
  const path = safeReturnPath(value);
  return /^\/(dashboard|records|settings|team|notifications|documents)(?:[/?#]|$)/.test(path) ? path : "/dashboard";
}

/** Replace with your application's server-owned policy; metadata is not authorization. */
export const starterEligibility: EligibilityPolicy = identity => {
  const settings = starterAuthSettings();
  return settings.mode === "supabase" && identity.emailConfirmed && settings.allowedUserIds.includes(identity.id);
};

export async function starterServerClient(writable = false) {
  const settings = starterAuthSettings();
  if (settings.mode !== "supabase") throw new Error("Provider mode is not configured.");
  const jar = await cookies();
  return createServerAuth(settings.config, {
    getAll: () => jar.getAll(),
    setAll(values) {
      if (!writable) throw new Error("Refresh cookies in the request proxy before rendering.");
      for (const { name, value, options } of values) jar.set(name, value, options);
    },
  });
}

export async function requireStarterSession(returnTo: string): Promise<{ mode: "demo" | "supabase"; userLabel: string }> {
  const settings = starterAuthSettings();
  if (settings.mode === "demo") return { mode: "demo", userLabel: "Alex Morgan · Demo" };
  const client = await starterServerClient();
  const access = await verifyAccess(client.auth, starterEligibility);
  if (access.status === "allowed") return { mode: "supabase", userLabel: access.identity.email ?? "Signed-in member" };
  if (access.status === "denied") redirect("/access-denied");
  redirect(authReturnUrl("/session-expired", starterReturnPath(returnTo)) + (access.status === "unavailable" ? "&reason=unavailable" : ""));
}
