import type { ComponentPropsWithoutRef } from "react";
import { dateOnlyToDate, parseDateOnly, type DateOnly } from "./date-utils.js";

export interface DateFormatOptions extends Omit<Intl.DateTimeFormatOptions, "timeZone" | "calendar" | "timeStyle" | "hour" | "minute" | "second" | "fractionalSecondDigits" | "timeZoneName" | "hour12" | "hourCycle" | "dayPeriod"> { locale?: string | undefined }
export function formatDateOnly(value: DateOnly, { locale = "en-US", ...options }: DateFormatOptions = {}): string {
  if (["timeStyle", "hour", "minute", "second", "fractionalSecondDigits", "timeZoneName", "hour12", "hourCycle", "dayPeriod"].some(key => key in options)) throw new RangeError("Calendar dates cannot display a time.");
  const defaults: Intl.DateTimeFormatOptions = options.dateStyle ? {} : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat(locale, { ...defaults, ...options, calendar: "gregory", timeZone: "UTC" }).format(dateOnlyToDate(value));
}
export interface TimestampFormatOptions extends Omit<Intl.DateTimeFormatOptions, "timeZone"> { locale?: string | undefined; timeZone: string }
export function formatTimestamp(value: string | Date, { locale = "en-US", timeZone, ...options }: TimestampFormatOptions): string {
  if (typeof value === "string" && !/T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) throw new RangeError("Timestamps require an explicit UTC offset.");
  if (typeof value === "string" && (!parseDateOnly(value.slice(0, 10)) || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i.test(value))) throw new RangeError("Invalid timestamp.");
  if (!timeZone) throw new RangeError("A display timezone is required.");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid timestamp.");
  const defaults: Intl.DateTimeFormatOptions = options.dateStyle || options.timeStyle ? {} : { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };
  return new Intl.DateTimeFormat(locale, { ...defaults, ...options, timeZone }).format(date);
}
export function formatNumber(value: number, { locale = "en-US", ...options }: Intl.NumberFormatOptions & { locale?: string } = {}): string {
  if (!Number.isFinite(value)) throw new RangeError("A finite number is required.");
  return new Intl.NumberFormat(locale, options).format(value);
}
export function formatFileSize(bytes: number, { locale = "en-US", base = 1000 }: { locale?: string; base?: 1000 | 1024 } = {}): string {
  if (!Number.isFinite(bytes) || bytes < 0) throw new RangeError("File size must be a finite nonnegative number.");
  const units = base === 1024 ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] : ["B", "kB", "MB", "GB", "TB", "PB"];
  const index = bytes === 0 ? 0 : Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1));
  return `${formatNumber(bytes / base ** index, { locale, maximumFractionDigits: index === 0 ? 0 : 1 })} ${units[index]}`;
}
export interface FormattedDateProps extends Omit<ComponentPropsWithoutRef<"time">, "dateTime" | "children"> { value: DateOnly; options?: DateFormatOptions }
export function FormattedDate({ value, options, ...props }: FormattedDateProps) { return <time {...props} dateTime={value}>{formatDateOnly(value, options)}</time>; }
export interface FormattedTimestampProps extends Omit<ComponentPropsWithoutRef<"time">, "dateTime" | "children"> { value: string; options: TimestampFormatOptions }
export function FormattedTimestamp({ value, options, ...props }: FormattedTimestampProps) { return <time {...props} dateTime={value}>{formatTimestamp(value, options)}</time>; }
