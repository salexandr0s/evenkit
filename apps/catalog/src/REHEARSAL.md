# Rehearsal: Evenkit live previews

Stageshow informs the composition of the existing interactive React examples. The homepage leads with the project form and gives the launch checklist a quieter supporting surface. Each catalog preview names a task and its result. Chat presents one conversation surface at a time through Embedded and Floating tabs.

Gold references: `stacked-cards` and `static-card` from the installed Stageshow skill. Both were rendered and filmed as stills. The homepage adopts their surface hierarchy and spacing while retaining complete, usable controls. Its compact layout removes the desktop stagger instead of shrinking the form. All colors, spacing, radii and shadows use Evenkit tokens.

## Actions and results

- Homepage: submit an empty name, correct the field, choose visibility, create the local project, then complete the checklist. Error and completion feedback stay visible.
- Catalog: read the entry's task, operate the corresponding live example, and inspect its result. Static reference entries invite a specific comparison.
- Chat: type in Embedded, switch to Floating, open the assistant, and return with the same conversation and draft. An independent check also switched during streaming and retained the message and Stop control.

## Captures and checks

Evidence lives in `.artifacts/stageshow-2026-11-02/` at the repository root.

- Homepage: 360, 390, 768, 1024 and 1440 CSS pixels, each in light and dark appearance. All ten documents fit their viewport.
- Homepage states: initial form, empty-name error and focused field, settled visibility menu, created-project feedback and completed checklist.
- Catalog: individual source and paired desktop-light/mobile-dark visual reviews for all 116 entries, plus an interaction or static presentation check for each.
- Chat: the existing 11 focused Chromium journeys pass, including draft continuity between presentations and absence of the launcher in Embedded.
- Host layout: Stageshow's `layout.mjs --strict` found no issues at 390 pixels, covering 16 controls and four padded containers. Independent visual review covered all ten homepage stills and the error, menu and payoff states.

The catalog capture harness hides its sticky host header only while photographing a preview, so the header does not obscure the subject after screenshot scrolling. It records page errors, document width, the rendered task and its accessible description. Portaled dialogs receive separate captures.

## Review decisions

The first desktop task capture showed its sentence sharing the title row. The header now uses a grid with the task spanning both columns. Corrected captures replace those earlier frames.

The mobile chat review showed the fixed launcher covering the embedded composer. The tab choice removes that overlap while keeping conversation, draft and response state above the presentation boundary. Independent source and browser review found no further issue.

The tooltip example retains its bottom reserve: open-state captures show the tooltip needs that space to remain clear of the next section.

## Limits

These are live controls without a Stageshow `Stage` or authored playback loop. Illustration crops, filler bars, fake cursors and loop-film gates do not describe this implementation. The upstream gold stills themselves reported `lopsided` and `uneven gutters` candidates; those reference captures are not host verification passes.

Checks use desktop Chromium and emulated viewport/media settings. Physical touch, screen-reader speech, Firefox and a full WebKit pass were not exercised. Reduced-motion stills do not establish animation frame-rate quality.
