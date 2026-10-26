import { expect, test, type Page } from "@playwright/test";

async function demoControls(page: Page) {
  const controls = page.locator(".starter-demo-controls");
  if (!await controls.getAttribute("open").then(value => value !== null)) await controls.getByText("Demo controls", { exact: true }).click();
}
async function workspace(page: Page, name: string) {
  await page.getByRole("button", { name: /^Switch workspace:/ }).click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
async function navigate(page: Page, name: string) {
  await page.getByRole("navigation", { name: "Admin navigation", exact: true }).getByRole("link", { name, exact: true }).click();
  await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
}

test("loading can be cancelled and a failed dashboard load can be retried", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Project overview" })).toBeVisible();
  await demoControls(page);
  await page.getByRole("switch", { name: "Slow requests" }).click();
  await page.getByRole("button", { name: "Refresh dashboard" }).click();
  await page.getByRole("button", { name: "Cancel loading", exact: true }).click();
  await expect(page.getByText("Loading cancelled", { exact: true })).toBeVisible();
  await page.getByRole("switch", { name: "Slow requests" }).click();
  await page.getByRole("button", { name: "Fail next request" }).click();
  await page.getByRole("button", { name: "Load dashboard", exact: true }).click();
  await expect(page.getByRole("region", { name: "Workspace dashboard" }).getByRole("alert")).toContainText("Dashboard could not be loaded");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Project overview" })).toBeVisible();
});

test("records retain a failed draft, retry and open a URL-backed detail", async ({ page }) => {
  await page.goto("/records");
  await expect(page.getByRole("button", { name: "Create project", exact: true })).toBeVisible();
  await demoControls(page);
  await page.getByRole("button", { name: "Fail next request" }).click();
  const create = page.getByRole("button", { name: "Create project", exact: true });
  await create.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox", { name: "Project name", exact: true }).fill("Fictional autumn programme");
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("sample service");
  await expect(dialog.getByRole("textbox", { name: "Project name", exact: true })).toHaveValue("Fictional autumn programme");
  await dialog.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(create).toBeFocused();
  await page.getByRole("searchbox", { name: "Find projects", exact: true }).fill("Fictional autumn programme");
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  await page.getByRole("button", { name: "View Fictional autumn programme", exact: true }).click();
  await expect(page).toHaveURL(/\/records\/northstar-/);
  await expect(page.getByRole("heading", { name: "Fictional autumn programme", exact: true })).toBeVisible();
});

test("workspace changes abort profile writes and restore each workspace's data", async ({ page }) => {
  await page.goto("/settings");
  const name = page.getByRole("textbox", { name: "Full name", exact: true });
  await expect(name).toHaveValue("Alex Rivers");
  await demoControls(page);
  await page.getByRole("switch", { name: "Slow requests" }).click();
  await name.fill("Pending change must not cross workspace");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByRole("button", { name: "Cancel save", exact: true })).toBeFocused();
  await workspace(page, "Harbor Workshop");
  await expect(name).toHaveValue("Sam Rowan");
  await workspace(page, "Northstar Studio");
  await expect(name).toHaveValue("Alex Rivers");
  await page.getByRole("switch", { name: "Slow requests" }).click();
  await navigate(page, "Records");
  await expect(page.getByRole("button", { name: "View Community field guide", exact: true })).toBeVisible();
  await workspace(page, "Harbor Workshop");
  await expect(page.getByRole("button", { name: "View Repair café", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "View Community field guide", exact: true })).toHaveCount(0);
});

test("keyboard discard restores focus and themes follow the selected workspace", async ({ page }) => {
  await page.goto("/records");
  const create = page.getByRole("button", { name: "Create project", exact: true });
  await create.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("textbox", { name: "Project name", exact: true }).fill("Unsaved draft");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Keep editing", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(create).toBeFocused();
  await navigate(page, "Settings");
  await page.getByRole("button", { name: /^Appearance/ }).click();
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await page.getByRole("combobox", { name: "Color theme", exact: true }).click();
  await page.getByRole("option", { name: "Ocean", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-kit-theme", "ocean");
  await expect(page.locator("html")).toHaveAttribute("data-kit-mode", "dark");
  await workspace(page, "Harbor Workshop");
  await expect(page.locator("html")).toHaveAttribute("data-kit-theme", "neutral");
  await workspace(page, "Northstar Studio");
  await expect(page.locator("html")).toHaveAttribute("data-kit-theme", "ocean");
});

test("session recovery preserves a safe destination and clears the demo workspace", async ({ page }) => {
  await page.goto("/settings");
  const name = page.getByRole("textbox", { name: "Full name", exact: true });
  await name.fill("Changed demo profile");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByText("Profile saved.", { exact: true })).toBeVisible();
  await demoControls(page);
  await page.getByRole("link", { name: "Try session recovery", exact: true }).click();
  await expect(page).toHaveURL(/\/session-expired\?returnTo=%2Fsettings/);
  await expect(page.getByRole("heading", { name: "Sign in again", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Continue with fictional demo data", exact: true }).click();
  await expect(name).toHaveValue("Alex Rivers");
});

test("demo sign-in retries and rejects an external return path", async ({ page }) => {
  await page.goto("/login?returnTo=%2Fa%2F..%2F%2Fevil.example");
  const form = page.getByRole("form", { name: "Sign in", exact: true });
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("fail@example.test");
  await form.locator('input[name="password"]').fill("fictional sample password");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("demo request failed");
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("alex@example.test");
  await form.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
});

test("auth HTTP boundaries reject foreign writes and invalid callback links", async ({ request }) => {
  const foreign = await request.post("/auth/action", { headers: { origin: "https://foreign.example" }, data: { action: "login", email: "alex@example.test", password: "fictional password" } });
  expect(foreign.status()).toBe(403);
  expect(foreign.headers()["cache-control"]).toContain("no-store");
  const signout = await request.get("/auth/sign-out");
  expect(signout.status()).toBe(405);
  const callback = await request.get("/auth/callback?returnTo=//foreign.example", { maxRedirects: 0 });
  expect(callback.status()).toBeGreaterThanOrEqual(300);
  expect(callback.status()).toBeLessThan(400);
  const target = new URL(callback.headers().location ?? "", "http://127.0.0.1");
  expect(target.pathname).toBe("/session-expired");
  expect(target.searchParams.get("returnTo")).toBe("/dashboard");
});
