# CI audit and rollout

Audit date: 2026-11-17. Local baseline: `bf1ca9f5afea1abc90a688ef4f1cfb025cab77d6`.

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
