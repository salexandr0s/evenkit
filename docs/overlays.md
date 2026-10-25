# Menus, overlays, and transient feedback

Contracts prepared on 25 October 2026 for F01–F04, G01, and M01. Owner: Project kit. Maturity: pilot. The catalog's fictional project examples are the first consumers. Generic UI does not perform authentication, persistence, or network requests.

## Component contracts

| Inventory ID | Public family | Contract |
| --- | --- | --- |
| F01 | DropdownMenu | Radix root/trigger/content plus item, group, label, separator, checkbox/radio items, and submenu parts. Items wrap long labels, use 36px minimum desktop rows and 44px touch targets, and retain native refs/events. Destructive styling supplements an explicit action label. Direction belongs on the root. |
| F02 | Popover | Radix focus/dismissal behavior with trigger, anchor, named content, title/description, and close. Content stays inside the viewport and uses the popover layer above dialogs. Interactive content needs a meaningful title or accessible name. |
| F03 | AlertDialog | Radix critical-confirmation behavior. Cancel receives initial focus, outside interaction does not dismiss, and Escape/cancel restore trigger focus. Async actions prevent the primitive's default close; the host closes only after success and keeps errors in the dialog. |
| F04 | Sheet | Existing Dialog behavior with logical start/end placement and full-height scrolling body. Header/footer and close reuse Dialog parts. It retains modal focus, close behavior, native content props, and document-level theme inheritance. |
| G01 | ToastProvider/useToast | At most three current notices. Radix handles announcement, swipe, paused expiry during focus/hover, and the F8 viewport shortcut. A changed scopeKey or container clears notices without remounting children; stale callbacks cannot add notices to a later scope, even after returning to the same key. Dismissal/eviction restores focus when the disappearing notice owned it. Unmount clears owned notices and timers. |
| M01 | AccountMenu | Host-supplied identity, navigation links, optional appearance preference, sign-out callback and pending/error feedback. Links remain native anchors. Appearance and sign-out callbacks do not change provider state themselves. The menu remains open for sign-out feedback until its host changes context or closes it. |

All surfaces use existing semantic foreground/surface colors, shared borders/radii/shadows, and the current `--pk-` control/motion tokens. The inherited menu/toast contracts supply explicit `layout.menuMin`, `layout.menuMax`, `layout.toast`, and `feedback.toastDuration` token additions. Layout uses logical properties and growing content; reduced motion removes entrance animation. CSS is scoped and installs no reset.

Menu/popover entrances use a defined `pk-overlay-in` opacity animation only in the open state. Closed content has no animation, so the primitive can unmount it and restore focus immediately. This prevents an unresolved or stale animation name from keeping dismissed portals mounted.

## Composition and ownership

Import token CSS before UI CSS. Roots support controlled and uncontrolled open state. Content wrappers include their own portal and accept `container`; use a container in the current modal for modal-local notifications and their announcements. Document-level theme attributes remain the supported general portal setup.

DropdownMenuItem accepts `destructive`; its `onSelect` may prevent dismissal. Checkbox/radio parts preserve Radix's native contracts. A menu is for actions; use Select/Combobox for a form choice. Popover is for interactive supplementary content; a Tooltip remains a short supplementary description.

AlertDialogAction closes synchronously by default. For an async operation, call `event.preventDefault()` in `onClick`, show the pending state, retain an enabled Cancel action, and set the root's controlled `open` to false only after success. If a pending action becomes disabled, move focus to a stable enabled control first. Cancelling should invalidate the host's pending result so it cannot close a later dialog or apply stale data.

Sheet reexports familiar header/body/footer/title/description/close parts. `side="start" | "end"` follows the page's direction. The default width uses the form layout token; `size` retains Dialog's width choices. The body scrolls while header/actions remain reachable, including short viewports.

`useToast()` returns `toast(options)`, `dismiss(id)`, and `clear()`. A notice needs a title; optional description, tone, duration, action and returnFocusTo are explicit. The returned ID is null if the provider is unmounted or the callback belongs to an old scope. Default lifetimes come from the inherited contract: success 3000ms, info 3500ms, warning 4500ms, error 6000ms. `duration: Infinity` keeps a notice until dismissal. Keep unresolved errors and required decisions visible in their original context. Action callbacks may prevent default dismissal when the host needs to keep a notice open.

Toast actions accept `label`, `altText`, `onClick`, and an optional `icon`. Supplied icons appear inline beside the title and dismiss control, using compact ghost buttons; `label` remains the accessible name and tooltip. Desktop controls are 24px with 16px glyphs; touch targets expand to 44px. Without an icon, the action label stays visible below the message. Use `icon: <Undo2Icon size="sm" />` for undo. Keep `altText` as the description of the alternative action announced with the notice. ToastProvider supplies the tooltip context for its actions and dismiss controls.

AccountMenu accepts a stable ID for each link, a visible name, and an optional description. The optional appearance value is controlled by the host; theme changes remain application code. Sign-out feedback is host-supplied. Routing, safe destinations, identity eligibility and server authorization remain outside these components.

## Source and verification

The wrappers and CSS are original kit code. Behavioral references are [Radix DropdownMenu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu), [Popover](https://www.radix-ui.com/primitives/docs/components/popover), [AlertDialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog), and [Toast](https://www.radix-ui.com/primitives/docs/components/toast). Root records pinned dependency versions and package provenance. These Radix packages retain their MIT licenses. Sheet uses the kit's existing Dialog dependency.

Focused browser checks cover menu keyboard/check/radio/submenus, interactive popup layering, cancel-first async failure/retry, sheet dismissal/focus, notification limits/pause/context cleanup, and account callbacks. Integrated builds, eight-theme visual checks and packed consumer verification are recorded by the root integration pass; source implementation alone does not establish those results.
