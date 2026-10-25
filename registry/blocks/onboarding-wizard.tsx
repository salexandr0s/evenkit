"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ActionMessage, Button, FormErrorSummary, StepIndicator, type StepIndicatorItem } from "@evenkit/ui";

export interface WizardValidationError { fieldId: string; message: string }
export interface WizardStepContext<Data> {
  data: Data;
  update: (next: Data) => void;
  errors: readonly WizardValidationError[];
  disabled: boolean;
}
export interface WizardStep<Data> {
  id: string;
  title: string;
  description?: string;
  render: (context: WizardStepContext<Data>) => ReactNode;
  validate: (data: Data) => readonly WizardValidationError[];
}
export interface WizardDraft<Data> { version: number; data: Data; stepId: string; savedAt: string }
export interface WizardDraftStorage<Data> {
  /** Validate stored data at this boundary before returning it. */
  load: (context: { signal: AbortSignal }) => Promise<WizardDraft<Data> | null>;
  save: (draft: WizardDraft<Data>, context: { signal: AbortSignal }) => Promise<void>;
  clear: (context: { signal: AbortSignal }) => Promise<void>;
}
export interface OnboardingWizardProps<Data> {
  initialData: Data;
  steps: readonly WizardStep<Data>[];
  renderReview: (data: Data, editStep: (id: string) => void) => ReactNode;
  onSubmit: (data: Data, context: { signal: AbortSignal }) => Promise<void>;
  storage?: WizardDraftStorage<Data>;
  draftVersion?: number;
  title?: string;
  submitLabel?: string;
  successTitle?: string;
  successContent?: ReactNode;
}

const reviewId = "__review";
type PendingOperation = "loading" | "saving" | "clearing" | "submitting" | null;

/** Copyable flow block. The host owns fields, validation, persistence, and storage scope. */
export function OnboardingWizard<Data>({ initialData, steps, renderReview, onSubmit, storage, draftVersion = 1,
  title = "Get started", submitLabel = "Finish setup", successTitle = "Setup complete", successContent,
}: OnboardingWizardProps<Data>) {
  const id = useId();
  const [data, setData] = useState(initialData);
  const [stepIndex, setStepIndex] = useState(0);
  const [visited, setVisited] = useState(0);
  const [errors, setErrors] = useState<readonly WizardValidationError[]>([]);
  const [pending, setPending] = useState<PendingOperation>(storage ? "loading" : null);
  const [recovered, setRecovered] = useState<WizardDraft<Data> | null>(null);
  const [storageError, setStorageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [note, setNote] = useState("");
  const [complete, setComplete] = useState(false);
  const [cleanupNeeded, setCleanupNeeded] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [focusVersion, setFocusVersion] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const cancelControl = useRef<HTMLButtonElement>(null);
  const request = useRef<AbortController | null>(null);
  const submitted = useRef(false);
  const focusedVersion = useRef(0);
  const busy = pending !== null || recovered !== null;
  const reviewing = stepIndex >= steps.length;
  const step = steps[stepIndex];

  useEffect(() => {
    if (!storage) return;
    const controller = new AbortController();
    request.current?.abort(); request.current = controller;
    setPending("loading"); setStorageError(""); setRecovered(null);
    void Promise.resolve().then(() => storage.load({ signal: controller.signal })).then(draft => {
      if (controller.signal.aborted || request.current !== controller) return;
      if (draft && draft.version !== draftVersion) setStorageError("This saved draft uses a different version. Start again or load a compatible draft.");
      else setRecovered(draft);
    }, (error: unknown) => {
      if (!controller.signal.aborted && request.current === controller) setStorageError(error instanceof Error ? error.message : "The saved draft could not be loaded.");
    }).finally(() => { if (request.current === controller) { request.current = null; setPending(null); } });
    return () => { controller.abort(); };
  }, [storage, draftVersion, loadAttempt]);
  useEffect(() => () => { request.current?.abort(); }, []);
  useLayoutEffect(() => { if (pending && pending !== "loading") cancelControl.current?.focus(); }, [pending]);
  useLayoutEffect(() => {
    if (focusVersion === focusedVersion.current) return;
    focusedVersion.current = focusVersion;
    if (errors.length > 0) summary.current?.focus(); else heading.current?.focus();
  }, [focusVersion, errors.length]);

  function changeStep(index: number) {
    if (busy || complete) return;
    setStepIndex(index); setVisited(previous => Math.max(previous, index));
    setErrors([]); setSubmitError(""); setNote(""); setFocusVersion(value => value + 1);
  }
  function editStep(stepId: string) {
    const index = steps.findIndex(item => item.id === stepId);
    if (index >= 0 && index <= visited) changeStep(index);
  }
  function update(next: Data) { if (busy) return; setData(next); setErrors([]); setSubmitError(""); setNote("Unsaved draft changes."); }
  function cancel() {
    request.current?.abort(); request.current = null; setPending(null);
    setNote(submitted.current ? "Setup is complete. Draft cleanup was cancelled." : "Operation cancelled. Your current answers are still here.");
    setFocusVersion(value => value + 1);
  }
  function validateAll() {
    for (let index = 0; index < steps.length; index++) {
      const failures = steps[index]?.validate(data) ?? [];
      if (failures.length) { setStepIndex(index); setErrors(failures); setFocusVersion(value => value + 1); return false; }
    }
    return true;
  }
  async function saveDraft() {
    if (!storage || busy || complete || request.current) return;
    const controller = new AbortController(); request.current = controller;
    setPending("saving"); setStorageError(""); setNote("");
    try {
      await storage.save({ version: draftVersion, data, stepId: step?.id ?? reviewId, savedAt: new Date().toISOString() }, { signal: controller.signal });
      if (!controller.signal.aborted && request.current === controller) setNote("Draft saved. You can return to these answers later.");
    } catch (error: unknown) {
      if (!controller.signal.aborted && request.current === controller) setStorageError(error instanceof Error ? error.message : "The draft could not be saved. Your answers are still here.");
    } finally { if (request.current === controller) { request.current = null; setPending(null); setFocusVersion(value => value + 1); } }
  }
  async function clearDraft(startFresh: boolean) {
    if (!storage || pending || request.current) return;
    const controller = new AbortController(); request.current = controller;
    setPending("clearing"); setStorageError("");
    try {
      await storage.clear({ signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      setCleanupNeeded(false);
      if (startFresh) { setRecovered(null); setData(initialData); setStepIndex(0); setVisited(0); setErrors([]); setNote("Started a new draft."); }
      setFocusVersion(value => value + 1);
    } catch (error: unknown) {
      if (!controller.signal.aborted && request.current === controller) setStorageError(error instanceof Error ? error.message : "The saved draft could not be removed.");
    } finally { if (request.current === controller) { request.current = null; setPending(null); setFocusVersion(value => value + 1); } }
  }
  function resume() {
    if (!recovered || pending) return;
    const requested = recovered.stepId === reviewId ? steps.length : Math.max(0, steps.findIndex(item => item.id === recovered.stepId));
    const invalid = steps.findIndex((item, index) => index < requested && item.validate(recovered.data).length > 0);
    const index = invalid < 0 ? requested : invalid;
    setData(recovered.data); setStepIndex(index); setVisited(index); setRecovered(null); setStorageError(""); setErrors([]);
    setNote("Saved draft restored. Review your answers before finishing."); setFocusVersion(value => value + 1);
  }
  async function advance() {
    if (busy || complete || submitted.current || request.current) return;
    if (!reviewing && step) {
      const failures = step.validate(data);
      setErrors(failures);
      if (failures.length) { setFocusVersion(value => value + 1); return; }
      changeStep(stepIndex + 1); return;
    }
    if (!validateAll()) return;
    const controller = new AbortController(); request.current = controller;
    setPending("submitting"); setSubmitError(""); setNote("");
    try {
      await onSubmit(data, { signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      submitted.current = true; setComplete(true); setFocusVersion(value => value + 1);
      if (storage) {
        setPending("clearing"); setCleanupNeeded(true);
        try {
          await storage.clear({ signal: controller.signal });
          if (!controller.signal.aborted && request.current === controller) { setCleanupNeeded(false); setStorageError(""); }
        } catch (error: unknown) {
          if (!controller.signal.aborted && request.current === controller) setStorageError(error instanceof Error ? error.message : "Setup finished, but the saved draft could not be removed.");
        }
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted && request.current === controller) { setSubmitError(error instanceof Error ? error.message : "Setup could not be completed. Try again."); setFocusVersion(value => value + 1); }
    } finally { if (request.current === controller) { request.current = null; setPending(null); setFocusVersion(value => value + 1); } }
  }

  const indicator: StepIndicatorItem[] = [...steps.map((item, index) => ({ id: item.id, label: item.title,
    status: errors.length > 0 && index === stepIndex ? "error" as const : (complete || index < visited) && item.validate(data).length === 0 ? "complete" as const : "upcoming" as const,
  })), { id: reviewId, label: "Review", status: complete ? "complete" : "upcoming" }];
  if (steps.length === 0) return <ActionMessage tone="error">Add at least one setup step.</ActionMessage>;
  return <section className="pk-onboarding-wizard" aria-label={title}>
    <StepIndicator aria-label={`${title} progress`} steps={indicator} currentStep={complete ? "" : step?.id ?? reviewId} onStepChange={editStep} disabled={busy || complete} />
    <header><h2 ref={heading} className="pk-wizard-heading" tabIndex={-1} id={`${id}-heading`}>{complete ? successTitle : reviewing ? "Review your answers" : step?.title}</h2>{!complete && step?.description ? <p className="pk-wizard-description">{step.description}</p> : null}</header>
    {recovered ? <ActionMessage heading="A saved draft is available" actions={<><Button disabled={pending !== null} onClick={resume}>Resume draft</Button><Button variant="outline" disabled={pending !== null} onClick={() => { void clearDraft(true); }}>Start fresh</Button></>}>Continue where you left off, or remove the saved answers and start again.</ActionMessage> : null}
    {storageError || (complete && cleanupNeeded && pending === null) ? <ActionMessage tone="error" heading={complete ? "Saved draft remains" : "Draft storage unavailable"} actions={complete && cleanupNeeded ? <Button variant="outline" size="sm" disabled={pending !== null} onClick={() => { void clearDraft(false); }}>Retry draft cleanup</Button> : !recovered ? <Button variant="outline" size="sm" disabled={pending !== null} onClick={() => setLoadAttempt(value => value + 1)}>Reload saved draft</Button> : undefined}>{storageError || "Setup is complete. The saved draft has not been removed."}</ActionMessage> : null}
    {submitError ? <ActionMessage tone="error" heading="Setup was not completed">{submitError} Your answers are available for retry.</ActionMessage> : null}
    {complete ? <div>{successContent ?? <p>Your answers have been saved.</p>}</div> : <form className="pk-wizard-form" noValidate aria-labelledby={`${id}-heading`} onSubmit={event => { event.preventDefault(); void advance(); }}>
      <FormErrorSummary ref={summary} errors={errors} />
      <fieldset className="pk-wizard-fields" disabled={busy} aria-busy={pending !== null} aria-labelledby={`${id}-heading`}>{reviewing ? renderReview(data, editStep) : step?.render({ data, update, errors, disabled: busy })}</fieldset>
      <div className="pk-wizard-actions"><div>{storage ? <Button type="button" variant="ghost" disabled={busy} onClick={() => { void saveDraft(); }}>Save draft</Button> : null}</div><div><Button type="button" variant="outline" disabled={busy || stepIndex === 0} onClick={() => changeStep(stepIndex - 1)}>Back</Button><Button type="submit" disabled={busy} loading={pending === "submitting"}>{reviewing ? submitError ? "Retry setup" : submitLabel : "Continue"}</Button></div></div>
    </form>}
    <p className="pk-wizard-status" role="status">{pending === "loading" ? "Looking for a saved draft…" : pending === "saving" ? "Saving draft…" : pending === "clearing" ? "Removing saved draft…" : pending === "submitting" ? "Completing setup…" : note}</p>
    {pending ? <div><Button ref={cancelControl} variant="outline" size="sm" onClick={cancel}>Cancel {pending === "submitting" ? "setup" : "operation"}</Button></div> : null}
  </section>;
}
