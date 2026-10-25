# Website blocks

P01–P06 and P10 are editable React source under [registry/blocks/website](../registry/blocks/website/). Copy the directory into your application, including its CSS and declaration files. The blocks import maintained components from `@evenkit/ui`; they are not package exports.

| Inventory | Source | Catalog |
| --- | --- | --- |
| P01 | `site-shell.tsx` | `/#website-shell` |
| P02 | `hero.tsx` | `/#website-heroes` |
| P03 | `feature-sections.tsx` | `/#website-features` |
| P04 | `call-to-action.tsx` | `/#website-cta` |
| P05 | `faq-section.tsx` | `/#website-faq` |
| P06 | `contact-form.tsx`, `newsletter-form.tsx` | `/#website-forms` |
| P10 | `article-layout.tsx` | `/#website-article` |

## Start with a complete example

[examples.tsx](../registry/blocks/website/examples.tsx) contains `WebsiteExample`, a complete website, and `ArticleExample`, a document. Smaller exports show each composition separately. Paper Observatory, its services, newsletter and specimen illustration are fictional demonstration content. Replace them with your own approved content and assets.

Load the package styles once in the application entry point. Each block imports its own website stylesheet after them. Vite and Next consumers use TypeScript's Bundler resolution; keep the CSS declaration sidecars when copying. Build and install the local packages as described in the repository README.

```tsx
"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { WebsiteExample, type ExampleHandlers } from "./website/examples";

export function WebsitePage({ onContact, onNewsletter }: ExampleHandlers) {
  return <WebsiteExample onContact={onContact} onNewsletter={onNewsletter} />;
}
```

Pass handlers from a client component. A Next Server Component cannot pass an ordinary function across the client boundary; define the handler in the client entry or use the application's supported server-action boundary. The examples make no network requests. The catalog alone supplies a local delay and a failure switch.

## Content and layout contracts

`WebsiteHeader` passes Navbar props through, including its router adapter, active item, mobile labels, contact action and direction. Its required `contentId` must name the page's `main` with `tabIndex={-1}`. Navbar renders the header landmark itself. `WebsiteFooter` accepts navigation groups, a link renderer, and slots for brand, contact details, locale controls, legal links and notes. It supplies no production policies.

`Hero` accepts `title`, `description`, `eyebrow`, `actions` and `media`, with `variant="text"` or `"media"`. Use one `h1` per page; set `headingAs` for embedded introductions. Compose media with the kit's `Image`, a captioned figure, or an accessible host player. Image alternatives, aspect ratio, loading strategy, sources, rights and captions belong to the application.

`FeatureSection` accepts `items` and `presentation="grid"` or `"list"`. `AlternatingSections` accepts text/media items. Both keep the text first in DOM order and derive child headings from the section heading. `CallToAction` accepts one `primaryAction` and an optional `secondaryAction`; use links for navigation and buttons for actions. The feature data and action slots can describe actual service differences without introducing pricing logic or invented claims.

`FaqSection` composes the kit's multiple-expansion Accordion. Supply stable unique item IDs and questions with answers. The question heading follows `headingAs` unless `questionHeadingAs` is supplied. Preserve a coherent page hierarchy when changing either.

`ArticleLayout` accepts a title, introduction, metadata, media, sections and related content. Each section has a unique URL-safe `id`, title and React content. Supply a stable page `id` for shareable anchors; generated IDs suit repeated embedded examples. Section targets are namespaced separately from the article title and receive focus on ordinary contents-link activation. Native anchors preserve modified-click and browser history behavior. The catalog intercepts its own example anchors because its route is already stored in the hash.

`ArticleCode` renders plain text in a named, keyboard-focusable scroll region. It uses `dir="ltr"` for code even in RTL documents. It does not inject HTML, parse Markdown, highlight syntax, or infer an active contents item. Supply semantic `<time dateTime="...">` elements and localized dates in metadata.

## Form submission and recovery

Both forms accept `heading`, `description`, `headingAs`, `onSubmit`, optional `consent`, and a partial `messages` dictionary. Contact collects required name, email and message plus optional organization. Newsletter collects email. Each instance generates separate control, error and label IDs; an explicit `id` must be unique on the page.

The handler receives normalized values and `{ signal: AbortSignal }`. Contact values contain `name`, `email`, `organization`, `message` and `consent`; newsletter values contain `email` and `consent`. Consent is `null` when the form asks no consent question, `false` when an optional checkbox is unchecked, and `true` when checked. The host supplies `label`, `required`, `errorMessage` and optional `hint`; the checkbox starts unchecked.

Validation focuses a linked error summary. Correcting a field clears its local error without moving focus. A pending request disables the fields and guards against repeated submission. A rejected handler preserves all answers, focuses safe failure feedback, and exposes a retry action. Provider exception text is not displayed. A resolved handler shows the sent acknowledgement and a deliberate start-again action. Starting again clears the values and focuses the first field.

Only resolve after the server confirms acceptance. Applications own server validation, consent records, subscription confirmation, duplicate-request policy and abuse prevention. The block does not assume that a successful subscription is already confirmed; set `messages.sentHeading` and `messages.sent` to describe your actual outcome.

Unmounting aborts the signal and ignores late results, including handlers that ignore cancellation. Remount with a new React `key` when the tenant, endpoint or submission context changes. Aborting the browser request does not promise that a server operation was rolled back. The draft remains in component memory only; persistence is application-owned.

Every field label, required/optional cue, validation string and feedback message can be replaced through `messages`. Consent text and error messages are supplied separately. Translate all of them together and set the document's language and direction. The demo's long German strings exercise wrapping; its RTL switch exercises layout direction without claiming a complete translation.

## Visual and accessibility contracts

Apply theme and mode on `document.documentElement` so Navbar's dialog portal inherits them. The website styles use existing `--pk-` typography, spacing, neutral surfaces, theme accents and focus tokens. Container queries adapt compositions to embedded widths; logical spacing supports RTL. Layout changes add no animation. Accordion, Navbar, Image and buttons retain the kit's motion and reduced-motion behavior.

Keep a single host main landmark. The catalog's shell example uses an embedded focus target and headings below the catalog title. Production examples use a main landmark and a page heading. Native footer details, contents links, form recovery and code regions remain keyboard accessible. Host content and custom action/media slots must maintain these contracts.

## Verification

Run the following after building the packages:

```sh
npm run build
npm run typecheck
npm run lint
npm run verify:examples
KIT_CATALOG_PORT=5428 npx playwright test tests/browser/website-blocks.spec.ts
node scripts/verify-website-blocks.mjs
```

The copied-example checker compiles all catalog snippets with the source directory and checks one mapping per inventory ID. The website consumer script packs the local packages, copies only website source into temporary Vite and Next applications, builds them and checks the rendered compositions and styles. It cleans its own temporary directories and servers. Focused browser checks cover interaction, recovery, heading structure, mobile widths, long strings, RTL, themes, modes and reduced motion. See the session handoff for results and any remaining limitations.

Provenance is recorded in [the website source directory](../registry/blocks/website/PROVENANCE.md).
