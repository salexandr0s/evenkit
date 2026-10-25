import type { CatalogEntry } from "./catalog-data";

export type AuthPreviewKind = "login" | "signup" | "password-reset" | "new-password";

export const authEntries: readonly CatalogEntry[] = [
  {
    id: "login",
    name: "Login",
    group: "Compositions",
    description: "An email and password form with validation, pending feedback, and a typed application callback.",
    tags: ["auth", "authentication", "login", "sign in", "email", "password", "pending", "error"],
    source: "Original kit composition · shared controls and tokens",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete",
    usage: 'import { LoginPage, type AuthResult } from "@project-kit/ui";\n\n<LoginPage\n  brand={<strong>Your project</strong>}\n  onSubmit={async ({ email, password }): Promise<AuthResult<"email" | "password">> => {\n    // Your application authenticates and maps the provider result.\n    return authenticate({ email, password });\n  }}\n  forgotPasswordLink={<a href="/reset-password">Forgot password?</a>}\n/>\n\n// Use contentAs="section" and headingAs="h2" inside an existing main.'
  },
  {
    id: "signup",
    name: "Signup",
    group: "Compositions",
    description: "Account request fields with password confirmation, a consumer password policy, and an explicit success message.",
    tags: ["auth", "authentication", "signup", "sign up", "register", "account", "password", "confirm", "verification"],
    source: "Original kit composition · shared controls and tokens",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete",
    usage: 'import { SignupPage } from "@project-kit/ui";\n\n<SignupPage\n  brand={<strong>Your project</strong>}\n  passwordHint="Use the password policy for this application."\n  validatePassword={validateApplicationPassword}\n  onSubmit={async (values) => {\n    const result = await requestAccount(values);\n    // Map failures to structured field errors. On success, describe\n    // the actual next step, such as provider email verification.\n    return result;\n  }}\n/>\n\n// Signup success requires a message; it does not imply a signed-in session.'
  },
  {
    id: "password-reset",
    name: "Password reset",
    group: "Compositions",
    description: "An email-only reset request form with neutral confirmation wording and recoverable submission feedback.",
    tags: ["auth", "authentication", "password", "reset", "forgot", "recovery", "email", "confirmation"],
    source: "Original kit composition · password-manager semantics",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete",
    usage: 'import { PasswordResetPage } from "@project-kit/ui";\n\n<PasswordResetPage\n  onSubmit={async ({ email }) => requestPasswordReset(email)}\n  footer={<a href="/login">Back to login</a>}\n/>\n\n// Your application supplies the reset request and delivery service.\n// The page uses a neutral confirmation, regardless of account existence.'
  },
  {
    id: "new-password",
    name: "New password",
    group: "Compositions",
    description: "A new-password form with confirmation and ready, expired, or invalid recovery states supplied by the application.",
    tags: ["auth", "authentication", "password", "new", "reset", "recovery", "expired", "invalid", "confirm"],
    source: "Original kit composition · password-manager semantics",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete",
    usage: 'import { NewPasswordPage } from "@project-kit/ui";\n\n<NewPasswordPage\n  recoveryState={recoveryState}\n  passwordHint="Use the password policy for this application."\n  validatePassword={validateApplicationPassword}\n  onSubmit={async ({ password }) => updateRecoveredPassword(password)}\n  requestResetLink={<a href="/reset-password">Request another reset</a>}\n/>\n\n// Your application validates the recovery token/session before rendering.\n// Passing ready is presentation state, not authorization.'
  }
];
