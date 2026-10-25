# Rich chat rendering decision

Evaluated on 25 October 2026 for N01 and H07. The npm registry reported `react-markdown` 10.1.0 and `remark-gfm` 4.0.1; both are pinned runtime dependencies with MIT licenses. Their release tags and published package metadata provide the version provenance. License copies ship in the UI package.

| Candidate | Official documentation | Decision |
| --- | --- | --- |
| react-markdown 10.1.0 | [Architecture and security](https://github.com/remarkjs/react-markdown/tree/10.1.0#security) | Selected. Builds React elements from a syntax tree and supports replacing code/table elements with existing Evenkit controls. Raw HTML is escaped by default. |
| remark-gfm 4.0.1 | [Supported syntax](https://github.com/remarkjs/remark-gfm/tree/4.0.1#what-is-this) | Selected. Adds tables, autolinks, task lists, strikethrough and footnotes to the fixed Markdown pipeline. |
| Marked | [Official usage and security warning](https://marked.js.org/#usage) | Not selected. Its HTML output requires a separate sanitization boundary and React integration. |
| markdown-it | [Official documentation](https://markdown-it.github.io/markdown-it/) | Not selected. Supports CommonMark and extensions, but an additional adapter is needed to map tokens into React controls. |

The selected packages have published releases, documented security guidance and upstream compatibility policies. These are dependency choices for this implementation, not a performance benchmark or a guarantee about future maintenance.

## Rendering boundary

`ChatMarkdown` exposes content, labels and ordinary wrapper attributes. It does not expose parser plugins, component overrides, HTML rendering or arbitrary syntax grammars. React escapes HTML text. Markdown image syntax renders its alt text with an omitted-image label; it cannot trigger a remote request. Applications supply permitted attachment previews through `ChatAttachment` instead.

Navigation allows HTTP, HTTPS, mailto and relative paths. Empty URLs, unknown schemes, controls, backslashes, malformed HTTP URLs and protocol-relative URLs produce plain text instead of a link. Attachment URLs use a separate validator that accepts HTTP, HTTPS, relative paths and app-supplied blob URLs, but excludes mailto. URL validation does not grant access or verify a destination; applications own attachment permissions and source data.

Code is ordinary text inside `pre`/`code`, with the existing `CopyAction` providing clipboard success and failure feedback. Language labels are text and cannot load code. Code and table regions are keyboard focusable and scroll horizontally within the message. Markdown footnote IDs and their accessible descriptions are namespaced per renderer instance.

## HTML and highlighting review

[`rehype-raw`](https://github.com/rehypejs/rehype-raw#security) parses embedded HTML and would widen this boundary. It is excluded. If a future feature requires HTML, it needs a separate sanitization design, an explicit allowed-element/attribute policy and regression tests before activation.

[`rehype-highlight`](https://github.com/rehypejs/rehype-highlight#security) transforms code into styled nodes. It is excluded because highlighting is optional for H07. A future integration must review its grammar dependencies, generated nodes and class names, sanitization order, language allowlist, theme contrast and bundle cost. No HTML or highlighting plugin is installed by this change.

## Streaming

Each update renders the content available so far. Incomplete link syntax remains visible; GFM can still turn a URL within it into an autolink. An unfinished fenced block renders as code. The renderer does not manufacture closing syntax or discard an unfinished tail. Stable component identities preserve controls within an existing block across streaming updates. The host should retain message IDs; the existing chat owns scroll-follow intent and final response announcements. New content can reclassify Markdown as its syntax becomes complete, so applications should throttle updates for very large responses and enforce their own message-size limits.

## Verification boundaries

Focused tests exercise hostile HTML and links, URL validation, incomplete syntax, semantic code/table output and duplicate footnotes across messages. Browser checks in the rich-chat journey cover real keyboard/copy behavior and contained overflow. This renderer does not display private model reasoning or manage transport, storage or provider credentials.
