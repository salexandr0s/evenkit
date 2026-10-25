import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("login validates, reveals passwords, and recovers from structured and rejected requests", async ({ page }) => {
  await page.goto("/#login");
  const form = page.getByRole("form", { name: "Sign in", exact: true });
  const email = form.getByRole("textbox", { name: "Email", exact: true });
  const password = form.locator('input[name="password"]');
  await expect(password).toHaveAccessibleName("Password");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Preview requests: 0", { exact: true })).toBeVisible();
  await email.fill("person@example.test");
  await password.fill("  sample password  ");
  await expect(email).toHaveAttribute("autocomplete", "username");
  await expect(password).toHaveAttribute("autocomplete", "current-password");
  await form.getByRole("button", { name: "Show password", exact: true }).click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("  sample password  ");
  await form.getByRole("button", { name: "Hide password", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
  await choose(page, "Submission outcome", "Failure");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();
  await choose(page, "Submission outcome", "Rejected request");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  const error = form.getByRole("alert");
  await expect(error).toContainText("We couldn’t complete your request. Please try again.");
  await expect(error).toBeFocused();
  await expect(form.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  await choose(page, "Submission outcome", "Success");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(form).not.toBeVisible();
  await expect(page.getByText("Preview requests: 3", { exact: true })).toBeVisible();
});

test("pending login locks a request immediately and resets without retaining credentials", async ({ page }) => {
  await page.goto("/#login");
  await choose(page, "Submission outcome", "Pending");
  const form = page.getByRole("form", { name: "Sign in", exact: true });
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("person@example.test");
  await form.locator('input[name="password"]').fill("sample password");
  // Two submits in the same task catch guards that rely only on a React render.
  await form.evaluate(element => {
    if (!(element instanceof HTMLFormElement)) throw new Error("Missing native auth form.");
    element.requestSubmit();
    element.requestSubmit();
  });
  await expect(page.getByText("Preview requests: 1", { exact: true })).toBeVisible();
  await expect(form.getByRole("button", { name: "Sign in", exact: true })).toBeDisabled();
  await expect(form.getByRole("button", { name: "Sign in", exact: true })).toHaveAttribute("aria-busy", "true");
  await expect(form.locator('input[name="password"]')).toHaveAttribute("readonly");
  await page.getByRole("button", { name: "Complete preview request", exact: true }).click();
  await expect(form).not.toBeVisible();
  await page.getByRole("button", { name: "Restart preview", exact: true }).click();
  await expect(form.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("");
  await expect(form.locator('input[name="password"]')).toHaveValue("");
  await expect(form.locator('input[name="password"]')).toHaveAttribute("type", "password");
});

test("signup applies the host password policy and confirms before invoking the callback", async ({ page }) => {
  await page.goto("/#signup");
  const form = page.getByRole("form", { name: "Create an account", exact: true });
  const password = form.locator('input[name="password"]');
  const confirmation = form.locator('input[name="confirmPassword"]');
  await expect(confirmation).toHaveAccessibleName("Confirm password");
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("person@example.test");
  await password.fill("short");
  await confirmation.fill("short");
  await form.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(password).toHaveAttribute("aria-invalid", "true");
  await expect(password).toBeFocused();
  await password.fill("a long sample password");
  await form.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(confirmation).toHaveAttribute("aria-invalid", "true");
  await expect(confirmation).toBeFocused();
  await expect(page.getByText("Preview requests: 0", { exact: true })).toBeVisible();
  await expect(password).toHaveAttribute("autocomplete", "new-password");
  await expect(confirmation).toHaveAttribute("autocomplete", "new-password");
  await confirmation.fill("a long sample password");
  await form.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(form).not.toBeVisible();
  await expect(page.getByText("Preview requests: 1", { exact: true })).toBeVisible();
});

test("reset requests use neutral confirmation and new-password pages reject unusable links", async ({ page }) => {
  await page.goto("/#password-reset");
  const request = page.getByRole("form", { name: "Reset your password", exact: true });
  await request.getByRole("textbox", { name: "Email", exact: true }).fill("invalid-email");
  await request.getByRole("button", { name: "Send reset instructions", exact: true }).click();
  await expect(request.getByRole("textbox", { name: "Email", exact: true })).toHaveAttribute("aria-invalid", "true");
  await request.getByRole("textbox", { name: "Email", exact: true }).fill("person@example.test");
  await request.getByRole("button", { name: "Send reset instructions", exact: true }).click();
  await expect(page.getByText("If an account matches that email, you’ll receive reset instructions.", { exact: true })).toBeVisible();
  await page.goto("/#new-password");
  const form = page.getByRole("form", { name: "Choose a new password", exact: true });
  await choose(page, "Recovery link state", "Expired");
  await expect(form).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Request another reset", exact: true })).toBeVisible();
  await choose(page, "Recovery link state", "Invalid");
  await expect(form).not.toBeVisible();
  await choose(page, "Recovery link state", "Ready");
  await form.locator('input[name="password"]').fill("a new sample password");
  await form.locator('input[name="confirmPassword"]').fill("different password");
  await form.getByRole("button", { name: "Update password", exact: true }).click();
  await expect(form.locator('input[name="confirmPassword"]')).toBeFocused();
  await form.locator('input[name="confirmPassword"]').fill("a new sample password");
  await form.getByRole("button", { name: "Update password", exact: true }).click();
  await expect(form).not.toBeVisible();
});

test("auth pages fit small screens and discard an unmounted pending preview", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [kind, name] of [["login", "Sign in"], ["signup", "Create an account"], ["password-reset", "Reset your password"], ["new-password", "Choose a new password"]] as const) {
    await page.goto(`/#${kind}`);
    await expect(page.getByRole("form", { name, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await page.locator(".pk-auth-form button[type=submit]").boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  await page.goto("/#login");
  await choose(page, "Submission outcome", "Pending");
  const form = page.getByRole("form", { name: "Sign in", exact: true });
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("person@example.test");
  await form.locator('input[name="password"]').fill("sample password");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Complete preview request", exact: true })).toBeVisible();
  await page.goto("/#signup");
  await expect(page.getByRole("form", { name: "Create an account", exact: true })).toBeVisible();
  await expect(page.getByText("Preview requests: 0", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("service expiry moves lost form focus to recovery feedback without remounting", async ({ page }) => {
  await page.goto("/#new-password");
  const form = page.getByRole("form", { name: "Choose a new password", exact: true });
  const password = form.locator('input[name="password"]');
  await expect(password).not.toBeFocused();
  await choose(page, "Submission outcome", "Expired link");
  await password.fill("a new sample password");
  const confirmation = form.locator('input[name="confirmPassword"]');
  await confirmation.fill("a new sample password");
  await confirmation.press("Enter");
  const recovery = page.locator(".pk-auth-recovery");
  await expect(form).not.toBeVisible();
  await expect(recovery).toContainText("This reset link has expired.");
  await expect(recovery).toBeFocused();
  await expect(page.getByText("Preview requests: 1", { exact: true })).toBeVisible();
  await choose(page, "Recovery link state", "Ready");
  await expect(form).toBeVisible();
  await expect(password).not.toBeFocused();
  await choose(page, "Submission outcome", "Success");
  await password.fill("another sample password");
  await form.locator('input[name="confirmPassword"]').fill("another sample password");
  await form.getByRole("button", { name: "Update password", exact: true }).click();
  await expect(form).not.toBeVisible();
  await expect(page.getByText("Preview requests: 2", { exact: true })).toBeVisible();
});

test("custom password captions remain visible in the accessible action names", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#login");
  await page.getByText("Reusable password field", { exact: true }).click();
  const field = page.getByRole("group", { name: "Reusable password field", exact: true });
  const password = field.locator("input");
  await password.fill("ein beispielpasswort");
  const show = field.getByRole("button", { name: "Passwort anzeigen", exact: true });
  await expect(show).toHaveText("Anzeigen");
  await show.click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("ein beispielpasswort");
  const hide = field.getByRole("button", { name: "Passwort verbergen", exact: true });
  await expect(hide).toHaveText("Verbergen");
  await hide.click();
  await expect(password).toHaveAttribute("type", "password");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
