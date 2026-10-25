# Dates, times, and formatting

The date controls use Gregorian calendar dates in `YYYY-MM-DD` form, from `0001-01-01` to `9999-12-31`. A date-only value has no timezone. `DateOnly` is a string alias; validate data from outside your application with `parseDateOnly`. Do not pass a date-only value through a local `Date` constructor or attach a timezone to a deadline.

`LocalTime` is a separate `HH:mm` string. `TimeField` accepts 24-hour entry or 12-hour entry with AM/PM while submitting the same canonical value. `min`, `max`, and `minuteStep` validate local minutes; steps start at `min` when supplied, otherwise midnight. Overnight bounds are not supported. Dates, times, and IANA zones must be resolved to instants by the host application, with an explicit policy for missing or repeated daylight-saving times.

## Controls

| Export | Contract |
| --- | --- |
| `Calendar` | Controlled `value` and `onValueChange`, optional inclusive `range` highlighting, `min`/`max`, `isDateUnavailable`, `locale`, and `weekStartsOn` (Monday by default). |
| `DateField` | Typed `YYYY-MM-DD` input with linked format help, errors, required validation, canonical native form value and forwarded input ref. |
| `DatePicker` | DateField plus a calendar popup. Selection and Escape return focus to the trigger. Pass `container` for a popup inside a dialog. |
| `DateRangePicker` | Two typed fields, a calendar, and validated presets. `value` contains `start` and `end`, each a date or `null`. `startName` and `endName` submit separately. |
| `TimeField` | Typed local time, `hourCycle` of 12 or 24, minute steps, bounds, empty state, native form value and forwarded input ref. |

Fields support controlled `value`/`onValueChange` or uncontrolled `defaultValue`. Invalid and incomplete entry stays visible but emits `null`; it never submits an earlier valid value. Format and bound validation use native custom validity, with linked error text after blur or an invalid submit. A host `error` string also blocks native submission. Hosts that use `noValidate` must validate their own submit handler.

Uncontrolled controls restore defaults on form reset. Controlled values and controlled reset handlers belong to the host. Prevented reset events leave drafts unchanged. `form` associates fields with an external form. Disabled fields are omitted from form data. Read-only fields remain available for reading and submission; their calendar triggers are disabled.

A date range is inclusive. The calendar first selects a start, then an end; choosing an earlier day starts a new range. A completed selection starts a new range on the next click. Incomplete ranges cannot submit once either endpoint has been chosen, even if the group is optional. Reversed typed ranges and ranges containing an unavailable interior day are invalid. Presets obey the same constraints.

Calendar keyboard movement follows the [WAI-ARIA date picker pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/): arrows move by day or week, Home/End move within a week, Page Up/Down change month, and Shift with Page Up/Down changes year. Dates outside bounds cannot be selected; unavailable dates remain discoverable by arrow navigation. Month navigation preserves the day when possible. Labels and dates localize separately: calendar dates use `locale`; typed date entry remains explicitly ISO. Supply `today` for stable server rendering and business-timezone behavior; otherwise today uses the runtime's local calendar date.

## Formatting

`formatDateOnly(value, { locale, ...dateOptions })` and `<FormattedDate value options />` display a calendar date without changing the day. The component renders a semantic `time` element. The Gregorian calendar and UTC arithmetic container are fixed so display cannot shift to an adjacent day. Time-related options are rejected because a calendar date has no time of day.

`formatTimestamp(value, { timeZone, locale, ...options })` and `<FormattedTimestamp value options />` require an explicit display timezone. Timestamp strings must contain a UTC offset, such as `2026-10-25T01:30:00Z`. A `Date` object is also accepted by the formatter. Style options (`dateStyle`, `timeStyle`) and individual Intl component options are supported; follow Intl's rule against mixing styles with individual components.

`formatNumber(value, { locale, ...options })` uses Intl.NumberFormat for finite values. `formatFileSize(bytes, { locale, base })` uses decimal units by default (`kB`, `MB`); `base: 1024` uses binary units (`KiB`, `MiB`). Sizes must be finite and nonnegative. Fractional bytes are rounded for display. Formatters default to `en-US`; pass a locale explicitly when the application has one.

The five catalog entries cover D01–D04 and D08 with working controls and copied public-API examples. Utility tests cover leap years, year boundaries, DST-independent date arithmetic, ranges, noon/midnight, time steps, timestamp display, and unit labels. Browser journeys cover keyboard movement, unavailable dates, invalid drafts, reset cancellation, focus recovery, range selection, and canonical time submission.
