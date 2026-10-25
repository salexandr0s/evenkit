# Reusable authentication pages

Approved on 25 October 2026. This phase adds login, signup, password reset request, and new-password pages to the existing shared kit. A goal tracks implementation, catalog examples, integration guidance, and verification.

The package supplies layout, form behavior, validation feedback, and asynchronous submission states. Applications supply typed callbacks, authentication services, recovery sessions/tokens, routing, and password policy. No SDK, credentials, live account creation, email delivery, or session storage is configured by this phase.

| Area | Owner | Completion check |
|---|---|---|
| New auth subsystem in `packages/ui/src` | Controls coder | Four pages, shared layout/password field, typed results, validation, focused feedback, pending guard and recovery |
| New auth catalog files | Catalog coder | Working local examples, failure/pending/success and expired-link states, truthful usage examples |
| Shared exports, CSS build, catalog registration, docs, package fixtures | Root | Public package consumption, preserved existing edits, documented provider boundary |
| Independent review | Reviewer | Resolve concrete form, async, accessibility, and integration defects |
| Verification | Root | Focused Chromium journeys, build/type/lint checks, independent packed consumers |

Use shared tokens, controls, and icons. Passwords remain unmodified, paste stays enabled, and password-manager autocomplete attributes identify each field. Signup/new-password pages accept a consumer password validator and hint. Reset confirmation uses neutral account wording. Signup success uses a consumer-supplied message so a submitted request does not imply a verified or signed-in account.

The primary checkout contains concurrent component improvements, including unfinished Dialog work. This phase runs in the attached `/Users/nationalbank/.codex/worktrees/auth-pages/design-tokens` worktree on `codex/auth-pages`, starting at `1dfd7f9`. Keep that work isolated and preserve the primary checkout. Record the earlier component-improvement queue in the handoff. No deployment or package publication is requested.

Completed as a local pilot: four pages and two shared compositions, fifteen catalog entries, integration guidance, and packed consumer fixtures. Build, strict types, lint, seven token tests, five auth browser journeys, and seventeen existing component journeys passed. Independent packed Vite/Next builds, server rendering, stylesheet delivery, and resource cleanup passed. Authentication-service integration remains application-owned.
