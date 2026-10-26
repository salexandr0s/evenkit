"use client";

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./button.js";
import { TextField, type TextFieldProps } from "./field.js";
import { useValueFieldReset } from "./multi-value-reset.js";
import { PlusIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";
import { assertNumberConstraints, parseLocaleNumber, stepNumber, validateNumber, type NumberConstraints } from "./number-field-utils.js";

export { parseLocaleNumber, stepNumber, validateNumber, type ParsedNumber, type NumberConstraints } from "./number-field-utils.js";

export interface NumberFieldProps extends Omit<TextFieldProps, "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "name" | "endAdornment">, NumberConstraints {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  locale?: string;
  name?: string;
  useGrouping?: boolean;
  minimumFractionDigits?: number;
  showSteppers?: boolean;
  unit?: ReactNode;
  increaseLabel?: string;
  decreaseLabel?: string;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField({
  value, defaultValue = null, onValueChange, locale = "en-US", min, max, step, maximumFractionDigits = 6, minimumFractionDigits = 0,
  name, form, disabled, readOnly, useGrouping = true, showSteppers = true, unit, increaseLabel = "Increase value", decreaseLabel = "Decrease value",
  onBlur, onFocus, onKeyDown, onInvalid, error, ...props
}, ref) {
  const constraints = { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}), ...(step !== undefined ? { step } : {}), maximumFractionDigits };
  assertNumberConstraints(constraints);
  if (minimumFractionDigits > maximumFractionDigits) throw new RangeError("minimumFractionDigits must not exceed maximumFractionDigits.");
  const format = (number: number | null) => number === null ? "" : new Intl.NumberFormat(locale, { maximumFractionDigits: 20, minimumFractionDigits, useGrouping }).format(number);
  const [local, setLocal] = useState(defaultValue);
  const current = value !== undefined ? value : local;
  const [draft, setDraft] = useState(() => format(current));
  const [issue, setIssue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const lastPublished = useRef(current);
  const previousFormat = useRef({ locale, maximumFractionDigits, minimumFractionDigits, useGrouping });
  function publish(next: number | null) {
    lastPublished.current = next;
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  }
  useEffect(() => {
    const before = previousFormat.current;
    if (!Object.is(current, lastPublished.current) || before.locale !== locale || before.maximumFractionDigits !== maximumFractionDigits || before.minimumFractionDigits !== minimumFractionDigits || before.useGrouping !== useGrouping) {
      setDraft(format(current)); setIssue(""); lastPublished.current = current;
    }
    previousFormat.current = { locale, maximumFractionDigits, minimumFractionDigits, useGrouping };
  });
  useValueFieldReset(input, form, () => {
    const next = value === undefined ? defaultValue : value;
    if (value === undefined) setLocal(next);
    setDraft(format(next)); setIssue(""); lastPublished.current = next;
  });
  const parsed = parseLocaleNumber(draft, locale, constraints);
  const validation = parsed.status === "invalid" ? parsed.message : parsed.status === "incomplete" ? "Finish entering the number." : "";
  useEffect(() => { input.current?.setCustomValidity(validation); }, [validation]);
  function commit() {
    if (parsed.status === "invalid" || parsed.status === "incomplete") { setIssue(validation); return; }
    // Required feedback starts at native validation; preserve it on later blur.
    if (parsed.status === "empty" && props.required) return;
    const next = parsed.status === "empty" ? null : parsed.value;
    if (!Object.is(next, current)) publish(next);
    setDraft(format(next)); setIssue("");
  }
  function increment(direction: -1 | 1) {
    const numericDraft = parseLocaleNumber(draft, locale, { maximumFractionDigits: 15 });
    const next = stepNumber(numericDraft.status === "valid" ? numericDraft.value : current, direction, constraints);
    const problem = validateNumber(next, constraints);
    if (problem) { setIssue(problem); return; }
    publish(next); setDraft(format(next)); setIssue(""); input.current?.focus();
  }
  return <div className="pk-number-field">
    <TextField {...props} ref={node => {
      input.current = node;
      if (typeof ref === "function") return ref(node);
      if (ref) ref.current = node;
    }} type="text" inputMode="decimal" role="spinbutton" form={form} disabled={disabled} readOnly={readOnly} value={draft}
      aria-valuenow={parsed.status === "valid" ? parsed.value : undefined} aria-valuemin={min} aria-valuemax={max} aria-valuetext={draft || undefined}
      onInvalid={event => { onInvalid?.(event); if (!event.defaultPrevented) setIssue(validation || event.currentTarget.validationMessage); }}
      error={error || issue} onChange={event => {
        const text = event.currentTarget.value;
        setDraft(text); setIssue("");
        const next = parseLocaleNumber(text, locale, constraints);
        if (next.status === "empty") publish(null);
        else if (next.status === "valid") publish(next.value);
      }} onBlur={event => { onBlur?.(event); if (!event.defaultPrevented) commit(); }} onFocus={onFocus}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.nativeEvent.isComposing || disabled || readOnly) return;
        if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); increment(event.key === "ArrowUp" ? 1 : -1); }
        else if (event.key === "Enter") commit();
      }}
      endAdornment={<>{unit ? <span className="pk-number-unit">{unit}</span> : null}{showSteppers && !readOnly ? <TooltipProvider><span className="pk-number-steppers">
        <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="xs" shape="icon" aria-label={decreaseLabel} disabled={disabled || (parsed.status === "valid" && min !== undefined && parsed.value <= min)} onMouseDown={event => event.preventDefault()} onClick={() => increment(-1)}><span className="pk-number-minus" aria-hidden="true">−</span></Button></TooltipTrigger><TooltipContent>{decreaseLabel}</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="xs" shape="icon" aria-label={increaseLabel} disabled={disabled || (parsed.status === "valid" && max !== undefined && parsed.value >= max)} onMouseDown={event => event.preventDefault()} onClick={() => increment(1)}><PlusIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{increaseLabel}</TooltipContent></Tooltip>
      </span></TooltipProvider> : null}</>} />
    {name ? <input type="hidden" name={name} form={form} value={parsed.status === "valid" ? parsed.value : ""} disabled={disabled} /> : null}
  </div>;
});

export interface CurrencyFieldProps extends Omit<NumberFieldProps, "unit"> { currency: string }
/** Values use major currency units. Applications own conversion to minor-unit integers. */
export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(function CurrencyField({ currency, locale = "en-US", maximumFractionDigits, minimumFractionDigits, ...props }, ref) {
  const digits = new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return <NumberField {...props} ref={ref} locale={locale} maximumFractionDigits={maximumFractionDigits ?? digits} minimumFractionDigits={minimumFractionDigits ?? digits} unit={currency.toUpperCase()} />;
});

/** Percentage values use percentage points: 12.5 means 12.5%, not 1250%. */
export const PercentageField = forwardRef<HTMLInputElement, Omit<NumberFieldProps, "unit">>(function PercentageField(props, ref) {
  return <NumberField {...props} ref={ref} unit="%" />;
});
export interface UnitFieldProps extends Omit<NumberFieldProps, "unit"> { unit: string }
export const UnitField = forwardRef<HTMLInputElement, UnitFieldProps>(function UnitField(props, ref) {
  return <NumberField {...props} ref={ref} />;
});
