# Multiple values and numeric fields

C08, C09, C05 and C06 are available from `@evenkit/ui`. Import the token and UI styles once. The catalog contains working examples at `#multi-select`, `#token-input`, `#number-field` and `#number-recipes`.

## MultiSelect

`MultiSelect` accepts the same `{ value, label, description?, disabled? }` options as `Combobox`. Values are stable string IDs. `value` and `onValueChange` provide controlled state; `defaultValue` starts an uncontrolled field. Repeated IDs in options or values are displayed once. Unknown selected IDs remain visible so a refreshed option list cannot silently remove a saved selection.

Search uses option labels. Arrow keys navigate results; Enter selects an available option; Escape closes without clearing selections. Backspace in an empty search removes the last selected value. Each displayed selection has a named removal button. `maxVisible` defaults to three, with a button to expand the remaining values. `clearLabel`, `openLabel` and `removeLabel` customize action names. `loading`, `loadingMessage` and `emptyMessage` describe async option states; applications own fetching and use `onSearchChange` to receive the query. A `container` prop places the popup inside a dialog when required.

`name` submits repeated values, so use `FormData.getAll(name)`. The Base UI primitive owns native required validation. Uncontrolled fields restore `defaultValue` on a non-cancelled native form reset. Controlled fields remain application-owned; reset their value in the form's reset handler. Disabled fieldsets disable native input and button controls; disabled values are omitted from form submission. Read-only fields retain values without selection or removal actions.

## TokenInput

`TokenInput` uses the same value, default, overflow, label and form conventions. Enter, comma, semicolon and pasted newlines add tokens. `separators` customizes separators. Input is trimmed; case-insensitive duplicate checks preserve the first spelling. Set `caseSensitive` when labels differing only in case are meaningful.

`validateToken` returns an error string or `undefined`; `maxTokens` bounds additions. `onReject` receives the token, rejection reason (`duplicate`, `invalid` or `limit`), and message. A pasted list keeps valid additions even if other tokens fail. Invalid and over-limit tokens remain editable. Duplicate tokens leave their existing selection in place and show feedback. Blur attempts to add a draft, and an unresolved draft blocks native form submission. IME composition does not add or remove tokens prematurely.

The exported `appendTokens` helper uses the same admission rules for application imports. Applications should still validate stored data at their API boundary.

## NumberField

`NumberField` stores `number | null`; an empty field is `null`. `locale` defaults explicitly to `en-US` for consistent server and client output. The field accepts that locale's decimal and grouping characters and localized digits. It rejects malformed grouping, exponent notation and currency symbols rather than guessing another locale. `parseLocaleNumber` exposes the parser with `empty`, `incomplete`, `invalid` and `valid` results.

Valid edits call `onValueChange` immediately. Intermediate text such as a minus sign or trailing decimal separator remains editable without publishing a number. Invalid drafts show associated feedback on blur and block native submission. Blurring a valid value applies grouping and minimum decimal digits. A parent value or locale change refreshes the displayed value.

`min`, `max`, `step`, `maximumFractionDigits` and `minimumFractionDigits` define the numeric contract. Maximum precision defaults to six and supports zero through fifteen fractional digits. A supplied step validates against `min ?? 0`. Arrow Up/Down and the named buttons step using decimal integer arithmetic; off-grid drafts snap in the chosen direction. Empty values start at `min ?? 0`, bounded by the range. The public `stepNumber` and `validateNumber` helpers follow the same rules. Invalid constraint configuration throws a `RangeError`.

Native form submission uses a hidden canonical number without grouping or unit text. Invalid and incomplete drafts submit an empty string, including when a host reads FormData without native validation. Required validation lives on the visible input. Uncontrolled forms restore the default on reset; controlled forms reset their value in the host. Values are JavaScript numbers within the safe numeric range. Applications requiring exact financial arithmetic should own a decimal or minor-unit model and convert at their boundary.

## Currency, percentage and unit recipes

`CurrencyField` adds an explicit ISO currency code and uses `Intl.NumberFormat` currency precision unless overridden. Values are major units: `1250.5` EUR means €1,250.50. `PercentageField` uses percentage points: `12.5` means 12.5%. `UnitField` displays the supplied unit string without conversion. Units are always visible, while labels and hints should spell out unfamiliar units.

These recipes share NumberField's parsing, limits, reset and validation behavior. The application owns exchange rates, unit conversion, accounting rules, and storage precision.
