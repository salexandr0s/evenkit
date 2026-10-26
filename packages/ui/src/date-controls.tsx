"use client";

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Button } from "./button.js";
import { Input } from "./field.js";
import { FieldFrame, useFieldDescription, type FieldContentProps } from "./field-frame.js";
import { CalendarDaysIcon } from "./icons.js";
import { Calendar, type CalendarProps } from "./date-calendar.js";
import { dateRangeValidationMessage, dateValidationMessage, displayLocalTime, parseDateOnly, parseLocalTime, timeValidationMessage, type DateConstraints, type DateOnly, type DateRange, type LocalTime } from "./date-utils.js";
import { formatDateOnly } from "./formatting.js";
import { Popover, PopoverContent, PopoverTrigger } from "./overlays.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

interface ValueProps {
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onValueChange?: ((value: string | null) => void) | undefined;
}
interface TextValueProps extends Omit<ComponentPropsWithoutRef<"input">, "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "size">, FieldContentProps, ValueProps {
  endAdornment?: ReactNode;
}
interface CanonicalFieldProps extends TextValueProps {
  parse: (text: string) => string | null;
  display: (value: string | null) => string;
  validate: (value: string) => string | null;
  formatHint: string;
  invalidMessage: string;
}

function useFormReset(control: { current: HTMLInputElement | HTMLButtonElement | null }, form: string | undefined, reset: () => void) {
  const latestReset = useRef(reset);
  useLayoutEffect(() => { latestReset.current = reset; });
  useEffect(() => {
    const owner = control.current?.form;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const handle = (event: Event) => {
      // A timer runs after every native/React reset listener has had a chance to cancel.
      const timer = setTimeout(() => { timers.delete(timer); if (!event.defaultPrevented) latestReset.current(); });
      timers.add(timer);
    };
    owner?.addEventListener("reset", handle);
    return () => { owner?.removeEventListener("reset", handle); timers.forEach(clearTimeout); };
  }, [control, form]);
}

const CanonicalField = forwardRef<HTMLInputElement, CanonicalFieldProps>(function CanonicalField({ value, defaultValue = null, onValueChange, parse, display, validate, formatHint, invalidMessage, label, hint, error, optional, fieldClassName, id, name, form, disabled, readOnly, required, onBlur, onInvalid, endAdornment, "aria-describedby": describedBy, ...props }, forwardedRef) {
  const [local, setLocal] = useState(defaultValue);
  const current = value !== undefined ? value : local;
  const formatted = display(current);
  const [draft, setDraft] = useState({ source: current, format: formatted, text: formatted });
  const [touched, setTouched] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  if (draft.source !== current || draft.format !== formatted) setDraft({ source: current, format: formatted, text: formatted });
  const parsed = draft.text.trim() ? parse(draft.text) : null;
  const validation = !draft.text.trim() ? required ? "Enter a value." : null : parsed ? validate(parsed) : invalidMessage;
  const visibleError = error || (touched ? validation : null);
  const description = useFieldDescription({ id, hint: <>{formatHint}{hint ? <> {hint}</> : null}</>, error: visibleError, describedBy });
  useLayoutEffect(() => { input.current?.setCustomValidity(disabled || readOnly ? "" : typeof error === "string" ? error : validation ?? ""); }, [validation, error, disabled, readOnly]);
  useFormReset(input, form, () => {
    if (value === undefined) { setLocal(defaultValue); setDraft({ source: defaultValue, format: display(defaultValue), text: display(defaultValue) }); }
    else setDraft({ source: value, format: display(value), text: display(value) });
    setTouched(false);
  });
  return <FieldFrame label={label} hint={<>{formatHint}{hint ? <> {hint}</> : null}</>} error={visibleError} optional={optional ?? false} fieldClassName={fieldClassName} description={description} required={required}>
    <Input {...props} ref={node => { input.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }} id={description.controlId} form={form} disabled={disabled} readOnly={readOnly} required={required} type="text" value={draft.text} aria-describedby={description.descriptionIds} aria-invalid={description.hasError || undefined} endAdornment={endAdornment} onInvalid={event => { setTouched(true); onInvalid?.(event); }} onBlur={event => { setTouched(true); onBlur?.(event); }} onChange={event => {
      const text = event.currentTarget.value;
      const next = parse(text);
      const valid = next && !validate(next) ? next : null;
      if (value === undefined) setLocal(valid);
      setDraft({ source: valid, format: display(valid), text });
      onValueChange?.(valid);
    }} />
    {name ? <input type="hidden" name={name} form={form} disabled={disabled} value={parsed && !validation ? parsed : ""} /> : null}
  </FieldFrame>;
});
const displayDate = (value: string | null) => value ?? "";

export interface DateFieldProps extends TextValueProps, DateConstraints {}
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField({ min, max, isDateUnavailable, ...props }, ref) {
  return <CanonicalField {...props} ref={ref} parse={parseDateOnly} display={displayDate} validate={value => dateValidationMessage(value, { min, max, isDateUnavailable })} formatHint="YYYY-MM-DD." invalidMessage="Enter a valid date in YYYY-MM-DD format." placeholder={props.placeholder ?? "YYYY-MM-DD"} />;
});

export interface DatePickerProps extends DateFieldProps {
  locale?: string | undefined;
  today?: DateOnly | undefined;
  weekStartsOn?: CalendarProps["weekStartsOn"];
  container?: HTMLElement | null | undefined;
  calendarLabel?: string | undefined;
}
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({ value, defaultValue = null, onValueChange, locale = "en-US", today, weekStartsOn, container, calendarLabel = "Choose date", ...props }, ref) {
  const [local, setLocal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const current = value !== undefined ? value : local;
  const change = (next: string | null) => { if (value === undefined) setLocal(next); onValueChange?.(next); };
  useFormReset(trigger, props.form, () => { if (value === undefined) setLocal(defaultValue); setOpen(false); });
  return <Popover open={open && !props.disabled && !props.readOnly} onOpenChange={next => setOpen(next && !trigger.current?.matches(":disabled"))}>
    <DateField {...props} ref={ref} value={current} onValueChange={change} endAdornment={<TooltipProvider><Tooltip><TooltipTrigger asChild><PopoverTrigger asChild><Button ref={trigger} form={props.form} className="pk-date-trigger" variant="ghost" size="sm" shape="icon" aria-label={`${calendarLabel}${current ? `, ${formatDateOnly(current, { locale })}` : ""}`} disabled={props.disabled || props.readOnly}><CalendarDaysIcon /></Button></PopoverTrigger></TooltipTrigger><TooltipContent container={container}>{calendarLabel}</TooltipContent></Tooltip></TooltipProvider>} />
    <PopoverContent ref={popup} container={container} className="pk-date-popup" aria-label={calendarLabel} onOpenAutoFocus={event => { event.preventDefault(); requestAnimationFrame(() => popup.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus()); }}>
      <Calendar value={current} onValueChange={date => { if (!trigger.current?.matches(":disabled")) change(date); setOpen(false); }} locale={locale} today={today} weekStartsOn={weekStartsOn} min={props.min} max={props.max} isDateUnavailable={props.isDateUnavailable} dir={props.dir === "rtl" ? "rtl" : props.dir === "ltr" ? "ltr" : undefined} />
    </PopoverContent>
  </Popover>;
});

export interface TimeFieldProps extends TextValueProps {
  hourCycle?: 12 | 24 | undefined;
  min?: LocalTime | undefined;
  max?: LocalTime | undefined;
  minuteStep?: number | undefined;
}
export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(function TimeField({ hourCycle = 24, min, max, minuteStep = 1, ...props }, ref) {
  if (!Number.isInteger(minuteStep) || minuteStep < 1 || minuteStep > 60) throw new RangeError("minuteStep must be an integer from 1 to 60.");
  return <CanonicalField {...props} ref={ref} parse={text => parseLocalTime(text, hourCycle)} display={value => displayLocalTime(value, hourCycle)} validate={value => timeValidationMessage(value, { min, max, minuteStep })} formatHint={hourCycle === 24 ? "24-hour time, HH:mm." : "12-hour time, h:mm AM or PM."} invalidMessage={hourCycle === 24 ? "Enter a time such as 09:30." : "Enter a time such as 9:30 AM."} placeholder={props.placeholder ?? (hourCycle === 24 ? "HH:mm" : "h:mm AM")} />;
});

export interface DateRangePreset { label: string; value: DateRange }
export interface DateRangePickerProps extends DateConstraints {
  label: ReactNode;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onValueChange?: ((range: DateRange) => void) | undefined;
  startName?: string | undefined;
  endName?: string | undefined;
  form?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  required?: boolean | undefined;
  locale?: string | undefined;
  today?: DateOnly | undefined;
  presets?: readonly DateRangePreset[] | undefined;
  hint?: ReactNode;
  error?: ReactNode;
  startLabel?: string | undefined;
  endLabel?: string | undefined;
  calendarLabel?: string | undefined;
  container?: HTMLElement | null | undefined;
}
const emptyRange: DateRange = { start: null, end: null };
export function DateRangePicker({ label, value, defaultValue = emptyRange, onValueChange, startName, endName, form, disabled, readOnly, required, locale, today, presets = [], hint, error, startLabel = "Start date", endLabel = "End date", calendarLabel = "Choose date range", container, ...constraints }: DateRangePickerProps) {
  const [local, setLocal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null), popup = useRef<HTMLDivElement>(null);
  const id = useId();
  const range = value ?? local;
  const rangeError = range.start && range.end ? dateRangeValidationMessage(range, constraints) : null;
  const change = (next: DateRange) => { if (value === undefined) setLocal(next); setAttemptError(null); onValueChange?.(next); };
  useFormReset(input, form, () => { if (value === undefined) setLocal(defaultValue); setAttemptError(null); setOpen(false); });
  const select = (date: string) => {
    if (input.current?.matches(":disabled") || input.current?.readOnly) { setOpen(false); return; }
    if (!range.start || range.end || date < range.start) { change({ start: date, end: null }); return; }
    const next = { start: range.start, end: date };
    const problem = dateRangeValidationMessage(next, constraints);
    if (problem) { setAttemptError(problem); return; }
    change(next); setOpen(false);
  };
  return <fieldset className="pk-date-range" disabled={disabled} aria-describedby={hint ? `${id}-hint` : undefined}>
    <legend className="pk-label">{label}{required ? <span className="pk-label-cue">Required</span> : null}</legend>
    {hint ? <p className="pk-field-hint" id={`${id}-hint`}>{hint}</p> : null}
    <div className="pk-date-range-fields">
      <DateField ref={input} label={startLabel} value={range.start} onValueChange={start => change({ ...range, start })} name={startName} form={form} required={required || !!range.end} disabled={disabled} readOnly={readOnly} {...constraints} />
      <DateField label={endLabel} value={range.end} onValueChange={end => change({ ...range, end })} name={endName} form={form} required={required || !!range.start} disabled={disabled} readOnly={readOnly} {...constraints} error={error || rangeError} />
    </div>
    <Popover open={open && !disabled && !readOnly} onOpenChange={next => setOpen(next && !input.current?.matches(":disabled"))}>
      <PopoverTrigger asChild><Button variant="outline" form={form} disabled={disabled || readOnly} startIcon={<CalendarDaysIcon />}>{calendarLabel}</Button></PopoverTrigger>
      <PopoverContent ref={popup} container={container} className="pk-date-popup" aria-label={calendarLabel} onOpenAutoFocus={event => { event.preventDefault(); requestAnimationFrame(() => popup.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus()); }}>
        <Calendar range={range} value={range.end ?? range.start} onValueChange={select} locale={locale} today={today} {...constraints} />
        <p className="pk-date-range-status" role="status">{attemptError ?? (range.start && !range.end ? `${formatDateOnly(range.start, { locale })} selected. Choose an end date.` : "Choose the first and last day.")}</p>
        {presets.length ? <div className="pk-date-presets">{presets.map(preset => <Button key={preset.label} size="sm" variant="outline" disabled={!!dateRangeValidationMessage(preset.value, constraints)} onClick={() => { if (!input.current?.matches(":disabled") && !input.current?.readOnly) change(preset.value); setOpen(false); }}>{preset.label}</Button>)}</div> : null}
      </PopoverContent>
    </Popover>
  </fieldset>;
}
