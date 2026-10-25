import { expect, test } from "@playwright/test";

test("loading restarts safely, announces once and preserves focus and content geometry", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-25T08:00:00Z") });
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/#loading");
  await page.clock.pauseAt(new Date("2026-10-25T09:00:00Z"));
  const preview = page.getByRole("region", { name: "Loading live preview", exact: true });
  const project = preview.getByRole("region", { name: "Project details", exact: true });
  const reload = preview.getByRole("button", { name: "Reload project", exact: true });
  const status = preview.getByRole("status", { name: "Project loading status", exact: true });
  await expect(preview.getByRole("status")).toHaveCount(1);
  await expect(status).toHaveText("Project details ready.");
  await expect(project).toHaveAttribute("aria-busy", "false");
  expect(await status.evaluate(element => element.closest('[aria-busy="true"]') === null)).toBe(true);
  const before = await project.boundingBox();
  await reload.press("Enter");
  await expect(reload).toBeEnabled();
  await expect(reload).toBeFocused();
  await expect(reload).toHaveAttribute("aria-busy", "true");
  await expect(project).toHaveAttribute("aria-busy", "true");
  await expect(status).toHaveText("Loading project details…");
  await expect(project.getByRole("heading", { name: "Spring launch" })).toHaveCount(0);
  expect((await project.boundingBox())?.height).toBe(before?.height);
  expect(await project.locator(".pk-skeleton").count()).toBeGreaterThan(0);
  for (const placeholder of await project.locator(".pk-skeleton").all()) await expect(placeholder).toHaveAttribute("aria-hidden", "true");
  for (const spinner of await preview.locator(".pk-spinner").all()) {
    await expect(spinner).toHaveAttribute("aria-hidden", "true");
    await expect(spinner).not.toHaveAttribute("role");
    await expect(spinner).not.toHaveAttribute("aria-label");
  }
  await expect(preview.getByRole("status")).toHaveCount(1);

  // The second request supersedes the first; its content cannot arrive early.
  await page.clock.runFor(800);
  await reload.press("Enter");
  await page.clock.runFor(800);
  await expect(project).toHaveAttribute("aria-busy", "true");
  await page.clock.runFor(400);
  await expect(project).toHaveAttribute("aria-busy", "false");
  await expect(reload).toHaveAttribute("aria-busy", "false");
  await expect(reload).toBeFocused();
  await expect(status).toHaveText("Project details ready.");
  await expect(project.getByRole("heading", { name: "Spring launch" })).toBeVisible();
  await expect(project.locator(".pk-skeleton")).toHaveCount(0);
  expect((await project.boundingBox())?.height).toBe(before?.height);

  // Text shapes must escape the old 40px block minimum; avatars stay square.
  const shapes = preview.getByRole("region", { name: "Skeleton shapes" });
  const spinners = preview.getByRole("region", { name: "Spinner sizes" });
  for (const [size, iconSize, textHeight, blockHeight] of [["sm", 16, 12, 32], ["md", 20, 14, 40], ["lg", 24, 16, 48]] as const) {
    const spinner = spinners.locator(`[data-size="${size}"]`);
    await expect(spinner).toHaveCSS("width", `${iconSize}px`);
    await expect(spinner).toHaveCSS("height", `${iconSize}px`);
    await expect(shapes.locator(`[data-variant="text"][data-size="${size}"]`)).toHaveCSS("height", `${textHeight}px`);
    const avatar = await shapes.locator(`[data-variant="avatar"][data-size="${size}"]`).boundingBox();
    expect(avatar?.width).toBe(blockHeight);
    expect(avatar?.height).toBe(blockHeight);
    await expect(shapes.locator(`[data-variant="block"][data-size="${size}"]`)).toHaveCSS("min-height", `${blockHeight}px`);
  }

  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const ready = await project.boundingBox();
    await reload.press("Enter");
    const pending = await project.boundingBox();
    expect(pending?.width).toBe(ready?.width);
    expect(pending?.height).toBe(ready?.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await project.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    // A completion must also leave a user who moved away on their chosen target.
    await page.getByRole("combobox", { name: "Theme", exact: true }).focus();
    await page.clock.runFor(1200);
    await expect(project).toHaveAttribute("aria-busy", "false");
    await expect(page.getByRole("combobox", { name: "Theme", exact: true })).toBeFocused();
  }
});
