"use client";

import { useId, useRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import { Label } from "./field.js";
import { IconButton } from "./icon-button.js";
import { Columns3Icon, XIcon } from "./icons.js";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./overlays.js";
import { Checkbox } from "./selection-controls.js";
import { Select } from "./select.js";

export interface TableSort { id: string; direction: "asc" | "desc" }
export interface SortControlProps {
  fields: readonly { id: string; label: string; disabled?: boolean }[];
  value: TableSort | null;
  onValueChange: (sort: TableSort | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Field and direction are one controlled value, suitable for lists as well as tables. */
export function SortControl({ fields, value, onValueChange, label = "Sort records", disabled = false, className }: SortControlProps) {
  const id = useId();
  const fieldRef = useRef<HTMLButtonElement>(null);
  return <div className={classes("pk-sort-control", className)} role="group" aria-labelledby={`${id}-label`}>
    <Label id={`${id}-label`} htmlFor={`${id}-field`}>{label}</Label>
    <div className="pk-sort-control-fields">
      <Select ref={fieldRef} id={`${id}-field`} aria-label={`${label}: field`} controlSize="sm" disabled={disabled} value={value?.id ?? ""} placeholder="Default order"
        options={fields.map(field => ({ value: field.id, label: field.label, ...(field.disabled !== undefined ? { disabled: field.disabled } : {}) }))}
        onValueChange={field => onValueChange({ id: field, direction: value?.direction ?? "asc" })} />
      <div className="pk-sort-control-order">
        <Select aria-label={`${label}: direction`} controlSize="sm" disabled={disabled || value === null} value={value?.direction ?? "asc"}
          options={[{ value: "asc", label: "Ascending" }, { value: "desc", label: "Descending" }]}
          onValueChange={direction => { if (value && (direction === "asc" || direction === "desc")) onValueChange({ ...value, direction }); }} />
        {value ? <IconButton size="sm" label={`Clear ${label.toLowerCase()}`} disabled={disabled} onClick={() => { fieldRef.current?.focus(); onValueChange(null); }}><XIcon size="sm" /></IconButton> : null}
      </div>
    </div>
  </div>;
}

export interface BulkActionBarProps {
  count: number;
  /** Describe exactly which records the selected IDs can include. */
  scopeLabel: string;
  children?: ReactNode;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
}

export function BulkActionBar({ count, scopeLabel, children, onClear, disabled = false, className }: BulkActionBarProps) {
  if (count <= 0) return null;
  return <div className={classes("pk-bulk-action-bar", className)} role="group" aria-label="Selected records" aria-busy={disabled || undefined}>
    <p><strong>{count} selected</strong><span>{scopeLabel}</span></p>
    <fieldset className="pk-bulk-action-controls" aria-label="Bulk actions" disabled={disabled}>{children}<IconButton size="sm" label="Clear selection" onClick={onClear}><XIcon size="sm" /></IconButton></fieldset>
  </div>;
}

export interface ColumnSetting { id: string; label: string; required?: boolean }
export interface ColumnSettingsProps {
  columns: readonly ColumnSetting[];
  hiddenIds: readonly string[];
  onHiddenIdsChange: (ids: readonly string[]) => void;
  density: "default" | "compact";
  onDensityChange: (density: "default" | "compact") => void;
  disabled?: boolean;
  label?: string;
}

/** The host persists these values. Required columns and the final visible column cannot be hidden. */
export function ColumnSettings({ columns, hiddenIds, onHiddenIdsChange, density, onDensityChange, disabled = false, label = "Display settings" }: ColumnSettingsProps) {
  const densityId = useId();
  const requestedVisible = columns.filter(column => column.required || !hiddenIds.includes(column.id));
  const visible = requestedVisible.length > 0 ? requestedVisible : columns.slice(0, 1);
  return <Popover><PopoverTrigger asChild><IconButton size="sm" variant="outline" disabled={disabled} label={label}><Columns3Icon size="sm" /></IconButton></PopoverTrigger>
    <PopoverContent className="pk-column-settings" align="end"><PopoverTitle>Display settings</PopoverTitle><PopoverDescription>Choose columns and row spacing.</PopoverDescription>
      <fieldset className="pk-column-settings-list" disabled={disabled}><legend>Visible columns</legend>{columns.map(column => {
        const checked = visible.some(item => item.id === column.id);
        return <Checkbox key={column.id} label={column.label} checked={checked} disabled={column.required || (checked && visible.length === 1)}
          onCheckedChange={next => onHiddenIdsChange(next === true ? hiddenIds.filter(id => id !== column.id) : [...new Set([...hiddenIds, column.id])])} />;
      })}</fieldset>
      <div className="pk-column-settings-density"><Label htmlFor={densityId}>Row spacing</Label><Select id={densityId} aria-label="Row spacing" controlSize="sm" value={density} disabled={disabled}
        options={[{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }]} onValueChange={next => { if (next === "default" || next === "compact") onDensityChange(next); }} /></div>
    </PopoverContent>
  </Popover>;
}
