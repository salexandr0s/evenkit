/** Calendar dates are Gregorian YYYY-MM-DD strings, never timestamps. */
export type DateOnly = string;
/** Local wall-clock time in HH:mm. It has no offset or timezone. */
export type LocalTime = string;
export interface DateRange { start: DateOnly | null; end: DateOnly | null }
export interface DateConstraints {
  min?: DateOnly | undefined;
  max?: DateOnly | undefined;
  isDateUnavailable?: ((date: DateOnly) => boolean) | undefined;
}

export function parseDateOnly(value: string): DateOnly | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? value : null;
}

/** UTC is used only as an arithmetic container, without converting the calendar day. */
export function dateOnlyToDate(value: DateOnly): Date {
  if (!parseDateOnly(value)) throw new RangeError(`Invalid calendar date: ${value}`);
  const date = new Date(0);
  date.setUTCFullYear(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)));
  return date;
}

function fromDate(date: Date): DateOnly {
  if (Number.isNaN(date.getTime())) throw new RangeError("Date calculation exceeds the supported range.");
  const year = date.getUTCFullYear();
  if (year < 1) return "0001-01-01";
  if (year > 9999) return "9999-12-31";
  return `${String(year).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function addDateDays(value: DateOnly, days: number): DateOnly {
  if (!Number.isSafeInteger(days)) throw new RangeError("Date offsets must be safe integers.");
  const date = dateOnlyToDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return fromDate(date);
}

export function addDateMonths(value: DateOnly, months: number): DateOnly {
  if (!Number.isSafeInteger(months)) throw new RangeError("Month offsets must be safe integers.");
  const date = dateOnlyToDate(value), day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return fromDate(date);
}

export function todayDateOnly(now = new Date()): DateOnly {
  return `${String(now.getFullYear()).padStart(4, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function assertDateConstraints({ min, max }: DateConstraints): void {
  if (min !== undefined && !parseDateOnly(min) || max !== undefined && !parseDateOnly(max)) throw new RangeError("Date bounds must use valid YYYY-MM-DD values.");
  if (min && max && min > max) throw new RangeError("The minimum date must not exceed the maximum date.");
}

export function dateValidationMessage(value: string, { min, max, isDateUnavailable }: DateConstraints = {}): string | null {
  assertDateConstraints({ min, max });
  if (!parseDateOnly(value)) return "Enter a valid date in YYYY-MM-DD format.";
  if (min && value < min) return `Choose ${min} or later.`;
  if (max && value > max) return `Choose ${max} or earlier.`;
  if (isDateUnavailable?.(value)) return "This date is unavailable.";
  return null;
}

export function dateRangeValidationMessage(range: DateRange, constraints: DateConstraints = {}): string | null {
  if (!range.start || !range.end) return "Choose a start and end date.";
  const startError = dateValidationMessage(range.start, constraints);
  const endError = dateValidationMessage(range.end, constraints);
  if (startError || endError) return startError ?? endError;
  if (range.start > range.end) return "The end date must be on or after the start date.";
  if (constraints.isDateUnavailable) {
    for (let day = range.start; day < range.end; day = addDateDays(day, 1)) {
      if (constraints.isDateUnavailable(day)) return "The range includes an unavailable date.";
    }
  }
  return null;
}

export function parseLocalTime(value: string, hourCycle: 12 | 24 = 24): LocalTime | null {
  const match = hourCycle === 24 ? /^(\d{2}):(\d{2})$/.exec(value.trim()) : /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || (hourCycle === 24 ? hour > 23 : hour < 1 || hour > 12)) return null;
  if (hourCycle === 12) hour = hour % 12 + (match[3]?.toUpperCase() === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function displayLocalTime(value: LocalTime | null, hourCycle: 12 | 24): string {
  if (!value || !parseLocalTime(value)) return "";
  if (hourCycle === 24) return value;
  const hour = Number(value.slice(0, 2));
  return `${hour % 12 || 12}:${value.slice(3)} ${hour >= 12 ? "PM" : "AM"}`;
}

export function timeValidationMessage(value: LocalTime, { min, max, minuteStep = 1 }: { min?: LocalTime | undefined; max?: LocalTime | undefined; minuteStep?: number | undefined } = {}): string | null {
  if (!parseLocalTime(value)) return "Enter a valid time.";
  if (!Number.isInteger(minuteStep) || minuteStep < 1 || minuteStep > 60) throw new RangeError("minuteStep must be an integer from 1 to 60.");
  if (min !== undefined && !parseLocalTime(min) || max !== undefined && !parseLocalTime(max)) throw new RangeError("Time bounds must use valid HH:mm values.");
  if (min && max && min > max) throw new RangeError("The minimum time must not exceed the maximum time.");
  if (min && value < min) return `Choose ${min} or later.`;
  if (max && value > max) return `Choose ${max} or earlier.`;
  const minutes = Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  const base = min ? Number(min.slice(0, 2)) * 60 + Number(min.slice(3)) : 0;
  if ((minutes - base) % minuteStep !== 0) return `Use ${minuteStep}-minute intervals${min ? ` from ${min}` : ""}.`;
  return null;
}
