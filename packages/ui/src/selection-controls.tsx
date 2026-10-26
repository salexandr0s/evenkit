"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { forwardRef, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from "react";
import { Button, type ButtonProps, type ControlSize } from "./button.js";
import { classes } from "./classes.js";
import { useFieldDescription } from "./field-frame.js";
import { Spinner } from "./feedback.js";
import { CheckIcon, CircleAlertIcon, CopyIcon } from "./icons.js";
import { IconButton } from "./icon-button.js";

export type CheckboxState = boolean | "indeterminate";

interface ChoiceFeedback {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  controlSize?: ControlSize;
}

function ChoiceMessages({ hint, error, description }: Pick<ChoiceFeedback, "hint" | "error"> & { description: ReturnType<typeof useFieldDescription> }) {
  return <>
    {description.hasHint ? <div className="pk-choice-hint" id={description.hintId}>{hint}</div> : null}
    {description.hasError ? <div className="pk-choice-error" id={description.errorId} role="alert">{error}</div> : null}
  </>;
}

/** Native constraints remain on Radix's input; naming, feedback and focus stay on the visible control. */
function useChoiceValidation(error: ReactNode, formId: string | undefined, role: "checkbox" | "radio" | "switch") {
  const region = useRef<HTMLDivElement>(null);
  const [nativeError, setNativeError] = useState("");
  useEffect(() => {
    const form = region.current?.querySelector<HTMLInputElement>('input[aria-hidden="true"]')?.form;
    if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setNativeError(""); });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [formId]);
  useEffect(() => {
    if (!nativeError) return;
    // Descendant Radix effects synchronize controlled values to the native inputs first.
    const inputs = region.current?.querySelectorAll<HTMLInputElement>('input[aria-hidden="true"]');
    if (inputs && !Array.from(inputs).some(input => input.willValidate && !input.validity.valid)) setNativeError("");
  });
  function onInvalidCapture(event: FormEvent<HTMLDivElement>) {
    const input = event.target;
    if (event.defaultPrevented || !(input instanceof HTMLInputElement) || input.getAttribute("aria-hidden") !== "true") return;
    event.preventDefault();
    setNativeError(input.validationMessage);
    const first = input.form ? Array.from(input.form.elements).find(element => (
      element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement
    ) && element.willValidate && !element.validity.valid) : input;
    if (first === input) region.current?.querySelector<HTMLButtonElement>(`button[role="${role}"]:not(:disabled)`)?.focus();
  }
  const hasHostError = error !== null && error !== undefined && error !== false && error !== "";
  return { region, error: hasHostError ? error : nativeError, clear: () => setNativeError(""), onInvalidCapture };
}

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild" | "children" | "type">, ChoiceFeedback {}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, hint, error, controlSize = "sm", id, className, onCheckedChange, "aria-describedby": describedBy, "aria-invalid": invalid, ...props }, ref,
) {
  const validation = useChoiceValidation(error, props.form, "checkbox");
  const description = useFieldDescription({ id, hint, error: validation.error, describedBy });
  return <div ref={validation.region} onInvalidCapture={validation.onInvalidCapture} className="pk-choice-field" data-size={controlSize} data-unlabelled={label == null || undefined}>
    <CheckboxPrimitive.Root {...props} ref={ref} id={description.controlId} className={classes("pk-check-control", className)} data-size={controlSize}
      onCheckedChange={next => { validation.clear(); onCheckedChange?.(next); }}
      aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid}>
      <span className="pk-check-box" aria-hidden="true"><CheckboxPrimitive.Indicator className="pk-check-mark">
        <CheckIcon size="sm" className="pk-check-tick" /><span className="pk-check-mixed" />
      </CheckboxPrimitive.Indicator></span>
    </CheckboxPrimitive.Root>
    {label != null ? <label className="pk-choice-label" htmlFor={description.controlId}>{label}</label> : null}
    <ChoiceMessages hint={hint} error={validation.error} description={description} />
  </div>;
});

export interface CheckboxGroupProps extends Omit<ComponentPropsWithoutRef<"fieldset">, "title"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  orientation?: "vertical" | "horizontal";
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { label, hint, error, orientation = "vertical", children, className, id, "aria-describedby": describedBy, ...props }, ref,
) {
  const description = useFieldDescription({ id, hint, error, describedBy });
  return <fieldset {...props} ref={ref} id={description.controlId} className={classes("pk-choice-group", className)} aria-describedby={description.descriptionIds} aria-invalid={description.hasError || undefined}>
    <legend className="pk-choice-legend">{label}</legend>
    <div className="pk-choice-options" data-orientation={orientation}>{children}</div>
    <ChoiceMessages hint={hint} error={error} description={description} />
  </fieldset>;
});

export interface ChoiceOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<typeof RadioPrimitive.Root>, "asChild" | "children"> {
  label: ReactNode;
  options: readonly ChoiceOption[];
  hint?: ReactNode;
  error?: ReactNode;
  controlSize?: ControlSize;
}

function RadioGroupControl({ label, options, hint, error, controlSize = "md", id, className, orientation = "vertical", segmented = false, forwardedRef, onValueChange, onKeyDownCapture, onKeyUpCapture, onFocusCapture, onPointerDownCapture, "aria-describedby": describedBy, "aria-invalid": invalid, ...props }: RadioGroupProps & { segmented?: boolean; forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const validation = useChoiceValidation(error, props.form, "radio");
  const description = useFieldDescription({ id, hint, error: validation.error, describedBy });
  const navigationIntent = useRef<{ from: EventTarget } | null>(null);
  const labelId = `${description.controlId}-label`;
  return <div ref={validation.region} onInvalidCapture={validation.onInvalidCapture} className="pk-radio-field" data-size={controlSize}>
    <span className="pk-choice-legend" id={labelId}>{label}</span>
    <RadioPrimitive.Root {...props} ref={forwardedRef} id={description.controlId} className={classes(segmented ? "pk-segmented-control" : "pk-radio-group", className)} data-size={controlSize}
      orientation={orientation} aria-labelledby={labelId} aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid}
      onValueChange={value => { validation.clear(); onValueChange?.(value); }}
      onKeyDownCapture={event => {
        onKeyDownCapture?.(event);
        const keys = orientation === "horizontal" ? ["ArrowLeft", "ArrowRight", "Home", "End"] : ["ArrowUp", "ArrowDown", "Home", "End"];
        navigationIntent.current = !event.defaultPrevented && keys.includes(event.key) ? { from: event.target } : null;
      }}
      onKeyUpCapture={event => {
        onKeyUpCapture?.(event);
        const current = navigationIntent.current;
        // Radix defers roving focus. Keep intent beyond keyup until that earlier focus task has run.
        if (current) setTimeout(() => { if (navigationIntent.current === current) navigationIntent.current = null; }, 0);
      }}
      onPointerDownCapture={event => { navigationIntent.current = null; onPointerDownCapture?.(event); }}
      onFocusCapture={event => {
        onFocusCapture?.(event);
        const intent = navigationIntent.current;
        if (!intent || intent.from === event.target) return;
        navigationIntent.current = null;
        if (!event.defaultPrevented && event.target instanceof HTMLButtonElement && event.target.getAttribute("role") === "radio") {
          event.preventDefault(); event.target.click();
        }
      }}>
      {options.map((option, index) => {
        const optionId = `${description.controlId}-option-${index}`;
        const optionDescription = option.description == null ? undefined : `${optionId}-description`;
        return segmented ? <RadioPrimitive.Item key={option.value} value={option.value} disabled={option.disabled} className="pk-segmented-item"
          id={optionId} aria-labelledby={`${optionId}-label`} aria-describedby={optionDescription}>
          <span id={`${optionId}-label`}>{option.label}</span>{optionDescription ? <span className="pk-choice-hint" id={optionDescription}>{option.description}</span> : null}
        </RadioPrimitive.Item> : <div key={option.value} className="pk-choice-field" data-size={controlSize}>
          <RadioPrimitive.Item id={optionId} value={option.value} disabled={option.disabled} className="pk-radio-control" aria-describedby={optionDescription}>
            <span className="pk-radio-circle" aria-hidden="true"><RadioPrimitive.Indicator className="pk-radio-dot" /></span>
          </RadioPrimitive.Item>
          <label htmlFor={optionId} className="pk-choice-label">{option.label}</label>
          {optionDescription ? <span className="pk-choice-hint" id={optionDescription}>{option.description}</span> : null}
        </div>;
      })}
    </RadioPrimitive.Root>
    <ChoiceMessages hint={hint} error={validation.error} description={description} />
  </div>;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(props, ref) {
  return <RadioGroupControl {...props} forwardedRef={ref} />;
});

export type SegmentedControlProps = Omit<RadioGroupProps, "orientation">;
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(props, ref) {
  return <RadioGroupControl {...props} forwardedRef={ref} orientation="horizontal" segmented />;
});

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "asChild" | "children" | "type">, ChoiceFeedback {
  /** Keep focus while the application saves a preference; suppress further activation. */
  pending?: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, hint, error, pending = false, controlSize = "md", id, className, onClick, onCheckedChange, "aria-describedby": describedBy, "aria-invalid": invalid, "aria-disabled": ariaDisabled, "aria-busy": busy, ...props }, ref,
) {
  const validation = useChoiceValidation(error, props.form, "switch");
  const description = useFieldDescription({ id, hint, error: validation.error, describedBy });
  return <div ref={validation.region} onInvalidCapture={validation.onInvalidCapture} className="pk-choice-field pk-switch-field" data-size={controlSize} data-unlabelled={label == null || undefined}>
    <SwitchPrimitive.Root {...props} ref={ref} id={description.controlId} className={classes("pk-switch-control", className)} data-size={controlSize}
      data-pending={pending || undefined} aria-busy={pending || busy} aria-disabled={pending || ariaDisabled}
      aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid}
      onCheckedChange={next => { validation.clear(); onCheckedChange?.(next); }}
      onClick={event => { onClick?.(event); if (pending) event.preventDefault(); }}>
      <span className="pk-switch-track" aria-hidden="true"><SwitchPrimitive.Thumb className="pk-switch-thumb">{pending ? <span className="pk-switch-pending" /> : null}</SwitchPrimitive.Thumb></span>
    </SwitchPrimitive.Root>
    {label != null ? <label className="pk-choice-label" htmlFor={description.controlId}>{label}</label> : null}
    <ChoiceMessages hint={hint} error={validation.error} description={description} />
  </div>;
});

export interface ToggleProps extends Omit<ButtonProps, "aria-pressed"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed: controlled, defaultPressed = false, onPressedChange, onClick, className, variant = "outline", ...props }, ref,
) {
  const [local, setLocal] = useState(defaultPressed);
  const pressed = controlled ?? local;
  return <Button {...props} ref={ref} className={classes("pk-toggle", className)} variant={variant} aria-pressed={pressed} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (controlled === undefined) setLocal(!pressed);
    onPressedChange?.(!pressed);
  }} />;
});

export type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & { controlSize?: ControlSize };
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup({ className, controlSize = "md", ...props }, ref) {
  return <ToggleGroupPrimitive.Root {...props} ref={ref} className={classes("pk-toggle-group", className)} data-size={controlSize} />;
});

export type ToggleGroupItemProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem({ className, ...props }, ref) {
  return <ToggleGroupPrimitive.Item {...props} ref={ref} className={classes("pk-toggle-item", className)} />;
});

export interface ButtonGroupProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  orientation?: "horizontal" | "vertical";
  joined?: boolean;
}
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { label, orientation = "horizontal", joined = false, className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={classes("pk-button-group", className)} role="group" aria-label={label} data-orientation={orientation} data-joined={joined || undefined} />;
});

export interface CopyActionProps extends Omit<ButtonProps, "onClick" | "loading"> {
  text: string;
  writeText?: (text: string) => Promise<void>;
  copyingMessage?: string;
  copiedMessage?: string;
  errorMessage?: string;
}
export const CopyAction = forwardRef<HTMLButtonElement, CopyActionProps>(function CopyAction(
  { text, writeText, copyingMessage = "Copying…", copiedMessage = "Copied to clipboard.", errorMessage = "Could not copy. Try again.", children = "Copy", variant = "outline", shape = "default", "aria-label": accessibleLabel, ...props }, ref,
) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const mounted = useRef(false);
  const attempt = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; attempt.current += 1; };
  }, []);
  useEffect(() => { attempt.current += 1; setStatus("idle"); }, [text]);
  async function copy() {
    const current = ++attempt.current;
    setStatus("copying");
    try {
      if (writeText) await writeText(text);
      else {
        if (!globalThis.navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(text);
      }
      if (mounted.current && current === attempt.current) setStatus("copied");
    } catch {
      if (mounted.current && current === attempt.current) setStatus("error");
    }
  }
  const icon = status === "copying" ? <Spinner aria-hidden="true" /> : status === "copied" ? <CheckIcon /> : <CopyIcon />;
  return <span className="pk-copy-action" data-status={status} data-shape={shape}>
    {shape === "icon" ? <IconButton {...props} ref={ref} label={accessibleLabel ?? (typeof children === "string" ? children : "Copy")} variant={variant} aria-busy={status === "copying" || undefined} onClick={() => { void copy(); }}>{icon}</IconButton> : <Button {...props} ref={ref} variant={variant} aria-label={accessibleLabel} aria-busy={status === "copying" || undefined}
      startIcon={icon} onClick={() => { void copy(); }}>{children}</Button>}
    <span className={classes("pk-copy-feedback", shape === "icon" && status !== "error" && "pk-visually-hidden")} role="status" data-error={status === "error" || undefined}>
      {status === "error" ? <CircleAlertIcon size="sm" /> : status === "copied" ? <CheckIcon size="sm" /> : null}
      <span>{status === "copying" ? copyingMessage : status === "copied" ? copiedMessage : status === "error" ? errorMessage : ""}</span>
    </span>
  </span>;
});

export interface ProgressProps extends Omit<ComponentPropsWithoutRef<"progress">, "children" | "value" | "max"> {
  label: ReactNode;
  valueText?: string;
  value?: number;
  max?: number;
}
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { label, id, max = 100, value, valueText, className, "aria-describedby": describedBy, ...props }, ref,
) {
  const generatedId = useId();
  const controlId = id ?? `pk-progress-${generatedId}`;
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const amount = value !== undefined && Number.isFinite(value) ? Math.max(0, Math.min(limit, value)) : undefined;
  const complete = amount === limit;
  const text = valueText ?? (amount === undefined ? "In progress" : complete ? "100% complete" : `${Math.round(amount / limit * 100)}%`);
  return <div className="pk-measurement" data-complete={complete || undefined}>
    <div className="pk-measurement-heading"><label htmlFor={controlId}>{label}</label><span id={`${controlId}-value`}>{complete ? <CheckIcon size="sm" aria-hidden="true" /> : null}{text}</span></div>
    <div className="pk-progress-track" dir={props.dir}>
      <progress {...props} ref={ref} id={controlId} className={classes("pk-progress", className)} max={limit} value={amount}
        aria-valuetext={text} aria-describedby={[describedBy, `${controlId}-value`].filter(Boolean).join(" ")} />
      {amount === undefined ? <span className="pk-progress-indeterminate" aria-hidden="true" /> : null}
    </div>
  </div>;
});

export interface MeterProps extends Omit<ComponentPropsWithoutRef<"meter">, "children" | "value" | "min" | "max"> {
  label: ReactNode;
  valueText?: string;
  value?: number;
  min?: number;
  max?: number;
}
export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { label, id, min = 0, max = 100, value = 0, valueText, className, "aria-describedby": describedBy, ...props }, ref,
) {
  const generatedId = useId();
  const controlId = id ?? `pk-meter-${generatedId}`;
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) && max > lower ? max : lower + 100;
  const amount = Number.isFinite(value) ? Math.max(lower, Math.min(upper, value)) : lower;
  const text = valueText ?? `${amount} / ${upper}`;
  return <div className="pk-measurement">
    <div className="pk-measurement-heading"><label htmlFor={controlId}>{label}</label><span id={`${controlId}-value`}>{text}</span></div>
    <meter {...props} ref={ref} id={controlId} className={classes("pk-meter", className)} min={lower} max={upper} value={amount}
      aria-valuetext={text} aria-describedby={[describedBy, `${controlId}-value`].filter(Boolean).join(" ")} />
  </div>;
});
