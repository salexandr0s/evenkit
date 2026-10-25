import { expect, test } from "@playwright/test";

test("grouped select keeps descriptions separate and recovers from required errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#select");
  const trigger = page.getByRole("combobox", { name: "Project template", exact: true });
  await page.getByRole("button", { name: "Use template", exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-invalid", "true");
  await expect(trigger).toHaveAccessibleDescription(/Choose a starting point for your team.*Choose a project template/);
  expect((await trigger.getAttribute("aria-describedby"))?.split(/\s+/)).toContain("template-note");
  await trigger.press("ArrowDown");
  const popup = page.getByRole("listbox");
  await expect(popup).toBeVisible();
  await expect(popup).toHaveClass(/pk-select-content/);
  await expect(popup).toHaveAttribute("data-state", "open");
  await expect(popup).toHaveCSS("animation-name", "pk-select-in");
  await expect(popup).toHaveCSS("animation-duration", "0.16s");
  await expect(popup.getByRole("group", { name: "Team templates", exact: true })).toBeVisible();
  await expect(popup.getByRole("group", { name: "Delivery templates", exact: true })).toBeVisible();
  await expect(page.getByRole("option", { name: "Blank project", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  const product = page.getByRole("option", { name: "Product launch", exact: true });
  await expect(product).toBeFocused();
  await expect(product).toHaveAccessibleDescription("Plan milestones, owners, and launch tasks.");
  await expect(page.getByRole("option", { name: "Internal review", exact: true })).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Client handover", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText("Client handover");
  await expect(trigger).not.toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Use template", exact: true }).click();
  await expect(page.getByText("Template value: client.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset template", exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("data-placeholder");
  await expect(trigger).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Template value: client.", { exact: true })).not.toBeVisible();
  await trigger.press("ArrowDown");
  await expect(page.locator(".pk-select-content")).toHaveCount(1);
  await expect(popup.getByRole("option")).toHaveCount(4);
  await expect(page.getByRole("option", { name: "Blank project", exact: true })).toBeFocused();
  await page.keyboard.press("p");
  await expect(product).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("Product launch");
  await expect(popup).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.press("ArrowDown");
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("empty grouped options are focusable and recover when options arrive", async ({ page }) => {
  await page.goto("/#select");
  const trigger = page.getByRole("combobox", { name: "Available presets", exact: true });
  await trigger.focus();
  await trigger.press("ArrowDown");
  const popup = page.getByRole("listbox");
  await expect(popup).toBeVisible();
  await expect(popup).toBeFocused();
  await expect(popup.getByRole("status")).toHaveText("No presets are available yet.");
  await expect(popup.getByRole("option")).toHaveCount(0);
  await expect(popup.getByRole("group")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Load sample presets", exact: true }).click();
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Starter preset", exact: true })).toBeFocused();
  await expect(popup.getByRole("status")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("Starter preset");
});

test("long select labels, RTL geometry, and coarse-pointer rows remain usable", async ({ page, browser }) => {
  await page.goto("/#select");
  const long = page.getByRole("combobox", { name: "Long option labels", exact: true });
  const label = "Quarterly planning and cross-functional delivery coordination";
  expect((await long.boundingBox())?.height).toBe(48);
  const option = page.getByRole("option", { name: label, exact: true });
  const popup = page.getByRole("listbox");
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await long.click();
    await expect(option).toHaveAccessibleDescription("Coordinate milestones, dependencies, and handovers across every delivery team.");
    const box = await popup.boundingBox();
    if (!box) throw new Error("Missing long-option popup.");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await option.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(popup).not.toBeVisible();
  }
  await page.setViewportSize({ width: 360, height: 900 });
  await long.click();
  await option.click();
  await expect(long).toHaveText(label);
  expect(await long.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const rtl = page.getByRole("combobox", { name: "Right-to-left selection", exact: true });
  const triggerBox = await rtl.boundingBox();
  const chevronBox = await rtl.locator(".pk-select-chevron").boundingBox();
  if (!triggerBox || !chevronBox) throw new Error("Missing RTL trigger geometry.");
  expect(chevronBox.x - triggerBox.x).toBeGreaterThanOrEqual(12);
  expect(chevronBox.x - triggerBox.x).toBeLessThanOrEqual(14);
  await rtl.click();
  await expect(popup).toHaveCSS("direction", "rtl");
  await page.keyboard.press("Escape");
  await expect(rtl).toBeFocused();

  const touch = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 900 } });
  try {
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("/#select", page.url()).href);
    expect((await touchPage.getByRole("combobox", { name: "Long option labels", exact: true }).boundingBox())?.height).toBe(48);
    const visibility = touchPage.getByRole("combobox", { name: "Project visibility", exact: true });
    expect((await visibility.boundingBox())?.height).toBe(44);
    await visibility.click();
    expect((await touchPage.getByRole("option", { name: "Private", exact: true }).boundingBox())?.height).toBe(44);
  } finally {
    await touch.close();
  }
});
