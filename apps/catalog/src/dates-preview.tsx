import { useState } from "react";
import { Button, Calendar, DateField, DatePicker, DateRangePicker, FormattedDate, FormattedTimestamp, SelectField, TimeField, formatFileSize, formatNumber, type DateRange } from "@evenkit/ui";
import "./dates-preview.css";

function CalendarExample() {
  const [date, setDate] = useState<string | null>("2026-10-26");
  const [locale, setLocale] = useState("en-GB");
  return <div className="dates-preview-stack calendar-preview">
    <header><h3>Choose a deadline</h3><p>October 27 is unavailable.</p></header>
    <div className="calendar-preview-frame">
      <div className="calendar-preview-calendar"><Calendar value={date} onValueChange={setDate} today="2026-10-25" min="2026-10-25" max="2026-12-31" locale={locale} dir={locale === "ar-EG" ? "rtl" : "ltr"} isDateUnavailable={day => day === "2026-10-27"} /></div>
      <div className="calendar-preview-selection" role="status" aria-atomic="true"><span>Selected date</span>{date ? <FormattedDate value={date} options={{ locale, day: "numeric", month: "long", year: "numeric" }} /> : <span>Choose a deadline</span>}</div>
    </div>
    <SelectField label="Calendar language" value={locale} onValueChange={setLocale} options={[{ value: "en-GB", label: "English" }, { value: "de-AT", label: "Deutsch" }, { value: "ar-EG", label: "العربية" }]} />
  </div>;
}
function DateExample() {
  const [saved, setSaved] = useState("No deadline saved.");
  return <form className="dates-preview-stack" aria-label="Deadline form" onSubmit={event => { event.preventDefault(); setSaved(`Saved deadline: ${new FormData(event.currentTarget).get("deadline")}.`); }} onReset={() => setSaved("Deadline reset.")}>
    <header><h3>Project deadline</h3><p>Choose a day from October 25 through December 31, 2026.</p></header>
    <DatePicker label="Deadline" name="deadline" defaultValue="2026-10-26" min="2026-10-25" max="2026-12-31" today="2026-10-25" required calendarLabel="Choose deadline" />
    <div className="dates-preview-actions"><Button type="submit">Save deadline</Button><Button variant="outline" type="reset">Reset deadline</Button></div>
    <p role="status">{saved}</p>
    <section className="dates-preview-secondary"><h4>Reference dates</h4><DateField label="Created on" defaultValue="2026-10-01" readOnly hint="This value is read-only." /><DatePicker label="Archived on" disabled hint="Available after the project is archived." /></section>
  </form>;
}
function RangeExample() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [saved, setSaved] = useState("Choose a reporting period.");
  return <form className="dates-preview-stack" aria-label="Reporting period form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setSaved(`Reporting period: ${data.get("from")} through ${data.get("through")}.`); }} onReset={() => { setRange({ start: null, end: null }); setSaved("Reporting period reset."); }}>
    <header><h3>Reporting period</h3><p>Start with a preset or choose the first and last day.</p></header>
    <DateRangePicker label="Date range" startName="from" endName="through" value={range} onValueChange={setRange} required today="2026-10-25" min="2026-01-01" max="2026-12-31" presets={[{ label: "October", value: { start: "2026-10-01", end: "2026-10-31" } }, { label: "Fourth quarter", value: { start: "2026-10-01", end: "2026-12-31" } }]} hint="The report includes both dates." />
    <div className="dates-preview-actions"><Button type="submit">Apply period</Button><Button variant="outline" type="reset">Reset period</Button></div><p role="status">{saved}</p>
  </form>;
}
function TimeExample() {
  const [cycle, setCycle] = useState<12 | 24>(24);
  const [value, setValue] = useState<string | null>("09:30");
  const [saved, setSaved] = useState("No appointment saved.");
  return <form className="dates-preview-stack" aria-label="Appointment form" onSubmit={event => { event.preventDefault(); setSaved(`Saved time: ${new FormData(event.currentTarget).get("appointment")}.`); }}>
    <header><h3>Appointment time</h3><p>Office hours are 09:00–17:00 in Europe/Vienna.</p></header>
    <SelectField label="Time format" value={String(cycle)} onValueChange={next => setCycle(next === "12" ? 12 : 24)} options={[{ value: "24", label: "24-hour" }, { value: "12", label: "12-hour" }]} />
    <TimeField label="Appointment time" name="appointment" value={value} onValueChange={setValue} hourCycle={cycle} min="09:00" max="17:00" minuteStep={15} required hint="Appointments start every 15 minutes." />
    <p className="dates-preview-note">Stored local time: <code>{value ?? "(empty)"}</code></p>
    <Button type="submit">Save appointment</Button><p role="status">{saved}</p>
  </form>;
}
function FormattingExample() {
  const [locale, setLocale] = useState("en-GB");
  const [timeZone, setTimeZone] = useState("Europe/Vienna");
  return <div className="dates-preview-stack">
    <header><h3>Report metadata</h3><p>Change the display locale and timezone. The deadline stays on the same calendar day.</p></header>
    <div className="dates-preview-columns"><SelectField label="Display locale" value={locale} onValueChange={setLocale} options={[{ value: "en-GB", label: "English (UK)" }, { value: "de-AT", label: "Deutsch (Österreich)" }, { value: "ja-JP", label: "日本語" }]} /><SelectField label="Display timezone" value={timeZone} onValueChange={setTimeZone} options={[{ value: "Europe/Vienna", label: "Europe/Vienna" }, { value: "America/New_York", label: "America/New_York" }, { value: "Asia/Tokyo", label: "Asia/Tokyo" }]} /></div>
    <dl className="dates-preview-metadata"><div><dt>Deadline</dt><dd><FormattedDate value="2026-10-25" options={{ locale, dateStyle: "long" }} /></dd></div><div><dt>Last updated</dt><dd><FormattedTimestamp value="2026-10-25T01:30:00Z" options={{ locale, timeZone, timeZoneName: "short" }} /></dd></div><div><dt>Budget</dt><dd>{formatNumber(1234.5, { locale, style: "currency", currency: "EUR" })}</dd></div><div><dt>Attachment</dt><dd>{formatFileSize(1536000, { locale })} <span className="dates-preview-note">({formatFileSize(1536000, { locale, base: 1024 })})</span></dd></div></dl>
  </div>;
}
export function DatesPreview({ id }: { id: string }) {
  if (id === "calendar") return <CalendarExample />;
  if (id === "date-picker") return <DateExample />;
  if (id === "date-range") return <RangeExample />;
  if (id === "time-field") return <TimeExample />;
  return <FormattingExample />;
}
