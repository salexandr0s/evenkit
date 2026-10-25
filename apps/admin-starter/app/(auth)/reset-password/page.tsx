import { StarterAuthForm } from "../../../lib/auth/auth-form";
import { starterAuthSettings } from "../../../lib/auth/settings";
import { starterReturnPath, starterServerClient } from "../../../lib/auth/server";
import { firstParam, type AuthRouteProps } from "../../../lib/auth/page-props";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: AuthRouteProps) {
  const query = await searchParams;
  const mode = starterAuthSettings().mode;
  let ready = mode === "demo" && query.demo === "ready";
  if (mode === "supabase") {
    try {
      const client = await starterServerClient();
      const { data, error } = await client.auth.getUser();
      ready = !error && Boolean(data.user);
    } catch { ready = false; }
  }
  return <StarterAuthForm action="update-password" mode={mode} returnTo={starterReturnPath(firstParam(query.returnTo))} recoveryState={ready ? "ready" : "expired"} />;
}
