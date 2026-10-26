"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons.js";
import { addDateDays, addDateMonths, assertDateConstraints, dateOnlyToDate, dateValidationMessage, parseDateOnly, todayDateOnly, type DateConstraints, type DateOnly, type DateRange } from "./date-utils.js";
import { formatDateOnly } from "./formatting.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export interface CalendarProps extends DateConstraints {
  value?: DateOnly | null | undefined;
  onValueChange?: ((date: DateOnly) => void) | undefined;
  /** Highlights an inclusive range. onValueChange still emits the clicked date. */
  range?: DateRange | undefined;
  defaultMonth?: DateOnly | undefined;
  /** Supply a stable date when rendering on a server or in a specific timezone. */
  today?: DateOnly | undefined;
  locale?: string | undefined;
  /** 0 is Sunday; the default is Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  dir?: "ltr" | "rtl" | undefined;
  className?: string | undefined;
  label?: string | undefined;
  labels?: Partial<{ previousMonth: string; nextMonth: string; today: string; keyboardHelp: string }> | undefined;
}

export function Calendar({ value, onValueChange, range, defaultMonth, today = todayDateOnly(), locale = "en-US", weekStartsOn = 1, disabled, readOnly, dir, className, label = "Calendar", labels, min, max, isDateUnavailable }: CalendarProps) {
  assertDateConstraints({ min, max });
  const initial = [value, range?.start, defaultMonth, today].find((date): date is string => !!date && !!parseDateOnly(date)) ?? "2000-01-01";
  const bound = (date: string) => min && date < min ? min : max && date > max ? max : date;
  const [focused, setFocused] = useState(() => bound(initial));
  const [month, setMonth] = useState(() => bound(initial).slice(0, 7));
  const selectedValue = value ?? range?.start;
  const [lastValue, setLastValue] = useState(selectedValue);
  if (selectedValue !== lastValue) {
    setLastValue(selectedValue);
    if (selectedValue && parseDateOnly(selectedValue)) { setFocused(bound(selectedValue)); setMonth(bound(selectedValue).slice(0, 7)); }
  }
  if (bound(focused) !== focused) { setFocused(bound(focused)); setMonth(bound(focused).slice(0, 7)); }
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    root.current?.querySelector<HTMLButtonElement>(`[data-date="${pendingFocus.current}"]`)?.focus();
    pendingFocus.current = null;
  });
  const headingId = useId(), helpId = useId();
  const first = `${month}-01`;
  const startOffset = (dateOnlyToDate(first).getUTCDay() - weekStartsOn + 7) % 7;
  const daysInMonth = Number(addDateDays(addDateMonths(first, 1), -1).slice(8));
  const rowCount = Math.ceil((startOffset + (month === "9999-12" ? 31 : daysInMonth)) / 7);
  const monthLabel = formatDateOnly(first, { locale, year: "numeric", month: "long", day: undefined });
  const unavailable = (date: string) => !!dateValidationMessage(date, { min, max, isDateUnavailable });
  const moveFocus = (date: string) => {
    const next = bound(date);
    const existing = root.current?.querySelector<HTMLButtonElement>(`[data-date="${next}"]`);
    if (existing) existing.focus();
    else pendingFocus.current = next;
    setFocused(next); setMonth(next.slice(0, 7));
  };
  const changeMonth = (amount: number) => {
    const next = bound(addDateMonths(focused, amount));
    setFocused(next); setMonth(next.slice(0, 7));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    let next: string | undefined;
    const day = dateOnlyToDate(date).getUTCDay();
    const rtl = root.current ? getComputedStyle(root.current).direction === "rtl" : dir === "rtl";
    if (event.key === "ArrowRight") next = addDateDays(date, rtl ? -1 : 1);
    if (event.key === "ArrowLeft") next = addDateDays(date, rtl ? 1 : -1);
    if (event.key === "ArrowDown") next = addDateDays(date, 7);
    if (event.key === "ArrowUp") next = addDateDays(date, -7);
    if (event.key === "Home") next = addDateDays(date, -((day - weekStartsOn + 7) % 7));
    if (event.key === "End") next = addDateDays(date, 6 - ((day - weekStartsOn + 7) % 7));
    if (event.key === "PageUp") next = addDateMonths(date, event.shiftKey ? -12 : -1);
    if (event.key === "PageDown") next = addDateMonths(date, event.shiftKey ? 12 : 1);
    if (next) { event.preventDefault(); moveFocus(next); }
  };
  return <div ref={root} className={classes("pk-calendar", className)} dir={dir} data-disabled={disabled || undefined}>
    <div className="pk-calendar-header">
      <h3 id={headingId} aria-live="polite" aria-atomic="true">{monthLabel}</h3>
      <TooltipProvider><div className="pk-calendar-navigation">
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" shape="icon" aria-label={labels?.previousMonth ?? "Previous month"} disabled={disabled || month === "0001-01" || !!(min && month <= min.slice(0, 7))} onClick={() => changeMonth(-1)}><ChevronLeftIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{labels?.previousMonth ?? "Previous month"}</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" shape="icon" aria-label={labels?.nextMonth ?? "Next month"} disabled={disabled || month === "9999-12" || !!(max && month >= max.slice(0, 7))} onClick={() => changeMonth(1)}><ChevronRightIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{labels?.nextMonth ?? "Next month"}</TooltipContent></Tooltip>
      </div></TooltipProvider>
    </div>
    <table role="grid" aria-label={`${label}, ${monthLabel}`} aria-describedby={helpId} aria-readonly={readOnly || undefined} aria-multiselectable={range ? true : undefined}>
      <thead><tr>{Array.from({ length: 7 }, (_, index) => {
        const date = addDateDays("2026-10-25", (weekStartsOn + index) % 7);
        const full = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(dateOnlyToDate(date));
        return <th key={index} scope="col" abbr={full}>{new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(dateOnlyToDate(date))}</th>;
      })}</tr></thead>
      <tbody>{Array.from({ length: rowCount }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, column) => {
        const day = row * 7 + column - startOffset + 1;
        if (day < 1 || day > (month === "9999-12" ? 31 : daysInMonth)) return <td key={column} />;
        const date = `${month}-${String(day).padStart(2, "0")}`;
        const selected = range ? !!(range.start && date >= range.start && date <= (range.end ?? range.start)) : date === value;
        const blocked = unavailable(date);
        return <td key={column} aria-selected={selected} data-in-range={range && selected || undefined} data-range-edge={range && (date === range.start || date === range.end) || undefined} data-range-start={range && date === range.start || undefined} data-range-end={range && date === (range.end ?? range.start) || undefined}>
          <button type="button" data-date={date} data-today={date === today || undefined} data-selected={selected || undefined} aria-label={formatDateOnly(date, { locale, weekday: "long", year: "numeric", month: "long", day: "numeric" })} aria-current={date === today ? "date" : undefined} aria-disabled={blocked || readOnly || undefined} disabled={disabled} tabIndex={date === focused ? 0 : -1} onFocus={() => setFocused(date)} onKeyDown={event => onKeyDown(event, date)} onClick={() => { if (!blocked && !readOnly) onValueChange?.(date); }}>{new Intl.NumberFormat(locale).format(day)}</button>
        </td>;
      })}</tr>)}</tbody>
    </table>
    <div className="pk-calendar-footer"><Button size="sm" variant="ghost" disabled={disabled || unavailable(today)} onClick={() => moveFocus(today)}>{labels?.today ?? "Today"}</Button><p id={helpId}>{labels?.keyboardHelp ?? "Arrow keys to browse. Page Up / Down for months."}</p></div>
  </div>;
}
