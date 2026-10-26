# R05 editable block registry: 25 October 2026


Status: DONE for the five committed blocks available at branch creation. Worktree: `/Users/nationalbank/.codex/worktrees/block-registry/design-tokens`. Branch: `codex/block-registry`. The earlier handoff sections are retained as history; their branch and deployment statements describe earlier work.

### Completed

Created the isolated worktree from local `codex/component-improvements` at `b588b1b`. After fetching, that local branch was seven commits ahead of `origin/codex/component-improvements`; the local tip was the latest source. Implementation commit: `0193a171b8fb50bf8fd95d111c7a64fd77a7b8ec` (`feat(registry): add editable block installation and upgrade tooling`). This handoff is a separate documentation commit following it.

Implemented discovery, schema validation, inspection, dry-run installation, baseline tracking, upgrade comparison, reviewed conflict acceptance and interrupted-operation recovery. Registered `account-settings`, `onboarding-wizard`, `record-detail`, `record-workflow` and `recovery-page`. `record-detail` includes the shared record editor; installed state tracks both owners when appropriate. Optional registry verification reuses the existing packed Vite/Next consumers.

Only registry tooling/metadata/schema, `docs/block-registry.md`, additive root scripts/dependencies and the optional verification path changed. Package, component, block, catalog and fixture source have no diff from the base. No registry was published, no service was deployed, no other worktree was edited, and no existing application was used as a test consumer.

### Files and commands

- `scripts/registry/{build,catalog,cli,installer,storage}.mjs`: source bundling, validation, CLI, baseline comparisons and filesystem transactions.
- `scripts/registry/registry.test.mjs`: 21 temporary-consumer test groups.
- `registry/metadata/*.json`: extensible opt-in records; `registry/schema/`: pinned official schemas, metadata schema, source hashes and retained MIT notice.
- `docs/block-registry.md`: exact installation, local/private package acquisition, upgrade, conflict resolution, recovery and integration commands.
- `scripts/verify-packages.mjs --registry`: installs copied blocks through the CLI before existing consumer builds and smoke checks.

Resume and inspect the final local snapshot:

```sh
cd /Users/nationalbank/.codex/worktrees/block-registry/design-tokens
git status --short
git log -3 --oneline
node scripts/registry/cli.mjs discover
node scripts/registry/cli.mjs validate --registry .artifacts/block-registry/catalog
node scripts/registry/cli.mjs inspect record-detail --registry .artifacts/block-registry/catalog
```

The ignored snapshot `.artifacts/block-registry/catalog` was built after implementation commit `0193a17` and validated against the pinned official schemas. To build elsewhere, use a new output directory; builds reject an existing directory. For fresh verification after integration:

```sh
npm ci --ignore-scripts
npm run verify:registry
npm run typecheck
npm run lint
```

### Verification evidence

Executed `npm run test:registry`: all 21 tests passed, no skips, final full run about 40 seconds. Coverage includes fresh install, missing/undeclared/incompatible dependencies, repeated install, pre-existing application files, edited/deleted source, clean upgrades/removals, conflicts, shared owners, review token staleness, traversal/symlinks, corrupt metadata/state, caught write failures, interrupted processes, and edits after interruption. Metadata validates against its selected schema; vendored bytes match provenance hashes. Tests also check that unfinished/unregistered source is excluded, dirty registered source is rejected, and incomplete relative imports fail the build.

Executed `npm run build:packages`, `npm run typecheck` and `npm run lint`: all passed. Final focused ESLint also passed after the review fixes. Executed `node scripts/verify-packages.mjs --registry`: packed local Evenkit packages installed in independent Vite and Next consumers; all five blocks installed through the CLI, dry runs and repeated installs passed, both production builds passed, both returned HTTP 200, stylesheets passed, and existing Next SSR assertions passed. All owned servers stopped and temporary consumers were removed.

Independent review found two failure modes: mixed baseline versions in different destination directories were wrongly checked as one catalog, and rollback/atomic replacement could lose permission bits. The fixes validate each installed item independently, validate the complete next state before writes, journal original modes and apply modes explicitly despite umask. Focused regressions passed, including `0600` removal rollback and `0664` atomic replacement under umask `022`; confidence is high. The `0664` assertion was added to the existing clean-upgrade test after the full run and that test passed again.

Evidence remains in this worktree:

- `.artifacts/block-registry/tests.log`, `permissions.log`, `build.log`, `typecheck.log`, `lint.log`, `packages.log`.
- `.artifacts/registry-package-verification.json`: consumer results, dependency checks, hashes, source revision, server PIDs/ports and confirmed cleanup.
- `.artifacts/block-registry/verification-inputs.json`: SHA-256 values for all 20 implementation inputs at verification.

The full catalog browser matrix was not rerun because no component or block behavior changed. Framework integration was exercised by the existing independent package fixtures.

### Decisions and limits

The selected distribution is a local installer over shadcn-schema-compatible catalogs. Standard shadcn installation does not create Evenkit baseline state, and the catalog dependency names do not imply publicly available Evenkit packages. Both private Evenkit tarballs must be supplied together or installed through the consumer's authenticated registry. The installer checks declarations/installed versions and never invokes npm or changes a consumer manifest.

Official schema copies and docs were inspected on 25 October 2026. Ajv 8.20.0 (MIT), Zod 4.6.7 (MIT), semver 7.8.5 (ISC), and existing TypeScript 6.0.3 (Apache-2.0) support tooling only. Evenkit block metadata remains `UNLICENSED`; no new public distribution right is claimed. Schema MIT notices are retained. Exact upstream URLs and hashes are in `registry/schema/provenance.json`.

There is no automatic text merge or force overwrite. Explicit conflict acceptance requires the current review token and preserves reviewed local contents. Native Windows filesystem behavior is unsupported; macOS was tested. File bytes and ordinary modes are retained, while ACLs, extended attributes and timestamps are not archived. Hostile concurrent directory replacement is outside the portable filesystem guarantees. A truncated initial write, corrupt state/journal or post-interruption edit can require manual review/repair; recovery refuses unknown content rather than erasing it. Empty directories may remain after rollback.

### Integration handoff for newly finished blocks

The integration owner should include tooling commit `0193a171b8fb50bf8fd95d111c7a64fd77a7b8ec` and retain this R05 handoff section alongside other agents' handoffs. Resolve root package-script/dependency additions additively. Do not replace their component/block source with this branch's older snapshots.

Merge each finished block's source, dependency/license decisions and verification from its owning agent first. Run `registry discover` on the integration branch. Add one metadata file per finished block, including its full local import closure, destination layout and direct package dependencies. The tooling intentionally has no references to the unfinished document-library, notifications, reporting, rich-chat or team-admin worktrees. Their final block names and paths must come from their completed handoffs.

After adding metadata, run `npm run verify:registry`, the integration branch's type/lint checks, and each new block's applicable behavior checks. The packed verification installs every registered block, while its runtime fixtures exercise the existing five; new blocks still need their owning agents' usage/runtime evidence. Build a fresh snapshot from the final integration commit and record that revision. Update inventory R05's status/link in the integration tracker there; this branch leaves the shared inventory document untouched to preserve ownership.
