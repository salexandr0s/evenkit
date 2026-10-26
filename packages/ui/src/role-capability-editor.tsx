"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./button.js";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js";
import { ActionMessage, Badge } from "./feedback.js";
import { SearchField } from "./form-controls.js";
import { IconButton } from "./icon-button.js";
import { LockIcon, RotateCcwIcon, SlidersHorizontalIcon } from "./icons.js";
import { Checkbox, CheckboxGroup } from "./selection-controls.js";
import type { TeamActionContext, TeamActionResult } from "./team-admin-types.js";
import { useTeamAction } from "./use-team-action.js";

export interface CapabilityDefinition {
  id: string;
  label: string;
  description?: string;
  group?: string;
  /** A display restriction; the application must enforce it when saving. */
  disabledReason?: string;
}
export interface EditableRole {
  id: string;
  revision: string;
  label: string;
  description?: string;
  capabilityIds: readonly string[];
}
export interface RoleCapabilityChange { roleId: string; revision: string; capabilityIds: readonly string[] }
export interface RoleCapabilityEditorProps {
  /** Include the team, principal and policy revision. */
  contextKey: string;
  role: EditableRole;
  capabilities: readonly CapabilityDefinition[];
  onSave: (next: RoleCapabilityChange, context: TeamActionContext) => Promise<TeamActionResult>;
  readOnlyReason?: string;
  deniedReason?: string;
  /** Fetch current definitions and grants, then change role.revision/contextKey. */
  onReload?: () => void;
}

/** Edits explicit grants only. Role inheritance, policy and authorization belong to the host. */
export function RoleCapabilityEditor(props: RoleCapabilityEditorProps) {
  const scope = JSON.stringify([props.contextKey, props.role, props.capabilities, props.readOnlyReason, props.deniedReason]);
  const [seen, setSeen] = useState({ scope, changed: false });
  if (seen.scope !== scope) setSeen({ scope, changed: true });
  return <RoleEditorPanel key={scope} {...props} scope={scope} contextChanged={seen.changed} />;
}

function RoleEditorPanel({ role, capabilities, contextKey, onSave, readOnlyReason, deniedReason, onReload, scope, contextChanged }: RoleCapabilityEditorProps & { scope: string; contextChanged: boolean }) {
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const review = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const action = useTeamAction(scope);
  const [baseline, setBaseline] = useState<readonly string[]>(() => [...new Set(role.capabilityIds)]);
  const [draft, setDraft] = useState<readonly string[]>(baseline);
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [note, setNote] = useState(contextChanged ? "Role details refreshed. Review the current grants before making changes." : "");
  const blocked = Boolean(readOnlyReason || deniedReason) || action.result?.status === "denied" || action.result?.status === "stale" || uncertain;
  const added = draft.filter(id => !baseline.includes(id));
  const removed = baseline.filter(id => !draft.includes(id));
  const dirty = added.length + removed.length > 0;
  const unknown = draft.filter(id => !capabilities.some(capability => capability.id === id));
  const filtered = capabilities.filter(capability => `${capability.label} ${capability.description ?? ""} ${capability.group ?? ""} ${capability.id}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const groups = [...new Set(filtered.map(capability => capability.group ?? "Capabilities"))];
  const name = (id: string) => capabilities.find(capability => capability.id === id)?.label ?? id;

  useLayoutEffect(() => { if (contextChanged) heading.current?.focus(); }, [contextChanged]);
  useLayoutEffect(() => { if (action.pending) cancel.current?.focus(); }, [action.pending]);

  function change(id: string, checked: boolean) {
    if (blocked || action.pending || capabilities.find(capability => capability.id === id)?.disabledReason) return;
    action.reset(); setNote("");
    setDraft(current => checked ? [...new Set([...current, id])] : current.filter(value => value !== id));
  }
  function close() {
    if (action.pending) {
      action.cancel(); setUncertain(true);
      setNote("Stopped waiting for the save. Reload the role to check which grants were saved before trying again.");
    }
    setConfirm(false);
  }
  async function save() {
    if (blocked || !dirty || action.pending || !confirm) return;
    const submitted = [...draft];
    const result = await action.run(context => onSave({ roleId: role.id, revision: role.revision, capabilityIds: submitted }, { ...context, contextKey }));
    if (!result) return;
    if (result.status === "success") { setBaseline(submitted); setConfirm(false); }
    if (result.status === "denied" || result.status === "stale") setConfirm(false);
  }
  function restoreFocus() {
    if (review.current && !review.current.disabled) review.current.focus();
    else heading.current?.focus();
  }
  const resultMessage = action.result ? <ActionMessage tone={action.result.status === "success" ? "success" : action.result.status === "error" ? "error" : "warning"} heading={action.result.status === "success" ? "Role saved" : action.result.status === "denied" ? "Save denied" : action.result.status === "stale" ? "Role changed" : "Could not save role"}>{action.result.message ?? "The role's capabilities were saved."}</ActionMessage> : null;

  return <section className="pk-role-editor" aria-labelledby={headingId}>
    <header className="pk-role-heading"><span className="pk-role-mark" aria-hidden="true"><SlidersHorizontalIcon size="lg" animation="static" /></span><div className="pk-role-heading-copy"><p className="pk-role-eyebrow">Role capabilities</p><h2 id={headingId} ref={heading} tabIndex={-1}>{role.label}</h2>{role.description ? <p>{role.description}</p> : null}</div><Badge tone="neutral">{draft.length} selected</Badge></header>
    {readOnlyReason || deniedReason ? <ActionMessage tone={deniedReason ? "warning" : "info"} heading={deniedReason ? "Editing unavailable" : "Read-only role"}>{deniedReason ?? readOnlyReason}</ActionMessage> : null}
    {note ? <ActionMessage tone={uncertain ? "warning" : "info"}>{note}</ActionMessage> : null}
    <div className="pk-role-search"><SearchField ref={search} label="Search capabilities" value={query} onValueChange={setQuery} /></div>
    <div className="pk-role-capabilities">{groups.map(group => {
      const items = filtered.filter(capability => (capability.group ?? "Capabilities") === group);
      return <CheckboxGroup key={group} label={<span className="pk-role-group-heading"><span>{group}</span><span className="pk-role-group-count" aria-hidden="true">{items.filter(capability => draft.includes(capability.id)).length} of {items.length} selected</span></span>} disabled={blocked || action.pending}>{items.map(capability => <div className="pk-role-capability-row" key={capability.id} data-checked={draft.includes(capability.id) || undefined} data-locked={Boolean(capability.disabledReason) || undefined}><Checkbox label={capability.label} hint={capability.disabledReason ? `${capability.description ? `${capability.description} ` : ""}${capability.disabledReason}` : capability.description} checked={draft.includes(capability.id)} disabled={blocked || action.pending || Boolean(capability.disabledReason)} onCheckedChange={checked => change(capability.id, checked === true)} />{capability.disabledReason ? <span className="pk-role-capability-lock" aria-hidden="true"><LockIcon size="sm" animation="static" /></span> : null}</div>)}</CheckboxGroup>;
    })}</div>
    {filtered.length === 0 ? <p className="pk-role-note">No matching capabilities.</p> : null}
    {unknown.length ? <ActionMessage tone="warning" heading="Additional grants retained"><p>These grants are not listed above. Saving keeps them unchanged.</p><ul className="pk-role-unknown">{unknown.map(id => <li key={id}><code>{id}</code></li>)}</ul></ActionMessage> : null}
    {!confirm ? resultMessage : null}
    <footer className="pk-role-footer"><div className="pk-role-change-summary" role="status"><strong>{dirty ? `${added.length + removed.length} unsaved ${added.length + removed.length === 1 ? "change" : "changes"}` : "No unsaved changes"}</strong><span>{dirty ? `${added.length} added · ${removed.length} removed` : "Changes apply after review and save."}</span></div><div className="pk-role-actions">
      <Button ref={review} disabled={blocked || !dirty || action.pending} onClick={() => { action.reset(); setNote(""); setConfirm(true); }}>Review changes</Button>
      <Button variant="outline" disabled={!dirty || action.pending} onClick={() => { setDraft(baseline); if (action.result?.status !== "denied" && action.result?.status !== "stale") action.reset(); setNote("Draft changes discarded."); search.current?.focus(); }}>Discard changes</Button>
      {(uncertain || action.result?.status === "stale" || action.result?.status === "denied" || deniedReason) && onReload ? <IconButton label="Reload role" size="md" variant="outline" onClick={onReload}><RotateCcwIcon size="sm" /></IconButton> : null}
    </div></footer>
    <Dialog open={confirm} onOpenChange={open => { if (!open) close(); }}>
      <DialogContent className="pk-role-confirmation" onOpenAutoFocus={event => { event.preventDefault(); cancel.current?.focus(); }} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus(); }}>
        <DialogHeader><DialogTitle>Save capabilities for {role.label}?</DialogTitle><DialogDescription>Review the grants being added and removed.</DialogDescription></DialogHeader>
        <DialogBody>
          <dl className="pk-role-diff"><div><dt>Add</dt><dd>{added.length ? <ul>{added.map(id => <li key={id}>{name(id)}</li>)}</ul> : "No additions"}</dd></div><div><dt>Remove</dt><dd>{removed.length ? <ul>{removed.map(id => <li key={id}>{name(id)}</li>)}</ul> : "No removals"}</dd></div></dl>
          {resultMessage}
          {action.pending ? <p role="status" className="pk-role-note">Saving capabilities…</p> : null}
        </DialogBody>
        <DialogFooter><Button ref={cancel} variant="outline" onClick={close}>{action.pending ? "Stop waiting" : "Cancel"}</Button><Button loading={action.pending} disabled={blocked || !dirty} onClick={() => { void save(); }}>{action.result?.status === "error" ? "Retry save" : "Save capabilities"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>;
}
