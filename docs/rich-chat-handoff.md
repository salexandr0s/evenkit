# Rich chat handoff

Completed on 25 October 2026. Status: **DONE**.

The follow-up [design pass](./rich-chat-design-pass.md) was completed on 26 October 2026 in commit `05d0ce0`. It records the updated presentation and verification evidence.

Worktree: `/Users/nationalbank/.codex/worktrees/rich-chat/design-tokens`.
Branch: `codex/rich-chat`.
Base: `b588b1b1964ba2b26ee8453606f354f2c33eb10d`, the latest local `codex/component-improvements` when this worktree was created. The fetched remote branch was seven commits behind that local branch. The original checkout and other agents' worktrees were preserved.

## Commits

| Commit | Content |
| --- | --- |
| `64f3196` | Safe Markdown, reusable code blocks, message/composer attachments, citations, integration types, styles, unit tests, dependencies and license notices. |
| `363f84b` | Catalog example, working copied source, documentation, inventory mappings, browser journeys and packed-consumer checks. |
| `7b16451` | Initial verification and handoff record. |
| `05d0ce0` | Rich content/composer design pass and extended short-window recovery coverage. |

Apply these commits in order when integrating, followed by the latest documentation commit. Nothing was pushed, published or deployed; no production provider was connected.

## Delivered behavior

N01 uses opt-in `ChatMessage.format: "markdown"`; default plain text and the existing `renderMessage` override remain compatible. Headings, lists, links, tables, inline code and fenced code render through pinned `react-markdown` 10.1.0 and `remark-gfm` 4.0.1. Raw HTML stays escaped text, links pass protocol validation and Markdown images do not fetch remote content. HTML and highlighting plugins are excluded. The [dependency evaluation](./rich-chat-rendering-research.md) records official sources, alternatives and the plugin review. The UI package includes MIT/ISC notices for all 98 newly introduced packages.

H07 exports `CodeBlock` with a language label, named keyboard scroll region and the existing `CopyAction` success/failure feedback. Incomplete Markdown remains visible while content streams; stable renderer identities preserve focused controls within an existing block. Existing scroll-follow intent, jump-to-latest, IME handling, stop/retry and draft focus remain covered by the original chat journeys.

N02 composes the existing upload queue, file rows and thumbnails. Pending, failed and cancelled files block sending until recovered or removed. Completed attachments support an empty text draft without changing `onSend(message: string)`. Applications snapshot the queue into message records and own transport, storage, permissions and URL lifetimes. Files have previews, progress, individual cancellation/retry/removal and unavailable states. File messages use the available message width, including attachment-only sends.

N03 exports numbered source lists with titles, validated links, keyboard previews and unavailable states. Preview text is supplied by the application and never fetched by the kit. Source popovers retain panel RTL, scroll by keyboard and dismiss before the enclosing widget. No private model-reasoning display was added.

The [usage guide](./rich-chat.md) contains working code. The catalog's `#rich-chat` route demonstrates panel and widget layouts, local uploads and failures, streaming, citations and code overflow. Its copied code is generated from the live example and checked for drift. Demo URL ownership bridges upload-result publication and message acceptance; sent URLs remain alive until the append-only demo unmounts.

## Verification evidence

Evidence is local under `.artifacts/rich-chat/` in the worktree. These ignored logs and images are retained locally; the commands below reproduce them after integration.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run build` | Passed for tokens, UI and catalog | `build-final.log` |
| `npm run typecheck` | Passed configured checks and all workspaces | `typecheck-final.log` |
| `npm run lint` | Passed full repository ESLint | `lint-final.log` |
| `npm test` | 32 tests passed across six files, including nine rich-chat boundary tests | `unit-final.log` |
| Focused Playwright | 11 Chromium journeys passed: five rich-chat, four existing chat, two catalog-sidebar | `browser-final.log` |
| Layout/modes | 128 theme/mode/direction/width combinations; all eight themes in light/dark and both system preferences; 360/768/1024/1440 widths; reduced motion and short widget viewport | `browser-final.log`, `tests/browser/rich-chat.spec.ts` |
| `npm run verify:examples` | 87 copied examples compile; 76 inventory mappings and source drift check pass | `examples-final.log` |
| `npm run verify:packages` | Independent packed Vite and Next production builds, HTTP 200, styles and rich-chat SSR pass; temporary resources cleaned | `packages-final.log`, `.artifacts/package-verification.json` |
| Visual review | Light/dark, narrow RTL, short dialog and sent attachments inspected; no runtime errors in capture session | `desktop-light.png`, `desktop-dark.png`, `narrow-panel.png`, `short-dialog.png`, `sent-attachments.png`, `sent-attachments-narrow.png`, `visual.json` |
| Source review | Independent review completed; findings fixed | RTL preview inheritance, preview keyboard scrolling, footnote IDs, empty attachment bubble, upload-result URL filtering |

`verification-inputs.json` records SHA-256 hashes for the 35 changed implementation/example/documentation files at `363f84b`. Verification fixes addressed a missing test tooltip provider, raw-source import compatibility, a corrupt sample PNG, premature demo URL cleanup, and attachment-only width collapse. Each was fixed and the affected checks passed afterward. The final log names above identify the completed checks.

Firefox, Safari, physical mobile keyboards and assistive-technology sessions were not tested. Large-response performance was not benchmarked; hosts should bound content size and update frequency. HTML rendering and highlighting remain excluded by design. There is no required work left in the requested scope.

## Integration notes

Shared integration files are `packages/ui/src/index.ts`, `packages/ui/scripts/copy-styles.mjs`, `packages/ui/package.json`, the lockfile, `apps/catalog/src/catalog.tsx`, `catalog-data.ts`, `docs/component-inventory.md`, and the package/example verification scripts. Preserve concurrent additions when merging these files. Combine dependency declarations and regenerate the lockfile rather than replacing other agents' dependencies. Add N01/N02/N03/H07 to the combined inventory mapping count.

The existing chat changes are confined to `chat-types.ts`, `chat-messages.tsx`, `chat-composer.tsx` and `chat.tsx`. Public additions are optional. Existing shared upload, image, overlay and feedback implementations were reused without modification.

```sh
cd /Users/nationalbank/.codex/worktrees/rich-chat/design-tokens
git status --short
git log -3 --oneline
npm run build
npm run typecheck
npm run lint
npm test
KIT_CATALOG_PORT=5387 npx playwright test tests/browser/rich-chat.spec.ts tests/browser/chat.spec.ts tests/browser/catalog-sidebar.spec.ts
npm run verify:examples
npm run verify:packages
```

After editing the live example, run `node scripts/generate-rich-chat-example.mjs`. After building packages, run `npm run dev --workspace @evenkit/catalog -- --port 5388 --strictPort` for a local preview and open `http://127.0.0.1:5388/#rich-chat`. The verification preview on 5388 was stopped; existing servers in other worktrees were preserved.
