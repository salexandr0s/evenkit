import { expect, test } from "@playwright/test";

test("sidebar expands, becomes an icon rail with tooltips, and hides without reserving space", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".pk-admin-shell");
  const aside = shell.locator(".pk-admin-sidebar");
  const controls = shell.locator(".pk-admin-sidebar-controls");
  await expect(controls.getByRole("button")).toHaveCount(1);
  await expect(aside).toHaveCSS("width", "260px");
  await controls.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await expect(aside).toHaveCSS("width", "72px");
  await expect(controls.getByRole("button")).toHaveAccessibleName("Hide sidebar");
  const links = aside.getByRole("link");
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    await expect(link.locator("svg")).toHaveCount(1);
    await expect(link).toHaveAccessibleName(/.+/);
    await expect(link).not.toHaveAttribute("title");
  }
  const team = aside.getByRole("link", { name: "Team", exact: true });
  await team.hover();
  const tooltip = page.getByRole("tooltip", { name: "Team", exact: true });
  await expect(tooltip).toBeVisible();
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).not.toBeVisible();
  await team.focus();
  await expect(tooltip).toBeVisible();
  await expect(team).toHaveAccessibleDescription("Team");
  await team.press("Enter");
  await expect(page.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
  await expect(team).toHaveAttribute("aria-current", "page");
  await expect(tooltip).not.toBeVisible();
  // A team uses a group glyph; each individual uses the single-person glyph.
  await expect(team.locator("svg")).toHaveClass(/lucide-users/);
  await expect(shell.locator(".catalog-team-list li").first().locator("svg")).toHaveClass(/lucide-user(?:\s|$)/);
  await controls.getByRole("button", { name: "Hide sidebar", exact: true }).click();
  await expect(aside).not.toBeVisible();
  await expect.poll(() => shell.evaluate(element => {
    const frame = element.querySelector(".pk-admin-frame")!.getBoundingClientRect();
    const workspace = element.querySelector(".pk-admin-workspace")!.getBoundingClientRect();
    return Math.abs(frame.width - workspace.width);
  })).toBeLessThan(1);
  await expect(shell.getByRole("navigation", { name: "Demo workspace navigation" })).toHaveCount(0);
  await controls.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(aside).toHaveCSS("width", "260px");
  await expect(team).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
});

test("sidebar state survives the mobile drawer and tooltips follow inherited RTL", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  const aside = page.locator(".pk-admin-sidebar");
  await page.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await aside.getByRole("link", { name: "Team", exact: true }).focus();
  await expect(page.getByRole("tooltip", { name: "Team", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(aside).not.toBeVisible();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Demo workspace navigation", exact: true });
  await drawer.getByRole("link", { name: "Team", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(aside).toHaveCSS("width", "72px");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const team = aside.getByRole("link", { name: "Team", exact: true });
  await team.focus();
  const tip = page.getByRole("tooltip", { name: "Team", exact: true });
  await expect(tip).toBeVisible();
  await expect(tip).toHaveAttribute("data-side", "left");
  const tipBox = await tip.boundingBox();
  const linkBox = await team.boundingBox();
  expect(tipBox!.x + tipBox!.width).toBeLessThanOrEqual(linkBox!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Hide sidebar", exact: true }).focus();
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Hide sidebar", exact: true }).focus();
  await expect(page.getByRole("tooltip", { name: "Hide sidebar", exact: true })).toBeVisible();
});

test("sidebar edge tracks dragging, snaps to each mode, and cancels without committing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#admin-shell");
  const frame = page.locator(".pk-admin-frame");
  const aside = page.locator(".pk-admin-sidebar");
  const handle = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  await expect(aside).toHaveCSS("width", "260px");

  async function grabEdge() {
    const box = await handle.boundingBox();
    const point = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    return point;
  }

  let edge = await grabEdge();
  await page.mouse.move(edge.x - 80, edge.y, { steps: 6 });
  const trackingWidth = (await aside.boundingBox())!.width;
  expect(trackingWidth).toBeGreaterThan(150);
  expect(trackingWidth).toBeLessThan(210);
  await expect(frame).toHaveAttribute("data-sidebar-state", "expanded");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.mouse.move(edge.x - 174, edge.y, { steps: 6 });
  await page.mouse.up();
  await expect(aside).toHaveCSS("width", "72px");
  await expect(handle).toHaveAttribute("aria-valuenow", "72");
  await expect(page.getByRole("button", { name: "Hide sidebar", exact: true })).toBeVisible();

  edge = await grabEdge();
  await page.mouse.move(edge.x - 60, edge.y, { steps: 6 });
  await page.mouse.up();
  await expect(frame).toHaveAttribute("data-sidebar-state", "hidden");
  await expect(aside).toHaveCSS("width", "0px");
  await expect(aside).toHaveAttribute("inert", "");
  await expect(handle).toBeVisible();
  await expect(handle).toBeFocused();

  edge = await grabEdge();
  await page.mouse.move(edge.x + 240, edge.y, { steps: 8 });
  await page.mouse.up();
  await expect(aside).toHaveCSS("width", "260px");
  await expect(frame).toHaveAttribute("data-sidebar-state", "expanded");

  edge = await grabEdge();
  await page.mouse.move(edge.x - 150, edge.y, { steps: 6 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(aside).toHaveCSS("width", "260px");
  await expect(frame).toHaveAttribute("data-sidebar-state", "expanded");

  edge = await grabEdge();
  await page.mouse.move(edge.x - 170, edge.y, { steps: 6 });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.mouse.up();
  await expect(handle).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(aside).toHaveCSS("width", "260px");
  await expect(frame).toHaveAttribute("data-sidebar-state", "expanded");
});

test("sidebar separator supports keyboard resizing, RTL, and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  const frame = page.locator(".pk-admin-frame");
  const aside = page.locator(".pk-admin-sidebar");
  const handle = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  await expect(handle).toHaveAttribute("aria-orientation", "vertical");
  await expect(aside).toHaveAttribute("id", /.+/);
  await expect(handle).toHaveAttribute("aria-controls", (await aside.getAttribute("id"))!);
  await expect(handle).toHaveAttribute("aria-valuemin", "0");
  await expect(handle).toHaveAttribute("aria-valuemax", "260");
  await handle.press("ArrowLeft");
  await expect(aside).toHaveCSS("width", "72px");
  await expect(handle).toHaveAttribute("aria-valuetext", /collapsed|minimised/i);
  await handle.press("ArrowLeft");
  await expect(aside).toHaveCSS("width", "0px");
  await expect(handle).toBeFocused();
  await handle.press("End");
  await expect(aside).toHaveCSS("width", "260px");
  await handle.press("Home");
  await expect(aside).toHaveCSS("width", "0px");

  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  await handle.press("ArrowLeft");
  await expect(aside).toHaveCSS("width", "72px");
  await handle.press("ArrowLeft");
  await expect(aside).toHaveCSS("width", "260px");
  await handle.press("ArrowRight");
  await expect(aside).toHaveCSS("width", "72px");
  const edge = await handle.boundingBox();
  const x = edge!.x + edge!.width / 2;
  const y = edge!.y + edge!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 170, y, { steps: 8 });
  await page.mouse.up();
  await expect(aside).toHaveCSS("width", "260px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(frame).toHaveCSS("transition-duration", "0s");
  await handle.press("Home");
  await expect(aside).toHaveCSS("width", "0px");
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(aside).toHaveCSS("width", "260px");
});

test("hiding a controlled sidebar with a focused link recovers focus to its restore control", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  await page.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await page.locator(".pk-admin-sidebar").getByRole("link", { name: "Projects", exact: true }).focus();
  // Invoke the controlled parent's change handler without moving focus first.
  await page.getByRole("button", { name: "Hide sidebar", exact: true }).evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.locator(".pk-admin-sidebar")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Expand sidebar", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".pk-admin-sidebar")).toHaveCSS("width", "260px");
});

test("custom tooltip preserves descriptions, dismisses with Escape, and wraps within the viewport", async ({ page }) => {
  await page.goto("/#tooltips");
  const bookmark = page.getByRole("button", { name: "Bookmark project", exact: true });
  await bookmark.focus();
  const tip = page.getByRole("tooltip", { name: "Keep this project in your bookmarks.", exact: true });
  await expect(tip).toBeVisible();
  await expect(bookmark).toHaveAccessibleDescription(/Changes stay in this preview\..*Keep this project in your bookmarks\.|Keep this project in your bookmarks\..*Changes stay in this preview\./);
  await page.keyboard.press("Escape");
  await expect(tip).not.toBeVisible();
  await expect(bookmark).toBeFocused();
  await bookmark.press("Enter");
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status").filter({ hasText: "Project bookmarked in this preview." })).toBeVisible();
  await expect(bookmark).toHaveAccessibleDescription("Changes stay in this preview.");

  const sharing = page.getByRole("button", { name: "Sharing help", exact: true });
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await sharing.hover();
    const longTip = page.getByRole("tooltip");
    await expect(longTip).toBeVisible();
    const box = await longTip.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.width).toBeLessThanOrEqual(280);
    expect(await longTip.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await page.mouse.move(0, 0);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await sharing.hover();
  await expect(page.getByRole("tooltip")).toHaveCSS("animation-name", "none");
});
