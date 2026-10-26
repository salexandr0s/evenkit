# Admin starter consumer verification

Verified on 26 October 2026 in `/Users/nationalbank/.codex/worktrees/admin-starter/design-tokens`, branch `codex/admin-starter`. Runtime: Node 26.12.1. Consumer versions: React/React DOM 19.3.1, Next 16.4.3, Vite 8.3.5, TypeScript 6.0.3, Playwright 1.64.1.

Final packed and registry runs passed against rebuilt packages from `1278ffb282d78437810503fe26bdd1b099961484`. That commit gives document table filenames a token-based minimum width so they remain readable on narrow layouts. Both runs started at 08:28:29 UTC and retain the same JavaScript sizes as the earlier run. The standalone website check below preceded this document-only CSS change; website source and styles are unchanged.

## Changes

Registry metadata commit `7ffc16aae9b187ca5a92dfe62b06a10f510620fc` registers 18 additions: the completed document, team, notification and dashboard blocks, plus nine website items. The complete registry contains 23 items and 34 unique installed files. Website items include their local import closure, CSS declarations and shared provenance. Their repository README remains unregistered because its adoption-guide link points outside the installed source directory. Rich chat remains a maintained UI family; no registry block was invented for it.

`scripts/verify-packages.mjs` retains registry dry-run/install/repeated-install checks and all track SSR/CSS checks. It adds explicit strict type checks in both independent consumers, including every copied source block; Chromium hydration, controlled checkbox, dialog Escape/focus and copied document-preview checks; auth package subpath/declaration checks; and a deliberate Next build failure when a Client Component imports the auth server entry. The negative case must identify the fixture route and the server-only boundary.

The fixtures use packed package APIs and local copied files. The team fixture now renders the copied team, invitation, role and audit wrappers. The website fixture renders the copied website and article examples. A separate Button-only Vite entry records the emitted module graph and JavaScript sizes. Its checks cover every emitted chunk, including shared chunks, and reject Next, Supabase, server-only, and optional chart/markdown engines.

## Executed checks

All commands below exited with status 0:

| Command | Result and evidence |
| --- | --- |
| `npm run verify:packages` | Independent packed Vite and Next production builds, explicit strict types, HTTP 200, stylesheet assertions, Chromium interactions, auth entry checks and server-only rejection. `.artifacts/admin-integration/packed-consumers-final.log` and `.artifacts/package-verification.json`. |
| `node scripts/verify-packages.mjs --registry` | All 23 items installed through the CLI in each independent consumer; dry run, first install and repeated install passed. Each installed 34 unique files, then passed the same build, type, browser and package-boundary checks. `.artifacts/admin-integration/registry-consumers-final.log` and `.artifacts/registry-package-verification.json`. |
| `node scripts/verify-website-blocks.mjs` | Independently copied website sources passed production builds, rendering, styles, keyboard/form interactions, duplicate submission prevention, unmount cancellation and repeated form instances in Vite and Next. No runtime errors. `.artifacts/admin-integration/website-consumers.log` and `.artifacts/website-blocks/copied-consumption.json`. |
| `npx eslint scripts/verify-packages.mjs fixtures` | Owned JavaScript and TypeScript sources passed lint. |
| `node --check scripts/verify-packages.mjs` and `git diff --check` on owned files | Script syntax and whitespace checks passed. |

A disposable registry build also passed the pinned schema, import/dependency closure, target layout and committed-source checks for the 23-item catalog. The final registry consumer run records source revision `1278ffb282d78437810503fe26bdd1b099961484`. All three runners confirmed that owned servers stopped and temporary consumer directories were removed.

## Bundle and package evidence

The normal and registry Vite runs produced the same JavaScript measurements:

| Fixture | Emitted modules | JavaScript bytes | Gzip bytes |
| --- | ---: | ---: | ---: |
| Full component and copied-block coverage | 1,222 | 1,419,602 | 420,894 |
| Button-only consumer, including React | 311 | 368,914 | 116,979 |

The full fixture deliberately references the UI namespace to exercise all exports. It is not an application bundle target. Both emitted graphs contain no Next or Supabase modules; the minimal graph also contains no optional chart or markdown engine modules. Sizes cover emitted JavaScript; stylesheet delivery is checked separately. This harness does not claim a before/after size baseline or enforce a size budget.

All packed packages are version 0.1.0. Final unpacked sizes: tokens 189,547 bytes, UI 2,034,049 bytes, auth adapter 20,432 bytes. The document CSS rule adds 99 bytes to the unpacked UI package. Both final runs recorded identical package integrity values:

| Package | npm tarball integrity |
| --- | --- |
| `@evenkit/tokens` | `sha512-iAf5Gu0gdJeh35cngapiFlswuuY7ZCOebOF91iAJBxnsotdIdix8/cWWZ310fkV060gQtdz+hXum8EV2lWIgaw==` |
| `@evenkit/ui` | `sha512-5f15rmiBbCPeqCWeQbHjtwnO2y+hMqJyvlOZ4mphciYAZoDVMUEKqpREnj0q8IXuc/Ui8yQ4FsCuKwk8gEIvKQ==` |
| `@evenkit/auth-next` | `sha512-hcZF6k/BE6ZlGGOzRWZZ+Wj269t8g3H19D3kchwIoYKKBGUp9MUakuShGHu2Eg5gUfOzZtDd8r/xDgLYf+i7iA==` |

The Vite consumers install the generic packages; only the Next package consumer installs the auth adapter.

## Limits and resume

These runners use Chromium on macOS. They do not cover Firefox, Safari or physical touch devices. The packed auth checks verify installation, declarations, server rendering and the server/client boundary without calling a provider. Provider behavior is documented separately in [the auth adapter handoff](auth-adapter.md).

Rebuild packages before rerunning after library changes. The registry builder requires registered source files to match committed Git blobs. Run `npm run verify:packages`, `node scripts/verify-packages.mjs --registry`, and `node scripts/verify-website-blocks.mjs` from this checkout. These commands create disposable local consumers; they do not publish or deploy packages or modify existing applications.
