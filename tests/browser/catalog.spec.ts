import { expect, test, type Page } from "@playwright/test";

async function chooseOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("search finds controls and recovers from no results", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search components" });
  await search.fill("modal");
  await expect(page.getByRole("heading", { name: "Dialog", exact: true })).toBeVisible();
  await search.fill("unmatched-component");
  await expect(page.getByText("No components match your search", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Buttons", exact: true })).toBeVisible();
});

test("explicit appearance overrides the system and theme selection changes actual colors", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const appearance = page.getByLabel("Appearance", { exact: true });
  await expect(page.locator("html")).not.toHaveAttribute("data-kit-mode");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await chooseOption(page, "Appearance", "Light");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  const primary = page.getByRole("button", { name: "Primary action", exact: true });
  const neutralColor = await primary.evaluate(element => getComputedStyle(element).backgroundColor);
  await chooseOption(page, "Theme", "Grove");
  await expect(primary).not.toHaveCSS("background-color", neutralColor);
  await chooseOption(page, "Appearance", "Dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await chooseOption(page, "Appearance", "System");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Theme", exact: true })).toHaveText("Grove");
  await expect(appearance).toHaveText("System");
});

test("field validation associates descriptions, focuses the first error, and resets", async ({ page }) => {
  await page.goto("/#fields");
  const name = page.getByRole("textbox", { name: "Project name", exact: true });
  const notes = page.getByRole("textbox", { name: "Notes", exact: true });
  const success = page.getByText("Preview submitted. No data was sent or stored.", { exact: true });
  await expect(name).toHaveAttribute("required", "");
  await expect(notes).not.toHaveAttribute("required");
  await notes.fill("Short");
  await page.getByRole("button", { name: "Submit preview" }).click();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription(/Use a name your team recognises.*at least two characters/);
  await expect(notes).toHaveAttribute("aria-invalid", "true");
  const descriptions = (await notes.getAttribute("aria-describedby"))?.split(/\s+/) ?? [];
  expect(descriptions).toContain("preview-notes-count");
  expect(new Set(descriptions).size).toBe(descriptions.length);
  for (const id of descriptions) await expect(page.locator(`[id="${id}"]`)).toBeVisible();
  await expect(notes).toHaveAccessibleDescription(/Add at least 12 characters, or leave notes empty/);
  await name.fill("Autumn project");
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Submit preview" }).click();
  await expect(notes).toBeFocused();
  const value = "Plan the release.\nConfirm the launch date with the team.";
  await notes.fill(value);
  await expect(notes).not.toHaveAttribute("aria-invalid", "true");
  await expect(notes).toHaveAttribute("maxlength", "240");
  expect((await notes.getAttribute("aria-describedby"))?.split(/\s+/)).not.toContain("preview-notes-error");
  const formData = await name.evaluate(element => Object.fromEntries(new FormData((element as HTMLInputElement).form!)));
  expect(formData).toMatchObject({ projectName: "Autumn project", notes: value });
  await page.getByRole("button", { name: "Submit preview" }).click();
  await expect(success).toBeVisible();
  await page.getByRole("button", { name: "Reset preview" }).click();
  await expect(name).toHaveValue("");
  await expect(notes).toHaveValue("");
  await expect(name).toBeFocused();
  await expect(success).not.toBeVisible();
  await expect(notes).not.toHaveAttribute("aria-invalid", "true");
  await name.fill("Name only");
  await page.getByRole("button", { name: "Submit preview" }).click();
  await expect(success).toBeVisible();
});

test("dialog contains focus, inherits the theme, closes with Escape and restores focus", async ({ page }) => {
  await page.goto("/#dialog");
  await chooseOption(page, "Theme", "Grove");
  await chooseOption(page, "Appearance", "Dark");
  const trigger = page.getByRole("button", { name: "Edit project", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Edit project" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Project name" })).toBeFocused();
  const inherited = await dialog.evaluate(element => ({
    dialog: getComputedStyle(element).getPropertyValue("--pk-color-accent").trim(),
    root: getComputedStyle(document.documentElement).getPropertyValue("--pk-color-accent").trim()
  }));
  expect(inherited.dialog).toBe(inherited.root);
  const dialogLayer = Number(await dialog.evaluate(element => getComputedStyle(element).zIndex));
  await dialog.getByRole("combobox", { name: "Project visibility", exact: true }).click();
  const popup = page.getByRole("listbox");
  await expect(popup).toBeVisible();
  expect(Number(await popup.evaluate(element => getComputedStyle(element).zIndex))).toBeGreaterThan(dialogLayer);
  await page.getByRole("option", { name: "Team", exact: true }).click();
  await expect(dialog.getByRole("combobox", { name: "Project visibility", exact: true })).toHaveText("Team");
  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press("Tab");
    await expect(dialog).toContainText("Edit project");
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();

  // Dismissed edits stay local; the footer submits the form inside DialogBody.
  await trigger.click();
  const name = dialog.getByRole("textbox", { name: "Project name" });
  await expect(dialog.getByRole("combobox", { name: "Project visibility", exact: true })).toHaveText("Private");
  await name.fill("Unsaved project");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await trigger.click();
  await expect(name).toHaveValue("Spring launch");
  await name.fill("   ");
  await dialog.getByRole("button", { name: "Save preview", exact: true }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription(/Enter a project name\./);
  await name.fill("Autumn launch");
  await dialog.getByRole("button", { name: "Save preview", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(name).toHaveValue("Autumn launch");
  await dialog.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(trigger).toBeFocused();
});

test("narrow layouts preserve controls and recoverable feedback", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const primary = page.getByRole("button", { name: "Primary action", exact: true });
  expect((await primary.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("button", { name: "Disabled action" })).toBeDisabled();
  const loading = page.getByRole("button", { name: "Loading state", exact: true });
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  for (const entry of ["Fields", "Select", "Dialog", "Design tokens", "Empty state"]) {
    await page.getByRole("button", { name: "Browse components" }).click();
    await page.getByRole("navigation", { name: "Components", exact: true }).getByRole("link", { name: entry, exact: true }).click();
    await expect(page.getByRole("heading", { name: entry, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.getByRole("button", { name: "Retry preview" }).click();
  await expect(page.getByText("The retry preview succeeded. No external service was contacted.", { exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Browse components" }).click();
  await page.getByRole("navigation", { name: "Components", exact: true }).getByRole("link", { name: "Loading", exact: true }).click();
  await expect(page.locator(".pk-spinner")).toHaveCSS("animation-name", "none");
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("custom select supports keyboard, form values, disabled state, and an inset chevron", async ({ page }) => {
  await page.goto("/#select");
  const trigger = page.getByRole("combobox", { name: "Project visibility", exact: true });
  const triggerBox = await trigger.boundingBox();
  const iconBox = await trigger.locator(".pk-select-chevron").boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  if (!triggerBox || !iconBox) throw new Error("Missing dropdown geometry.");
  const inset = triggerBox.x + triggerBox.width - iconBox.x - iconBox.width;
  expect(inset).toBeGreaterThanOrEqual(12);
  expect(inset).toBeLessThanOrEqual(14);
  await expect(page.getByRole("combobox", { name: "Region", exact: true })).toBeDisabled();
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.getByRole("option", { name: "Private", exact: true })).toBeFocused();
  expect((await page.getByRole("option", { name: "Private", exact: true }).boundingBox())?.height).toBe(36);
  await page.keyboard.press("ArrowDown");
  // Radix schedules navigation focus; Enter acts on the currently focused item.
  await expect(page.getByRole("option", { name: "Team", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("Team");
  await page.getByRole("button", { name: "Read selection" }).click();
  await expect(page.getByText("Form value: team.", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  await trigger.click();
  const popup = page.getByRole("listbox");
  await expect(popup).toBeVisible();
  await expect(page.getByRole("option", { name: "Team", exact: true })).toBeFocused();
  const popupBox = await popup.boundingBox();
  expect((await page.getByRole("option", { name: "Team", exact: true }).boundingBox())?.height).toBe(44);
  expect(popupBox).not.toBeNull();
  if (!popupBox) throw new Error("Missing dropdown popup.");
  expect(popupBox.x).toBeGreaterThanOrEqual(0);
  expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(360);
  await page.keyboard.press("p");
  await page.keyboard.press("u");
  await page.keyboard.press("b");
  await expect(page.getByRole("option", { name: "Public", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("Public");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
