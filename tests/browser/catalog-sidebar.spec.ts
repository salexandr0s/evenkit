import { expect, test } from "@playwright/test";
import { entries } from "../../apps/catalog/src/catalog-data.js";

test("library sidebar cycles and drags independently of the embedded example", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/#admin-shell");
  const frame = page.locator(".catalog-app > .pk-admin-frame");
  const aside = frame.locator(":scope > .pk-admin-sidebar");
  const header = frame.locator(":scope > .pk-admin-workspace > .pk-admin-header");
  const controls = header.getByRole("group", { name: "Sidebar display", exact: true });
  const handle = frame.locator(":scope > .pk-admin-resize");
  const demo = page.locator(".catalog-admin-preview");
  const demoHandle = demo.getByRole("separator", { name: "Resize sidebar", exact: true });
  const nav = page.getByRole("navigation", { name: "Components", exact: true });
  const search = header.getByRole("searchbox", { name: "Search components", exact: true });
  await expect(demoHandle).toBeVisible();
  const innerMargin = await demoHandle.evaluate(element => getComputedStyle(element).marginInlineEnd);
  const innerBackground = await demoHandle.evaluate(element => getComputedStyle(element).backgroundColor);
  await expect(controls.getByRole("button")).toHaveCount(1);
  await expect(nav.getByRole("link")).toHaveCount(entries.length);
  await expect(nav.locator(".pk-admin-nav-icon svg")).toHaveCount(entries.length);
  await expect(page.getByRole("main")).toHaveCount(1);

  await controls.getByRole("button", { name: "Minimise sidebar" }).click();
  await expect(aside).toHaveCSS("width", "72px");
  await nav.getByRole("link", { name: "Admin shell", exact: true }).focus();
  await expect(page.getByRole("tooltip", { name: "Admin shell", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await controls.getByRole("button", { name: "Hide sidebar" }).click();
  await expect(aside).not.toBeVisible();
  await expect(demoHandle).toHaveCSS("margin-inline-end", innerMargin);
  await expect(demo.locator(".pk-admin-sidebar")).toHaveCSS("width", "260px");
  await expect(search).toBeVisible();
  await expect(async () => {
    const left = await frame.evaluate(element => ({
      frame: element.getBoundingClientRect().left,
      workspace: element.querySelector(":scope > .pk-admin-workspace")!.getBoundingClientRect().left,
    }));
    expect(left.workspace).toBeCloseTo(left.frame, 0);
  }).toPass();

  await search.fill("unmatched-library-entry");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(frame).toHaveAttribute("data-sidebar-state", "hidden");
  await handle.press("End");
  await expect(aside).toHaveCSS("width", "260px");
  const grip = await handle.boundingBox();
  if (!grip) throw new Error("Missing library resize handle.");
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
  await page.mouse.down();
  await page.mouse.move(74, grip.y + grip.height / 2, { steps: 6 });
  await expect(frame).toHaveAttribute("data-dragging", "true");
  await expect(demoHandle).toHaveCSS("background-color", innerBackground);
  await page.mouse.up();
  await expect(aside).toHaveCSS("width", "72px");
  await page.reload();
  await expect(aside).toHaveCSS("width", "72px");

  await nav.getByRole("link", { name: "Icons", exact: true }).click();
  await expect(page).toHaveURL(/#icons$/);
  await search.fill("lucide");
  await nav.getByRole("link", { name: "Icons", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(nav.getByRole("link")).toHaveCount(entries.length);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Admin shell", exact: true })).toBeVisible();
  await expect(aside).toHaveCSS("width", "72px");
});

test("library drawer keeps navigation reachable while preserving the hidden desktop mode", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#buttons");
  const frame = page.locator(".catalog-app > .pk-admin-frame");
  const header = frame.locator(":scope > .pk-admin-workspace > .pk-admin-header");
  await header.getByRole("button", { name: "Minimise sidebar", exact: true }).click();
  await header.getByRole("button", { name: "Hide sidebar", exact: true }).click();
  await page.setViewportSize({ width: 360, height: 800 });
  const trigger = header.getByRole("button", { name: "Open navigation", exact: true });
  await expect(trigger).toBeVisible();
  await expect(header.getByRole("searchbox", { name: "Search components" })).toBeVisible();
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Components", exact: true });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "Data table", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Data table", exact: true })).toBeVisible();
  await trigger.click();
  await expect(drawer.getByRole("link", { name: "Data table", exact: true })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await drawer.getByRole("link", { name: "Project kit home", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Buttons", exact: true })).toBeVisible();
  const skip = page.locator(".catalog-app > .pk-admin-skip");
  await skip.focus();
  await skip.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const headingBox = await page.getByRole("heading", { name: "Buttons", exact: true }).boundingBox();
  const headerBox = await header.boundingBox();
  if (!headingBox || !headerBox) throw new Error("Missing skip-link destination geometry.");
  expect(headingBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await expect(frame).toHaveAttribute("data-sidebar-state", "hidden");
  await header.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(frame.locator(":scope > .pk-admin-sidebar")).toHaveCSS("width", "260px");
});
