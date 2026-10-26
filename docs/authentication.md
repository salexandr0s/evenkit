# Authentication pages

The kit exports `LoginPage`, `SignupPage`, `PasswordResetPage`, and `NewPasswordPage`. They share `AuthLayout`, `PasswordField`, tokens, icons, and controls. Import token CSS before UI CSS as usual. Use a client component for the pages and their callbacks in Next.js.

Each page validates its form, focuses invalid fields, prevents duplicate pending submissions, and presents the result returned by its callback. The application supplies authentication, recovery sessions, routing, and password policy. These pages do not create a service connection or store a session.

## Connect a login callback

```tsx
"use client";

import { ButtonLink, LoginPage, type LoginPageProps } from "@evenkit/ui";

export function LoginScreen({ signIn }: { signIn: LoginPageProps["onSubmit"] }) {
  return <LoginPage
    brand={<strong>Your workspace</strong>}
    onSubmit={signIn}
    forgotPasswordLink={<ButtonLink variant="link" href="/forgot-password">Forgot password?</ButtonLink>}
    footer={<ButtonLink variant="link" href="/signup">Create an account</ButtonLink>}
  />;
}
```

The callback receives `{ email, password }` and a second `{ signal }` argument. Pass that abort signal to the service request. Change the page’s `contextKey` when its account, provider or continuation changes; stale results are then discarded. Return `{ status: "success", message?: string }` after the intended operation completes, or `{ status: "error", error: { message, fieldErrors? } }`. Field errors are keyed by the relevant field name. Return user-facing messages from the adapter; do not pass raw SDK errors or transport responses into the page. Rejected promises get a generic retry message and release the pending state.

The UI reads native form values at submission, including browser-filled credentials. It trims email whitespace and preserves the password exactly. It permits paste and uses `username`, `current-password`, and `new-password` autocomplete tokens where appropriate. [MDN autocomplete reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete).

## Signup and password policy

Signup receives `{ email, password }`; password confirmation stays local. Its success result requires a message. State the actual outcome, such as an email-verification step or completed registration. A successful callback does not make the UI establish a session or mark an account verified.

`SignupPage` and `NewPasswordPage` accept `passwordHint` and `validatePassword(password)`, which returns an error string or `undefined`. Match that validator to the service's policy. Without an override, the pages require a password and matching confirmation, without imposing a minimum length or composition rule. Password policy is also enforced by the service.

`PasswordField` exposes an icon show/hide action with a keyboard tooltip and forwards input props and refs. Use `startAdornment={<LockIcon />}` when a lock icon is useful; the named `LockIcon` is exported by the UI package. Passwords start concealed. The pages clear their password inputs after success and keep credentials out of persistence and logs.

Use `showLabel` and `hideLabel` for the toggle’s accessible name and tooltip. For example, a standalone German control can use `showLabel="Passwort anzeigen"` and `hideLabel="Passwort verbergen"`. The page fields, submit actions, form names, and built-in validation messages remain in English; changing a page title does not translate the entire form.

## Password recovery

`PasswordResetPage` receives `{ email }`. A successful request always shows the same neutral confirmation for matching and nonmatching accounts. The adapter should map those cases to the same successful result. Consistent service timing, rate limits, reset email delivery, and secure single-use tokens remain responsibilities of the authentication service. [OWASP password recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

`NewPasswordPage` receives `{ password }`. Close over the validated recovery token or session in the application callback. Set `recoveryState` to `"expired"` or `"invalid"` when the service rejects the link, and provide `requestResetLink` to request another. Those states display recovery feedback and omit the password form. `"ready"` is the default UI state; it is not proof that a token is valid. The service must verify the recovery authorization when updating the password.

When a live recovery-state change removes a focused form, focus moves to the recovery notice. Initial rendering does not autofocus, and a focused control elsewhere in the application keeps its focus. Change `recoveryState` directly; the page does not need a React key to reset its recovery state.

## Layout and navigation

Pages accept branding, heading, description, footer, success-footer, and additional-method slots. Supply real links or router components; the kit does not infer route names. Additional authentication methods are application-owned actions. Use `contentAs="section"` and `headingAs="h2"` when placing a page inside an existing main landmark, as the catalog does. A standalone page uses a main landmark and h1 by default.

The catalog places the actual page before its demo controls and provides local Success, Failure, Pending, and Rejected request examples. Pending requests finish through an explicit preview control. The new-password example also simulates an expired link during submission. These examples do not contact an authentication service, send email, or create accounts.
