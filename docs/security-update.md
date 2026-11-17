# Next.js security update

Verified on 17 November 2026 at `2da89dd8e4c70ccd72c13ab652f81834ce2f9bf2`.

Next.js is updated from 16.4.3 to **16.4.6** in the admin starter, auth adapter's
development dependency and standalone Next fixture. The adapter's peer range
and consumer guide now require `^16.4.6`. This excludes the vulnerable versions
and uses the patch version tested here as the minimum.

[GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) includes
16.4.3 in its affected range and identifies 16.4.5 as patched. The update uses
the later [16.4.6 release](https://github.com/vercel/next.js/releases/tag/v16.4.6)
within the existing minor line. The lockfile changes only Next, `@next/env`, its
eight platform-specific SWC packages and the corresponding workspace manifests;
no package entries were added or removed. The framework's security checks remain
enabled. The production build completed without the previous security reminder.

## Verification

A clean `npm ci --prefer-offline --no-audit` and `npm ls --all` passed using
Node 24.22.3 / npm 11.19.1 on macOS 27.2 Apple Silicon. All commands below ran
sequentially against the clean implementation commit, with `CI=1` and demo auth.
No test selection, retry or skipped-check exception was introduced.

| Command | Result | Wall seconds | Process CPU seconds |
| --- | --- | ---: | ---: |
| `npm run verify` | Passed: lint, all builds/types, 56 unit + 34 registry + 337 catalog + 63 admin tests | 325.606 | 1266.544 |
| `npm run verify:examples` | Passed: 116 copied examples and 104 priority mappings | 1.629 | 3.899 |
| `npm run verify:packages` | Passed: independent Vite and Next consumers | 39.067 | 74.432 |
| `node scripts/verify-packages.mjs --registry` | Passed: 23 registry items / 34 files in each independent consumer | 66.873 | 113.338 |
| `node scripts/verify-website-blocks.mjs` | Passed: independent Vite and Next copied website consumers | 21.173 | 47.051 |
| `npm run verify:bundle` | Passed: 11 deferred previews; no forbidden initial modules | 0.543 | 0.555 |

The full `verify` command passed all **490 tests in one invocation**, including
Chromium, Firefox and WebKit admin journeys. Packed consumers passed production
builds, strict types, hydration and interaction checks; the Next consumer also
rejected an intentional client import of the server-only adapter. Copied website
consumers passed keyboard/form, duplicate-submission and cancellation checks.
All independent-consumer and example scratch directories were removed.

`npm audit --omit=dev --json` reported **zero vulnerabilities**. The full
`npm audit --json` still reported **nine moderate development-tool entries** in
the ESLint/typescript-eslint/minimatch dependency graph (exit 1). Neither report
contains a Next advisory. These remaining development-tool findings were not
changed in this Next security patch.

Exact command measurements and audit counts are retained in
[security-update-measurements.json](./security-update-measurements.json).
Raw logs, full audit JSON and the lockfile comparison are in the local ignored
`.artifacts/security-update/` directory. Independent verifiers also retain
their normal reports under `.artifacts/`.

## Limits and CI follow-up

The local Firefox run uses a task-owned `CFFIXED_USER_HOME` directory under
`.artifacts/security-update/` for the macOS app-data issue documented in the
[CI audit](./ci-audit.md). The user's real home directory is unchanged. This
workaround is not in the Ubuntu workflow.

The full suite took 5m 26s locally. These timings exclude the initial dependency
installation, use warm downloads/build caches and reflect a busy shared machine.
They establish successful feedback time and process CPU consumption for this
revision, not a controlled speedup or financial saving against the earlier
failed baseline. Process CPU seconds are not allocated runner-minutes.

The disposable real-Supabase-provider integration was not rerun; its original
26 October evidence remains in the compatibility record. This refresh covers
demo admin journeys and the packed adapter boundary, with unchanged provider
dependencies. No deployment or hosted GitHub Actions run was performed. The
changes remain local and unpushed; hosted timing and behavior remain unverified.
