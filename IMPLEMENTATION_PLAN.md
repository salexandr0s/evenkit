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
