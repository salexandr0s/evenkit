# Editable block registry

Inventory R05 provides a local source installer for Evenkit blocks. Applications edit the installed copies and import them locally. Maintained controls and styles still come from the Evenkit packages. The installer does not change component behavior, install npm packages, execute source code, or publish anything.

The catalog contains the following completed blocks. Targets are relative to the installer's `--dir` argument.

| Block | Inventory | Installed source |
| --- | --- | --- |
| `account-settings` | M03, M04, M05 | `account-settings.tsx` |
| `onboarding-wizard` | O06 | `onboarding-wizard.tsx` |
| `record-detail` | O03 | `record-detail.tsx`, `record-workflow.tsx` |
| `record-workflow` | O02, O04 | `record-workflow.tsx` |
| `recovery-page` | O11 | `recovery-page.tsx` |
| `avatar-upload` | J05 | `avatar-upload.tsx` |
| `document-library` | J07 | `document-library.tsx` |
| `team-administration` | M07 | `team-administration.tsx` |
| `invitation-page` | L04 | `invitation-page.tsx` |
| `role-settings` | M08 | `role-settings.tsx` |
| `audit-page` | O09 | `audit-page.tsx` |
| `notification-center` | O08 | `notification-center.tsx` |
| `notification-preferences` | M06 | `notification-preferences.tsx` |
| `dashboard` | O01 | `dashboard.tsx` |
| `website-shell` | P01 | `website/site-shell.tsx` and shared website styles |
| `website-hero` | P02 | `website/hero.tsx` and shared website styles |
| `website-features` | P03 | `website/feature-sections.tsx` and shared website styles |
| `website-cta` | P04 | `website/call-to-action.tsx` and shared website styles |
| `website-faq` | P05 | `website/faq-section.tsx` and shared website styles |
| `website-contact` | P06 | `website/contact-form.tsx`, submission helpers and form styles |
| `website-newsletter` | P06 | `website/newsletter-form.tsx`, submission helpers and form styles |
| `website-article` | P10 | `website/article-layout.tsx` and article styles |
| `website-examples` | P01–P06, P10 | `website/examples.tsx` and the complete website source/style closure |

`record-detail` includes `record-workflow.tsx` because its source imports that file. Website items preserve the `website/` directory, include CSS declaration files for strict consumers, and share `website/PROVENANCE.md`. The other blocks have no local source imports. Shared files have explicit owners in installed state. File preview and lightbox controls used by `document-library` remain maintained exports of `@evenkit/ui`.

The repository-only website README is deliberately unregistered: it links to the adoption guide outside the installed source directory. Use [the website adoption guide](website-blocks.md) when customizing installed blocks. Rich chat is a maintained UI family with a catalog example; it adds no source-installed block.

## Format and shadcn compatibility

The official [registry catalog specification](https://ui.shadcn.com/docs/registry/registry-json), [item specification](https://ui.shadcn.com/docs/registry/registry-item-json), and [registry setup guide](https://ui.shadcn.com/docs/registry/getting-started) were checked on 25 October 2026. They support a catalog of items, npm dependencies, files with destinations, and an extensible `meta` field. Evenkit emits `registry:block` items whose source files use `registry:file` with explicit targets and inlined content. A local import closure is bundled into each item; these items need no registry dependencies.

`registry/schema/registry.json` and `registry-item.json` are pinned copies of the official JSON Schemas. Their URLs, retrieval date and SHA-256 hashes are in `registry/schema/provenance.json`. Ajv validates every generated catalog and item against those copies without network access. Zod then validates the narrower Evenkit profile, including hashes, relative paths and dependency metadata. `registry/schema/block-metadata.json` describes the authored metadata files. Updating an upstream schema is a reviewed repository change.

This is schema compatibility, not a claim that the shadcn CLI implements Evenkit upgrades. The [shadcn API](https://ui.shadcn.com/docs/registry/api-reference) installs files and dependencies; it does not define this tool's baseline or recovery protocol. Evenkit uses its own installer to preserve application edits. Its targets are relative to `--dir`, while shadcn applies its own target resolution. Do not substitute `shadcn add` for the installation commands below: it will not create Evenkit baseline state and may try to obtain the private package names from npm.

Each item records:

| Field | Meaning |
| --- | --- |
| `files[].path` | Source path in this repository |
| `files[].target` | File path beneath the consumer's chosen `--dir` |
| `files[].content` | Exact UTF-8 source bytes represented as JSON text |
| `dependencies` | shadcn-compatible package names with semver ranges |
| `meta.evenkit.dependencies` | Package name, range, private/npm distribution and license decision |
| `meta.evenkit.sourceRevision` | Git HEAD used for the source snapshot |
| `meta.evenkit.files[]` | Matching path/target, content SHA-256 and last source-changing commit |
| `meta.evenkit.inventoryIds`, `license` | Inventory mapping and distribution restriction |

Hashes detect changed content; they are not signatures. Use catalogs and packages from a trusted checkout. The builder requires every registered source file to match its committed Git blob. Unregistered work does not block a build or enter its output.

## Build, discover and inspect

Run from the tooling checkout with Node >=22.12 and Git installed. The commands were exercised on macOS; native Windows filesystem behavior is not supported by this release.

```sh
cd /Users/nationalbank/.codex/worktrees/admin-starter/design-tokens
npm ci --ignore-scripts
npm run registry -- discover

# Each build needs a new directory; an existing snapshot is never replaced.
REGISTRY_SNAPSHOT=$(mktemp -d /tmp/evenkit-registry.XXXXXX)
node scripts/registry/cli.mjs build --output "$REGISTRY_SNAPSHOT/catalog"
node scripts/registry/cli.mjs validate --registry "$REGISTRY_SNAPSHOT/catalog"
node scripts/registry/cli.mjs list --registry "$REGISTRY_SNAPSHOT/catalog"
node scripts/registry/cli.mjs inspect record-detail --registry "$REGISTRY_SNAPSHOT/catalog"
```

The snapshot contains `registry.json` and one JSON file per item. The installer reads the self-contained `registry.json`; the individual files are schema-compatible exports for inspection or later integration. Preserve the snapshot directory while its commands are in use. `discover` lists registered entries and source files without metadata separately. It does not infer that an unregistered block is finished.

## Explore the local viewer

Export a standalone HTML viewer from a validated snapshot, then open that file in a browser:

```sh
# Run from the tooling checkout used above.
npm run build --workspace @evenkit/tokens
node scripts/registry/cli.mjs view \
  --registry "$REGISTRY_SNAPSHOT/catalog" \
  --output "$REGISTRY_SNAPSHOT/blocks.html"
open "$REGISTRY_SNAPSHOT/blocks.html" # macOS; otherwise open the file in your browser
```

The viewer uses Evenkit's Grove tokens and wordmark, with light/dark appearances and layouts for desktop and mobile. Search by title, name, description or inventory ID. Select a block to inspect its file destinations, private package requirements, source revisions, hashes and license. The Source tab shows numbered source text and copies the complete file; previews stop at 5,000 lines. Arrow keys, Home and End switch tabs. If browser clipboard access is unavailable, the text is selected for manual copying.

Enter the application's directory and a relative destination to prepare a quoted `sh`/`zsh` dry-run command. Copy it into a terminal to run the installer. The viewer itself does not execute commands or install dependencies. Generated files embed the catalog's source, local tooling paths, token CSS and logo, make no network requests, and require no service. Keep them with the private source. Re-export after moving the tooling or snapshot, changing the catalog, or rebuilding the tokens; an existing output file is refused. Application directory entries and appearance changes live only in the open page.

The terminal interface groups file actions, dependencies, conflicts and next steps. It defaults to readable text in a terminal and JSON when stdout is piped. Select the format explicitly when needed:

```sh
node scripts/registry/cli.mjs inspect record-detail \
  --registry "$REGISTRY_SNAPSHOT/catalog" --format text
node scripts/registry/cli.mjs inspect record-detail \
  --registry "$REGISTRY_SNAPSHOT/catalog" --json > "$REGISTRY_SNAPSHOT/record-detail.json"
```

Text output wraps to terminal width and removes terminal control characters from source metadata. Use `--json` (or `--format json`) for exact contents, complete hashes and unwrapped diffs. `NO_COLOR=1` disables terminal colors.

## Install with local or private packages

Build and pack both Evenkit packages from the checkout that supplies the catalog:

```sh
EVENKIT_ROOT="$PWD"
EVENKIT_PACKS=$(mktemp -d /tmp/evenkit-packs.XXXXXX)
npm run build:packages
npm pack ./packages/tokens --pack-destination "$EVENKIT_PACKS" --ignore-scripts
npm pack ./packages/ui --pack-destination "$EVENKIT_PACKS" --ignore-scripts
```

For a disposable installation example, create a consumer and install both tarballs in one npm transaction. Supplying both prevents npm from looking for `@evenkit/tokens` in a public registry while resolving the UI package:

```sh
EVENKIT_CONSUMER=$(mktemp -d /tmp/evenkit-app.XXXXXX)
cd "$EVENKIT_CONSUMER"
npm init -y
npm install --ignore-scripts --no-audit --no-fund \
  "$EVENKIT_PACKS/evenkit-tokens-0.1.0.tgz" \
  "$EVENKIT_PACKS/evenkit-ui-0.1.0.tgz" \
  'react@^19.0.0' 'react-dom@^19.0.0'

node "$EVENKIT_ROOT/scripts/registry/cli.mjs" install record-detail recovery-page \
  --registry "$REGISTRY_SNAPSHOT/catalog" --cwd "$EVENKIT_CONSUMER" \
  --dir src/blocks --dry-run
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" install record-detail recovery-page \
  --registry "$REGISTRY_SNAPSHOT/catalog" --cwd "$EVENKIT_CONSUMER" \
  --dir src/blocks
```

For an existing application, set `EVENKIT_CONSUMER` to its absolute directory and review the dry-run output first. Its package manifest must declare the dependencies and its own `node_modules` must contain matching installed versions. The installer checks installed package identities and versions, including private registry installations, local tarballs and npm links. It does not fetch packages or rewrite `package.json` or lockfiles. A missing, undeclared or incompatible dependency blocks the entire operation. Peer declarations alone are insufficient for a runnable consumer.

Import `@evenkit/tokens/css` followed by `@evenkit/ui/css` once in the application's style entry point. Import the copied blocks from their local paths. Supply the host data, callbacks and routes documented in [data workflows](data-workflows.md), [record/settings contracts](records-settings.md), [wizard contracts](commands-wizard.md), [document library](document-library.md), [team administration](team-administration.md), [notifications](notifications.md), [reporting](reporting.md), and [website blocks](website-blocks.md). Website source imports its local styles. This installer does not scaffold a framework or route.

Results go to stdout; invalid inputs and operation errors go to stderr in the selected format. Exit status `0` means success, `1` means invalid input or an operation failure, and `2` means a plan is blocked. Dry runs, discovery, inspection and diffs never write to the consumer. Invoking the CLI directly with `--json` avoids npm's script banner when redirecting JSON to a file.

## Ownership and upgrade review

Commit `.evenkit/blocks.json` with the installed source. It contains baseline contents, hashes, revisions, directories and shared-file owners. It is required for upgrades. Do not edit it by hand. A first install refuses an existing unowned destination even if its contents happen to match. There is no force-overwrite option. Repeating the same installation preserves edits and deletions; a different baseline requires `upgrade`.

After integrating a newer source revision, build a new snapshot. Upgrade commands use the directories already recorded in installed state:

```sh
cd "$EVENKIT_ROOT"
EVENKIT_NEXT=$(mktemp -d /tmp/evenkit-next.XXXXXX)
node scripts/registry/cli.mjs build --output "$EVENKIT_NEXT/catalog"
node scripts/registry/cli.mjs diff record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER" \
  > "$EVENKIT_NEXT/review.json"
node scripts/registry/cli.mjs upgrade record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER" --dry-run
node scripts/registry/cli.mjs upgrade record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER"
```

`diff` includes baseline, local and incoming contents, SHA-256 hashes, and unified baseline-to-local and baseline-to-upstream diffs. A conflict returns exit status `2` while still writing the comparison JSON. Review it before continuing. The whole plan is blocked if any file has an unresolved conflict.

| Comparison | Result |
| --- | --- |
| New file, no existing destination | Create |
| Local matches baseline, upstream changed | Update |
| Upstream matches baseline, local changed or deleted | Preserve application edit/deletion |
| Local already matches new upstream | Record new baseline without rewriting |
| Both local and upstream changed | Conflict; write nothing |
| Upstream removed a clean file | Remove and release ownership |
| Upstream removed a locally edited file | Conflict; write nothing |
| Shared owners request different contents | Block; upgrade the owning blocks together |

If `record-workflow` was also installed separately, include it alongside `record-detail` when upgrading their shared source. Blocks in separate destination directories can retain different baseline versions.

To resolve a conflict, edit the application files into the result you want to retain. Run `diff` again and review that exact result. Its `reviewToken` binds the incoming snapshot, baseline, dependencies and current local files. You can then explicitly preserve the reviewed local contents while advancing the upstream baseline:

```sh
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" diff record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER" \
  > "$EVENKIT_NEXT/review.json"
# Read review.json and the application diff before using its token.
EVENKIT_REVIEW_TOKEN=$(node -p 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).reviewToken' "$EVENKIT_NEXT/review.json")
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" upgrade record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER" \
  --accept-local "$EVENKIT_REVIEW_TOKEN" --dry-run
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" upgrade record-detail recovery-page \
  --registry "$EVENKIT_NEXT/catalog" --cwd "$EVENKIT_CONSUMER" \
  --accept-local "$EVENKIT_REVIEW_TOKEN"
```

Acceptance applies to conflicts on previously owned files only. It cannot override dependency failures, unowned destinations or incompatible shared owners. Files changed after review invalidate the token. For an edited file removed upstream, acceptance retains the local file and releases its registry ownership. For a locally deleted file still present upstream, acceptance preserves the deletion and records the new upstream baseline. No automatic text merge is attempted.

## Failed operations and recovery

The installer validates the full plan, acquires an exclusive consumer lock, rechecks the plan, and writes `.evenkit/transaction.json` before changing source files. Each write checks the expected contents again. Existing files are replaced atomically, with their permission modes retained. A caught failure rolls back the batch when current contents still match its journal. Empty directories created during an attempt can remain; pre-existing directories are never removed.

After an interrupted process:

```sh
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" recover --cwd "$EVENKIT_CONSUMER" --dry-run
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" recover --cwd "$EVENKIT_CONSUMER"
```

Recovery refuses a live installer lock. A stale lock from a dead process can be recovered. If state reached its commit point, recovery clears the completed journal; otherwise it rolls back recognized writes. A post-interruption edit produces a conflict and is preserved. Keep the journal and save those edits elsewhere before manually restoring the journal's expected before/after content and retrying recovery. A corrupt journal, truncated first write or changed state may require manual repair from the journal and version control; there is no destructive reset command.

Destination paths reject traversal, absolute/drive paths, backslashes, reserved state/package/Git directories, case collisions, device names and file/directory collisions. Existing destination symlinks and hardlinks are rejected, including `.evenkit` and ancestor paths. Cooperating installer processes use the lock; do not concurrently rename directories or edit files while applying or recovering. Portable Node filesystem calls cannot eliminate a hostile external process swapping path ancestors between checks. File contents and ordinary permission modes are preserved; timestamps, ACLs and extended attributes are not archived.

## Add a finished block

The integration owner should merge the block's completed source and verification first, then add `registry/metadata/<name>.json`. Copy the shape of an existing metadata record and validate it against `registry/schema/block-metadata.json`. Include every local import, retain its relative destination layout, declare each direct npm import, and record inventory IDs and license decisions. Build checks TypeScript import/export/dynamic-import/require dependencies; computed module imports and undeclared packages are rejected. The initial profile supports UTF-8 source files, semver package dependencies and explicit destinations. It rejects other shadcn install-time features such as CSS injection, environment variables and remote registry dependencies.

```sh
npm run registry -- discover
npm run test:registry
npm run verify:registry-viewer
npm run verify:registry
```

Unregistered files are listed without being installed. Do not add metadata for unfinished files merely to clear discovery output. Keep block source and behavior changes in their owning agents' commits. After integration, build a fresh snapshot from the integration commit; this refreshes source revision metadata without modifying source files.

`test:registry` builds the token CSS needed by the viewer tests. `verify:registry-viewer` uses the existing Playwright Chromium installation and temporary catalogs to check keyboard navigation, search, clipboard fallbacks, command validation, escaped source and offline operation. It writes screenshots at 360, 768, 1024 and 1440 pixels, dark/source views and a JSON report under `.artifacts/block-registry-design/`, then removes its temporary catalogs. Install the configured browser with `npx playwright install chromium` if it is absent.

## Dependencies and licenses

The copied blocks are original internal Evenkit source. Metadata records `UNLICENSED`, consistent with the token package's retained distribution restriction; the UI package is private and grants no public license here. These decisions do not authorize publishing source or packages. Package provenance remains in `packages/ui/PROVENANCE.md` and `packages/tokens/PROVENANCE.md`.

| Dependency | Decision |
| --- | --- |
| `@evenkit/ui`, `@evenkit/tokens` 0.1.0 | Required private packages; acquire locally or through the application's authenticated registry |
| React and React DOM `^19.0.0` | Existing package peers, MIT; declarations and installed versions checked |
| Ajv 8.20.0 | Development/tooling dependency, MIT; validates the official JSON Schemas |
| Zod 4.6.7 | Existing workspace dependency, now explicit for tooling, MIT; parses metadata/state/journal inputs |
| semver 7.8.5 | Development/tooling dependency, ISC; checks package version ranges |
| TypeScript 6.0.3 | Existing development dependency, Apache-2.0; parses source imports |
| Official shadcn JSON Schemas | Vendored under MIT with notice and provenance; no shadcn component implementation copied |

Transitive UI dependencies and their notices remain in the packed UI package. The tooling introduces no consumer runtime dependency or hosted service. It requires the checkout's development dependencies; it is not a separately published installer package.

The document, team, notification, reporting and website metadata declares `@evenkit/ui` and React, including the JSX runtime. Their token styles and React DOM renderer use the consumer setup above; charting, markdown and provider packages are not direct block dependencies. These blocks call application-owned functions for storage, mutations, permissions and account/workspace scoping.

The viewer reuses the repository's Evenkit token CSS and logo under the same private distribution restriction. It adds no third-party UI package; its small SVG glyphs are authored in the tooling. Browser verification reuses the existing development dependency `@playwright/test`.

## Verification

`npm run test:registry` runs Node integration tests in temporary consumers. They cover committed-source discovery, metadata/schema integrity, fresh/repeated installs, missing and incompatible dependencies, existing application files, local edits/deletions, upgrades/removals, shared ownership, review tokens, traversal, symlinks, corrupt inputs, interrupted batches and recovery conflicts.

`npm run verify:registry` adds package builds and the existing independent Vite/Next verification with `--registry`. It packs both private packages, installs them in disposable consumers, installs all registered blocks through this CLI, repeats the install, and runs the existing framework build, SSR, HTTP and stylesheet checks. It records `.artifacts/registry-package-verification.json`, stops owned servers and removes its temporary consumers. Fixture package acquisition may use npm for third-party dependencies; the registry installer itself has no network operations. See the R05 session handoff for the executed results and commit IDs.
