import type { CatalogEntry } from "./catalog-types.js";

export type AuthPreviewKind = "login" | "signup" | "password-reset" | "new-password";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
const source = "Evenkit auth compositions, adapted to the current password control";
const sourceUrl = "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete";

export const authEntries: readonly CatalogEntry[] = [
  {
    id: "login", name: "Login", group: "Compositions", inventoryIds: ["L01", "L08"],
    description: "Email and password fields with validation, pending feedback and application-owned authentication.",
    tags: ["auth", "login", "sign in", "password", "recovery"], source, sourceUrl,
    usage: imports + `import { LoginPage, type LoginPageProps } from "@evenkit/ui";

export function LoginExample({ authenticate }: { authenticate: LoginPageProps["onSubmit"] }) {
  return <LoginPage brand={<strong>Example workspace</strong>} onSubmit={authenticate}
    forgotPasswordLink={<a href="/forgot-password">Forgot password?</a>} />;
}
// Authenticate on your server. The UI does not establish a session.
`,
  },
  {
    id: "signup", name: "Signup", group: "Compositions", inventoryIds: ["L09"],
    description: "Account request fields with confirmation and an application-owned eligibility and password policy.",
    tags: ["auth", "signup", "account", "verification"], source, sourceUrl,
    usage: imports + `import { SignupPage, type SignupPageProps } from "@evenkit/ui";

export function SignupExample({ requestAccount }: { requestAccount: SignupPageProps["onSubmit"] }) {
  return <SignupPage onSubmit={requestAccount} passwordHint="Use at least 12 characters."
    validatePassword={password => Array.from(password).length < 12 ? "Use at least 12 characters." : undefined} />;
}
// Enforce policy on the server too; a request does not imply eligibility or a session.
`,
  },
  {
    id: "password-reset", name: "Password reset", group: "Compositions",
    description: "A recovery request with neutral confirmation and recoverable submission errors.",
    tags: ["auth", "reset", "forgot", "email"], source, sourceUrl,
    usage: imports + `import { PasswordResetPage, type PasswordResetPageProps } from "@evenkit/ui";

export function ResetExample({ requestReset }: { requestReset: PasswordResetPageProps["onSubmit"] }) {
  return <PasswordResetPage onSubmit={requestReset} footer={<a href="/login">Back to login</a>} />;
}
// Return the same confirmation whether or not the account exists.
`,
  },
  {
    id: "new-password", name: "New password", group: "Compositions",
    description: "Password confirmation with ready, expired and invalid recovery states supplied by the application.",
    tags: ["auth", "password", "recovery", "expired", "invalid"], source, sourceUrl,
    usage: imports + `import { NewPasswordPage, type NewPasswordPageProps } from "@evenkit/ui";

export function NewPasswordExample({ updatePassword, recoveryState }: {
  updatePassword: NewPasswordPageProps["onSubmit"];
  recoveryState: "ready" | "expired" | "invalid";
}) {
  return <NewPasswordPage onSubmit={updatePassword} recoveryState={recoveryState}
    requestResetLink={<a href="/forgot-password">Request another reset</a>} />;
}
// Validate the recovery session on the server before accepting a password update.
`,
  },
];
