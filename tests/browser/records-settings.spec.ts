import { expect, test } from "@playwright/test";
import { themes } from "@evenkit/tokens";

test("list detail edit retains the selected record and restores focus", async ({ page }) => {
  await page.goto("/#record-detail");
  const view = page.getByRole("button", { name: "View Meridian release", exact: true });
  await view.click();
  const detail = page.getByRole("region", { name: "Meridian release details", exact: true });
  await expect(detail.getByRole("heading", { name: "Meridian release", exact: true })).toBeVisible();
  await detail.getByRole("tab", { name: "Activity", exact: true }).click();
  await expect(detail.locator("time").first()).toHaveAttribute("datetime", "2026-10-25T10:30:00Z");
  await detail.getByRole("button", { name: "Edit project", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Edit project", exact: true });
  await dialog.getByRole("textbox", { name: "Project name", exact: true }).fill("Meridian launch");
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(dialog).toBeHidden();
  const updated = page.getByRole("region", { name: "Meridian launch details", exact: true });
  await expect(updated.getByRole("button", { name: "Edit project", exact: true })).toBeFocused();
  await updated.getByRole("button", { name: "Back to projects", exact: true }).click();
  await expect(page.getByRole("button", { name: "View Meridian launch", exact: true })).toBeFocused();
});

test("workspace switching searches, retries and cancels without changing context", async ({ page }) => {
  await page.goto("/#workspace-switcher");
  await page.getByRole("checkbox", { name: "Fail the next switch" }).check();
  await page.getByRole("button", { name: "Switch workspace: Meridian Studio", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "Switch workspace", exact: true });
  await expect(popup.getByRole("button", { name: /Cedar Archive/ })).toBeDisabled();
  const search = popup.getByRole("searchbox", { name: "Find a workspace", exact: true });
  await search.fill("Aster");
  const compositionWasPrevented = await search.evaluate(element => {
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", isComposing: true, bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(compositionWasPrevented).toBe(false);
  await expect(search).toBeFocused();
  await search.press("ArrowDown");
  await expect(popup.getByRole("button", { name: /Aster Research/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(popup.getByText("Workspace did not change", { exact: true })).toBeVisible();
  await expect(search).toBeFocused();
  await popup.getByRole("button", { name: "Retry switch", exact: true }).click();
  await expect(popup).toBeHidden();
  const trigger = page.getByRole("button", { name: "Switch workspace: Aster Research", exact: true });
  await expect(trigger).toBeFocused();
  await page.clock.install();
  await page.getByRole("checkbox", { name: "Use a slow response" }).check();
  await trigger.click();
  await popup.getByRole("button", { name: /Meridian Studio/ }).click();
  await popup.getByRole("button", { name: "Cancel switch", exact: true }).click();
  await expect(search).toBeFocused();
  await page.clock.fastForward(3000);
  await search.press("Escape");
  await expect(trigger).toBeFocused();
});

test("profile failures keep drafts and cancelled saves cannot replace saved values", async ({ page }) => {
  await page.goto("/#profile-settings");
  const form = page.getByRole("form", { name: "Profile settings", exact: true });
  await page.getByRole("checkbox", { name: "Fail the next save" }).check();
  await form.getByRole("textbox", { name: "Full name", exact: true }).fill("Alex Rivera");
  await form.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("draft is ready to retry");
  await expect(form.getByRole("textbox", { name: "Full name", exact: true })).toHaveValue("Alex Rivera");
  await form.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(form.getByRole("status")).toContainText("Profile saved.");
  await page.clock.install();
  await page.getByRole("checkbox", { name: "Use a slow response" }).check();
  await form.getByRole("textbox", { name: "Full name", exact: true }).fill("Cancelled name");
  await form.getByRole("button", { name: "Save profile", exact: true }).click();
  await form.getByRole("button", { name: "Cancel save", exact: true }).click();
  await page.clock.fastForward(3000);
  await form.getByRole("button", { name: "Reset changes", exact: true }).click();
  await expect(form.getByRole("textbox", { name: "Full name", exact: true })).toHaveValue("Alex Rivera");
});

test("settings preserve profile drafts and restore mode, density and locale", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/#settings-layout");
  const nav = page.getByRole("navigation", { name: "Settings sections", exact: true });
  await page.getByRole("textbox", { name: "Full name", exact: true }).fill("Draft name");
  await nav.getByRole("button", { name: "Appearance", exact: true }).click();
  const sample = page.locator(".account-appearance-sample");
  const primary = sample.getByRole("button", { name: "Primary action", exact: true });
  const rgb = (hex: string) => `rgb(${[1, 3, 5].map(start => Number.parseInt(hex.slice(start, start + 2), 16)).join(", ")})`;
  await expect(sample).toHaveCSS("background-color", rgb(themes.neutral.modes.light.surface));
  await expect(primary).toHaveCSS("background-color", rgb(themes.neutral.modes.light.accent));
  const lightBackground = await sample.evaluate(element => getComputedStyle(element).backgroundColor);
  const lightAccent = await primary.evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByRole("radio", { name: "Dark", exact: true }).check();
  await expect(sample).toHaveAttribute("data-kit-mode", "dark");
  await expect(sample).not.toHaveCSS("background-color", lightBackground);
  await expect(primary).not.toHaveCSS("background-color", lightAccent);
  await expect(primary).toHaveCSS("background-color", rgb(themes.neutral.modes.dark.accent));
  const neutralAccent = await primary.evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByRole("combobox", { name: "Color theme", exact: true }).click();
  await page.getByRole("option", { name: "Ocean", exact: true }).click();
  await expect(primary).not.toHaveCSS("background-color", neutralAccent);
  await expect(sample).toHaveCSS("background-color", rgb(themes.ocean.modes.dark.surface));
  await expect(primary).toHaveCSS("background-color", rgb(themes.ocean.modes.dark.accent));
  const oceanBackground = await sample.evaluate(element => getComputedStyle(element).backgroundColor);
  const oceanAccent = await primary.evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByRole("combobox", { name: "Density", exact: true }).click();
  await page.getByRole("option", { name: "Compact", exact: true }).click();
  await page.getByRole("combobox", { name: "Locale", exact: true }).click();
  await page.getByRole("option", { name: "Deutsch (Österreich)", exact: true }).click();
  await expect(page.locator(".account-appearance-sample")).toHaveAttribute("data-density", "compact");
  await expect(page.locator(".account-appearance-sample")).toContainText("1.234,50");
  await nav.getByRole("button", { name: "Profile", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Full name", exact: true })).toHaveValue("Draft name");
  await page.goto("/#appearance-preferences");
  await expect(page.getByRole("radio", { name: "Dark", exact: true })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Color theme", exact: true })).toContainText("Ocean");
  await expect(sample).toHaveCSS("background-color", oceanBackground);
  await expect(primary).toHaveCSS("background-color", oceanAccent);
  await expect(page.getByRole("combobox", { name: "Density", exact: true })).toContainText("Compact");
  await expect(page.getByRole("combobox", { name: "Locale", exact: true })).toContainText("Deutsch (Österreich)");
  await expect(page.locator(".account-appearance-sample time")).toHaveText("6. November 2026");
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("radio", { name: /System/ }).check();
  await expect(page.locator(".account-appearance-sample")).toHaveAttribute("data-kit-mode", "light");
  await expect(sample).not.toHaveCSS("background-color", oceanBackground);
  await expect(primary).not.toHaveCSS("background-color", oceanAccent);
  await expect(sample).toHaveCSS("background-color", rgb(themes.ocean.modes.light.surface));
  await expect(primary).toHaveCSS("background-color", rgb(themes.ocean.modes.light.accent));
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator(".account-appearance-sample")).toHaveAttribute("data-kit-mode", "dark");
  await expect(sample).toHaveCSS("background-color", oceanBackground);
  await expect(primary).toHaveCSS("background-color", oceanAccent);
});

test("appearance rejects unsupported stored density and locale", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("evenkit.demo.appearance", JSON.stringify({ theme: "neutral", mode: "dark", density: "dense", locale: "unsupported-locale" }));
  });
  await page.goto("/#appearance-preferences");
  await expect(page.getByRole("radio", { name: "Dark", exact: true })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Density", exact: true })).toContainText("Default");
  await expect(page.getByRole("combobox", { name: "Locale", exact: true })).toContainText("English (United States)");
  await expect(page.locator(".account-appearance-sample")).toHaveAttribute("data-locale", "en-US");
  await expect(page.locator(".account-appearance-sample")).toContainText("€1,234.50");
});

test("appearance remains usable when preference storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
  });
  await page.goto("/#appearance-preferences");
  await page.getByRole("radio", { name: "Dark", exact: true }).check();
  await expect(page.locator(".account-appearance-sample")).toHaveAttribute("data-kit-mode", "dark");
  await expect(page.getByText("Preferences changed for this visit. Browser storage is unavailable.", { exact: true })).toBeVisible();
});

test("activity retries retain keyboard focus when failure controls disappear", async ({ page }) => {
  await page.goto("/#activity-timeline");
  const timeline = page.getByRole("region", { name: "Activity", exact: true });
  const retryEvent = timeline.getByRole("button", { name: "Retry action by You", exact: true });
  await retryEvent.focus();
  await page.keyboard.press("Enter");
  await expect(retryEvent).toHaveCount(0);
  await expect(timeline.locator(".pk-activity-event").first()).toBeFocused();
  await page.getByRole("button", { name: "Simulate loading failure", exact: true }).click();
  const retryActivity = timeline.getByRole("button", { name: "Retry activity", exact: true });
  await retryActivity.focus();
  await page.keyboard.press("Enter");
  await expect(retryActivity).toHaveCount(0);
  await expect(timeline).toBeFocused();
  await expect(timeline).toHaveCSS("outline-style", "solid");
});
