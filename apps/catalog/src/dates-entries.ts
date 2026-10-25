import type { CatalogEntry } from "./catalog-types.js";

const styles = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
const source = "Original kit controls · Gregorian date contract · WAI-ARIA calendar keyboard model";
const sourceUrl = "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/";
export const datesEntries: readonly CatalogEntry[] = [
  {
    id: "calendar", name: "Calendar", group: "Controls", inventoryIds: ["D01"],
    description: "Choose a calendar date with keyboard navigation, localized month labels, and unavailable days.",
    tags: ["date", "calendar", "month", "keyboard", "locale", "D01"], source, sourceUrl,
    usage: `${styles}import { useState } from "react";
import { Calendar, FormattedDate } from "@evenkit/ui";

export function DeadlineCalendar() {
  const [date, setDate] = useState<string | null>("2026-10-26");
  return <>
    <Calendar value={date} onValueChange={setDate} today="2026-10-25"
      min="2026-10-25" max="2026-12-31" locale="en-GB" weekStartsOn={1}
      isDateUnavailable={day => day === "2026-10-27"} />
    {date && <FormattedDate value={date} options={{ locale: "en-GB" }} />}
  </>;
}
`,
  },
  {
    id: "date-picker", name: "Date field and picker", group: "Controls", inventoryIds: ["D02"],
    description: "Type a date or choose from a calendar. Validation and native form values use YYYY-MM-DD.",
    tags: ["date", "picker", "field", "deadline", "validation", "D02"], source, sourceUrl,
    usage: `${styles}import { Button, DateField, DatePicker } from "@evenkit/ui";

export function DeadlineForm({ onSave }: { onSave: (data: FormData) => void }) {
  return <form onSubmit={event => { event.preventDefault(); onSave(new FormData(event.currentTarget)); }}>
    <DatePicker label="Deadline" name="deadline" required defaultValue="2026-10-26"
      min="2026-10-25" max="2026-12-31" today="2026-10-25" calendarLabel="Choose deadline" />
    <DateField label="Reference date" name="referenceDate" defaultValue="2026-10-01" readOnly />
    <Button type="submit">Save deadline</Button>
    <Button type="reset" variant="outline">Reset</Button>
  </form>;
}
`,
  },
  {
    id: "date-range", name: "Date range", group: "Controls", inventoryIds: ["D03"],
    description: "Set inclusive reporting periods with typed dates, calendar selection, and presets.",
    tags: ["date", "range", "period", "reporting", "presets", "D03"], source, sourceUrl,
    usage: `${styles}import { useState } from "react";
import { DateRangePicker, type DateRange } from "@evenkit/ui";

export function ReportingPeriod() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DateRangePicker label="Reporting period" value={range} onValueChange={setRange}
    startName="from" endName="through" required today="2026-10-25"
    presets={[{ label: "October", value: { start: "2026-10-01", end: "2026-10-31" } }]}
    hint="Both the first and last day are included." />;
}
`,
  },
  {
    id: "time-field", name: "Time field", group: "Controls", inventoryIds: ["D04"],
    description: "Enter 12- or 24-hour local times with bounds and minute intervals. Stored values use HH:mm.",
    tags: ["time", "hours", "minutes", "appointment", "12 hour", "24 hour", "D04"], source: "Original kit text field · explicit local-time contract", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time",
    usage: `${styles}import { TimeField } from "@evenkit/ui";

export function AppointmentTime() {
  return <TimeField label="Appointment time" name="time" defaultValue="09:30"
    hourCycle={12} minuteStep={15} min="09:00" max="17:00" required
    hint="Office hours in Europe/Vienna. The application resolves the date and timezone." />;
}
`,
  },
  {
    id: "formatting", name: "Date and number formatting", group: "Foundations", inventoryIds: ["D08"],
    description: "Format calendar dates, zoned timestamps, numbers, and file sizes without changing stored values.",
    tags: ["date", "number", "formatting", "locale", "timezone", "file size", "D08"], source: "Intl formatters · semantic time elements", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl",
    usage: `${styles}import { FormattedDate, FormattedTimestamp, formatNumber, formatFileSize } from "@evenkit/ui";

export function ReportMetadata() {
  return <dl>
    <dt>Deadline</dt><dd><FormattedDate value="2026-10-25" options={{ locale: "de-AT" }} /></dd>
    <dt>Updated</dt><dd><FormattedTimestamp value="2026-10-25T01:30:00Z"
      options={{ locale: "de-AT", timeZone: "Europe/Vienna", timeZoneName: "short" }} /></dd>
    <dt>Budget</dt><dd>{formatNumber(1234.5, { locale: "de-AT", style: "currency", currency: "EUR" })}</dd>
    <dt>Attachment</dt><dd>{formatFileSize(1536000, { locale: "de-AT" })}</dd>
  </dl>;
}
`,
  },
];
