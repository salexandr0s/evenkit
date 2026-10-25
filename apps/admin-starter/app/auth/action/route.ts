import { NextResponse } from "next/server";
import { isSameOrigin, verifyAccess } from "@evenkit/auth-next/server";
import { authRequestSchema, type AuthResponse } from "../../../lib/auth/requests";
import { starterEligibility, starterReturnPath, starterServerClient } from "../../../lib/auth/server";
import { starterAuthSettings } from "../../../lib/auth/settings";

export const dynamic = "force-dynamic";
function reply(value: AuthResponse, status = 200) { return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } }); }
function failure(message: string, status = 400) { return reply({ status: "error", error: { message } }, status); }

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return null; }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } catch { return null; }
  finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  const settings = starterAuthSettings();
  const origin = settings.origin;
  if (!isSameOrigin(request, origin)) return failure("This request did not come from this application.", 403);
  if (Number(request.headers.get("content-length") ?? 0) > 8192) return failure("The request is too large.", 413);
  const parsed = authRequestSchema.safeParse(await readBody(request));
  if (!parsed.success) return failure("Check your email and password. New passwords need 12 to 128 characters.");
  const input = parsed.data;
  const returnTo = starterReturnPath(input.returnTo);
  if (settings.mode === "demo") {
    await new Promise(resolve => setTimeout(resolve, 650));
    if ("email" in input && input.email === "fail@example.test") return failure("The demo request failed. Use another fictional address to retry.", 503);
    if (input.action === "login") return reply({ status: "success", message: "Demo sign-in completed.", redirect: returnTo });
    if (input.action === "signup") return reply({ status: "success", message: "Demo account request received. No account or email was created." });
    if (input.action === "request-reset") return reply({ status: "success", message: "If an account matches that email, reset instructions will be sent." });
    return reply({ status: "success", message: "Demo password change completed. No password was stored.", redirect: returnTo });
  }
  try {
    const client = await starterServerClient(true);
    if (input.action === "login") {
      const { error } = await client.auth.signInWithPassword({ email: input.email, password: input.password });
      if (error) return failure("Sign-in failed. Check your details or try again.");
      const access = await verifyAccess(client.auth, starterEligibility);
      if (access.status !== "allowed") {
        await client.auth.signOut({ scope: "local" });
        return failure(access.status === "denied" ? "This account is not eligible for this application. Contact the application owner." : "Account access could not be checked. Try again.", 403);
      }
      return reply({ status: "success", message: "Signed in.", redirect: returnTo });
    }
    const callback = new URL("/auth/callback", settings.origin);
    callback.searchParams.set("returnTo", returnTo);
    if (input.action === "signup") {
      if (!settings.allowSignup) return failure("Account creation is closed. Contact the application owner.", 403);
      const { error } = await client.auth.signUp({ email: input.email, password: input.password, options: { emailRedirectTo: callback.href } });
      if (error) return failure("The account request could not be completed. Try again.");
      // Some test providers create a session before email confirmation. Eligibility is separate.
      await client.auth.signOut({ scope: "local" });
      return reply({ status: "success", message: "If your address can be registered, check your email for the next step. Application access still requires approval." });
    }
    if (input.action === "request-reset") {
      callback.searchParams.set("flow", "recovery");
      const { error } = await client.auth.resetPasswordForEmail(input.email, { redirectTo: callback.href });
      if (error) return failure("Reset instructions could not be requested. Try again.");
      return reply({ status: "success", message: "If an account matches that email, reset instructions will be sent." });
    }
    const { data, error: sessionError } = await client.auth.getUser();
    if (sessionError || !data.user) return failure("Your recovery session has expired. Request a new reset link.", 401);
    const { error } = await client.auth.updateUser({ password: input.password });
    if (error) return failure("The password could not be changed. Try again or request a new link.");
    await client.auth.signOut({ scope: "local" });
    return reply({ status: "success", message: "Password updated. Sign in with your new password.", redirect: `/login?returnTo=${encodeURIComponent(returnTo)}` });
  } catch { return failure("The authentication service is unavailable. Try again.", 503); }
}
