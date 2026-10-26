# Rich chat design pass

Completed on 26 October 2026. Status: **DONE**. Implementation commit: `05d0ce0d5715b0058fd992aee6361c6789bb5adf` on `codex/rich-chat`.

The pass gives rich content a clearer reading hierarchy within Evenkit's existing token system. It uses the existing palette, type families, spacing, borders and controls across all eight themes. No dependency or license changes were needed.

## Changes and decisions

- Markdown has more deliberate paragraph, heading and list spacing, differentiated table headers, contained scrolling and a quieter inline-code treatment.
- Code blocks separate the language/control header from the scrolling code surface. An icon copy button has an accessible name and tooltip. Copying, success and failure feedback occupy the label cell; translated messages reserve their required space so copying does not change block height. At a 260px block width, the default header remains 61px in idle, failure and copied states, with a 44px copy target.
- Sources have numbered reference rows, domain metadata derived from validated HTTP(S) URLs, clear unavailable states and quieter preview controls. Popovers separate title, excerpt and footer. The kit does not request source contents or domain assets.
- Message attachments have distinct file surfaces and smaller metadata. Explicit list roles retain list semantics when markers are removed.
- Uploads and the message field share one composer boundary. A visible outer focus ring identifies the draft field. Uploads retain their own bounded scroll area, native file-picker focus, progress and individual recovery actions. The default empty upload-summary sentence is omitted; a supplied `emptyMessage` still takes precedence.
- The catalog puts the conversation beneath a compact introduction, groups recovery/layout controls beneath it and explains the standalone code specimen. Copied source is regenerated from the working example.

Public APIs, plain-text defaults, the safe rendering boundary, streaming, scroll intent, draft focus and application ownership of transport/storage/permissions remain covered by behavior checks. Existing uploads, overlays, tooltips and copy feedback are reused.

## Verification

Logs are retained locally in `.artifacts/rich-chat/`:

| Check | Result | Evidence |
| --- | --- | --- |
| Production build | Tokens, UI and catalog passed | `design-build.log` |
| Configured typecheck and ESLint | Passed; the final test extension also passed focused ESLint | `design-typecheck.log`, `design-lint.log` |
| Unit tests | 32 passed across six files | `design-unit.log` |
| Rich/plain chat Chromium journeys | Nine passed, including link/copy feedback, per-file failures, keyboard previews, RTL, streaming and scroll/focus behavior | `design-browser.log` |
| Extended layout journey | Passed with 128 theme/mode/direction/width combinations, system modes, reduced motion, long code/table scrolling and a 360×320 widget containing failed files and a multiline draft | `design-short-check.log` |
| Copied examples | 87 examples and 76 mappings passed, including source drift detection | `design-examples.log` |
| Packed consumers | Independent Vite and Next builds and stylesheet/HTTP checks passed | `design-packages.log` |

Final visual evidence is in `.artifacts/rich-chat-design/`: `desktop-light.png`, `desktop-dark.png`, `prose-light.png`, `prose-dark.png`, `source-preview.png`, `narrow-rtl-dark.png`, `short-widget.png` and `short-widget-recovery.png`. `visual-review.json` records no runtime errors during capture. `code-header-geometry.json` and `code-error-light-260.png` / `code-error-dark-260.png` record narrow copy-feedback geometry. The capture script is retained alongside those files. These artifacts are ignored by Git.

Visual inspection covered light/dark reading and reference views, narrow RTL, code-copy failures and short-window recovery. Source review and code-feedback geometry received independent checks. The final broad reviewer stopped because its model was at capacity; the primary agent completed inspection of the final captures.

Firefox, Safari, physical mobile keyboards and assistive-technology sessions were not tested. Large-response performance was not benchmarked. No required implementation work remains. Nothing was published or deployed.

## Resume

```sh
cd /Users/nationalbank/.codex/worktrees/rich-chat/design-tokens
git status --short
git log -5 --oneline
npm run preview --workspace @evenkit/catalog -- --port 5388 --strictPort
```

Open `http://127.0.0.1:5388/#rich-chat`. The implementation handoff and complete usage guide remain in `docs/rich-chat-handoff.md` and `docs/rich-chat.md`. Preserve other agents' changes when integrating this branch.
