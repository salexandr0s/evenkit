"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { themeNames } from "@evenkit/tokens";
import { AppearancePreferences, Avatar, Button, FormSection, IconButton, RotateCcwIcon, SaveStatus, TextField, type AppearancePreferencesProps, type AppearanceValue } from "@evenkit/ui";

export interface ProfileValue { id: string; name: string; email: string }
export interface ProfileSettingsProps {
  profile: ProfileValue;
  onSave: (draft: ProfileValue, context: { signal: AbortSignal }) => Promise<ProfileValue>;
  onSaved?: (profile: ProfileValue) => void;
}

/** Identity changes remount the form so a previous account's draft cannot leak. */
export function ProfileSettings(props: ProfileSettingsProps) { return <ProfileForm key={props.profile.id} {...props} />; }

function ProfileForm({ profile, onSave, onSaved }: ProfileSettingsProps) {
  const [saved, setSaved] = useState(profile);
  const [draft, setDraft] = useState(profile);
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const request = useRef<AbortController | null>(null);
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const returnToName = useRef(false);
  const dirty = draft.name !== saved.name || draft.email !== saved.email;
  useEffect(() => () => request.current?.abort(), []);
  useLayoutEffect(() => { if (pending) cancel.current?.focus(); else if (returnToName.current) { returnToName.current = false; name.current?.focus(); } }, [pending]);
  function update(patch: Partial<ProfileValue>) { setDraft(current => ({ ...current, ...patch })); setError(""); setNote(""); }
  function cancelSave() { request.current?.abort(); request.current = null; returnToName.current = true; setPending(false); setNote("Save cancelled. Your changes are still here."); }
  function reset() { request.current?.abort(); request.current = null; returnToName.current = pending; setPending(false); setDraft(saved); setAttempted(false); setError(""); setNote(""); if (!pending) name.current?.focus(); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    setAttempted(true);
    if (!draft.name.trim()) { name.current?.focus(); return; }
    if (!draft.email.trim() || !email.current?.validity.valid) { email.current?.focus(); return; }
    const controller = new AbortController();
    request.current = controller; setPending(true); setError(""); setNote("");
    try {
      const result = await onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim() }, { signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      if (result.id !== profile.id) throw new Error("The saved profile did not match this account.");
      setSaved(result); setDraft(result); setNote("Profile saved."); onSaved?.(result);
    } catch (failure: unknown) {
      if (controller.signal.aborted || request.current !== controller) return;
      setError(failure instanceof Error ? failure.message : "Your profile could not be saved.");
    } finally {
      if (request.current === controller) { request.current = null; returnToName.current = cancel.current !== null && cancel.current.ownerDocument.activeElement === cancel.current; setPending(false); }
    }
  }
  return <form className="pk-profile-settings" aria-label="Profile settings" onSubmit={event => { void submit(event); }} onReset={event => { event.preventDefault(); reset(); }}>
    <div className="pk-profile-summary"><Avatar name={saved.name} size="lg" decorative /><div><strong>{saved.name}</strong><p>{saved.email}</p></div></div>
    <FormSection heading="Your profile" description="Update the name and email shown on your account.">
      <TextField ref={name} label="Full name" name="name" autoComplete="name" required disabled={pending} value={draft.name} onChange={event => update({ name: event.target.value })} onInvalid={() => setAttempted(true)} error={attempted && !draft.name.trim() ? "Enter your name." : undefined} />
      <TextField ref={email} label="Email address" name="email" autoComplete="email" type="email" required disabled={pending} value={draft.email} onChange={event => update({ email: event.target.value })} onInvalid={() => setAttempted(true)} error={attempted && (!draft.email.trim() || email.current?.validity.typeMismatch) ? "Enter a valid email address." : undefined} />
    </FormSection>
    <SaveStatus state={error ? "error" : pending ? "saving" : note === "Profile saved." ? "saved" : dirty ? "dirty" : "idle"} role={error ? "alert" : "status"}>{error || (pending ? "Saving profile…" : note || (dirty ? "Unsaved changes" : "No unsaved changes"))}</SaveStatus>
    <div className="pk-settings-actions"><Button type="submit" loading={pending} disabled={!dirty && !pending}>{error ? "Retry save" : "Save profile"}</Button><IconButton type="reset" label="Reset changes" disabled={pending || !dirty}><RotateCcwIcon size="sm" /></IconButton>{pending ? <Button ref={cancel} variant="outline" onClick={cancelSave}>Cancel save</Button> : null}</div>
  </form>;
}

export interface AppearanceSettingsProps {
  /** Scope by account/workspace; avoid sharing a key between unrelated contexts. */
  storageKey: string;
  initialValue?: AppearanceValue;
  onValueChange?: (value: AppearanceValue) => void;
  locales?: AppearancePreferencesProps["locales"];
}
const defaultAppearance: AppearanceValue = { theme: "neutral", mode: "system" };
const noLocales: NonNullable<AppearanceSettingsProps["locales"]> = [];
function normalizePreferences(value: AppearanceValue, locales: NonNullable<AppearanceSettingsProps["locales"]>, fallback: AppearanceValue): AppearanceValue {
  const density = value.density === "compact" || value.density === "default" ? value.density : fallback.density === "compact" ? "compact" : "default";
  const locale = locales.find(option => option.value === value.locale)?.value ?? locales.find(option => option.value === fallback.locale)?.value ?? locales[0]?.value;
  return { theme: value.theme, mode: value.mode, density, ...(locale ? { locale } : {}) };
}
function readAppearance(raw: string | null, locales: NonNullable<AppearanceSettingsProps["locales"]>, fallback: AppearanceValue): AppearanceValue | null {
  if (!raw) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!value || typeof value !== "object" || !("theme" in value) || !("mode" in value)) return null;
  const theme = themeNames.find(item => item === value.theme);
  if (!theme || (value.mode !== "light" && value.mode !== "dark" && value.mode !== "system")) return null;
  return normalizePreferences({ theme, mode: value.mode, ...("density" in value && (value.density === "default" || value.density === "compact") ? { density: value.density } : {}), ...("locale" in value && typeof value.locale === "string" ? { locale: value.locale } : {}) }, locales, fallback);
}

/** A copyable local preference recipe. It never mutates the document theme. */
export function AppearanceSettings(props: AppearanceSettingsProps) { return <StoredAppearance key={props.storageKey} {...props} />; }
function StoredAppearance({ storageKey, initialValue = defaultAppearance, onValueChange, locales = noLocales }: AppearanceSettingsProps) {
  const [value, setValue] = useState(() => normalizePreferences(initialValue, locales, initialValue));
  const [storageNote, setStorageNote] = useState("");
  const [ready, setReady] = useState(false);
  const callback = useRef(onValueChange);
  callback.current = onValueChange;
  const initial = useRef(initialValue);
  const options = useRef(locales);
  options.current = locales;
  const localeValues = JSON.stringify(locales.map(locale => locale.value));
  useEffect(() => {
    let restored = normalizePreferences(initial.current, options.current, initial.current);
    try { restored = readAppearance(localStorage.getItem(storageKey), options.current, initial.current) ?? restored; }
    catch { setStorageNote("Preferences are available for this visit. Browser storage is unavailable."); }
    setValue(restored); callback.current?.(restored);
    setReady(true);
  }, [storageKey, localeValues]);
  function change(next: AppearanceValue) {
    const supported = normalizePreferences(next, options.current, initial.current);
    setValue(supported); callback.current?.(supported);
    try { localStorage.setItem(storageKey, JSON.stringify(supported)); setStorageNote("Preferences saved on this device."); }
    catch { setStorageNote("Preferences changed for this visit. Browser storage is unavailable."); }
  }
  return <FormSection heading="Appearance" description="Choose colors, spacing and formatting for your workspace.">
    <AppearancePreferences value={value} onValueChange={change} locales={locales} disabled={!ready} />
    <p className="pk-settings-note" role="status">{storageNote || "System mode follows your device's light or dark setting."}</p>
  </FormSection>;
}
