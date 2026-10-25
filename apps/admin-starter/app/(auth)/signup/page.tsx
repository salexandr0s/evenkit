import { StarterAuthForm } from "../../../lib/auth/auth-form";
import { starterAuthSettings } from "../../../lib/auth/settings";
import { starterReturnPath } from "../../../lib/auth/server";
import { firstParam, type AuthRouteProps } from "../../../lib/auth/page-props";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: AuthRouteProps) {
  const query = await searchParams;
  return <StarterAuthForm action="signup" mode={starterAuthSettings().mode} returnTo={starterReturnPath(firstParam(query.returnTo))} />;
}
