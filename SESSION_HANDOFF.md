# Session handoff: 25 October 2026

Project: shared project kit. Worktree: `/Users/nationalbank/.codex/worktrees/auth-pages/design-tokens`. Current branch: `main`. The preserved `codex/auth-pages` branch ends at `e81afc0`, based on `1dfd7f9` from `codex/component-improvements`.

Latest work: the user authorized merging the completed auth branch into `main`. Local `main` fast-forwarded from `d1a9799` to `e81afc0` without conflicts. There is no configured Git remote, so no push was possible.

## Completed

- Added `LoginPage`, `SignupPage`, `PasswordResetPage`, and `NewPasswordPage` using shared controls, tokens, and icons.
- Exported shared `AuthLayout`, `PasswordField`, page props, credential payload types, and typed result contracts.
- Added local validation, native FormData capture, password-manager attributes, password visibility, focused error/success feedback, a synchronous pending guard, and ignored stale/unmounted completions.
- Signup requires an explicit success message. Signup/new-password forms accept the application's password validator and hint. Confirmation stays local, and password whitespace is preserved.
- Reset requests show neutral confirmation. Expired/invalid new-password states omit the form and provide a consumer recovery action. Recovery authorization remains with the service.
- Added four lazy catalog entries and local Success/Failure/Pending/Rejected request examples. Pending previews use an explicit completion control; restart/unmount settles owned promises without retaining credential values.
- Added integration guidance and independent packed-package auth fixtures for Vite and Next.
- Fixed keyboard focus loss when a live recovery-state change removes a focused form. Focus moves to the recovery notice only when it was lost from that form; initial and external-control focus remain intact.
- Added visible `showText`/`hideText` password-toggle captions. Accessible names retain their visible captions; the docs state the English page-copy boundary.
- Tightened auth spacing, icon size, and mobile card padding. Catalog controls now follow the page, with a compact preview caption and fewer nested frames. Embedded mobile form width increased from 218px to 252px.
- Added a public `LockIcon` and made it the default leading adornment in `PasswordField`, including confirmation fields. Custom adornments and explicit `null` remain supported. The icon catalog includes password/credentials aliases; the kit now has 32 icons.

## Key files

- `packages/ui/src/auth-types.ts`, `auth-layout.tsx`, `password-field.tsx`, `use-auth-submission.ts`, four `*-page.tsx` modules, and `auth.css`.
- `packages/ui/src/index.ts` and `packages/ui/scripts/copy-styles.mjs`: public exports and combined CSS.
- `apps/catalog/src/auth-preview.tsx`, `auth-preview.css`, `auth-data.ts`, plus catalog registration.
- `tests/browser/auth.spec.ts`: seven auth journeys, including service-driven expiry without remounting and custom toggle captions.
- `fixtures/vite/auth-preview.tsx`, `fixtures/next/app/preview-auth.tsx`, fixture entry points, and `scripts/verify-packages.mjs`.
- `AUTH_PAGES_PLAN.md`, `docs/authentication.md`, `docs/compatibility.md`, README, and UI provenance.

## Verification

Merge verification: `codex/auth-pages` is an ancestor of `main`, and the fast-forward retained the previously verified source tree exactly. Existing applicable checks were reused; no code changed during the merge. The primary checkout remains on `codex/component-improvements` with its existing edits to `feedback.tsx` and `styles.css`.

Password-icon correction: production build, workspace/test type checks, ESLint, all seven existing auth Chromium journeys, and the icon-reference Chromium journey passed. The icon-reference check initially used a catalog build created before the inventory edit; rebuilding the catalog resolved the mismatch without changing the test. Independent review found no actionable concerns. The refreshed retained preview visibly shows the lock icon beside the password input; `.artifacts/auth-audit/password-lock-icon.png` records it. No new dependency or test was added for this visual change.

Passed on the final audit revision: production build, workspace/test type checks, ESLint, seven token tests, seven auth Chromium journeys, and seventeen existing Chromium journeys. The auth and regression groups ran separately against the same final app build.

The first auth batch stopped after locator failures. Required labels include an aria-hidden cue in DOM text, so exact getByLabel did not match despite correct accessible names. Independent review confirmed the harness issue. Email tests now use role/accessibility names; password inputs use their native names plus explicit accessible-name assertions. The corrected five journeys passed. No component labels or validation were weakened to accommodate the tests.

Code review also corrected auth-slot anchor rules to exclude `.pk-button`, preserving ButtonLink contrast. The follow-up audit used independent lifecycle and composition harnesses. They verified stale completion, fresh retry, whitespace preservation, confirmation omission, malformed signup-success recovery, and the focus fix. Source/design reviews found no remaining actionable findings.

Visual audit: 17 native DPR1 captures and 14 geometry checks cover all four pages, light/dark, 360px mobile and desktop, doubled typography, long slots/captions, and RTL. No document overflow, clipped text, out-of-root elements, or browser errors were reported. The main browser's viewport override was reset. Transient audit servers on 5312/5313 and their browsers were closed.

`npm run verify:packages` passed independent Vite and Next builds, all four auth-page exports, Next server rendering, and token/control/icon/shell/table/auth stylesheet HTTP checks. `.artifacts/package-verification.json` confirms both owned fixture servers stopped and its temporary directory was removed.

Commands used:

```sh
npm run build
npm run typecheck
npm run lint
npm test
KIT_CATALOG_PORT=5301 npm run test:browser -- tests/browser/auth.spec.ts
KIT_CATALOG_PORT=5301 npm run test:browser -- tests/browser/catalog.spec.ts tests/browser/admin-kit.spec.ts tests/browser/button.spec.ts tests/browser/field.spec.ts tests/browser/icon-reference.spec.ts tests/browser/token-reference.spec.ts tests/browser/select.spec.ts
npm run verify:packages
```

## Preview and artifacts

This worktree's retained production preview is `http://127.0.0.1:5174/#login`. Other new hashes are `/#signup`, `/#password-reset`, and `/#new-password`. The retained listener is owned Node PID `23460`, execution session `45664`; verify ownership before stopping it. Rebuild the catalog to refresh a production preview. Current screenshots and geometry report are in `.artifacts/auth-audit/`, especially `standalone-login-360-light.png`, `standalone-login-1280-dark.png`, and `report.json`. Earlier `.artifacts/auth-login.png` shows the pre-audit design.

Local token/UI package tarballs can be regenerated with `npm pack --workspace @project-kit/tokens --workspace @project-kit/ui --pack-destination .artifacts`. Generated files are ignored.

## Isolation and remaining work

The primary `/Users/nationalbank/GitHub/design-tokens` checkout has concurrent component work, so the merge was performed from this attached worktree. The primary checkout was not switched, reset, or staged. This worktree now holds `main`; the auth branch remains available at `e81afc0`.

The earlier component-refinement queue is separate. At this branch's base, Tokens, Icons, Buttons, Fields, and Select were completed; Dialog and later areas remained in `COMPONENT_IMPROVEMENTS.md`. Check the primary checkout's current status before integrating, because that work may have advanced independently. This auth phase does not complete or overwrite that queue.

Packages remain unpublished local pilots. No real authentication provider, live login/account creation, email delivery, recovery-token validation, session management, or application migration was configured. Consumers supply those through callbacks. Firefox/Safari and third-party password-manager extensions were not exercised. Use the integration guide before adopting the pages in a live project.

## Resume

```sh
cd /Users/nationalbank/.codex/worktrees/auth-pages/design-tokens
git status --short
git log --oneline -3
npm run build
npm run preview --workspace @project-kit/catalog -- --port 5174 --strictPort
```

The auth work is merged into local `main`. Later component-refinement commits and uncommitted primary-checkout edits remain separate; inspect that branch before any further integration.
