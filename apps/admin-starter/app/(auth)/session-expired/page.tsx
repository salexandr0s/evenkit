import { AuthLayout, Button } from "@evenkit/ui";
import { starterAuthSettings } from "../../../lib/auth/settings";
import { starterReturnPath } from "../../../lib/auth/server";
import { firstParam, type AuthRouteProps } from "../../../lib/auth/page-props";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: AuthRouteProps) {
  const query = await searchParams;
  const returnTo = starterReturnPath(firstParam(query.returnTo));
  const reason = firstParam(query.reason);
  const unavailable = reason === "unavailable";
  const failedSignout = reason === "signout-failed";
  const invalid = reason === "invalid-link";
  return <AuthLayout brand={<a href="/dashboard">Evenkit admin</a>} title={invalid ? "This link cannot be used" : failedSignout ? "Sign-out did not complete" : unavailable ? "Authentication is unavailable" : "Sign in again"} description={invalid ? "The link is invalid, expired, or was opened in a different browser." : failedSignout ? "Your session may still be active. Retry signing out." : unavailable ? "The provider or access check could not be reached. Your destination is preserved." : "Your session has ended. Sign in to return to your previous destination."}>
    <div className="pk-auth-recovery">
      <p>Continue to: {returnTo}</p>
      <a href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</a>
      <a href={`/forgot-password?returnTo=${encodeURIComponent(returnTo)}`}>Request a new reset link</a>
      {unavailable ? <a href={returnTo}>Retry connection</a> : null}
      {failedSignout ? <form action="/auth/sign-out" method="post"><Button type="submit">Retry sign-out</Button></form> : null}
      {starterAuthSettings().mode === "demo" ? <a href={returnTo}>Continue with fictional demo data</a> : null}
    </div>
  </AuthLayout>;
}
