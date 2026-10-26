# Session handoff: 25 October 2026

Project: `/Users/nationalbank/GitHub/design-tokens`. Active worktree: `/Users/nationalbank/.codex/worktrees/website-blocks/design-tokens`. Branch: `codex/website-blocks`.

## Website blocks: 25 October 2026

Status: DONE. Feature commit: `173dd10` (`feat(website): add editable website blocks and examples`). Started from `b588b1b1964ba2b26ee8453606f354f2c33eb10d`, the latest local `codex/component-improvements` after fetching origin. That local base was seven commits ahead of the remote. The isolated worktree preserves the original checkout and other agents' work. Nothing was pushed, published or deployed.

Implemented P01–P06 and P10 under `registry/blocks/website/`: Navbar header/footer; text/media heroes; feature lists, grids and alternating sections; CTA; Accordion FAQ; recoverable contact/newsletter forms; article layout with metadata, contents, media and code. `examples.tsx` supplies complete editable website and article examples plus individual compositions. Content and illustration are fictional, with origins recorded in `PROVENANCE.md`. All block styles are scoped; no public package exports or existing homepage/components were changed.

Catalog integration is in `apps/catalog/src/website-entries.ts`, `website-preview.tsx`, `website-preview.css`, plus additive entry, icon and lazy-preview wiring in `catalog-data.ts` and `catalog.tsx`. The catalog has 93 entries and 79 inventory mappings. Adoption and host responsibilities are in `docs/website-blocks.md`; README and inventory rows are updated.

Forms keep consent policy and submission with the host. They retain drafts after errors, prevent duplicate sends, abort on unmount, ignore stale completion, keep focus during pending work, and offer sent/reset recovery. Required/optional cues and all messages are localizable. Header anchor recovery waits for its own mobile dialog to close before focusing a local destination. Article section anchors use a separate namespace from the title; prose spacing survives the website CSS. Editable forms use extensionless local imports for Next/Turbopack consumption.

Verification passed:

- Package and catalog production builds; configured workspace TypeScript, followed by affected checks/catalog TypeScript after the final changes; full ESLint; `git diff --check`.
- `npm run verify:examples`: 93 copied examples and all 79 mappings compile under strict consumer settings.
- `KIT_CATALOG_PORT=5428 npx playwright test tests/browser/website-blocks.spec.ts`: 22 Chromium tests. The matrix covers all eight themes in light/dark, each of seven previews at 1440px LTR and 360px RTL with long content, plus 768/1024px, heading levels, keyboard focus, menu/FAQ behavior, form recovery, reduced motion, article links and code overflow.
- Three existing catalog search/sidebar regression tests passed on port 5429.
- `node scripts/verify-website-blocks.mjs`: independently packed Vite and Next production builds, server/client render, CSS delivery and Chromium smoke passed. Additional consumer checks cover repeated form IDs, duplicate submission, unmount cancellation, ignored late responses and a section named `title`. Both consumers reported zero runtime errors; all owned temporary servers/directories were cleaned.
- Read-only implementation review approved the final changes. Fourteen desktop/mobile screenshots were captured; visual inspection included article, forms, shell, features, CTA and heroes. Evidence is under `.artifacts/website-blocks/`, including `copied-consumption.json`, `browser-results/`, `catalog-regression/`, `catalog-build.log` and `visual/`.

No requested implementation work remains. Firefox, Safari, physical touch and live backend behavior were not tested. No real submission endpoint is included. Unrelated full application/browser suites were not rerun; shared component source is unchanged. The local catalog preview remains available at `http://127.0.0.1:5427/#website-shell`.

Resume commands:

```sh
cd /Users/nationalbank/.codex/worktrees/website-blocks/design-tokens
git status --short
git log -3 --oneline
cat docs/website-blocks.md
# Restart the local preview if needed:
npm run preview --workspace @evenkit/catalog -- --port 5427 --strictPort
```
