"use client";

import { LoginPage, SignupPage, PasswordResetPage, NewPasswordPage, type AuthSubmissionContext } from "@evenkit/ui";
import { safeReturnPath } from "@evenkit/auth-next/paths";
import { authResponseSchema, type AuthRequest } from "./requests";

export interface StarterAuthFormProps {
  action: AuthRequest["action"];
  mode: "demo" | "supabase";
  returnTo: string;
  recoveryState?: "ready" | "expired";
}

export function StarterAuthForm({ action, mode, returnTo, recoveryState = "ready" }: StarterAuthFormProps) {
  const query = `?returnTo=${encodeURIComponent(returnTo)}`;
  async function submit(input: AuthRequest, { signal }: AuthSubmissionContext) {
    const response = await fetch("/auth/action", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, returnTo }), signal });
    const result = authResponseSchema.parse(await response.json());
    signal.throwIfAborted();
    if (result.status === "success" && result.redirect) window.location.assign(safeReturnPath(result.redirect));
    return result;
  }
  const common = {
    brand: <a href="/dashboard">Evenkit admin</a>,
    contextKey: `${mode}:${action}:${returnTo}`,
    additionalMethods: mode === "demo" ? <p>Demo only. No accounts are created or emails sent. Use fail@example.test to try failure and retry.</p> : undefined,
  };
  const policy = { passwordHint: "Use 12 to 128 characters.", validatePassword: (value: string) => value.length < 12 || value.length > 128 ? "Use 12 to 128 characters." : undefined };
  if (action === "login") return <LoginPage {...common} onSubmit={(values, context) => submit({ action, ...values }, context)} forgotPasswordLink={<a href={`/forgot-password${query}`}>Forgot password?</a>} footer={<a href={`/signup${query}`}>Create an account</a>} />;
  if (action === "signup") return <SignupPage {...common} {...policy} onSubmit={(values, context) => submit({ action, ...values }, context)} footer={<a href={`/login${query}`}>Back to sign in</a>} successFooter={<a href={`/login${query}`}>Continue to sign in</a>} />;
  if (action === "request-reset") return <PasswordResetPage {...common} onSubmit={(values, context) => submit({ action, ...values }, context)} footer={<a href={`/login${query}`}>Back to sign in</a>} successFooter={mode === "demo" ? <a href={`/reset-password${query}&demo=ready`}>Try the demo reset form</a> : <a href={`/forgot-password${query}`}>Request another link</a>} />;
  return <NewPasswordPage {...common} {...policy} recoveryState={recoveryState} onSubmit={(values, context) => submit({ action, ...values }, context)} requestResetLink={<a href={`/forgot-password${query}`}>Request a new reset link</a>} footer={<a href={`/login${query}`}>Back to sign in</a>} />;
}
