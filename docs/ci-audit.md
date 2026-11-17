# CI audit and rollout

Audit date: 2026-11-17. Local baseline: `bf1ca9f5afea1abc90a688ef4f1cfb025cab77d6`.

Follow-up: the separate [Next.js security update](./security-update.md) patches
16.4.3 to 16.4.6 and passes all 490 tests in one full `npm run verify` invocation
at `2da89dd` (325.606s wall / 1266.544s process CPU). The historical audit and
failed-run evidence below are retained. Hosted behavior remains unverified.

## Findings and priorities

There were no tracked GitHub Actions workflows and the repository's Actions API
reported zero runs. GitHub reported `main` as unprotected with empty required
status contexts, and the rulesets API returned an empty list. The separate
administrative branch-protection endpoint returned 403. No protection settings
were changed. Remote `main` was `2a543a1`; the local baseline already included
three later commits, which are not part of this CI change.

The existing verification contract is `npm run verify`: all package and app
production builds, workspace and test type checks, ESLint, Vitest, registry
tests, the catalog's Chromium tests, and admin tests in Chromium, Firefox and
WebKit. Standalone example, packed-consumer, bundle, registry-viewer and local
Supabase-provider verifiers exist, but were not part of that command or an
enforced CI gate. They remain available; this change does not claim their
coverage is included in `verify`.

Prioritized implementation:

1. Record command wall time, process CPU time, revision and exit status. Preserve
   failure and cancellation semantics and retain evidence from failed runs.
2. Put lint and unit feedback before app builds and broad type checks. Build
   packages once and reuse the resulting tokens for registry tests, while
   retaining the standalone registry command's prerequisite build.
3. Add one full-suite Linux job with one dependency install, lockfile-keyed npm
   download caching, bounded runtime, cancellation of obsolete PR revisions and
   diagnostic artifacts. Measure an invocation-local Node compilation cache
   before adopting it. Keep all three admin browsers.

No affected-test selector is enabled. The dependency boundary includes generated
token CSS, package output, copied registry sources, metadata, Markdown loaded
from disk by the catalog plugin, and browser hosts built dynamically with Vite.
An import-only graph would miss inputs. Unknown, deleted, renamed, configuration,
dependency, fixture and documentation changes therefore all receive the full
verification contract, as do manual and merge-queue runs. No path filter skips
the check, and there is no cached passing-test result.

## What transfers from OpenClaw

Read [the article](https://vincent.build/openclaw-ci-cost-reduction/) and its
[pinned implementation](https://github.com/openclaw/openclaw/blob/a7d05c7af04aa17ac57c994da238d0c60f058ca6/.github/workflows/ci.yml).
The useful principles here are measuring equivalent work, reducing repeated
setup, earlier cheap failures, explicit full-suite fallback, and a check that
cannot go green when required work failed. OpenClaw's preflight/planner,
build-artifact reuse, PR cancellation and `openclaw/ci-gate` enforce those
principles at a much larger scale.

Its runner fleet, Node/Bun matrices, native platform lanes, ownership rules,
alternate typecheckers, test deletion budgets and reported percentages are not
evidence for this repository. There is no basis here for switching providers,
dropping tests, disabling isolation, or moving required tests to a schedule.
The article's organization-wide comparison also covers changing workloads;
it is not an equal-workload benchmark.

## Reproducing measurements

Use the same revision, Node version, machine, browser inventory, worker count
and cache state for both arms. Avoid concurrent benchmark work. The initial
audit uses Node 24.22.3 on macOS 27.2 / Apple Silicon, 10 logical CPUs, 32 GiB.
Existing dependencies and browser binaries are warm; local figures exclude
installation and runner allocation. Other activity on this shared workstation
can affect elapsed time. These are observations, not hosted p50/p95 estimates.

```sh
python3 scripts/ci/measure.py --output .artifacts/ci/local.json -- npm run verify
python3 -m unittest discover -s scripts/ci -p 'test_*.py'
```

The wrapper executes argv directly, forwards termination to the child process
group, and returns the command's failure status. Each report starts as `running`
so an interrupted command cannot retain stale success. CPU seconds sum user and
system time for waited child processes; they are not allocated runner-minutes.
The wrapper requires Python 3 on Linux/macOS; ordinary npm commands do not.

### Environment findings

The first build completed compilation but exited with Next.js's
`SecurityFatalError` upgrade reminder for installed Next 16.4.3. An immediate
unchanged retry passed and retained the vulnerability warning. The reminder's
retry window expires after five minutes; a later attempt stopped again before
its immediate retry passed. No dependency version, security check or framework
configuration was changed to suppress this. The dependency needs a separate
security upgrade; a successful retry does not resolve the advisory. npm audit
identified [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h)
(16.4.3 is in the affected range; the advisory lists 16.4.5 as patched).
The current npm resolver offered 16.4.6. No dependency upgrade was bundled into
this CI change.

The initial admin run passed 43 cases but failed 20 Firefox browser launches
before application assertions (`Could not find profile folder`). Redownloading
the pinned Firefox 157 binary did not help. A launch with a fresh
`CFFIXED_USER_HOME` succeeded, matching
[Playwright's macOS 27 app-data issue](https://github.com/microsoft/playwright/issues/42768).
For subsequent local validation only, point that environment variable at an
empty directory under `.artifacts/ci-audit/`. This keeps test app data separate
from the user's real browser data. It is not part of the Ubuntu workflow, and
the initial failures remain in the baseline evidence.

## Workflow contract

The `CI` workflow has one job/check named `verify`. It runs on pull requests,
pushes to `main`, merge groups and manual dispatch, with no changed-path or draft
exclusions. Keep that check name stable if branch protection is later enabled.
All verification stages must pass; there is no `continue-on-error`, conditional
test skip, test-result reuse, or aggregate gate that accepts skipped work.
Only obsolete revisions of the same PR cancel one another. Main/manual runs
use unique concurrency groups.

One Ubuntu 24.04 runner uses pinned Node 24.22.3 and `npm ci --prefer-offline`.
The npm cache stores downloads keyed by the lockfile; installation still runs.
No Node compilation cache, dependency-tree cache, build cache or passing-test
cache is enabled. A local experiment did not establish a reliable benefit for
a fresh compilation cache; see the measurements below. A future experiment must
also account for
[Node's coverage caveat](https://nodejs.org/docs/latest-v24.x/api/module.html#module-compile-cache).

All three Playwright engines are installed after the earlier checks succeed.
Browser binaries are not cached, following
[Playwright's CI guidance](https://playwright.dev/docs/ci).
Playwright's existing worker defaults, test inventory, assertions and retries
are unchanged. CI rejects focused `test.only` cases and bounds catalog/admin
execution to 15/10 minutes; the overall job has a 30-minute limit. Failing or
timed-out tests stay failures. Reports and failure traces are retained for
seven days, including hidden `.artifacts` paths explicitly listed in the upload.

## Compute cost

This repository is public. Standard hosted runner compute is
[free for public repositories](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
Historical Actions compute is zero because no runs exist. Adding CI increases
verification coverage and compute usage; there is no historical CI bill to
reduce. Track elapsed feedback time and total allocated runner-seconds, and
report storage separately. Do not turn local CPU seconds into a dollar saving.

For future hosted comparisons, collect every job's `started_at`, `completed_at`,
conclusion and attempt, plus step timings and setup/cache outcomes. Feedback is
the interval from workflow creation to completion of `verify`; allocated compute
is the sum of all job durations, including failures, cancellations and retries.
Compare cold and warm runs of the same SHA before reporting medians or tails.
If billing changes, apply the then-current per-job rounded minute rates, not a
rate borrowed from OpenClaw or this workstation.

## Measurements

The baseline was a diagnostic sweep of the original `verify` stages, in their
original order. It continued after failures to measure all stages; the actual
original `&&` command would have stopped at the first failed build.

| Original stage | Wall seconds | Process CPU seconds | Result |
| --- | ---: | ---: | --- |
| build | 20.724 | 35.758 | Security upgrade reminder; exit 1 |
| typecheck | 48.244 | 35.313 | Passed |
| lint | 9.875 | 10.097 | Passed |
| unit | 3.802 | 7.243 | 56 passed |
| registry | 70.943 | 46.601 | 34 passed |
| catalog-browser | 292.296 | 935.013 | 337 passed |
| admin-browser | 105.934 | 151.346 | 43 passed; 20 Firefox launch failures |

Total diagnostic wall time: **551.824s**; summed process CPU:
**1221.371s**. This is a failed baseline, not a
green run to use in a percentage-saving claim. The unchanged successful build
retry took 20.484s wall / 29.781s CPU.

The same 34 registry tests, unchanged source and Node version, were run in this
order using `node --test scripts/registry/*.test.mjs`. Uncached arms used
`NODE_DISABLE_COMPILE_CACHE=1`; cached arms used the same initially empty
`NODE_COMPILE_CACHE` directory. All four arms passed all 34 tests.

| Registry cache experiment | Wall seconds | Process CPU seconds |
| --- | ---: | ---: |
| uncached-1 | 56.601 | 40.681 |
| cache-cold | 49.813 | 40.977 |
| cache-warm | 91.358 | 43.719 |
| uncached-2 | 73.833 | 53.191 |

The fresh-cache arm did not improve process CPU against the first uncached
arm; later runs varied substantially as workstation load increased. One
observed load average was 47 on 10 logical CPUs. This does not establish
same-run cache savings or a general cache regression. The cache is omitted.

An injected undefined-variable lint error stopped the new `npm run verify`
in **4.627s** (7.864s process CPU), before package builds. The original measured
order placed 68.968s of build/typecheck work ahead of lint. That is a sequencing
comparison, not a controlled 94% speedup claim. Both browser configurations
rejected a temporary `test.only` probe. All probes were removed.

A detached, clean worktree completed `npm ci --prefer-offline` in **7.594s**
(14.232s CPU), using the existing npm download cache. This is a warm download
cache and fresh dependency tree, not a cold-network installation benchmark.

Reports are summarized in [ci-measurements.json](ci-measurements.json); local
command logs and traces are under `.artifacts/ci-audit/`. Instrumentation
regression tests cover command arguments, nonzero exits, missing executables,
stale reports and cancellation, including a child that exits zero on SIGTERM.


### Final correctness and scope

The final full `npm run verify` attempt during the CI-only changes (`2ad8bd2`) passed builds, lint, all type
checks, 56 unit tests and 34 registry tests, then reported 336/337 catalog cases
passing. It failed on a pre-existing 250ms timing race in the remaining catalog
test, before reaching admin. That failed invocation took 621.731s wall /
1159.442s process CPU and remains marked failed in the evidence.

Two narrow test repairs emerged from verification:

- The catalog metadata watcher may report an invalid input twice. Require an
  initial error and successful regenerated output after repair, without requiring
  exactly one watcher notification. All four tests in that file passed five
  consecutive runs. Removing initial watch registration as a temporary mutation
  made the retained recovery assertion fail; the mutation was restored.
- The preference-save test's pending-focus assertion raced the sample response:
  on a loaded machine the button had already become “Retry save”. Use Playwright's
  clock to hold the response pending, inspect focus, then advance the response.
  All existing focus, error, draft, policy, retry and completion assertions remain.
  All five tests in that file passed three repetitions (15 executions), in
  54.761s wall / 41.634s CPU. This was a known test-only scope, not graph-based
  affected-test selection.

After that last test edit, full lint and type checks passed again (16.011s wall /
30.943s CPU), and the full admin suite passed **63/63** across Chromium, Firefox
and WebKit (88.831s wall / 251.114s CPU), using isolated macOS Firefox app data.
Thus all **490 existing cases** have passing evidence across full-suite runs and
focused reruns. There was **not a single green end-to-end `npm run verify` after
the last test edit**; the failed full attempt is not relabeled as successful.
The final test-only edit did not change application code or any suite's selection.

`actionlint` and `git diff --check` passed. All three timing-wrapper regression
tests passed; both browser configurations rejected focused-test probes. No
required check was removed, no assertion was removed from the browser test,
and no CI retry or success exception was introduced.

The branch remains local and unpushed. No hosted workflow has been executed, so
Ubuntu behavior, cache hit rates, queue latency, allocated runner-minutes and
hosted p50/p95 are unverified. The first hosted run should validate the complete
`verify` job before making it required. Do not claim a full-pipeline speedup or
financial saving from the failed/noisy local comparisons. The verified benefits
are earlier lint/unit ordering, one fewer token build per complete verification,
retained coverage, and repair of two observed sources of wasted reruns.

## First hosted run

PR [#3](https://github.com/salexandr0s/evenkit/pull/3) ran the new Ubuntu job at
head `6946556` (GitHub's test merge `05cb2c6`).
[Run 44097290438](https://github.com/salexandr0s/evenkit/actions/runs/44097290438)
passed installation, timing-wrapper checks, lint, builds, types, unit and
registry tests, then failed one catalog assertion (336/337 passed). Admin
correctly did not run after that failure.

| Stage | Wall seconds | Process CPU seconds |
| --- | ---: | ---: |
| Dependency installation | 57.503 | 63.545 |
| Lint, package builds and unit tests | 18.074 | 35.856 |
| App builds and type checks | 37.773 | 91.985 |
| Registry tests | 29.779 | 39.461 |
| Browser installation | 47.804 | 45.928 |
| Catalog browser tests (failed) | 432.710 | 285.563 |

The attachment-width test assumed the user message would occupy more than 75%
of a 720px column. The message also has an intentional `65ch` prose cap: with
Linux's font metrics that cap is about 506px, below the asserted 540px. Selecting
Arial locally reproduces the exact failure. The assertion now measures the
font-relative prose cap and requires the message to fill its intended width,
`min(90% of the column, prose cap)`, within one pixel. The overflow, upload,
focus, download and image assertions remain. No application CSS changed, no
threshold was simply lowered, and no CI retry was added.

The repaired assertion passed the local Arial reproduction and both complete
rich-chat repetitions (12 cases). An isolated test-only CSS override removing
attachment `inline-size: 100%` made the new sizing assertion fail by 226.6px,
confirming the original shrinkage regression remains detected. Lint and all
type checks passed. Logs and the original hosted failure artifact are retained
under `.artifacts/security-release/`; a new full hosted run follows the repair.
