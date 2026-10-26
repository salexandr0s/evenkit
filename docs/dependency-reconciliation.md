# Dependency reconciliation

Compared with component-improvements `b588b1b`, the lockfile adds 162 third-party package entries plus two internal workspace links. Platform-specific optional packages count separately. `npm ls --all` passes. The registry tools select Ajv 8.20.0 (MIT), semver 7.8.5 (ISC) and the existing Zod 4.6.7 (MIT); ESLint retains its own nested Ajv 6 dependency.

## Runtime boundaries and notices

| Scope | New direct dependencies | Recorded licenses / notices |
| --- | --- | --- |
| Generic UI reporting | d3-shape 3.2.0; d3-path 3.1.0 transitively | ISC; package notices in `packages/ui/licenses/d3-*.txt`; @types/d3-shape 3.2.0 is development-only MIT |
| Generic UI rich chat | react-markdown 10.1.0, remark-gfm 4.0.1 | MIT/ISC dependency notices retained in `packages/ui/licenses/rich-chat-dependencies.txt` |
| Optional auth adapter | @supabase/ssr 0.12.7, @supabase/supabase-js 2.118.0, server-only 0.0.1, Zod 4.6.7 | MIT; notices retained in `packages/auth-next/licenses/` |
| Next starter / adapter peer | Next 16.4.3 | MIT; Next retains notices with its installed package. Next's optional Sharp 0.35.5 uses Apache-2.0, with platform libvips bundles declaring LGPL-3.0-or-later and combined licenses listed below. They are outside the generic UI tarball. |

New installed metadata also includes Apache-2.0 (@swc/helpers and browser mapping), CC-BY-4.0 (caniuse-lite), and BSD-3-Clause (fast-uri). Those dependency packages retain their own installed notices. No third-party notices are relicensed. Evenkit's original private source remains unlicensed for public distribution. Nothing was published or deployed in this task.

The UI manifest contains no Next, Supabase or server-only dependency. The auth adapter has explicit server/client subpaths and is installed only by the independent Next auth consumer. Registry metadata declares generic dependencies and UNLICENSED source ownership. Website, team, notification and document UI add no runtime dependencies.

## Resolved added lock entries

This table records declared package metadata, rather than a legal assessment or a claim that every optional platform binary was downloaded on macOS. Reproduce by comparing `package-lock.json` package keys with `git show b588b1b:package-lock.json`; local JSON is `.artifacts/admin-integration/dependency-additions.json`. All versions below come from the reconciled lockfile.

| Package | Version | Declared license | Optional / dev |
| --- | --- | --- | --- |
| @emnapi/runtime | 1.11.3 | MIT | optional |
| @img/colour | 1.1.0 | MIT | optional |
| @img/sharp-darwin-arm64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-darwin-x64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-freebsd-wasm32 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-libvips-darwin-arm64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-darwin-x64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-arm | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-arm64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-ppc64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-riscv64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-s390x | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linux-x64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linuxmusl-arm64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-libvips-linuxmusl-x64 | 1.3.4 | LGPL-3.0-or-later | optional |
| @img/sharp-linux-arm | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linux-arm64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linux-ppc64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linux-riscv64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linux-s390x | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linux-x64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linuxmusl-arm64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-linuxmusl-x64 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-wasm32 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later AND MIT | optional |
| @img/sharp-webcontainers-wasm32 | 0.35.5 | Apache-2.0 | optional |
| @img/sharp-win32-arm64 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | optional |
| @img/sharp-win32-ia32 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | optional |
| @img/sharp-win32-x64 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | optional |
| @next/env | 16.4.3 | MIT | runtime |
| @next/swc-darwin-arm64 | 16.4.3 | MIT | optional |
| @next/swc-darwin-x64 | 16.4.3 | MIT | optional |
| @next/swc-linux-arm64-gnu | 16.4.3 | MIT | optional |
| @next/swc-linux-arm64-musl | 16.4.3 | MIT | optional |
| @next/swc-linux-x64-gnu | 16.4.3 | MIT | optional |
| @next/swc-linux-x64-musl | 16.4.3 | MIT | optional |
| @next/swc-win32-arm64-msvc | 16.4.3 | MIT | optional |
| @next/swc-win32-x64-msvc | 16.4.3 | MIT | optional |
| @supabase/auth-js | 2.118.0 | MIT | runtime |
| @supabase/functions-js | 2.118.0 | MIT | runtime |
| @supabase/phoenix | 0.4.5 | MIT | runtime |
| @supabase/postgrest-js | 2.118.0 | MIT | runtime |
| @supabase/realtime-js | 2.118.0 | MIT | runtime |
| @supabase/ssr | 0.12.7 | MIT | runtime |
| @supabase/storage-js | 2.118.0 | MIT | runtime |
| @supabase/supabase-js | 2.118.0 | MIT | runtime |
| @swc/helpers | 0.5.23 | Apache-2.0 | runtime |
| @types/d3-path | 3.1.1 | MIT | dev |
| @types/d3-shape | 3.2.0 | MIT | dev |
| @types/debug | 4.1.13 | MIT | runtime |
| @types/estree-jsx | 1.0.5 | MIT | runtime |
| @types/hast | 3.0.5 | MIT | runtime |
| @types/mdast | 4.0.4 | MIT | runtime |
| @types/ms | 2.1.0 | MIT | runtime |
| @types/unist | 3.0.3 | MIT | runtime |
| @ungap/structured-clone | 1.4.0 | ISC | runtime |
| bail | 2.0.2 | MIT | runtime |
| baseline-browser-mapping | 2.11.33 | Apache-2.0 | runtime |
| caniuse-lite | 1.0.30001819 | CC-BY-4.0 | runtime |
| ccount | 2.0.1 | MIT | runtime |
| character-entities | 2.0.2 | MIT | runtime |
| character-entities-html4 | 2.1.0 | MIT | runtime |
| character-entities-legacy | 3.0.0 | MIT | runtime |
| character-reference-invalid | 2.0.1 | MIT | runtime |
| client-only | 0.0.1 | MIT | runtime |
| comma-separated-tokens | 2.0.3 | MIT | runtime |
| cookie | 1.1.1 | MIT | runtime |
| d3-path | 3.1.0 | ISC | runtime |
| d3-shape | 3.2.0 | ISC | runtime |
| decode-named-character-reference | 1.3.0 | MIT | runtime |
| dequal | 2.0.3 | MIT | runtime |
| devlop | 1.1.0 | MIT | runtime |
| ajv | 6.15.0 | MIT | dev |
| json-schema-traverse | 0.4.1 | MIT | dev |
| estree-util-is-identifier-name | 3.0.0 | MIT | runtime |
| extend | 3.0.2 | MIT | runtime |
| fast-uri | 3.1.9 | BSD-3-Clause | dev |
| hast-util-to-jsx-runtime | 2.3.6 | MIT | runtime |
| hast-util-whitespace | 3.0.0 | MIT | runtime |
| html-url-attributes | 3.0.1 | MIT | runtime |
| iceberg-js | 0.8.1 | MIT | runtime |
| inline-style-parser | 0.2.7 | MIT | runtime |
| is-alphabetical | 2.0.1 | MIT | runtime |
| is-alphanumerical | 2.0.1 | MIT | runtime |
| is-decimal | 2.0.1 | MIT | runtime |
| is-hexadecimal | 2.0.1 | MIT | runtime |
| is-plain-obj | 4.1.0 | MIT | runtime |
| longest-streak | 3.1.0 | MIT | runtime |
| markdown-table | 3.0.4 | MIT | runtime |
| mdast-util-find-and-replace | 3.0.4 | MIT | runtime |
| escape-string-regexp | 5.0.0 | MIT | runtime |
| mdast-util-from-markdown | 2.1.0 | MIT | runtime |
| mdast-util-gfm | 3.1.0 | MIT | runtime |
| mdast-util-gfm-autolink-literal | 2.0.1 | MIT | runtime |
| mdast-util-gfm-footnote | 2.1.0 | MIT | runtime |
| mdast-util-gfm-strikethrough | 2.0.1 | MIT | runtime |
| mdast-util-gfm-table | 2.0.0 | MIT | runtime |
| mdast-util-gfm-task-list-item | 2.0.0 | MIT | runtime |
| mdast-util-mdx-expression | 2.0.1 | MIT | runtime |
| mdast-util-mdx-jsx | 3.2.0 | MIT | runtime |
| mdast-util-mdxjs-esm | 2.0.1 | MIT | runtime |
| mdast-util-phrasing | 4.1.0 | MIT | runtime |
| mdast-util-to-hast | 13.2.1 | MIT | runtime |
| mdast-util-to-markdown | 2.2.0 | MIT | runtime |
| mdast-util-to-string | 4.0.0 | MIT | runtime |
| micromark | 4.0.3 | MIT | runtime |
| micromark-core-commonmark | 2.0.4 | MIT | runtime |
| micromark-extension-gfm | 3.0.0 | MIT | runtime |
| micromark-extension-gfm-autolink-literal | 2.1.0 | MIT | runtime |
| micromark-extension-gfm-footnote | 2.1.0 | MIT | runtime |
| micromark-extension-gfm-strikethrough | 2.1.0 | MIT | runtime |
| micromark-extension-gfm-table | 2.1.2 | MIT | runtime |
| micromark-extension-gfm-tagfilter | 2.0.0 | MIT | runtime |
| micromark-extension-gfm-task-list-item | 2.1.0 | MIT | runtime |
| micromark-factory-destination | 2.0.1 | MIT | runtime |
| micromark-factory-label | 2.0.1 | MIT | runtime |
| micromark-factory-space | 2.1.0 | MIT | runtime |
| micromark-factory-title | 2.0.1 | MIT | runtime |
| micromark-factory-whitespace | 2.0.1 | MIT | runtime |
| micromark-util-character | 2.1.1 | MIT | runtime |
| micromark-util-chunked | 2.0.1 | MIT | runtime |
| micromark-util-classify-character | 2.0.1 | MIT | runtime |
| micromark-util-combine-extensions | 2.0.1 | MIT | runtime |
| micromark-util-decode-numeric-character-reference | 2.0.2 | MIT | runtime |
| micromark-util-decode-string | 2.0.1 | MIT | runtime |
| micromark-util-edit-map | 1.0.0 | MIT | runtime |
| micromark-util-encode | 2.0.1 | MIT | runtime |
| micromark-util-html-tag-name | 2.0.1 | MIT | runtime |
| micromark-util-normalize-identifier | 2.0.1 | MIT | runtime |
| micromark-util-resolve-all | 2.0.1 | MIT | runtime |
| micromark-util-sanitize-uri | 2.0.1 | MIT | runtime |
| micromark-util-subtokenize | 2.1.0 | MIT | runtime |
| micromark-util-symbol | 2.0.1 | MIT | runtime |
| micromark-util-types | 2.0.3 | MIT | runtime |
| next | 16.4.3 | MIT | runtime |
| postcss | 8.5.23 | MIT | runtime |
| parse-entities | 4.0.2 | MIT | runtime |
| @types/unist | 2.0.11 | MIT | runtime |
| property-information | 7.2.0 | MIT | runtime |
| react-markdown | 10.1.0 | MIT | runtime |
| remark-gfm | 4.0.1 | MIT | runtime |
| remark-parse | 11.0.0 | MIT | runtime |
| remark-rehype | 11.1.2 | MIT | runtime |
| remark-stringify | 11.0.0 | MIT | runtime |
| require-from-string | 2.0.2 | MIT | dev |
| server-only | 0.0.1 | MIT | runtime |
| sharp | 0.35.5 | Apache-2.0 | optional |
| space-separated-tokens | 2.0.2 | MIT | runtime |
| stringify-entities | 4.0.4 | MIT | runtime |
| style-to-js | 1.1.21 | MIT | runtime |
| style-to-object | 1.0.14 | MIT | runtime |
| styled-jsx | 5.1.6 | MIT | runtime |
| trim-lines | 3.0.1 | MIT | runtime |
| trough | 2.2.0 | MIT | runtime |
| unified | 11.0.5 | MIT | runtime |
| unist-util-is | 6.0.1 | MIT | runtime |
| unist-util-position | 5.0.0 | MIT | runtime |
| unist-util-stringify-position | 4.0.0 | MIT | runtime |
| unist-util-visit | 5.2.0 | MIT | runtime |
| unist-util-visit-parents | 6.1.0 | MIT | runtime |
| vfile | 6.0.3 | MIT | runtime |
| vfile-message | 4.0.3 | MIT | runtime |
| zwitch | 2.0.4 | MIT | runtime |
