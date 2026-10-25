# Auth pages and R01 adapter handoff

Date: 25 October 2026. Integration branch: `codex/admin-starter`. Worktree: `/Users/nationalbank/.codex/worktrees/admin-starter/design-tokens`.

## Delivered

Generic auth UI is committed as `e1276b2` (`feat(auth): adapt account pages to current controls and cancellation`). It adapts the finished `codex/auth-pages` presentation from `6fc9302`, `0a93d90` and `e81afc0` into AuthLayout, LoginPage, SignupPage, PasswordResetPage and NewPasswordPage. Current `PasswordField`, icons, field composition, theme changes and `@evenkit/*` names are preserved. Requests receive AbortSignal and can be canceled; `contextKey` changes discard stale completion. The integration owner wires shared exports, CSS, catalog and copied examples.

Adapter package, guide and provider verification script are committed as `fe2baf8` (`feat(auth): add explicit Supabase adapter boundaries and verified policy`). The opt-in `@evenkit/auth-next` package has explicit server/client/paths/policy subpaths. Server entry uses `server-only`; generic UI stays independent of Next and Supabase. Validated configuration rejects secret keys, continuation paths reject normalization-based open redirects, and verified identity is checked against application-owned eligibility. The starter's default provider policy requires confirmed email plus an explicit UUID allowlist. Signup is closed unless explicitly enabled. No production auth, data or membership schema was changed.

App routes cover login, signup, recovery request, password change, PKCE callback, access denial, local sign-out and session-expiry recovery. A trusted origin governs all modes, including the demo (default `http://127.0.0.1:5396`; tests override it). Mutation routes reject foreign origins, bound request size and validate payloads with Zod. The proxy synchronizes refreshed cookies into the request and response. A provider-only lazy client monitor checks SIGNED_OUT, window focus and a 60-second interval, then clears the mounted application by full navigation. The adapter does not infer authorization from user metadata. A verified nonmember may recover their own password but cannot enter protected admin pages.

Setup/customization: `docs/auth-adapter.md`; package boundaries/licenses: `packages/auth-next/README.md` and `PROVENANCE.md`.

## Verification evidence

All listed checks passed for this auth implementation before its handoff:

- `npm run typecheck --workspace @evenkit/ui` and focused ESLint on auth UI. CSS generated an expected ESLint ignored-file warning; no lint error.
- `npm run build --workspace @evenkit/auth-next`, app strict TypeScript, focused ESLint for the adapter, auth routes and auth client/server helpers.
- At final auth handoff, a focused check extending the existing app tsconfig passed for all auth routes/helpers. The concurrent document-library app integration temporarily left missing shared exports in the full app check; the integration lead owns that final wiring and full rerun.
- `npx vitest run packages/auth-next/src/auth-boundaries.test.ts`: 3 test groups covering ambiguous/normalized redirects, configuration keys/origins, verified identity, default denial and unavailable policy.
- Integration owner verified the 90 copied catalog examples, 75 mappings and 7 auth Chromium journeys after shared auth wiring. The assembled production Next build passed before live-provider verification.
- `EVENKIT_LOCAL_STATUS=<disposable status JSON> node packages/auth-next/scripts/verify-local-provider.mjs`: **9 groups passed against real local GoTrue and the built Next app**, including Chromium login/session expiry. Evidence: `.artifacts/admin-auth/local-provider.json`, `local-provider-server.log`, `local-environment.json`.

The real-provider groups verified anonymous route recovery; foreign-Origin and closed-signup rejection; confirmed nonmember denial and cookie cleanup; eligible password login/cookie persistence/SSR; local sign-out and expired-session password rejection; safe invalid callbacks; actual reset email, PKCE exchange, password update and login with the new password; Chromium focus-triggered expiry clearing the admin; and a real PKCE callback denying a verified nonmember.

The isolated environment used Supabase CLI 2.111.0, Docker 29.5.2/Colima, GoTrue v2.194.0, PostgreSQL 17.6.1.156 and Mailpit v1.30.2. Project `evenkit-admin-auth-disposable` used API port 56321 and an owned Next process on 5348. The initial `/tmp` bind failed because Colima treated the secret key path as a directory; a fresh disposable directory under the shared home mount resolved it. This was an environment repair, not an application change.

Fixture users, browser, Next process, all project containers/volumes/network, temporary project directories and generated credential files were removed. Filtered Docker container, volume and network listings confirmed none remained. Production providers and existing projects were never contacted or modified.

## Limits

Hosted-provider configuration, external email delivery, OAuth/magic links/MFA, rate limits, bot protection, production entitlements, expiry-triggered token refresh timing and an injected sign-out outage were not verified. Successful cookie issuance, server reads and local sign-out were exercised with the real provider; the proxy refresh code was type-checked and reviewed. Firefox, Safari and physical devices remain part of the integration owner's broader browser-gap report.

Cancellation prevents a stale UI result or redirect; it cannot reverse a provider mutation already completed. Provider outages leave the current view mounted until a protected request gives the retry page; an absent session is detected on focus, SIGNED_OUT or the periodic check. All admin business data remains fictional and in memory. Independent packed consumers and final integration checks are owned by the integration lead.
