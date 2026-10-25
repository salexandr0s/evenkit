"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { foundation } from "@project-kit/tokens";
import {
  forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState,
  type ComponentPropsWithoutRef, type ForwardedRef, type ReactNode, type RefObject,
} from "react";
import { Button, type ControlSize } from "./button.js";
import { classes } from "./classes.js";
import { ActionMessage, Spinner, type ActionMessageProps } from "./feedback.js";
import { FieldFrame, useFieldDescription, type FieldContentProps } from "./field-frame.js";
import { TextField, type TextFieldProps } from "./field.js";
import { CheckIcon, ChevronDownIcon, CircleAlertIcon, EyeIcon, EyeOffIcon, PencilIcon, SearchIcon, XIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

function useInputHandle(forwardedRef: ForwardedRef<HTMLInputElement>) {
  const input = useRef<HTMLInputElement>(null);
  const setInput = useCallback((node: HTMLInputElement | null) => {
    input.current = node;
    if (typeof forwardedRef === "function") {
      const cleanup: unknown = forwardedRef(node);
      if (typeof cleanup === "function") return () => { input.current = null; cleanup(); };
    } else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);
  return { input, setInput };
}

/** Wait until reset dispatch ends so a host can cancel it with preventDefault. */
function useNativeReset(input: RefObject<HTMLInputElement | null>, formId: string | undefined, reset: () => void) {
  const latestReset = useRef(reset);
  latestReset.current = reset;
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    let mounted = true;
    const onReset = (event: Event) => {
      queueMicrotask(() => { if (mounted && !event.defaultPrevented) latestReset.current(); });
    };
    form.addEventListener("reset", onReset);
    return () => { mounted = false; form.removeEventListener("reset", onReset); };
  }, [input, formId]);
}

export interface FieldsetProps extends ComponentPropsWithoutRef<"fieldset"> {
  legend: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
}

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { className, legend, hint, error, required = false, optional = false, id, children, "aria-describedby": describedBy, ...props }, ref,
) {
  const description = useFieldDescription({ id, hint, error, describedBy });
  return (
    <fieldset {...props} id={description.controlId} ref={ref} className={classes("pk-fieldset", className)} aria-describedby={description.descriptionIds}>
      <legend className="pk-fieldset-legend">{legend}{required || optional ? <span className="pk-label-cue" aria-hidden="true">{required ? "Required" : "Optional"}</span> : null}</legend>
      {description.hasHint ? <div className="pk-field-hint" id={description.hintId}>{hint}</div> : null}
      <div className="pk-fieldset-content">{children}</div>
      {description.hasError ? <div className="pk-field-error" id={description.errorId} role="alert"><CircleAlertIcon size="sm" /><div>{error}</div></div> : null}
    </fieldset>
  );
});

export interface FormSectionProps extends ComponentPropsWithoutRef<"section"> {
  heading: ReactNode;
  headingAs?: "h2" | "h3" | "h4" | "h5" | "h6";
  description?: ReactNode;
}

export const FormSection = forwardRef<HTMLElement, FormSectionProps>(function FormSection(
  { className, heading, headingAs: Heading = "h2", description, children, "aria-labelledby": labelledBy, "aria-describedby": describedBy, ...props }, ref,
) {
  const headingId = useId();
  return (
    <section {...props} ref={ref} className={classes("pk-form-section", className)} aria-labelledby={labelledBy ?? headingId} aria-describedby={[describedBy, description ? `${headingId}-description` : undefined].filter(Boolean).join(" ") || undefined}>
      <header className="pk-form-section-header"><Heading id={headingId}>{heading}</Heading>{description ? <p id={`${headingId}-description`}>{description}</p> : null}</header>
      {children}
    </section>
  );
});

export interface FormErrorItem { fieldId: string; message: ReactNode }
export interface FormErrorSummaryProps extends ComponentPropsWithoutRef<"div"> {
  errors: readonly FormErrorItem[];
  heading?: ReactNode;
}

export const FormErrorSummary = forwardRef<HTMLDivElement, FormErrorSummaryProps>(function FormErrorSummary(
  { errors, heading = "Check the following fields", className, role = "alert", tabIndex = -1, "aria-labelledby": labelledBy, ...props }, ref,
) {
  const headingId = useId();
  if (errors.length === 0) return null;
  return (
    <div {...props} ref={ref} className={classes("pk-form-summary", className)} role={role} tabIndex={tabIndex} aria-labelledby={labelledBy ?? headingId}>
      <div className="pk-form-summary-header"><span className="pk-form-summary-icon" aria-hidden="true"><CircleAlertIcon /></span><p id={headingId} className="pk-form-summary-heading">{heading}</p></div>
      <ul>{errors.map((error, index) => <li key={`${error.fieldId}-${index}`}><a href={`#${encodeURIComponent(error.fieldId)}`} onClick={event => {
        const target = document.getElementById(error.fieldId);
        if (target && !target.matches(":disabled")) { event.preventDefault(); target.focus(); }
      }}>{error.message}</a></li>)}</ul>
    </div>
  );
});

export interface SearchFieldProps extends Omit<TextFieldProps, "type" | "value" | "defaultValue" | "startAdornment" | "endAdornment" | "results"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearLabel?: string;
  results?: ReactNode;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, defaultValue = "", onValueChange, onChange, clearLabel = "Clear search", results, disabled, readOnly, form, "aria-describedby": describedBy, ...props }, ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const { input, setInput } = useInputHandle(ref);
  const resultsId = useId();
  const query = value ?? localValue;
  const hasResults = results !== undefined && results !== null && results !== false;
  useNativeReset(input, form, () => { if (value === undefined) setLocalValue(defaultValue); });
  function change(next: string) { if (value === undefined) setLocalValue(next); onValueChange?.(next); }
  function clear() {
    const node = input.current;
    if (!node) return;
    // Use the native setter so React detects a value change and supplies a real ChangeEvent.
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (nativeSetter) {
      nativeSetter.call(node, "");
      node.dispatchEvent(new Event("input", { bubbles: true }));
    }
    node.focus();
  }
  return (
    <div className="pk-search-field">
      <TextField {...props} ref={setInput} form={form} type="search" disabled={disabled} readOnly={readOnly} value={query}
        aria-describedby={[describedBy, hasResults ? resultsId : undefined].filter(Boolean).join(" ") || undefined}
        onChange={event => { onChange?.(event); if (!event.defaultPrevented) change(event.currentTarget.value); }}
        startAdornment={<SearchIcon size="sm" />}
        endAdornment={query && !disabled && !readOnly ? <Button type="button" className="pk-field-action" size="xs" variant="ghost" shape="icon" aria-label={clearLabel} onClick={clear}><XIcon size="sm" /></Button> : null}
      />
      {hasResults ? <p className="pk-field-hint pk-search-results" id={resultsId} role="status">{results}</p> : null}
    </div>
  );
});

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "endAdornment"> {
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { showLabel = "Show password", hideLabel = "Hide password", disabled, readOnly, fieldClassName, ...props }, ref,
) {
  const [visible, setVisible] = useState(false);
  const { input, setInput } = useInputHandle(ref);
  return <TextField {...props} ref={setInput} fieldClassName={classes("pk-password-field", fieldClassName)} type={visible ? "text" : "password"} disabled={disabled} readOnly={readOnly}
    endAdornment={<TooltipProvider><Tooltip><TooltipTrigger asChild><Button className="pk-field-action pk-password-action" size="xs" variant="ghost" shape="icon" aria-label={visible ? hideLabel : showLabel} aria-pressed={visible} disabled={disabled}
      onMouseDown={event => event.preventDefault()} onClick={() => {
        const start = input.current?.selectionStart ?? null;
        const end = input.current?.selectionEnd ?? null;
        setVisible(current => !current);
        queueMicrotask(() => { if (start !== null && end !== null) input.current?.setSelectionRange(start, end); });
      }}>{visible ? <EyeOffIcon size="sm" /> : <EyeIcon size="sm" />}</Button></TooltipTrigger><TooltipContent>{visible ? hideLabel : showLabel}</TooltipContent></Tooltip></TooltipProvider>} />;
});

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ChoiceFieldProps extends Omit<TextFieldProps, "value" | "defaultValue" | "type" | "startAdornment" | "endAdornment"> {
  options: readonly ComboboxOption[];
  emptyMessage?: ReactNode;
  clearLabel?: string;
  openLabel?: string;
  clearable?: boolean;
  loading?: boolean;
  loadingMessage?: ReactNode;
  container?: ComponentPropsWithoutRef<typeof ComboboxPrimitive.Portal>["container"];
  renderOption?: (option: ComboboxOption) => ReactNode;
}

export interface ComboboxProps extends ChoiceFieldProps {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onInputValueChange?: (query: string) => void;
}

export interface AutocompleteProps extends ChoiceFieldProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface ChoiceInputProps {
  inputProps: Omit<TextFieldProps, keyof FieldContentProps | "value" | "defaultValue" | "type" | "startAdornment" | "endAdornment">;
  inputRef: (node: HTMLInputElement | null) => void | (() => void);
  controlId: string;
  labelId: string;
  descriptionIds: string | undefined;
  invalid: TextFieldProps["aria-invalid"];
  controlSize: ControlSize;
  clearable: boolean;
  clearLabel: string;
  openLabel: string;
  autocomplete?: boolean;
}

function ChoiceInput({ inputProps, inputRef, controlId, labelId, descriptionIds, invalid, controlSize, clearable, clearLabel, openLabel, autocomplete = false }: ChoiceInputProps) {
  const Group = autocomplete ? AutocompletePrimitive.InputGroup : ComboboxPrimitive.InputGroup;
  const Trigger = autocomplete ? AutocompletePrimitive.Trigger : ComboboxPrimitive.Trigger;
  return (
    <Group className="pk-combobox-control" data-size={controlSize} dir={inputProps.dir} data-invalid={(invalid === true || invalid === "true") || undefined}>
      <ComboboxPrimitive.Input {...inputProps} ref={inputRef} id={controlId} className={classes("pk-input pk-combobox-input", inputProps.className)} data-size={controlSize} aria-labelledby={inputProps["aria-labelledby"] ?? (inputProps["aria-label"] === undefined ? labelId : undefined)} aria-describedby={descriptionIds} aria-invalid={invalid} />
      <span className="pk-combobox-actions">
        {clearable && !inputProps.readOnly ? <ComboboxPrimitive.Clear className="pk-combobox-action" aria-label={clearLabel}><XIcon size="sm" /></ComboboxPrimitive.Clear> : null}
        <Trigger className="pk-combobox-action pk-combobox-trigger" aria-label={openLabel}><ChevronDownIcon size="sm" /></Trigger>
      </span>
    </Group>
  );
}

function ChoiceOption({ option, autocomplete, renderOption }: { option: ComboboxOption; autocomplete: boolean; renderOption: ChoiceFieldProps["renderOption"] }) {
  const descriptionId = useId();
  const Item = autocomplete ? AutocompletePrimitive.Item : ComboboxPrimitive.Item;
  return <Item className="pk-combobox-option" value={autocomplete ? option : option.value} disabled={option.disabled ?? false} aria-label={option.label} aria-describedby={option.description ? descriptionId : undefined}>
    <span className="pk-combobox-option-copy">{renderOption ? renderOption(option) : <span>{option.label}</span>}{option.description ? <span id={descriptionId} className="pk-combobox-option-description">{option.description}</span> : null}</span>
    {!autocomplete ? <ComboboxPrimitive.ItemIndicator className="pk-combobox-check" aria-hidden="true"><CheckIcon size="sm" /></ComboboxPrimitive.ItemIndicator> : null}
  </Item>;
}

function ChoicePopup({ container, emptyMessage, loading, loadingMessage, renderOption, autocomplete = false, dir, onDismiss }: {
  container: ChoiceFieldProps["container"]; emptyMessage: ReactNode; loading: boolean; loadingMessage: ReactNode;
  renderOption: ChoiceFieldProps["renderOption"]; autocomplete?: boolean; dir: TextFieldProps["dir"]; onDismiss: () => void;
}) {
  return <ComboboxPrimitive.Portal container={container}>
    <ComboboxPrimitive.Positioner className="pk-combobox-positioner" sideOffset={Number.parseFloat(foundation.space["1_5"])} collisionPadding={Number.parseFloat(foundation.space["3"])} align="start">
      <DismissableLayer asChild onEscapeKeyDown={event => { event.preventDefault(); onDismiss(); }}>
        <ComboboxPrimitive.Popup className="pk-combobox-popup" dir={dir}>
          <ComboboxPrimitive.Status>{loading ? <div className="pk-combobox-notice">{loadingMessage}</div> : null}</ComboboxPrimitive.Status>
          <ComboboxPrimitive.Empty>{!loading ? <div className="pk-combobox-notice">{emptyMessage}</div> : null}</ComboboxPrimitive.Empty>
          <ComboboxPrimitive.List className="pk-combobox-list">{(option: ComboboxOption) => <ChoiceOption key={option.value} option={option} autocomplete={autocomplete} renderOption={renderOption} />}</ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </DismissableLayer>
    </ComboboxPrimitive.Positioner>
  </ComboboxPrimitive.Portal>;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue = null, onValueChange, onInputValueChange, label, hint, error, optional, fieldClassName, id, name, form, required, disabled = false, readOnly = false,
    emptyMessage = "No matching options.", clearLabel = "Clear selection", openLabel = "Show options", clearable = true, loading = false, loadingMessage = "Loading options…", container, renderOption, controlSize = "md", "aria-describedby": describedBy, "aria-invalid": invalid, ...inputProps }, ref,
) {
  const [localValue, setLocalValue] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : localValue;
  const { input, setInput } = useInputHandle(ref);
  const [open, setOpen] = useState(false);
  const description = useFieldDescription({ id, hint, error, describedBy });
  const labelId = `${description.controlId}-label`;
  const items = useMemo(() => ComboboxPrimitive.createItems(options, { getValue: option => option.value, getLabel: option => option.label }), [options]);
  const actions = useRef<ComboboxPrimitive.Root.Actions>(null);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useNativeReset(input, form, () => {
    setOpen(false);
    actions.current?.close();
    if (value === undefined) setLocalValue(defaultValue);
  });
  return <ComboboxPrimitive.Root items={items} value={selected} onValueChange={next => { if (value === undefined) setLocalValue(next); onValueChange?.(next); }}
    // Let the primitive own its display query so external IDs and refreshed labels synchronize.
    onInputValueChange={next => onInputValueChange?.(next)}
    open={open && !disabled} onOpenChange={next => setOpen(!disabled && next)} actionsRef={actions}
    name={name} form={form} required={required} disabled={disabled} readOnly={readOnly} autoComplete={inputProps.autoComplete}>
    <FieldFrame label={<span id={labelId}>{label}</span>} hint={hint} error={error} optional={optional ?? false} fieldClassName={fieldClassName} description={description} required={required}>
      <ChoiceInput inputProps={{ ...inputProps, disabled, readOnly, form, "aria-busy": loading || inputProps["aria-busy"] }} inputRef={setInput} controlId={description.controlId} labelId={labelId} descriptionIds={description.descriptionIds} invalid={description.hasError ? true : invalid} controlSize={controlSize} clearable={clearable} clearLabel={clearLabel} openLabel={openLabel} />
    </FieldFrame>
    <ChoicePopup container={container} emptyMessage={emptyMessage} loading={loading} loadingMessage={loadingMessage} renderOption={renderOption} dir={inputProps.dir} onDismiss={() => actions.current?.close()} />
  </ComboboxPrimitive.Root>;
});

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  { options, value, defaultValue = "", onValueChange, label, hint, error, optional, fieldClassName, id, name, form, required, disabled = false, readOnly = false,
    emptyMessage = "No suggestions. You can keep your text.", clearLabel = "Clear text", openLabel = "Show suggestions", clearable = true, loading = false, loadingMessage = "Loading suggestions…", container, renderOption, controlSize = "md", "aria-describedby": describedBy, "aria-invalid": invalid, ...inputProps }, ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const text = value ?? localValue;
  const { input, setInput } = useInputHandle(ref);
  const [open, setOpen] = useState(false);
  const description = useFieldDescription({ id, hint, error, describedBy });
  const labelId = `${description.controlId}-label`;
  const actions = useRef<AutocompletePrimitive.Root.Actions>(null);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useNativeReset(input, form, () => { setOpen(false); if (value === undefined) setLocalValue(defaultValue); });
  return <AutocompletePrimitive.Root items={options} value={text} onValueChange={next => { if (value === undefined) setLocalValue(next); onValueChange?.(next); }} itemToStringValue={option => option.label}
    open={open && !disabled} onOpenChange={next => setOpen(!disabled && next)} actionsRef={actions} name={name} form={form} required={required} disabled={disabled} readOnly={readOnly}>
    <FieldFrame label={<span id={labelId}>{label}</span>} hint={hint} error={error} optional={optional ?? false} fieldClassName={fieldClassName} description={description} required={required}>
      <ChoiceInput autocomplete inputProps={{ ...inputProps, disabled, readOnly, form, "aria-busy": loading || inputProps["aria-busy"] }} inputRef={setInput} controlId={description.controlId} labelId={labelId} descriptionIds={description.descriptionIds} invalid={description.hasError ? true : invalid} controlSize={controlSize} clearable={clearable} clearLabel={clearLabel} openLabel={openLabel} />
    </FieldFrame>
    <ChoicePopup autocomplete container={container} emptyMessage={emptyMessage} loading={loading} loadingMessage={loadingMessage} renderOption={renderOption} dir={inputProps.dir} onDismiss={() => actions.current?.close()} />
  </AutocompletePrimitive.Root>;
});

export interface FormActionsProps extends ComponentPropsWithoutRef<"div"> {
  dirty?: boolean;
  dirtyMessage?: ReactNode;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(function FormActions(
  { className, dirty = false, dirtyMessage = "Unsaved changes", children, ...props }, ref,
) {
  return <div {...props} ref={ref} className={classes("pk-form-actions", className)}>
    <div className="pk-form-actions-buttons">{children}</div>
    <span className="pk-form-dirty" role="status">{dirty ? dirtyMessage : null}</span>
  </div>;
});

export type SaveStatusState = "idle" | "dirty" | "saving" | "saved" | "error";
export interface SaveStatusProps extends Omit<ActionMessageProps, "tone"> {
  state: SaveStatusState;
}

export const SaveStatus = forwardRef<HTMLDivElement, SaveStatusProps>(function SaveStatus(
  { state, children, className, icon, ...props }, ref,
) {
  const messages: Record<SaveStatusState, string> = { idle: "No changes to save.", dirty: "You have unsaved changes.", saving: "Saving changes…", saved: "Changes saved.", error: "Changes could not be saved. Try again." };
  const stateIcon = state === "saving" ? <Spinner size="sm" aria-hidden="true" /> : state === "idle" ? <CheckIcon size="sm" /> : state === "dirty" ? <PencilIcon size="sm" /> : undefined;
  return <ActionMessage {...props} ref={ref} className={classes("pk-save-status", className)} data-state={state} icon={icon === undefined ? stateIcon : icon} tone={state === "error" ? "error" : state === "saved" ? "success" : "info"}>{children ?? messages[state]}</ActionMessage>;
});
