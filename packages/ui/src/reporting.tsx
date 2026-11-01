"use client";

import { useCallback, useId, useRef, type ReactNode, type RefObject } from "react";
import { Button, ButtonLink } from "./button.js";
import { classes } from "./classes.js";
import { IconButton } from "./icon-button.js";
import { CircleAlertIcon, CircleCheckIcon, DownloadIcon, RotateCcwIcon, XIcon } from "./icons.js";
import { Progress } from "./selection-controls.js";
import { SelectField, type SelectOption } from "./select.js";

export interface ReportingSelection {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
}

export interface ReportingControlsProps {
  period: ReportingSelection;
  comparison?: ReportingSelection;
  unit?: ReportingSelection;
  /** Compose additional kit fields here. Their values and application are host-owned. */
  filters?: ReactNode;
  onApply?: () => void;
  onReset?: () => void;
  dirty?: boolean;
  pending?: boolean;
  disabled?: boolean;
  status?: ReactNode;
  label?: string;
  dir?: "ltr" | "rtl";
  className?: string;
}

/** Without onApply, selection changes are immediate. Queries and applied snapshots remain in the host. */
export function ReportingControls({ period, comparison, unit, filters, onApply, onReset, dirty = false, pending = false, disabled = false, status, label = "Reporting controls", dir, className }: ReportingControlsProps) {
  const id = useId();
  return <div className={classes("pk-reporting-controls", className)} role="group" aria-label={label} dir={dir} data-pending={pending || undefined} data-dirty={dirty || undefined}>
    <fieldset className="pk-reporting-fields" disabled={disabled}>
      <legend className="pk-visually-hidden">{label}</legend>
      <SelectField {...period} controlSize="sm" disabled={disabled} {...(dir ? { dir } : {})} />
      {comparison ? <SelectField {...comparison} controlSize="sm" disabled={disabled} {...(dir ? { dir } : {})} /> : null}
      {unit ? <SelectField {...unit} controlSize="sm" disabled={disabled} {...(dir ? { dir } : {})} /> : null}
      {filters}
    </fieldset>
    {onApply || onReset ? <div className="pk-reporting-actions">
      {onApply ? <Button size="sm" aria-describedby={`${id}-status`} disabled={disabled} aria-disabled={pending || undefined} onClick={() => { if (!pending) onApply(); }}>Apply report</Button> : null}
      {onReset ? <IconButton label="Reset report" size="sm" variant="ghost" disabled={disabled} onClick={onReset}><RotateCcwIcon size="sm" /></IconButton> : null}
    </div> : null}
    <p id={`${id}-status`} className={classes("pk-reporting-status", !pending && !(dirty && onApply) && !status && "pk-visually-hidden")} role="status">{pending ? "Updating report…" : dirty && onApply ? "Changes have not been applied." : status}</p>
  </div>;
}

export type ExportState =
  | { status: "idle" }
  | { status: "preparing"; message?: string }
  | { status: "progress"; value: number; message?: string }
  | { status: "ready"; href: string; fileName?: string; message?: string }
  | { status: "error"; message: string };

export interface ExportActionProps {
  state: ExportState;
  onPrepare: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

function useExportFocusReturn(prepareRef: RefObject<HTMLButtonElement | null>) {
  const element = useRef<HTMLElement | null>(null);
  return useCallback((node: HTMLElement | null) => {
    const previous = element.current;
    if (!node && previous && previous.ownerDocument.activeElement === previous) prepareRef.current?.focus();
    element.current = node;
  }, [prepareRef]);
}

/** The host prepares files, cancels jobs, owns URLs and revokes object URLs after use. */
export function ExportAction({ state, onPrepare, onCancel, onRetry, label = "Export report", disabled = false, className }: ExportActionProps) {
  const id = useId();
  const prepareRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useExportFocusReturn(prepareRef);
  const downloadRef = useExportFocusReturn(prepareRef);
  const pending = state.status === "preparing" || state.status === "progress";
  const progress = state.status === "progress" && Number.isFinite(state.value) ? Math.max(0, Math.min(100, state.value)) : undefined;
  const message = state.status === "idle" ? "" : state.message ?? (state.status === "ready" ? "Your export is ready to download." : state.status === "progress" ? "Preparing your file…" : "Preparing export…");
  return <div className={classes("pk-export-action", className)} data-state={state.status} role="group" aria-label={label}>
    <div className="pk-export-buttons">
      <IconButton ref={prepareRef} label={state.status === "error" ? "Retry export" : state.status === "ready" ? "Prepare another export" : label} variant="outline" disabled={disabled} aria-disabled={pending || undefined} aria-describedby={`${id}-status`} onClick={() => { if (!pending) { if (state.status === "error") (onRetry ?? onPrepare)(); else onPrepare(); } }}>
        {state.status === "error" || state.status === "ready" ? <RotateCcwIcon size="sm" /> : <DownloadIcon size="sm" />}
      </IconButton>
      {pending && onCancel ? <IconButton ref={cancelRef} label="Cancel export" variant="ghost" disabled={disabled} onClick={() => { prepareRef.current?.focus(); onCancel(); }}><XIcon size="sm" /></IconButton> : null}
      {state.status === "ready" ? <ButtonLink ref={downloadRef} href={disabled ? undefined : state.href} download={state.fileName ?? true} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined}>Download export</ButtonLink> : null}
    </div>
    <div className={classes("pk-export-feedback", !pending && !message && "pk-visually-hidden")}>
      {pending ? <Progress label="Export progress" {...(progress === undefined ? {} : { value: progress })} /> : null}
      <p id={`${id}-status`} className="pk-export-status" role={state.status === "error" ? "alert" : "status"}>
        {state.status === "error" ? <CircleAlertIcon size="sm" animation="static" aria-hidden="true" /> : state.status === "ready" ? <CircleCheckIcon size="sm" animation="static" aria-hidden="true" /> : null}
        <span>{message}</span>
      </p>
    </div>
  </div>;
}
