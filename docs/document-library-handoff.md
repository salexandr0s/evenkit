# Document-library integration handoff

Completed on 25 October 2026 in the isolated worktree
`/Users/nationalbank/.codex/worktrees/document-library/design-tokens`, branch
`codex/document-library`. The base is
`b588b1b1964ba2b26ee8453606f354f2c33eb10d` from the latest local
`codex/component-improvements`. Fetching confirmed that local base was seven
commits ahead of its remote. The original checkout and other worktrees were
preserved. No storage provider, publication, push or deployment was performed.

## Delivered

- J05: editable `registry/blocks/avatar-upload.tsx` with raster selection,
  preview, replacement, staged removal/undo, reset, save retry/cancel, stable
  owner/revision handling and owned object URL cleanup.
- J06: maintained `media-preview` module with named raster/plain-text previews,
  expired/unavailable recovery, safe open/download actions and Dialog lightbox.
- J07: maintained `document-library` module and editable block with remote
  list/grid, folders, selection, filtering/sorting, load recovery, existing
  UploadQueue composition, removal retry/cancel and host-provided restoration.
- Catalog routes `/#avatar-upload`, `/#file-preview` and `/#document-library`,
  complete copyable examples, API guide and provenance. Catalog totals are now
  89 entries and 75 inventory mappings.

Implementation commit: `27eb10e` (`feat(document-library): add previews and
editable document flows`). The following catalog/docs commit completes the
branch. Review the range `b588b1b..codex/document-library` for the full change.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | Token/UI/catalog production builds passed |
| `npm run typecheck` | Test/config, package and catalog TypeScript passed |
| `npm run lint` | Workspace ESLint passed |
| `npm test` | 25 tests in 5 files passed |
| `npm run verify:examples` | 89 copied examples and 75 mappings passed |
| `npm run verify:packages` | Independent packed Vite and Next builds, Next SSR and HTTP/CSS checks passed; temporary servers/directories cleaned |
| New Chromium journeys | 3 avatar, 2 preview and 5 document-library journeys passed |
| Existing Chromium regressions | 11 table, remote-table, dialog and upload journeys passed |
| Layout and appearance | 281 checks passed across 8 themes, both modes, 360/768/1024/1440 widths, grid/list, RTL, system-dark, mobile controls and reduced-motion portals |
| Source review | Independent reviewer findings resolved; no remaining blocker |

Evidence lives in `.artifacts/document-library/`: `build.log`, `typecheck.log`,
`lint.log`, `unit.log`, `examples.log`, `packages.log`, `avatar-browser.log`,
`media-browser.log`, `documents-browser.log`, `documents-recovery-browser.log`,
`regression-browser.log`, `layout-report.json`, `grid-report.json` and PNG captures.
The initial document run passed three journeys and found two test synchronization/
locator issues; the corrected two journeys passed in the recovery log. Concurrent
Playwright output directories are isolated to avoid artifact cleanup races.
`.artifacts/package-verification.json` records packed-consumer cleanup;
`.artifacts/catalog-examples.json` records all validated entries.

Visual inspection covered desktop Linen light and mobile Ocean dark/RTL, long
filenames, grid cards, avatar settings and a 360px lightbox. Token tests cover
the shared semantic contrast pairs. This evidence is Chromium-only; Safari,
Firefox, physical mobile keyboards and production storage remain unverified.
Animated uploaded images need application-supplied static renditions when motion
must be suppressed. No implementation work remains in J05–J07.

## Integration

Merge or cherry-pick the branch commits into the chosen integration checkout.
Preserve concurrent additions when resolving shared files. Shared changes are
limited to package exports/style bundling, additive catalog routing/icons,
inventory/docs/provenance and verification fixtures/scripts. The only existing
component API addition is `DataTable.onClearSearch`, which lets an external
search control clear its query and restore focus; its default behavior is unchanged.

Both `roadmap-entries.ts` and `roadmap-preview.tsx` need the three new catalog
families. Retain all other agents' families when merging. The example verifier's
addition list/count, README totals and inventory summary must be combined with
concurrent additions rather than taking this branch's totals wholesale. Retain
the document fixture import in `fixtures/roadmap-fixture.tsx`, copy step and CSS/SSR
checks in `scripts/verify-packages.mjs` alongside other fixture additions.

The source blocks stay under application ownership. Applications validate API
responses and file content, authorize each operation, supply fresh signed URLs,
and own transfer cancellation/cleanup. `scopeKey` includes account/workspace/
permission revision. Folder changes cancel that folder's pending queue; removal
undo is available only when the application supplies `onRestore`.

## Resume

```sh
cd /Users/nationalbank/.codex/worktrees/document-library/design-tokens
git status --short
git log --oneline b588b1b..codex/document-library
git diff --stat b588b1b..codex/document-library
npm run preview --workspace @evenkit/catalog -- --port 5497 --strictPort
```

The local preview is left running at `http://127.0.0.1:5497/#document-library`.
Restart it with the command above if it has stopped. The worktree is retained
for integration and review; it has not been archived.
