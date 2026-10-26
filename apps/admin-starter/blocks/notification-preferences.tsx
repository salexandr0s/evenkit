"use client";

import { useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Badge, Button, FormActions, FormSection, SaveStatus, Switch } from "@evenkit/ui";

export interface NotificationChannel { id: string; label: string; description?: string; unavailable?: string }
export interface NotificationPreferencePolicy {
  /** Required delivery is always on. Supply the reason shown beside the control. */
  required?: string;
  readOnlyReason?: string;
  /** Delivery availability is host-owned; an unavailable choice retains its saved value. */
  unavailable?: string;
}
export interface NotificationCategory {
  id: string;
  label: string;
  description?: string;
  readOnlyReason?: string;
  policies?: Readonly<Record<string, NotificationPreferencePolicy>>;
}
export type NotificationPreferenceValue = Readonly<Record<string, Readonly<Record<string, boolean>>>>;
export interface NotificationPreferenceContext { contextKey: string; revision: string | number; signal: AbortSignal }
export interface NotificationPreferencesProps {
  /** Change when the account or workspace changes. */
  contextKey: string;
  /** Increment for a replacement server snapshot, including updates from another device. */
  revision: string | number;
  channels: readonly NotificationChannel[];
  categories: readonly NotificationCategory[];
  value: NotificationPreferenceValue;
  readOnlyReason?: string;
  label?: string;
  description?: string;
  /** Return saved values. Do not commit local host state here; use onSaved. */
  onSave: (draft: NotificationPreferenceValue, context: NotificationPreferenceContext) => Promise<NotificationPreferenceValue>;
  /** Called only while the request's context, schema, policy and revision still match. */
  onSaved?: (value: NotificationPreferenceValue, context: NotificationPreferenceContext) => void;
}

function normalize(value: NotificationPreferenceValue, categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]): NotificationPreferenceValue {
  return Object.fromEntries(categories.map(category => [category.id, Object.fromEntries(channels.map(channel => [channel.id, Boolean(category.policies?.[channel.id]?.required) || value[category.id]?.[channel.id] === true]))]));
}

/** Copyable presentation block. Applications own storage, delivery and authorization. */
export function NotificationPreferences({ contextKey, revision, channels, categories, value, readOnlyReason,
  label = "Notification preferences", description = "Choose how you receive updates for each category.", onSave, onSaved }: NotificationPreferencesProps) {
  const scope = JSON.stringify([contextKey, revision, channels, categories, readOnlyReason]);
  const descriptionId = useId();
  const [saved, setSaved] = useState(() => normalize(value, categories, channels));
  const [draft, setDraft] = useState(saved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const request = useRef<AbortController | null>(null);
  const committedScope = useRef(scope);
  const latestSavedCallback = useRef(onSaved);
  const saveButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const focusedControl = useRef<HTMLElement | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const editable = !readOnlyReason && categories.some(category => !category.readOnlyReason && channels.some(channel => {
    const policy = category.policies?.[channel.id];
    return !channel.unavailable && !policy?.required && !policy?.readOnlyReason && !policy?.unavailable;
  }));

  // Layout cleanup invalidates ignored-abort promises before another context can commit.
  useLayoutEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useLayoutEffect(() => {
    latestSavedCallback.current = onSaved;
    if (committedScope.current === scope) return;
    committedScope.current = scope;
    request.current?.abort(); request.current = null;
    if (cancelButton.current === document.activeElement) saveButton.current?.focus();
    if (focusedControl.current && !focusedControl.current.isConnected && document.activeElement === document.body) saveButton.current?.focus();
    const next = normalize(value, categories, channels);
    setSaved(next); setDraft(next); setPending(false); setError("");
    setNote("Preferences updated. Review the current choices before saving.");
  }, [scope, value, categories, channels, onSaved]);

  function cancel() {
    request.current?.abort(); request.current = null;
    if (cancelButton.current === document.activeElement) saveButton.current?.focus();
    setPending(false); setError(""); setNote("Save cancelled. Your changes are still here.");
  }
  function reset() {
    if (pending || !dirty) return;
    setDraft(saved); setError(""); setNote("Changes reset to the saved preferences.");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !dirty || !editable) return;
    const controller = new AbortController();
    request.current = controller;
    const context = { contextKey, revision, signal: controller.signal };
    const submitted = normalize(draft, categories, channels);
    setPending(true); setError(""); setNote("");
    try {
      const result = await onSave(submitted, context);
      if (controller.signal.aborted || request.current !== controller || committedScope.current !== scope) return;
      for (const category of categories) for (const channel of channels) {
        const received = result[category.id]?.[channel.id];
        const policy = category.policies?.[channel.id];
        const locked = category.readOnlyReason || channel.unavailable || policy?.required || policy?.readOnlyReason || policy?.unavailable;
        if (typeof received !== "boolean" || (locked && received !== submitted[category.id]?.[channel.id])) {
          throw new Error("The saved preferences did not match the available choices. Retry or reload your settings.");
        }
      }
      const next = normalize(result, categories, channels);
      latestSavedCallback.current?.(next, context);
      setSaved(next); setDraft(next); setNote("Notification preferences saved.");
    } catch (failure: unknown) {
      if (controller.signal.aborted || request.current !== controller || committedScope.current !== scope) return;
      setError(failure instanceof Error && failure.message.trim() ? failure.message : "Preferences could not be saved. Your changes are still here.");
    } finally {
      if (request.current === controller && committedScope.current === scope) {
        request.current = null;
        if (cancelButton.current === document.activeElement) saveButton.current?.focus();
        setPending(false);
      }
    }
  }

  return <form className="pk-notification-preferences" aria-label={label} onSubmit={event => { void submit(event); }} onReset={event => { event.preventDefault(); reset(); }}
    onFocusCapture={event => { if (event.target instanceof HTMLElement) focusedControl.current = event.target; }}
    onBlurCapture={event => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) focusedControl.current = null;
      else if (!event.relatedTarget) {
        const previous = focusedControl.current;
        queueMicrotask(() => {
          if (focusedControl.current === previous && previous?.isConnected && !previous.contains(document.activeElement)) focusedControl.current = null;
        });
      }
    }}>
    <FormSection className="pk-notification-preference-section" heading={label} description={description}>
      {readOnlyReason ? <p className="pk-notification-preference-access"><Badge size="sm">View only</Badge><span>{readOnlyReason}</span></p> : null}
      {channels.some(channel => channel.description) ? <dl className="pk-notification-preference-guide" aria-label="Delivery channels">{channels.map((channel, index) => channel.description ? <div key={channel.id}>
        <dt>{channel.label}</dt><dd id={`${descriptionId}-${index}`}>{channel.description}</dd>
      </div> : null)}</dl> : null}
      {categories.length === 0 || channels.length === 0 ? <p className="pk-settings-note">No notification preferences are available.</p> : <div className="pk-notification-preference-categories">{categories.map(category => <fieldset className="pk-notification-preference-category" key={category.id}>
        <legend className="pk-visually-hidden">{category.label}</legend>
        <div className="pk-notification-preference-category-body">
          <div className="pk-notification-preference-category-heading">
            <h3>{category.label}</h3>
            {category.description ? <p>{category.description}</p> : null}
            {category.readOnlyReason ? <p>{category.readOnlyReason}</p> : null}
          </div>
          <div className="pk-notification-preference-channels">{channels.map((channel, channelIndex) => {
            const policy = category.policies?.[channel.id];
            const reason = readOnlyReason || category.readOnlyReason || policy?.required || policy?.readOnlyReason || policy?.unavailable || channel.unavailable;
            const policyLabel = readOnlyReason ? "View only" : category.readOnlyReason ? "Managed" : policy?.required ? "Required" : policy?.readOnlyReason ? "Managed" : policy?.unavailable || channel.unavailable ? "Unavailable" : null;
            return <div key={channel.id} className="pk-notification-preference-option" data-locked={Boolean(reason) || undefined}>
              <Switch label={channel.label} aria-label={`${category.label}: ${channel.label}`} checked={draft[category.id]?.[channel.id] === true}
                aria-disabled={Boolean(reason) || pending || undefined} controlSize="md"
                aria-describedby={channel.description ? `${descriptionId}-${channelIndex}` : undefined}
                hint={reason ? <><Badge size="sm" variant="outline">{policyLabel}</Badge><span>{reason}</span></> : undefined}
                onCheckedChange={checked => {
                  if (reason || request.current) return;
                  setDraft(current => ({ ...current, [category.id]: { ...current[category.id], [channel.id]: checked } }));
                  setError(""); setNote("");
                }} />
            </div>;
          })}</div>
        </div>
      </fieldset>)}</div>}
    </FormSection>
    <div className="pk-notification-preference-footer">
      <SaveStatus state={error ? "error" : pending ? "saving" : note === "Notification preferences saved." ? "saved" : dirty ? "dirty" : "idle"}
        role={error ? "alert" : "status"}>{error || (pending ? "Saving notification preferences…" : note || (dirty ? "You have unsaved changes." : "No changes to save."))}</SaveStatus>
      <FormActions>
        <Button ref={saveButton} type="submit" aria-disabled={pending || !dirty || !editable || undefined} aria-busy={pending || undefined}>{error ? "Retry save" : "Save preferences"}</Button>
        <Button type="reset" variant="ghost" aria-disabled={pending || !dirty || undefined}>Reset changes</Button>
        {pending ? <Button ref={cancelButton} variant="outline" onClick={cancel}>Cancel save</Button> : null}
      </FormActions>
    </div>
  </form>;
}
