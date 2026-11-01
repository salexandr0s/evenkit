# Component icons and compact actions

Reviewed the UI components, editable blocks and catalog examples on 26 October 2026. Familiar secondary actions use named kit icons with accessible names and hover/focus tooltips. Primary submissions, confirmation decisions, field labels, choices and recovery instructions retain visible text.

`IconButton` and `IconButtonLink` share the existing Button styles and size tokens. Both require a `label`, which supplies the tooltip and default accessible name. Use `aria-label` when a repeated action needs a record or filename in its accessible name. Refs and native control props pass through to the button or anchor. Links retain native navigation, new-tab and download behavior.

```tsx
import { CheckIcon, DownloadIcon, IconButton, IconButtonLink } from "@evenkit/ui";

<IconButton
  label="Mark as read"
  aria-label={`Mark as read: ${notification.title}`}
  onClick={() => markRead(notification.id)}
>
  <CheckIcon size="sm" />
</IconButton>

<IconButtonLink label="Download" href={file.href} download={file.name}>
  <DownloadIcon size="sm" />
</IconButtonLink>
```

The default is a small ghost button: 32px on desktop, at least 44px on narrow screens or coarse pointers. Tooltips open on hover or keyboard focus. Icon-action tooltips unmount on dismissal so a closing layer cannot intercept the next action or Escape key. The general Tooltip component keeps its existing entrance and exit animations.

`CopyAction shape="icon"` renders the copy/spinner/check glyph with a named tooltip. Copy success remains announced without widening the control. Clipboard errors remain visible and retryable.

## Review coverage

| Component family | Review result |
| --- | --- |
| Notifications and notification center | Read/unread and page/selection read actions use icons. Reduced header, group, toolbar and row spacing. Selection scope, read state, timestamps, permission reasons and application actions remain readable. |
| Tables, filter bars and applied filters | Compact display settings, filter reset/clear and repeated row actions. Selection clearing and sorting already used icons. Kept search fields, sort choices, Apply, primary creation and confirmation actions. |
| Pagination and navigation | Previous/next use tooltipped chevrons in both pagination modes. Removed forced narrow two-row pagination. Navigation labels, breadcrumbs, tabs and account-menu choices remain visible. The navigation trigger's tooltip unmounts while its drawer is open. |
| Dates, time and formatting | Embedded the date-range calendar trigger in the end-date input. Calendar paging, date clearing and other date triggers already used icons. Kept typed values, labels, presets, range guidance and validation. |
| Uploads, files, previews and images | Compact cancel/clear, refresh, undo, reset, preview, open and download actions. Tighter document card footers and spacing. Kept file metadata, upload selection/start, preview recovery instructions, save actions and removal confirmations. |
| Team members and invitations | Invitation resend/revoke launchers and refresh use icons. Invite, role/status choices, unavailable reasons and confirmation decisions retain text. Invitation acceptance and account decisions remain explicit. |
| Roles, workspace and account settings | Compact role reload, workspace cancel/retry and profile reset. Locked capabilities use a lock glyph beside the existing reason. Kept permission review/save/discard, workspace names and preference labels. |
| Audit, reports and dashboards | Compact reset, export preparation/retry/cancel and refresh. Tighter audit rows. Kept report Apply, ready Download export, export status/errors, metrics and chart legends/table alternatives. |
| Chat, rich messages, history and sources | New chat becomes a plus beside the history heading, with tighter heading spacing. Send/stop, copy, regenerate, history/delete, expand/close, attachments, source preview and code copy already used icons. Kept prompts, suggestions and recovery instructions. |
| Persistent and transient feedback | Persistent banner dismissal uses an X with its existing async/focus behavior and tighter padding. Toasts and other dismiss controls already used icons. Kept notices, connection/session state, essential instructions and application actions. |
| Records, details and onboarding | Compact row edit/review, detail Back/Edit, reset changes, wizard Back and Save draft. Kept primary Create/Save/Continue/Finish, cancellation and discard/recovery choices. |
| Fields and value entry | Search/clear, password visibility, numeric stepping, combobox/multiselect and token removal already used compact glyphs. Kept labels, selected values, validation, help and form submission actions. |
| Selection, groups, copy and progress | Added icon-shaped copying and compact Preview examples. Mixed icon/text joined button groups retain their horizontal form on narrow screens. Checkbox/radio/switch/toggle choices and progress labels retain text. |
| Foundations and layout | Reviewed cards, headers, layout/typography, lists, tags, avatars, statistics, activity and steps. Compact per-event activity retry and image retry; existing tag removal already used icons. Primary/header content and global recovery remain visible. |
| Dialogs, overlays and commands | Close, menu and command controls already used icons where appropriate. Kept menu options, dialog decisions, command labels, shortcut hints and destructive confirmations. |
| Authentication and website blocks | Reviewed login/signup/password flows, website shell, heroes, features, CTA, FAQ, forms and article layouts. Existing utility controls already use icons; navigation, consent, submissions and calls to action retain text. |
| Catalog and copied examples | Compact toolbar filter resets, Preview/Archive examples, row actions and homepage/reference copying. Updated matching usage snippets. Empty-state recovery actions retain text. |

The review covers the implemented inventory and its compositions; it does not imply implementation of optional or future inventory items. Caller-defined action labels remain explicit when the kit has no reliable icon meaning for them.

## Verification

Production builds, configured TypeScript and ESLint, unit tests, registry tests, copied examples, catalog browser journeys, admin browser journeys and packed Vite/Next consumers are recorded in `.artifacts/compact-actions/`. The copied examples cover all 116 catalog entries and 104 inventory mappings. Visual captures include the notification center on desktop and mobile, keyboard tooltips, and dark RTL layout.

| Check | Result |
| --- | --- |
| Production build, TypeScript and ESLint | Passed |
| Unit tests | 47 passed |
| Catalog browser journeys | 297 passed |
| Admin browser journeys | 63 passed across Chromium, Firefox and WebKit |
| Copied examples | 116 examples and 104 inventory mappings passed |
| Packed consumers | Independent Vite and Next builds, strict types, browser interaction and package boundaries passed |
| Registry | 33 checks passed in the full run; the committed-source check passed after source commit `0eb9ff6` |
| Final grouped-button CSS | Rebuilt production assets; all 8 selection journeys passed. Long-label mobile LTR/RTL checks confirmed a 44px square icon and no page overflow. |

The first browser run exposed stale tooltip dismissal layers; the final full run passed after the fix. The first admin run needed its existing bundle-report output directory created. Registry building deliberately rejects uncommitted block edits, so its committed-source check was rerun after saving the implementation. Full browser and packed checks preceded the final grouped-button `flex: none` safeguard; the focused selection and geometry checks cover that last CSS change.

Browser evidence covers the configured automated engines. Physical touch hardware and screen-reader speech were not exercised.
