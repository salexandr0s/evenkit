# Evenkit design and copy review

26 October 2026. This pass covers all seven workstreams in the requested screenshot, the 116-entry catalog and their assembled admin flows. The work preserves Evenkit’s neutral surfaces, theme accents, `--pk-` tokens, named Lucide icons and host-owned behavior. The installed `avoid-ai-writing` skill, its patterns/headline references, applicable workspace instructions and Apple Minimal contracts informed the review.

## Scope and priorities

The seven feature chats had completed separate design passes that were not yet in the integrated checkout. We reviewed their commits, code, handoffs and rendered evidence, incorporated those passes and the earlier broad design pass, then corrected problems visible in the combined result. The audit plan was recorded before the follow-up edits in `.artifacts/design-pass/seven-workstreams/plan.md` in the earlier design-pass worktree.

Priorities were readable mobile layouts; alignment across unequal content; consistent assembled headers and action areas; accessible utility controls; concise, accurate copy; and preservation of callbacks, focus recovery and public APIs. Concurrent integration continued in its own worktree. All seven feature tips, the admin integration branch and the original main history are ancestors of the completed design branch.

## Improvements by workstream

| Workstream | Integrated improvements and final refinements |
| --- | --- |
| Editable block registry | Searchable local viewer, source inspection and readable CLI output. The expanded 23-item mobile chooser now occupies 236px instead of 985px; selected items and keyboard focus stay visible. Mobile controls meet 44px targets, and appearance help supports focus, hover and Escape. Source validation, CSP and dry-run safeguards remain intact. |
| Document library | Clearer toolbar groups, passive thumbnails, consistent selection surfaces, bounded media previews and avatar settings. Mobile filenames remain readable inside a 480px local scroll surface; compact list actions have accessible names and tooltips. The app uses the updated upload composition. Undo is unavailable during list reloads so the target cannot move during activation. |
| Team administration | Clearer member, invitation, role and audit layouts. The assembled app uses a compact role header/selector and removes the duplicate audit heading/timezone wrapper. Permissions, invitation delivery, cancellation, stale-response guards and application callbacks remain unchanged. |
| Notifications and status | Refined inbox rows, selected states, preference categories, banners and presence indicators. The app’s copied inbox/preferences now match those designs and retain cancellation. Bulk buttons appear after selection; the idle mobile toolbar shrinks from 206px to 110px. Accessible read/unread names contain their complete visible labels. |
| Rich chat | Improved Markdown and code hierarchy, stable copy feedback, numbered citations/domain metadata, attachment surfaces and a unified composer. Icon-only citations stay in their row on narrow screens, reducing the example source section from 334px to 240px. Preview/close controls keep 44px touch targets; nested Escape and focus recovery work in normal/reduced motion. |
| Reporting | Stronger KPI hierarchy, compact report controls, improved chart proportions and stable inspectors. Shared statistic tracks align long labels, values and optional footers across rows. Corrected the dashboard gap override and kept wrapped field controls aligned. RTL number/date isolation and accessible chart tables remain intact. |
| Website blocks | Display typography, original botanical artwork, feature cards, composed forms, FAQ and article layouts. Feature descriptions/actions share baselines. Removing an obsolete 720px section cap restores desktop form columns while their fields stay bounded. Mobile stacking, reading-width media and articles without contents navigation remain correct. |

The broader copy pass removed internal implementation language and repeated explanations while preserving demo/service distinctions, uncertainty and functional strings. Familiar utility icons retain accessible names, keyboard hints and visible focus; primary and consequential actions keep labels.

## Compatibility and integration

The final branch includes the seven source branches, the assembled admin work and the earlier global pass. Local main’s older authentication implementation was reconciled with the current canonical modules rather than duplicated. The public `LockIcon` export/catalog entry and optional `PasswordField.showText`/`hideText` props are preserved. Explicit captions retain their accessible naming; the current default remains icon-only. Independent packed fixtures exercise all four auth pages and both caption states. The authentication guide now describes the current package name and abort/context boundary.

No public identifier, route, URL or application callback was removed or renamed by this pass. Primary-checkout metadata edits and unrelated worktrees were left intact. No push, publication or deployment occurred.

## Visual evidence

The [seven-family before/after gallery](../.artifacts/seven-workstreams/evidence.html) is retained in `/Users/nationalbank/.codex/worktrees/evenkit-design-refinements/design-tokens/.artifacts/`. Its images are local and ignored by Git. The original broad audit and 232 desktop/mobile captures remain in `/Users/nationalbank/.codex/worktrees/evenkit-design-pass/design-tokens/.artifacts/design-pass/`.

| Family | Before | After |
| --- | --- | --- |
| Registry chooser | [Before](../.artifacts/seven-workstreams/registry-before-360.png) | [After](../.artifacts/seven-workstreams/registry/grove-light-360.png) |
| Documents in the admin app | [Before](../.artifacts/seven-workstreams/admin/before-documents-360.png) | [After](../.artifacts/seven-workstreams/admin/after-documents-360.png) |
| Assembled audit screen | [Before](../.artifacts/seven-workstreams/admin/before-audit-1440.png) | [After](../.artifacts/seven-workstreams/admin/after-audit-1440.png) |
| Notification toolbar | [Before](../.artifacts/seven-workstreams/notifications-before-360.png) | [After](../.artifacts/seven-workstreams/notifications-after-360.png) |
| Mobile citations | [Before](../.artifacts/design-refinements/chat/sources-before-360.png) | [After](../.artifacts/design-refinements/chat/sources-after-360.png) |
| Dashboard spacing | [Before](../.artifacts/design-refinements/data/dashboard-before-cascade-1440.png) | [After](../.artifacts/design-refinements/data/dashboard-after-1440.png) |
| Website form columns | [Before](../.artifacts/design-refinements/website/before-forms-reproduced-viewport.png) | [After](../.artifacts/design-refinements/website/after-forms-viewport.png) |

Registry, document, team and notification before captures show original rendered versions. Chat, dashboard and website follow-up comparisons reconstruct the exact previous CSS on the final markup; they are labelled accordingly. Notification component captures hide only sticky catalog chrome to prevent screenshot occlusion. Ordinary viewport captures were used for website comparisons because full-page capture briefly changed the sidebar layout. The final assembled audit capture waits for loaded activity. Development-only indicators in older app captures are not product changes.

## Verification

Logs are under `.artifacts/seven-workstreams/`; focused geometry/state reports are under `.artifacts/design-refinements/`. Initial failures and subsequent checks are retained, not hidden.

| Check | Result |
| --- | --- |
| Configured production build | Tokens, UI, auth-next, catalog and Next admin passed on the final compatible implementation. |
| Configured TypeScript and ESLint | Passed: `typecheck-complete.log`, `lint-complete.log`. The later verifier/fixture change also passed focused lint and packed strict types. |
| Unit suite | 47 tests across 10 files passed. |
| Full catalog journeys | 296 Chromium journeys passed after the main design reconciliation. Subsequent localized auth/forms changes passed 12 affected journeys; four final icon journeys passed. |
| Assembled app | 63 journeys passed across Chromium, Firefox and WebKit. Follow-up copied-block checks passed 35/39 initially; all four failures passed unchanged in isolated runs. After Undo hardening, the upload/removal/restore journey passed in all three browsers with one worker and unchanged timeouts. |
| Registry | 34 tests passed again on the completed implementation; all seven viewer verification groups passed at four widths. The temporary dirty-source rejection was resolved by committing registered blocks; no guard was weakened. |
| Copied examples | 116 examples and all 104 priority mappings passed, including the final repeat in `examples-final.log`. |
| Packed consumers and installed registry blocks | Independent Vite and Next production builds, strict types, HTTP/styles, browser interactions and package boundaries passed with all 23 installed blocks. Report: `.artifacts/registry-package-verification.json`; log: `packages-hydration-final.log`. Temporary consumers and servers were removed. |
| Visual and interactive checks | 128 data stress cases plus 18 RTL/short-viewport cases, 80 website cases, 32 registry cases, 32 notification cases, 32 citation cases plus four nested dismissal paths, 64 long-caption cases and 14 assembled captures passed. Theme-sensitive coverage includes all eight themes in light/dark. |
| Independent review | Resolved merge/type errors, layout reconciliation findings and the password-caption API gap. No known source regression remains. |

The initial combined build exposed a source-metadata type mismatch and duplicate icon import; both were fixed. A resource-heavy follow-up run timed out in three Firefox journeys; they passed with the same assertions/timeouts in isolation. A WebKit trace showed the document list moving during an Undo click, so Undo now waits for the reload. One earlier packed Next run failed to open its dialog during parallel verification; the same checks passed in an isolated run. The concurrent integration branch then added a hydration-ready signal to the Next fixture and failure diagnostics; the combined verifier passed again. The earlier failure did not retain enough evidence to establish its precise cause.

No existing check or assertion was weakened. Behavior tests cover focus recovery, page-scoped selection, cancellation, stale completions, copied blocks, safe source rendering and package boundaries. Cosmetic changes use visual/geometry inspection rather than snapshot tests.

## Limits and local result

Catalog and standalone viewer checks use Chromium; assembled admin journeys also cover Firefox and WebKit. Physical touch/IME devices and screen-reader speech were not exercised. Real authentication, mail, storage and provider services were not used; fictional examples remain explicit. Browsers without subgrid retain natural-flow fallback alignment.

All seven feature branches, the admin integration branch, the earlier design pass and original main history are included. Final implementation commits include `2932a76` (team headers), `bdd116f` (notifications), `458d630` (responsive reconciliation), `6d8ab01` (registry viewer), `53e70d3`/`b3b2624` (auth compatibility), `6614a6c` (document recovery) and `0f9251c` (icon discovery). Concurrent verifier hardening is retained through `0706996`. The completed branch is merged into local `main` with a fast-forward; no existing history is rewritten.

The primary checkout’s concurrent metadata edits remain outside this worktree. No required design work is deferred. The earlier pass remains documented in the separate design-pass worktree and its committed history.
