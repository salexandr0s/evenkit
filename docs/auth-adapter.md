# Authentication in the admin starter

The starter runs in fictional demo mode without credentials. Its default trusted origin is `http://127.0.0.1:5396`; set `EVENKIT_APP_ORIGIN` when using another port or hostname, including for demo mode. `/login`, `/signup`, `/forgot-password` and `/reset-password` exercise the account pages; they create no accounts and send no mail. `fail@example.test` produces a retryable demo failure. A pending request can be canceled, and changing the route or continuation discards stale results. Cancellation stops waiting and prevents a late redirect; it cannot undo a provider operation that already completed.

## Enable a disposable provider

Build the packages before the app. Set these variables for the **admin starter process**, using a disposable Supabase project or local CLI stack:

```sh
EVENKIT_AUTH_MODE=supabase
SUPABASE_URL=http://127.0.0.1:56321
SUPABASE_PUBLISHABLE_KEY=<local publishable or anon key>
EVENKIT_APP_ORIGIN=http://127.0.0.1:5396
EVENKIT_ALLOWED_USER_IDS=<confirmed test user UUID>
EVENKIT_ALLOW_SIGNUP=false
```

Keep credentials outside version control. The publishable key is public connection information; do not substitute a secret or service-role key. Invalid configuration fails closed. `EVENKIT_ALLOWED_USER_IDS` defaults to an empty list, so every provider user is denied until an application policy is configured. A typo in `EVENKIT_AUTH_MODE` fails validation rather than enabling the demo.

Configure the provider's allowed redirect URL as `http://127.0.0.1:5396/auth/callback` for that disposable environment. The configured application origin, not an incoming Host or Forwarded header, determines callback and sign-out destinations. HTTPS is required except for loopback testing. Email confirmation is required by the starter's eligibility callback. `EVENKIT_ALLOW_SIGNUP=true` permits account requests; it does not grant application access.

For local verification, initialize Supabase in a new directory under your home folder. Colima's default shared mounts can treat a `/tmp` secret-file bind as a directory; a shared home directory avoids that issue. Assign unused ports, a distinct project ID and a loopback application origin. Do not start, migrate or link an existing application. The recorded verification uses project `evenkit-admin-auth-disposable`, API port 56321 and app port 5348.

## Boundaries and policy

The adapter has explicit `@evenkit/auth-next/server`, `/client`, `/paths` and `/policy` entry points. Its server module imports `server-only`. Generic UI packages and copied auth presentation remain usable in Vite and have no Next or Supabase dependency.

`lib/auth/server.ts` verifies the user with `auth.getUser()` before calling `starterEligibility`. The starter requires a confirmed email and an explicit UUID allowlist; it does not trust user-editable metadata or infer permission from an email domain. Replace that callback with your own server-side entitlement decision. Check authorization again at each application data or mutation boundary; this fictional starter does not supply production data access or row-level policies.

The Next proxy refreshes cookies into both the forwarded request and browser response. A server component cannot silently discard cookie writes: its client throws if refresh was missed. Auth responses use `Cache-Control: no-store`. Login, signup, reset and sign-out mutations require the configured same-origin header. Requests are validated with Zod, and provider errors become application-safe messages.

## Routes and recovery

| Route | Behavior |
| --- | --- |
| `/login` | Password login, then verified eligibility and a validated continuation |
| `/signup` | Explicit open/closed application signup policy; account creation does not confer access |
| `/forgot-password` | Enumeration-safe reset confirmation and another-link recovery |
| `/auth/callback` | PKCE code exchange using the initiating browser's cookie, then verified identity and policy |
| `/reset-password` | Verified user session required; password change signs out locally and returns to login |
| `/session-expired` | Preserves a safe destination and offers sign-in, retry or new reset instructions |
| `/access-denied` | Explains the application policy boundary and offers another account or sign-out |
| `POST /auth/sign-out` | Ends only the current session; failures retain a visible retry path |

Recovery callbacks allow a verified nonmember to change their own password. Protected application routes still require eligibility. This prevents the application's membership policy from trapping someone who needs account recovery.

`returnTo` accepts local application destinations only. The adapter rejects external URLs, backslashes, control characters, ambiguous encoding and paths that normalize to a network URL. The starter further restricts destinations to its six admin routes. Invalid or consumed callback links return to recovery; their raw provider errors are not rendered.

Provider-mode admin pages watch `SIGNED_OUT`, revalidate on window focus, and check once per minute. When the session is absent, a full navigation clears the mounted application and preserves the current path/query/fragment. A provider outage does not immediately erase the current view; the next protected request supplies a retry page. Application records are fictional and held in memory. Session cleanup on navigation and sign-out removes those in-memory drafts; saving sensitive drafts across authentication requires an application-specific design.

## Customization and limits

The four account pages retain the original auth branch's focus recovery, password validation hooks and generic callback results. They use the newer `PasswordField` and `@evenkit/*` names. `contextKey` identifies the provider/account/continuation context, and callbacks receive an `AbortSignal`. No duplicate PasswordField, old lock icon or old theme CSS is restored.

This R01 adapter covers passwords, signup entry, password recovery, callback exchange, local sign-out and session recovery. It does not implement OAuth, magic-link entry, MFA, invitations, rate limits, bot protection or production entitlement storage. Those remain application/provider configuration work. Provider verification uses only the disposable environment; no production configuration, data, membership schema or migration is changed.

Unit checks cover return-path normalization, public configuration and fail-closed eligibility. `packages/auth-next/scripts/verify-local-provider.mjs` exercises the real local Supabase provider and built Next app. It requires `EVENKIT_LOCAL_STATUS` pointing to JSON from `supabase status -o json` for the disposable provider on port 56321, creates and deletes only fixture users, and starts/stops its own Next process on 5348. It never discovers credentials or permits a hosted provider. The integration handoff records the exact completed checks and gaps.

References: [Supabase server-side clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [password recovery](https://supabase.com/docs/guides/auth/passwords), and [PKCE/session behavior](https://supabase.com/docs/guides/auth/server-side/advanced-guide).
