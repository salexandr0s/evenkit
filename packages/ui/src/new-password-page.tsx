"use client";

import { AuthAdditionalMethods, AuthErrorSummary, AuthLayout, AuthSuccess } from "./auth-layout.js";
import { Button } from "./button.js";
import { CircleAlertIcon } from "./icons.js";
import { PasswordField } from "./password-field.js";
import { formString, useAuthSubmission } from "./use-auth-submission.js";
import type { ReactNode } from "react";
import type { AuthPageProps, AuthResult, NewPasswordField, NewPasswordValues, PasswordPolicyProps } from "./auth-types.js";

export interface NewPasswordPageProps extends AuthPageProps, PasswordPolicyProps {
  onSubmit: (values: NewPasswordValues) => Promise<AuthResult<NewPasswordField>>;
  recoveryState?: "ready" | "expired" | "invalid";
  requestResetLink?: ReactNode;
}

interface NewPasswordFormValues extends NewPasswordValues { confirmPassword: string }

export function NewPasswordPage({ onSubmit, validatePassword, passwordHint, recoveryState = "ready", requestResetLink, brand, title = "Choose a new password", description = "Choose a password for your account.", footer, successFooter, additionalMethods, contentAs = "main", headingAs = "h1", className }: NewPasswordPageProps) {
  const submission = useAuthSubmission<NewPasswordFormValues, NewPasswordField>({
    onSubmit: ({ password }) => onSubmit({ password }),
    getValues(form) {
      const data = new FormData(form);
      return { password: formString(data, "password"), confirmPassword: formString(data, "confirmPassword") };
    },
    validate(values) {
      const errors: Partial<Record<NewPasswordField, string>> = {};
      if (!values.password) errors.password = "Enter a password.";
      else {
        const policyError = validatePassword?.(values.password);
        if (policyError?.trim()) errors.password = policyError;
      }
      if (!values.confirmPassword) errors.confirmPassword = "Confirm your password.";
      else if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords must match.";
      return errors;
    },
    fieldOrder: ["password", "confirmPassword"],
    successMessage: "Your password has been updated.",
    enabled: recoveryState === "ready",
  });

  return (
    <AuthLayout brand={brand} title={title} description={description} footer={footer} contentAs={contentAs} headingAs={headingAs} className={className}>
      {recoveryState !== "ready" ? (
        <div className="pk-auth-recovery" role="status">
          <CircleAlertIcon size="lg" />
          <p>{recoveryState === "expired" ? "This reset link has expired. Request a new link to continue." : "This reset link is invalid. Request a new link to continue."}</p>
          {requestResetLink ? <div>{requestResetLink}</div> : null}
        </div>
      ) : submission.succeeded ? <AuthSuccess ref={submission.messageRef} message={submission.successMessage} footer={successFooter} /> : (
        <>
          <form ref={submission.formRef} className="pk-auth-form" aria-label="Choose a new password" aria-busy={submission.pending || undefined} method="post" noValidate onSubmit={submission.handleSubmit}>
            {submission.error ? <AuthErrorSummary ref={submission.messageRef} message={submission.error} /> : null}
            <PasswordField label="Password" name="password" autoComplete="new-password" required readOnly={submission.pending} hint={passwordHint} error={submission.fieldErrors.password} />
            <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" required readOnly={submission.pending} error={submission.fieldErrors.confirmPassword} showLabel="Show confirm password" hideLabel="Hide confirm password" />
            <Button type="submit" loading={submission.pending} fullWidth>Update password</Button>
          </form>
          <AuthAdditionalMethods>{additionalMethods}</AuthAdditionalMethods>
        </>
      )}
    </AuthLayout>
  );
}
