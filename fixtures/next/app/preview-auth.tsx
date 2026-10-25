"use client";

import { LoginPage, NewPasswordPage, PasswordResetPage, SignupPage } from "@project-kit/ui";

export function PreviewAuth() {
  return <div aria-label="Packed authentication">
    <LoginPage contentAs="section" headingAs="h2" title="Packed login"
      onSubmit={async () => ({ status: "success", message: "Package login callback completed." })} />
    <SignupPage contentAs="section" headingAs="h2" title="Packed signup"
      onSubmit={async () => ({ status: "success", message: "Package signup callback completed. No account was created." })} />
    <PasswordResetPage contentAs="section" headingAs="h2" title="Packed password reset"
      onSubmit={async () => ({ status: "success" })} />
    <NewPasswordPage contentAs="section" headingAs="h2" title="Packed new password"
      onSubmit={async () => ({ status: "success", message: "Package password callback completed." })} />
  </div>;
}
