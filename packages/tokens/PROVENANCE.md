# Token provenance

The base scales and complete palette derive from the workspace's Apple Minimal Tokens contract, ID `tokens.apple-minimal.v1`, version `1.0.0`, updated 10 March 2026. The reviewed source file SHA-256 is `762bc8068bca72494f58164871f8488c589e19940ee1431c30a267ceeec3a4d3`. Its project-relative location is `ai-config/claude/uiux-contract/design_tokens.json` in the workspace. No build-time access to that repository is required.

The inherited contract is internal source material. Package metadata remains `UNLICENSED`; this package has not been granted a public distribution license. It contains no external fonts, logos, photography, or client branding.

## Resolved values and changes

- `src/foundation.ts` preserves the inherited scale and palette values. References in the original contract were resolved during extraction; runtime token aliases are not supported.
- White text on the inherited blue-500 and red-500 action colors fails the required 4.5:1 contrast threshold. The light themes use darker action colors and explicit `on-accent`/`on-danger` values. Dark themes use lighter action colors with dark foregrounds.
- Decorative borders remain subtle. `border-strong` is a separate control boundary checked against the background and surfaces at 3:1 or greater.
- Every built-in theme checks normal and muted text, link/action text, status text, action/hover foregrounds, focus rings, and control boundaries against their specified surfaces.
- Grove is a fictional theme composed from the inherited green and neutral palettes. It introduces no real client identity.
- Kit additions are layout widths for sidebar/content/reading/form/dialog, a 44px touch target, a 20px icon, a 16px spinner, 800ms spinner duration, disabled/skeleton opacity, and a 65ch prose width. Layout values become explicit tokens rather than control-local constants.
- The popover layer is 85, above modal content at 80 and below toast feedback at 90. This lets portalled dropdowns remain visible when opened from a dialog without changing the inherited dropdown layer.
- The admin foundation adds icon sizes of 16/20/24px with a unitless stroke width of 2, header heights of 56px (desktop) and 52px (mobile), a 36px dropdown option height, and compact/default table row heights of 36/44px. The compact dropdown and table values reflect the user's density feedback. Existing control heights (32/40/48px), the 44px touch target, and 260px sidebar remain unchanged.

Semantic colors, typography overrides, and radius overrides are emitted from the typed source and validation layer. CSS and JSON are generated artifacts and should not be edited directly.
