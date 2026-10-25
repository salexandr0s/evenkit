import { useEffect, useRef, useState } from "react";
import {
  Badge, Button, ButtonLink, Label, LayoutDashboardIcon,
  LoginPage, NewPasswordPage, PasswordField, PasswordResetPage, Select, SignupPage,
  type AuthResult
} from "@project-kit/ui";
import type { AuthPreviewKind } from "./auth-data";
import "./auth-preview.css";

export type { AuthPreviewKind } from "./auth-data";

type PreviewField = "email" | "password" | "confirmPassword";
type PreviewResult = Extract<AuthResult<PreviewField>, { status: "error" }> | { status: "success"; message: string };
type Outcome = "success" | "failure" | "pending" | "rejected" | "expired";
type RecoveryState = "ready" | "expired" | "invalid";

const baseOutcomeOptions = [
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected request" }
] as const;
const recoveryOptions = [
  { value: "ready", label: "Ready" },
  { value: "expired", label: "Expired" },
  { value: "invalid", label: "Invalid" }
] as const;

const cancelledResult: PreviewResult = { status: "error", error: { message: "The preview request was cancelled." } };
const passwordHint = "Use at least 12 characters for this preview. Your application chooses its own password policy.";

function validatePreviewPassword(password: string) {
  return Array.from(password).length >= 12 ? undefined : "Use at least 12 characters for this preview.";
}

function successResult(kind: AuthPreviewKind): PreviewResult {
  switch (kind) {
    case "login": return { status: "success", message: "Sign-in preview completed. No session was created." };
    case "signup": return { status: "success", message: "Signup preview completed. Your application would handle verification. No account was created." };
    case "password-reset": return { status: "success", message: "Reset request preview completed. No email was sent." };
    case "new-password": return { status: "success", message: "Password update preview completed. No password was changed." };
  }
}

function failureResult(kind: AuthPreviewKind): PreviewResult {
  const fieldErrors: Partial<Record<PreviewField, string>> = kind === "new-password"
    ? { password: "Choose a different password for this failure preview." }
    : { email: "Use another email address for this failure preview." };
  return {
    status: "error",
    error: { message: "The preview request was declined. Choose Success and submit again.", fieldErrors }
  };
}

function PreviewSession({ kind, onRestart }: { kind: AuthPreviewKind; onRestart: () => void }) {
  const outcomeOptions = kind === "new-password"
    ? [...baseOutcomeOptions, { value: "expired", label: "Expired link" } as const]
    : baseOutcomeOptions;
  const [outcome, setOutcome] = useState<Outcome>("success");
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("ready");
  const [requests, setRequests] = useState(0);
  const [held, setHeld] = useState(false);
  const pending = useRef<{ resolve: (result: PreviewResult) => void } | null>(null);

  useEffect(() => () => {
    const request = pending.current;
    pending.current = null;
    // Settle this demo's promise when its form is restarted or leaves the catalog.
    // The page's unmount guard ignores the result; no credential values are retained.
    request?.resolve(cancelledResult);
  }, []);

  async function submit(): Promise<PreviewResult> {
    setRequests((count) => count + 1);
    if (outcome === "rejected") {
      throw new Error("DEMO_AUTH_TRANSPORT_FAILURE: internal status 503; preview-only diagnostic.");
    }
    if (kind === "new-password" && outcome === "expired") {
      setRecoveryState("expired");
      return { status: "error", error: { message: "The preview recovery link expired. Request another reset to continue." } };
    }
    if (outcome === "failure") return failureResult(kind);
    if (outcome === "pending") {
      // A second callback invocation remains visible in the counter. Settle any
      // superseded request as well, so the preview cannot leave an orphan promise.
      pending.current?.resolve(cancelledResult);
      setHeld(true);
      return new Promise<PreviewResult>((resolve) => { pending.current = { resolve }; });
    }
    return successResult(kind);
  }

  function complete() {
    const request = pending.current;
    pending.current = null;
    setHeld(false);
    request?.resolve(successResult(kind));
  }

  const common = {
    brand: <span className="catalog-auth-brand"><LayoutDashboardIcon /><strong>Project kit</strong><Badge>Demo</Badge></span>,
    contentAs: "section" as const,
    headingAs: "h2" as const,
    onSubmit: submit
  };

  return (
    <div className="catalog-auth-demo">
      <p className="catalog-auth-help">Local form preview. Use fictional details; submissions do not contact an authentication service.</p>
      <div className="catalog-auth-stage">
        {kind === "login" && <LoginPage {...common} forgotPasswordLink={<ButtonLink href="#password-reset" variant="link">Forgot password?</ButtonLink>} footer={<span>Need an account? <a href="#signup">View signup</a></span>} />}
        {kind === "signup" && <SignupPage {...common} validatePassword={validatePreviewPassword} passwordHint={passwordHint} footer={<span>Have an account? <a href="#login">View login</a></span>} />}
        {kind === "password-reset" && <PasswordResetPage {...common} footer={<a href="#login">Back to login</a>} />}
        {kind === "new-password" && <NewPasswordPage {...common} recoveryState={recoveryState} validatePassword={validatePreviewPassword} passwordHint={passwordHint} requestResetLink={<ButtonLink href="#password-reset" variant="outline">Request another reset</ButtonLink>} footer={<a href="#login">Back to login</a>} />}
      </div>
      <div className="catalog-auth-controls">
        <div className="catalog-auth-control">
          <Label htmlFor={`${kind}-outcome`}>Submission outcome</Label>
          <Select id={`${kind}-outcome`} options={outcomeOptions} value={outcome} disabled={held} onValueChange={(value) => { const next = outcomeOptions.find((option) => option.value === value); if (next) setOutcome(next.value); }} aria-describedby={`${kind}-outcome-help`} />
        </div>
        {kind === "new-password" && <div className="catalog-auth-control">
          <Label htmlFor="recovery-link-state">Recovery link state</Label>
          <Select id="recovery-link-state" options={recoveryOptions} value={recoveryState} disabled={held} onValueChange={(value) => { const next = recoveryOptions.find((option) => option.value === value); if (next) setRecoveryState(next.value); }} />
        </div>}
        <Button variant="outline" onClick={onRestart}>Restart preview</Button>
      </div>
      <p className="catalog-auth-help" id={`${kind}-outcome-help`}>Pending holds the local request until you complete it. Rejected request checks the page's error handling.</p>
      <div className="catalog-auth-request-state">
        <p role="status">Preview requests: {requests}</p>
        {held && <Button variant="secondary" onClick={complete}>Complete preview request</Button>}
      </div>
      {kind === "login" && <details className="catalog-auth-field-example">
        <summary>Reusable password field</summary>
        <div role="group" aria-label="Reusable password field">
          <PasswordField label="Beispielpasswort" showText="Anzeigen" hideText="Verbergen" showLabel="Passwort anzeigen" hideLabel="Passwort verbergen" hint="Standalone control with German labels. The page above remains in English." />
        </div>
      </details>}
    </div>
  );
}

export function AuthPreview({ kind }: { kind: AuthPreviewKind }) {
  const [run, setRun] = useState(0);
  return <PreviewSession key={`${kind}-${run}`} kind={kind} onRestart={() => setRun((value) => value + 1)} />;
}
