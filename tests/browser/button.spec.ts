import { expect, test, type Locator } from "@playwright/test";

async function expectSquare(control: Locator, expected: number) {
  const box = await control.boundingBox();
  expect(box?.width).toBe(expected);
  expect(box?.height).toBe(expected);
}

test("buttons preserve names and geometry while busy and expose pressed state", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-25T08:00:00Z") });
  await page.goto("/#buttons");
  await page.clock.pauseAt(new Date("2026-10-25T09:00:00Z"));
  const save = page.getByRole("button", { name: "Save changes", exact: true });
  const before = await save.boundingBox();
  await save.press("Enter");
  await expect(save).toBeDisabled();
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(save).toHaveAccessibleName("Save changes");
  const during = await save.boundingBox();
  expect(during?.width).toBe(before?.width);
  expect(during?.height).toBe(before?.height);
  await save.press("Enter");
  await page.clock.runFor(1200);
  await expect(save).toBeEnabled();
  await expect(save).not.toHaveAttribute("aria-busy", "true");
  await expect(page.getByText("Preview saved 1 time.", { exact: true })).toBeVisible();

  const toggle = page.getByRole("button", { name: "Email notifications", exact: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Email notifications are on.", { exact: true })).toBeVisible();
  await expect(toggle.locator("svg")).toHaveAttribute("aria-hidden", "true");
  const callerBusy = page.getByRole("button", { name: "Background update", exact: true });
  await expect(callerBusy).toHaveAttribute("aria-busy", "true");
  await expect(callerBusy).toBeEnabled();
});

test("button shapes and adornments fit desktop, narrow, and wide touch layouts", async ({ page, browser }) => {
  await page.goto("/#buttons");
  for (const [label, dimension] of [["Small", 32], ["Medium", 40], ["Large", 48]] as const) {
    await expectSquare(page.getByRole("button", { name: `${label} icon action`, exact: true }), dimension);
  }
  const iconLink = page.getByRole("link", { name: "Browse icons", exact: true });
  await expectSquare(iconLink, 40);
  const full = page.getByRole("button", { name: "Continue with this workspace and invite the rest of your team", exact: true });
  const leading = page.getByRole("button", { name: "Create project", exact: true });
  const trailing = page.getByRole("link", { name: "Explore tokens", exact: true });
  await expect(leading.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(trailing.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [label, dimension] of [["Small", 44], ["Medium", 44], ["Large", 48]] as const) {
    await expectSquare(page.getByRole("button", { name: `${label} icon action`, exact: true }), dimension);
  }
  await expectSquare(iconLink, 44);
  expect(await full.evaluate(element => {
    const parent = element.parentElement;
    if (!parent) return false;
    const style = getComputedStyle(parent);
    const available = parent.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
    return Math.abs(element.getBoundingClientRect().width - available) < 1 && element.scrollWidth <= element.clientWidth;
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await iconLink.press("Enter");
  await expect(page.getByRole("heading", { name: "Icons", exact: true })).toBeVisible();

  const touch = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 900 } });
  try {
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("/#buttons", page.url()).href);
    for (const [label, dimension] of [["Small", 44], ["Medium", 44], ["Large", 48]] as const) {
      await expectSquare(touchPage.getByRole("button", { name: `${label} icon action`, exact: true }), dimension);
    }
  } finally {
    await touch.close();
  }
});
