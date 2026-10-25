import { expect, test, type Locator, type Page } from "@playwright/test";

function tooltipSurface(page: Page, name: string) {
  return page.getByRole("tooltip", { name, exact: true }).and(page.locator(".pk-tooltip-content"));
}

async function dismissTooltipWithEscape(page: Page, surface: Locator) {
  // Observe the mounted exit phase without racing its short animation.
  const exit = await surface.evaluateHandle(element => {
    const result = { connected: false, pointerEvents: "", animation: "", duration: "" };
    const observer = new MutationObserver(() => {
      if (element.getAttribute("data-state") !== "closed") return;
      const style = getComputedStyle(element);
      Object.assign(result, { connected: element.isConnected, pointerEvents: style.pointerEvents, animation: style.animationName, duration: style.animationDuration });
      observer.disconnect();
    });
    observer.observe(element, { attributes: true, attributeFilter: ["data-state"] });
    return result;
  });
  try {
    await page.keyboard.press("Escape");
    await expect.poll(() => exit.jsonValue()).toEqual({ connected: true, pointerEvents: "none", animation: "pk-tooltip-out", duration: "0.12s" });
    await expect(surface).toHaveCount(0);
  } finally {
    await exit.dispose();
  }
}

test("sidebar expands, becomes an icon rail with tooltips, and hides without reserving space", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".catalog-admin-preview .pk-admin-shell");
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
  const tooltip = tooltipSurface(page, "Team");
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveCSS("opacity", "1");
  const linkBox = await team.boundingBox();
  const tipBox = await tooltip.boundingBox();
  if (!linkBox || !tipBox) throw new Error("Missing sidebar tooltip geometry.");
  expect(tipBox.x).toBeGreaterThan(linkBox.x + linkBox.width);
  await page.mouse.move((linkBox.x + linkBox.width + tipBox.x) / 2, tipBox.y + tipBox.height / 2);
  await expect(tooltip).toHaveAttribute("data-state", /open/);
  await page.mouse.move(tipBox.x + tipBox.width / 2, tipBox.y + tipBox.height / 2, { steps: 4 });
  await expect(tooltip).toHaveAttribute("data-state", /open/);
  await page.keyboard.press("Escape");
  await expect(tooltip).not.toBeVisible();
  await team.focus();
  await expect(tooltip).toBeVisible();
  await expect(team).toHaveAccessibleDescription("Team");
  await team.press("Enter");
  await expect(shell.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
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
  await expect(shell.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
});

test("sidebar state survives the mobile drawer and tooltips follow inherited RTL", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".catalog-admin-preview .pk-admin-shell");
  const aside = shell.locator(".pk-admin-sidebar");
  const menu = shell.getByRole("button", { name: "Open navigation", exact: true });
  await shell.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await aside.getByRole("link", { name: "Team", exact: true }).focus();
  await expect(page.getByRole("tooltip", { name: "Team", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(aside).not.toBeVisible();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await expect(menu).toBeFocused();
  await menu.click();
  const drawer = page.getByRole("dialog", { name: "Demo workspace navigation", exact: true });
  await drawer.getByRole("link", { name: "Team", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(shell.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
  await expect(menu).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(aside).toHaveCSS("width", "72px");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const team = aside.getByRole("link", { name: "Team", exact: true });
  await team.focus();
  const tip = tooltipSurface(page, "Team");
  await expect(tip).toBeVisible();
  await expect(tip).toHaveAttribute("data-side", "left");
  const tipBox = await tip.boundingBox();
  const linkBox = await team.boundingBox();
  expect(tipBox!.x + tipBox!.width).toBeLessThanOrEqual(linkBox!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await shell.getByRole("button", { name: "Hide sidebar", exact: true }).focus();
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(menu).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await shell.getByRole("button", { name: "Hide sidebar", exact: true }).focus();
  await expect(page.getByRole("tooltip", { name: "Hide sidebar", exact: true })).toBeVisible();
});

test("sidebar edge tracks dragging, snaps to each mode, and cancels without committing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".catalog-admin-preview .pk-admin-shell");
  const frame = shell.locator(".pk-admin-frame");
  const aside = shell.locator(".pk-admin-sidebar");
  const handle = shell.getByRole("separator", { name: "Resize sidebar", exact: true });
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
  await expect(shell.getByRole("button", { name: "Hide sidebar", exact: true })).toBeVisible();

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
  await expect(shell.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(aside).toHaveCSS("width", "260px");
  await expect(frame).toHaveAttribute("data-sidebar-state", "expanded");
});

test("sidebar separator supports keyboard resizing, RTL, and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".catalog-admin-preview .pk-admin-shell");
  const frame = shell.locator(".pk-admin-frame");
  const aside = shell.locator(".pk-admin-sidebar");
  const handle = shell.getByRole("separator", { name: "Resize sidebar", exact: true });
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
  await shell.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(aside).toHaveCSS("width", "260px");
});

test("hiding a controlled sidebar with a focused link recovers focus to its restore control", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#admin-shell");
  const shell = page.locator(".catalog-admin-preview .pk-admin-shell");
  const aside = shell.locator(".pk-admin-sidebar");
  await shell.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await aside.getByRole("link", { name: "Projects", exact: true }).focus();
  // Invoke the controlled parent's change handler without moving focus first.
  await shell.getByRole("button", { name: "Hide sidebar", exact: true }).evaluate((element: HTMLButtonElement) => element.click());
  await expect(aside).not.toBeVisible();
  await expect(shell.getByRole("button", { name: "Expand sidebar", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(aside).toHaveCSS("width", "260px");
});

test("custom tooltip preserves descriptions, dismisses with Escape, and wraps within the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#tooltips");
  const preview = page.locator(".tooltip-workbench");
  const bookmark = preview.getByRole("button", { name: "Bookmark project", exact: true });
  await bookmark.focus();
  const tip = tooltipSurface(page, "Keep this project in your bookmarks.");
  await expect(tip).toBeVisible();
  await expect(bookmark).toHaveAccessibleDescription(/Changes stay in this preview\..*Keep this project in your bookmarks\.|Keep this project in your bookmarks\..*Changes stay in this preview\./);
  const reopening = await bookmark.evaluate(element => {
    const descriptions = element.getAttribute("aria-describedby")?.split(/\s+/) ?? [];
    const surface = descriptions.map(id => document.getElementById(id)).find(node => node?.classList.contains("pk-tooltip-content"));
    if (!surface) throw new Error("Missing bookmark tooltip surface.");
    element.blur();
    return new Promise(resolve => requestAnimationFrame(() => {
      const previousState = { connected: surface.isConnected, state: surface.getAttribute("data-state") };
      element.focus();
      resolve(previousState);
    }));
  });
  expect(reopening).toEqual({ connected: true, state: "closed" });
  await expect(tip).toHaveAttribute("data-state", "instant-open");
  await expect(tip).toHaveCSS("opacity", "1");
  await expect(bookmark).toHaveAccessibleDescription(/Keep this project in your bookmarks\./);
  await dismissTooltipWithEscape(page, tip);
  await expect(bookmark).toBeFocused();
  await bookmark.press("Enter");
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await expect(preview.getByRole("status").filter({ hasText: "Project bookmarked in this preview." })).toBeVisible();
  await expect(bookmark).toHaveAccessibleDescription("Changes stay in this preview.");

  const sharing = preview.getByRole("button", { name: "Sharing help", exact: true });
  const longTip = tooltipSurface(page, "Changing visibility keeps existing members' permissions.");
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await sharing.hover();
    await expect(longTip).toBeVisible();
    await expect(longTip).toHaveCSS("opacity", "1");
    const box = await longTip.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.width).toBeLessThanOrEqual(280);
    expect(await longTip.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(longTip).toHaveCount(0);
    await page.mouse.move(0, 0);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await sharing.hover();
  await expect(longTip).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  await expect(longTip).toHaveCount(0);
});

test("shared tooltips preserve toolbar and table icon actions", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#data-table");
  const header = page.locator(".catalog-app > .pk-admin-frame > .pk-admin-workspace > .pk-admin-header");
  const appearance = header.getByRole("button", { name: "Switch to dark mode", exact: true });
  await appearance.hover();
  await expect(tooltipSurface(page, "Switch to dark mode")).toBeVisible();
  await expect(appearance).toHaveAccessibleDescription("Switch to dark mode");
  await expect(appearance).not.toHaveAttribute("title");
  await appearance.click();
  await expect(page.locator("html")).toHaveAttribute("data-kit-mode", "dark");
  await expect(tooltipSurface(page, "Switch to dark mode")).toHaveCount(0);

  const table = page.locator(".pk-data-table");
  const next = table.getByRole("button", { name: "Next page", exact: true });
  const pageSize = table.getByRole("combobox", { name: "Rows per page", exact: true });
  await pageSize.scrollIntoViewIfNeeded();
  await pageSize.focus();
  await expect(table.getByRole("button", { name: "Previous page", exact: true })).toBeDisabled();
  await pageSize.press("Tab");
  await expect(next).toBeFocused();
  await expect(tooltipSurface(page, "Next page")).toBeVisible();
  await expect(next).toHaveAccessibleDescription("Next page");
  await expect(next).not.toHaveAttribute("title");
  const beforeScroll = await next.boundingBox();
  if (!beforeScroll) throw new Error("Missing pagination button geometry.");
  await page.mouse.wheel(0, 100);
  await expect.poll(async () => {
    const afterScroll = await next.boundingBox();
    return afterScroll ? Math.abs(afterScroll.y - beforeScroll.y) : 0;
  }).toBeGreaterThan(1);
  await expect(tooltipSurface(page, "Next page")).toHaveCount(0);
  await expect(next).toBeFocused();
  await next.press("Enter");
  await expect(table.getByText("Page 2 of 3", { exact: true })).toBeVisible();
  await expect(next).toBeFocused();
  await expect(tooltipSurface(page, "Next page")).toHaveCount(0);
});

test("modal and chat tooltips dismiss before their parent surfaces", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#dialog");
  const edit = page.getByRole("button", { name: "Edit project", exact: true });
  await edit.click();
  const dialog = page.getByRole("dialog", { name: "Edit project", exact: true });
  const close = dialog.getByRole("button", { name: "Close dialog", exact: true });
  await close.focus();
  const closeTip = tooltipSurface(page, "Close dialog");
  await expect(closeTip).toBeVisible();
  await expect(close).toHaveAccessibleDescription("Close dialog");
  await dismissTooltipWithEscape(page, closeTip);
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await close.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(edit).toBeFocused();

  await page.goto("/#chat");
  await page.getByRole("button", { name: "Open assistant", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Project assistant", exact: true });
  const maximize = chat.getByRole("button", { name: "Maximize chat", exact: true });
  await maximize.focus();
  await expect(tooltipSurface(page, "Maximize chat")).toBeVisible();
  await expect(maximize).toHaveAccessibleDescription("Maximize chat");
  await page.keyboard.press("Escape");
  await expect(tooltipSurface(page, "Maximize chat")).toHaveCount(0);
  await expect(chat).toBeVisible();
  await expect(maximize).toBeFocused();
  await maximize.press("Enter");
  await expect(chat.locator(".pk-chat-panel")).toHaveAttribute("data-mode", "expanded");
});
