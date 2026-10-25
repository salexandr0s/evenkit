# Selection controls and progress

Contracts recorded for B01–B06, B08 and G02 on 25 October 2026. These original kit wrappers use the existing semantic colors, control heights, icon sizes, focus rings and touch target tokens. They add no colors or size tokens.

| Family | Contract |
| --- | --- |
| Checkbox | Radix checkbox button with a forwarded button ref, `checked`/`defaultChecked` as boolean or `"indeterminate"`, `onCheckedChange`, native `name`/`value`/`form`/`required`/`disabled`, optional `label`, `hint`, `error`, external descriptions and `controlSize`. The inner visual box is 20px; the target follows the control height and reaches 44px on narrow/coarse-pointer screens. Mixed values submit as unchecked. |
| CheckboxGroup | Native fieldset/legend composition with label, hint, error and native disabled grouping. Each child Checkbox owns its value and checked state. Group validity rules belong to the application. |
| RadioGroup | Radix single-choice keyboard model with options `{ value, label, description?, disabled? }`, group label/hint/error, native form name/value/reset, orientation and controlled/uncontrolled value. Option values must be unique and nonempty. Disabled options are skipped. |
| Switch | Radix switch with label/hint/error and native form integration. `pending` keeps the control focusable, reports busy/unavailable state and prevents further activation; the application owns the persisted value and failed-save recovery. `disabled` retains native disabled behavior. |
| Toggle / ToggleGroup | Toggle exposes a pressed button. ToggleGroup uses Radix single/multiple pressed actions and roving focus. These are actions, not form inputs. Labels stay visible or are supplied by the host for icon-only actions. |
| SegmentedControl | RadioGroup selection in a compact segmented presentation. It selects a mode or value and submits a native form value; view panels remain application content, rather than tab panels. |
| ButtonGroup | A named ordinary action group with joined/spaced and horizontal/vertical presentation. Each button remains in normal Tab order. It does not claim toolbar semantics. Long labels wrap. |
| CopyAction | Real clipboard write on activation with persistent polite success/failure feedback and stable focus. Missing permission/API and rejected writes report failure. A host can inject `writeText`; newer attempts and text changes invalidate stale results, and unmount discards completion. |
| Progress / Meter | Native `progress` and `meter` with explicit associated label and text value. Progress permits an omitted value for indeterminate work. Meter describes a bounded measurement; low/high/optimum remain native inputs. Invalid progress bounds normalize to a positive default and nonfinite progress values become indeterminate. |

Controlled form values belong to the host. Radix sends reset changes through the supplied callbacks; an application that ignores a controlled reset callback keeps its value. Native reset works without host state for uncontrolled inputs. Required Checkbox means that individual choice is required; use application validation for “choose at least one.”

Required checkbox, radio and switch validation stays on Radix's native form inputs. The kit prevents those visually hidden inputs from receiving validation focus, associates their browser-localized validation message with the visible control, and focuses only the form's first invalid control. Hosts can supply their own `error` content. Segmented errors include a danger-colored group boundary.

Absent, false and empty-string host errors permit native validation feedback. An external controlled value correction, or a change that removes the native constraint, clears stale native feedback after the inputs become valid. A supplied host error remains visible until the host changes it.

The RadioGroup wrapper retains keyboard navigation intent until Radix's deferred roving-focus task runs. This avoids a quick key release clearing Radix 1.5.1's arrow flag before the new item receives focus. Pointer and non-navigation keys clear that intent; Radix still determines movement, direction, looping and disabled-option skipping.

## Selection presentation

Checkbox labels use medium weight, with hints aligned beneath the label and space between separate choices. Radio options use a quiet selected row boundary in addition to their checked indicator. Selected row styling is limited to radio options; labels and controls retain their native click targets.

The switch thumb travels inside a fixed track over the base motion duration. Travel derives from the track width, thumb width, padding and border tokens. The nearest explicit `dir="ltr"` or `dir="rtl"` context sets its direction, including nested overrides, through an inherited private CSS variable. This avoids the production build's language-based lowering of `:dir()`. A pending save shows a small spinner inside the thumb without changing control geometry or focus. Reduced motion removes thumb transitions and spinner rotation.

Toggle actions have individual outlines and pressed fills. Segmented choices share a recessed track, balanced widths and a raised selected surface. The catalog applies formatting toggles to a note and switches the project presentation between list and cards.

Joined button groups share one border at each seam and raise hovered or focused buttons above their neighbours. Horizontal groups keep labels wrapped within a single row on larger screens and stack below 640px, with logical corners preserved. Spaced groups retain their normal wrapping behavior and every action stays in Tab order.

Copy feedback occupies a reserved line beneath the action and grows when a message wraps. Success and failure pair text with decorative icons; copying replaces the action icon with a spinner. The button label, focus and stale-result guards remain stable. The catalog places the source value beside the action, then stacks them on narrow screens.

Progress keeps its native element, label, ref and value semantics inside a clipped visual track. Unknown totals show a moving partial segment instead of a filled bar. The nearest explicit direction context controls travel; a `dir` prop also reaches the track, including nested overrides. Reduced motion leaves a centered stationary segment. Completed work has a decorative check and defaults to “100% complete”; supplied `valueText` is preserved. Meter remains a native bounded measurement with its low/high/optimum inputs unchanged. Label and value rows wrap when space is limited.

The examples expose mixed/disabled choices, form serialization/reset, disabled-option keyboard skipping, a failed preference save and retry, pressed actions, copy success/failure/retry, and determinate/indeterminate progress. The preparation example advances four fictional files and keeps workspace capacity separate. No provider or persistence is included.

Import `@project-kit/tokens/css`, then `@project-kit/ui/css`. Controls are exported from `@project-kit/ui`; recipes and complete snippets are in the corresponding catalog entries.

Behavior sources are pinned Radix [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox), [RadioGroup](https://www.radix-ui.com/primitives/docs/components/radio-group), [Switch](https://www.radix-ui.com/primitives/docs/components/switch), and [ToggleGroup](https://www.radix-ui.com/primitives/docs/components/toggle-group). Those packages retain their MIT notices. Kit markup and CSS are original. The local catalog is the initial example consumer; maturity remains pilot until adoption and documented compatibility checks are complete.

Verification is recorded by the root integration pass. Focused scenarios live in `tests/browser/selection-controls.spec.ts`; browser execution is serialized with the other new modules.
