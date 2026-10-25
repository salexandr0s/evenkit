# Editable website blocks

Copy this directory, including CSS and declaration files, into a React application using the local Evenkit packages. Load `@evenkit/tokens/css` and `@evenkit/ui/css` before rendering a block. Source modules import their own website styles.

Start with `WebsiteExample` or `ArticleExample` in [examples.tsx](./examples.tsx). Supply contact and newsletter handlers to `WebsiteExample`; each receives values and an abort signal. Replace the fictional content, illustration, routes and consent wording before adoption.

Import individual blocks directly when composing another page. They are editable application source, with no new exports in `@evenkit/ui`.

See [the adoption guide](../../../docs/website-blocks.md) for API contracts, keyboard behavior, heading levels, localization, form recovery and verification. [PROVENANCE.md](./PROVENANCE.md) records code and artwork origins.
