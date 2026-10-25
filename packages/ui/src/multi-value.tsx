"use client";

import { Combobox as Primitive } from "@base-ui/react/combobox";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { foundation } from "@evenkit/tokens";
import { forwardRef, useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ForwardedRef, type ReactNode } from "react";
import { Button, type ControlSize } from "./button.js";
import { classes } from "./classes.js";
import { FieldFrame, useFieldDescription, type FieldContentProps } from "./field-frame.js";
import type { ComboboxOption } from "./form-controls.js";
import { CheckIcon, ChevronDownIcon, XIcon } from "./icons.js";
import { useValueFieldReset } from "./multi-value-reset.js";
import { appendTokens, type TokenIssue } from "./multi-value-utils.js";

export { appendTokens, type TokenIssue } from "./multi-value-utils.js";

interface MultiValueProps extends FieldContentProps, Omit<ComponentPropsWithoutRef<"input">, "value" | "defaultValue" | "onChange" | "size" | "type" | "children"> {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  controlSize?: ControlSize;
  maxVisible?: number;
  clearLabel?: string;
  removeLabel?: (value: string) => string;
}

function useValueField(value: readonly string[] | undefined, initial: readonly string[], onChange: MultiValueProps["onValueChange"], ref: ForwardedRef<HTMLInputElement>, form: string | undefined, reset: () => void) {
  const [local, setLocal] = useState(initial);
  const input = useRef<HTMLInputElement>(null);
  const selected = [...new Set(value ?? local)];
  useValueFieldReset(input, form, () => {
    if (value === undefined) setLocal(initial);
    reset();
  });
  return { input, selected, setInput: (node: HTMLInputElement | null) => {
    input.current = node;
    if (typeof ref === "function") return ref(node);
    if (ref) ref.current = node;
  }, change: (next: readonly string[]) => {
    const unique = [...new Set(next)];
    if (value === undefined) setLocal(unique);
    onChange?.(unique);
  } };
}

function Selections({ values, labelFor, disabled, readOnly, maxVisible = 3, removeLabel = value => `Remove ${value}`, onRemove, input }: {
  values: readonly string[]; labelFor: (value: string) => string; disabled: boolean; readOnly: boolean;
  maxVisible?: number; removeLabel?: (value: string) => string; onRemove: (value: string) => void;
  input: { current: HTMLInputElement | null };
}) {
  const [expanded, setExpanded] = useState(false);
  const count = Math.max(1, Math.floor(maxVisible));
  const visible = expanded ? values : values.slice(0, count);
  if (!values.length) return null;
  return <div className="pk-multi-selections">
    <ul className="pk-multi-tokens" role="list" aria-label="Selected values">{visible.map(value => <li className="pk-multi-token" key={value}>
      <span>{labelFor(value)}</span>
      {!readOnly ? <button type="button" className="pk-multi-remove" disabled={disabled} aria-label={removeLabel(labelFor(value))} onClick={() => { onRemove(value); input.current?.focus(); }}><XIcon size="sm" /></button> : null}
    </li>)}</ul>
    {values.length > count ? <Button type="button" size="xs" variant="ghost" disabled={disabled} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Show fewer" : `+${values.length - count} more`}</Button> : null}
  </div>;
}

export interface MultiSelectProps extends MultiValueProps {
  options: readonly ComboboxOption[];
  loading?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
  openLabel?: string;
  onSearchChange?: (query: string) => void;
  container?: ComponentPropsWithoutRef<typeof Primitive.Portal>["container"];
}

const EMPTY_VALUES: readonly string[] = [];

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect({
  options, value, defaultValue = EMPTY_VALUES, onValueChange, label, hint, error, optional, fieldClassName, id, name, form,
  required, disabled = false, readOnly = false, controlSize = "md", maxVisible, clearLabel = "Clear all selections", removeLabel,
  loading = false, loadingMessage = "Loading options…", emptyMessage = "No matching options.", openLabel = "Show options", onSearchChange, container,
  "aria-describedby": describedBy, "aria-invalid": invalid, className, onKeyDown, ...inputProps
}, ref) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const actions = useRef<Primitive.Root.Actions>(null);
  const state = useValueField(value, defaultValue, onValueChange, ref, form, () => { setQuery(""); setOpen(false); });
  const description = useFieldDescription({ id, hint, error, describedBy });
  const labelId = `${description.controlId}-label`;
  const distinctOptions = useMemo(() => options.filter((option, index) => options.findIndex(item => item.value === option.value) === index), [options]);
  const items = useMemo(() => Primitive.createItems(distinctOptions, { getValue: item => item.value, getLabel: item => item.label }), [distinctOptions]);
  const labelFor = (item: string) => options.find(option => option.value === item)?.label ?? item;
  useEffect(() => {
    if (!open) return;
    const observer = new MutationObserver(() => { if (state.input.current?.matches(":disabled")) setOpen(false); });
    let ancestor = state.input.current?.parentElement;
    while (ancestor) {
      if (ancestor instanceof HTMLFieldSetElement) observer.observe(ancestor, { attributes: true, attributeFilter: ["disabled"] });
      ancestor = ancestor.parentElement;
    }
    return () => observer.disconnect();
  }, [open, state.input]);
  return <Primitive.Root multiple items={items} value={state.selected} onValueChange={(next, details) => {
      // Escape dismisses search; removing every selection is an explicit action.
      if (details.reason === "escape-key" || disabled || readOnly || state.input.current?.matches(":disabled")) { details.cancel(); return; }
      state.change(next); setQuery("");
    }}
    inputValue={query} onInputValueChange={next => { setQuery(next); onSearchChange?.(next); }}
    open={open && !disabled && !readOnly} onOpenChange={next => setOpen(next && !disabled && !readOnly && !state.input.current?.matches(":disabled"))} actionsRef={actions}
    name={name} form={form} required={required} disabled={disabled} readOnly={readOnly}>
    <FieldFrame label={<span id={labelId}>{label}</span>} hint={hint} error={error} optional={optional ?? false} fieldClassName={classes("pk-multi-field", fieldClassName)} description={description} required={required}>
      <Selections values={state.selected} labelFor={labelFor} disabled={disabled} readOnly={readOnly} {...(maxVisible !== undefined ? { maxVisible } : {})} {...(removeLabel ? { removeLabel } : {})} input={state.input} onRemove={item => state.change(state.selected.filter(value => value !== item))} />
      <Primitive.InputGroup className="pk-combobox-control" data-size={controlSize} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={description.hasError || invalid === true || invalid === "true" || undefined}>
        <Primitive.Input {...inputProps} id={description.controlId} ref={state.setInput} form={form} className={classes("pk-input pk-combobox-input", className)} data-size={controlSize}
          aria-labelledby={inputProps["aria-labelledby"] ?? (inputProps["aria-label"] ? undefined : labelId)} aria-describedby={description.descriptionIds}
          aria-invalid={description.hasError ? true : invalid} aria-busy={loading} onKeyDown={event => {
            onKeyDown?.(event);
            if (!event.defaultPrevented && !event.nativeEvent.isComposing && event.key === "Backspace" && !query && !readOnly && !disabled && state.selected.length) {
              event.preventDefault(); state.change(state.selected.slice(0, -1));
            }
          }} />
        <span className="pk-combobox-actions">
          {state.selected.length && !readOnly ? <Primitive.Clear className="pk-combobox-action" aria-label={clearLabel}><XIcon size="sm" /></Primitive.Clear> : null}
          {!readOnly ? <Primitive.Trigger className="pk-combobox-action pk-combobox-trigger" aria-label={openLabel}><ChevronDownIcon size="sm" /></Primitive.Trigger> : null}
        </span>
      </Primitive.InputGroup>
      <span className="pk-multi-count" role="status">{state.selected.length} selected</span>
    </FieldFrame>
    <Primitive.Portal container={container}><Primitive.Positioner className="pk-combobox-positioner" sideOffset={Number.parseFloat(foundation.space["1_5"])} collisionPadding={Number.parseFloat(foundation.space["3"])} align="start">
      <DismissableLayer asChild onEscapeKeyDown={event => { event.preventDefault(); actions.current?.close(); }}><Primitive.Popup className="pk-combobox-popup" dir={inputProps.dir}>
        <Primitive.Status>{loading ? <div className="pk-combobox-notice">{loadingMessage}</div> : null}</Primitive.Status>
        <Primitive.Empty>{!loading ? <div className="pk-combobox-notice">{emptyMessage}</div> : null}</Primitive.Empty>
        <Primitive.List className="pk-combobox-list">{(option: ComboboxOption) => <Primitive.Item key={option.value} value={option.value} disabled={option.disabled ?? false} className="pk-combobox-option" aria-label={option.label}>
          <span className="pk-combobox-option-copy"><span>{option.label}</span>{option.description ? <span className="pk-combobox-option-description">{option.description}</span> : null}</span>
          <Primitive.ItemIndicator className="pk-combobox-check"><CheckIcon size="sm" /></Primitive.ItemIndicator>
        </Primitive.Item>}</Primitive.List>
      </Primitive.Popup></DismissableLayer>
    </Primitive.Positioner></Primitive.Portal>
  </Primitive.Root>;
});

export interface TokenInputProps extends MultiValueProps {
  caseSensitive?: boolean;
  maxTokens?: number;
  validateToken?: (token: string) => string | undefined;
  onReject?: (issues: readonly TokenIssue[]) => void;
  separators?: readonly string[];
}

export const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(function TokenInput({
  value, defaultValue = EMPTY_VALUES, onValueChange, label, hint, error, optional, fieldClassName, id, name, form,
  required = false, disabled = false, readOnly = false, controlSize = "md", maxVisible, clearLabel = "Clear all tokens", removeLabel,
  caseSensitive = false, maxTokens, validateToken, onReject, separators = [",", ";", "\n"], className,
  "aria-describedby": describedBy, "aria-invalid": invalid, onKeyDown, onBlur, onPaste, ...inputProps
}, ref) {
  const [draft, setDraft] = useState("");
  const [issue, setIssue] = useState("");
  const state = useValueField(value, defaultValue, onValueChange, ref, form, () => { setDraft(""); setIssue(""); });
  const shownError = error || issue;
  const description = useFieldDescription({ id, hint, error: shownError, describedBy });
  function add(text: string) {
    const candidates = separators.reduce((parts, separator) => parts.flatMap(part => separator ? part.split(separator) : [part]), [text]);
    const result = appendTokens(state.selected, candidates, { caseSensitive, ...(maxTokens !== undefined ? { maxTokens } : {}), ...(validateToken ? { validate: validateToken } : {}) });
    if (result.values.length !== state.selected.length) state.change(result.values);
    setIssue(result.issues.map(item => item.message).join(" "));
    // Rejected values stay editable; duplicates are already represented by a token.
    setDraft(result.issues.filter(item => item.reason !== "duplicate").map(item => item.token).join(", "));
    if (result.issues.length) onReject?.(result.issues);
  }
  useEffect(() => {
    state.input.current?.setCustomValidity(draft.trim() ? "Add this value with Enter or remove it before continuing." : "");
  }, [draft, state.input]);
  return <FieldFrame label={label} hint={hint} error={shownError} optional={optional ?? false} fieldClassName={classes("pk-multi-field", fieldClassName)} description={description} required={required}>
    <Selections values={state.selected} labelFor={value => value} disabled={disabled} readOnly={readOnly} {...(maxVisible !== undefined ? { maxVisible } : {})} {...(removeLabel ? { removeLabel } : {})} input={state.input} onRemove={item => { state.change(state.selected.filter(value => value !== item)); setIssue(""); }} />
    <div className="pk-combobox-control" data-size={controlSize} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={description.hasError || invalid === true || invalid === "true" || undefined}>
      <input {...inputProps} ref={state.setInput} id={description.controlId} form={form} className={classes("pk-input pk-combobox-input", className)} data-size={controlSize}
        value={draft} disabled={disabled} readOnly={readOnly} required={required && state.selected.length === 0} aria-required={required} aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid}
        onChange={event => { setDraft(event.currentTarget.value); setIssue(""); }}
        onBlur={event => { onBlur?.(event); if (!event.defaultPrevented && !readOnly && draft.trim()) add(draft); }}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing || disabled || readOnly) return;
          if ((event.key === "Enter" || separators.includes(event.key)) && draft.trim()) { event.preventDefault(); add(draft); }
          else if (event.key === "Backspace" && !draft && state.selected.length) { event.preventDefault(); state.change(state.selected.slice(0, -1)); setIssue(""); }
        }}
        onPaste={event => {
          onPaste?.(event);
          if (event.defaultPrevented || disabled || readOnly) return;
          const text = event.clipboardData.getData("text");
          if (separators.some(separator => separator && text.includes(separator))) { event.preventDefault(); add(draft + text); }
        }} />
      {state.selected.length && !readOnly ? <button type="button" disabled={disabled} className="pk-combobox-action" aria-label={clearLabel} onClick={() => { state.change([]); setIssue(""); state.input.current?.focus(); }}><XIcon size="sm" /></button> : null}
    </div>
    {name ? state.selected.map(item => <input key={item} type="hidden" name={name} form={form} value={item} disabled={disabled} />) : null}
    <span className="pk-multi-count" role="status">{state.selected.length}{maxTokens !== undefined ? ` of ${maxTokens}` : ""} added</span>
  </FieldFrame>;
});
