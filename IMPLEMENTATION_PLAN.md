# Foundation phase

The user approved this phase on 25 October 2026. The parent plan is `/Users/nationalbank/project-kit-review-2026-10-25/README.md`.

Build only tokens, basic controls, and a component catalog. Authentication services, admin shells, tables, storage, and existing-project migrations are later phases.

| Work area | Owner | Completion check |
|---|---|---|
| Root configuration, docs, packaged consumers, integration | Root agent | Fresh package installation in Next and Vite; checks and handoff recorded |
| `packages/tokens` | Tokens coder | Two validated themes, light/dark/system modes, deterministic CSS/JSON output, accessible semantic color pairs |
| `packages/ui` | Controls coder | Framework-independent controls, prefixed CSS, keyboard and feedback states, explicit client exports |
| `apps/catalog` | Catalog coder | Searchable examples, theme and mode selection, live controls, usage and provenance |
| Architecture and implementation review | Review agents | Resolve concrete defects before completion |

Package names are `@project-kit/tokens`, `@project-kit/ui`, and `@project-kit/catalog`, initially at version 0.1.0. Core packages export built artifacts; the catalog consumes their public exports. Use strict TypeScript and npm workspaces. Ship ordinary CSS with the controls so existing Tailwind 3, Tailwind 4, and plain-CSS apps do not need the same build setup.

Tokens use the prefix `--pk-`. Document-level attributes are `data-kit-theme="neutral|grove"` and `data-kit-mode="light|dark"`; omitting the mode follows the system. Preserve the inherited palette, but validate semantic foreground/background pairs and control borders before use. Package styles must not reset unrelated application elements.

The user subsequently requested custom dropdowns with chevrons inset from the right edge. Select therefore uses kit-styled Radix behavior rather than the initially proposed native dropdown. Apply it consistently to catalog preferences and reusable form controls, with keyboard/focus and popup positioning checks.

The root agent coordinates interface changes in the shared task list. Each coder owns only its assigned directory and must preserve others' edits. Build and inspect each subsystem, integrate, run the meaningful browser and package-consumption checks, review fixes, and commit the completed phase locally. No publication or deployment is part of this phase.

# Admin shell, tables, and icons

The user approved this phase on 25 October 2026 and requested a goal for its completion. Extend the existing packages and catalog. Reduce dropdown row heights by correcting their box sizing; use 36px desktop options and retain 44px touch targets.

| Work area | Owner | Completion check |
|---|---|---|
| Token extensions | Tokens coder | Icon sizes and stroke, option height, header heights, and table densities generate correctly |
| Icons and control density | Controls coder | Named Lucide wrappers, consistent accessible labels, compact dropdowns and inset chevrons |
| Admin shell | Shell coder | Configurable navigation and slots, router boundary, skip link, mobile drawer and focus recovery |
| Reusable table | Tables coder | TanStack-backed client sorting, search, pagination, stable selection, loading/error/empty states |
| Component catalog | Catalog coder | Working shell, table, and searchable icon examples with public API usage |
| Integration and review | Root and reviewer | Browser interactions, narrow layouts, packed Next/Vite consumers, docs, handoff, local commit |

Use `lucide-react` 1.61.0 and `@tanstack/react-table` 9.3.1 through `@project-kit/ui`. Import icons statically and export named wrappers; avoid a runtime registry that includes every icon. Table data is supplied by its consumer, with mandatory stable row IDs. The kit owns presentation and client table behavior; applications own fetching, authorization, routing, and persistence.

Shell and table styles live in separate prefixed source files, combined into the existing UI stylesheet at build time. Keep the two-package installation contract. The catalog is a local demonstration, and the packages remain unpublished pilots. This phase does not migrate existing products or provide authentication services.

Completed as a local pilot: eleven catalog entries, 31 icons, compact dropdown options, container-responsive shell, and client data table. Build, strict type checks, lint, token tests, nine browser journeys, and independent packed Next/Vite consumers were verified. Review fixes covered numeric alignment and the embedded skip link. See `SESSION_HANDOFF.md` for exact verification state and remaining product-adoption work.
