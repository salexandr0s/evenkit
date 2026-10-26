import { expect, test } from "@playwright/test";
import { entries } from "../../apps/catalog/src/catalog-data.js";

test("library sections preserve keyboard choices while search and history reveal destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/#buttons");
  const nav = page.getByRole("navigation", { name: "Components", exact: true });
  const links = nav.locator("a.pk-admin-nav-link");
  await expect(links).toHaveCount(entries.length);
  const ids = await links.evaluateAll(elements => elements.map(element => element.getAttribute("href")?.slice(1)).sort());
  expect(ids).toEqual(entries.map(entry => entry.id).sort());
  await expect(links.locator(".pk-admin-nav-icon svg")).toHaveCount(entries.length);
  await expect(links.locator(".pk-admin-nav-icon .lucide-circle")).toHaveCount(0);
  await expect(nav.locator('a[href="#line-chart"] .lucide-chart-line')).toHaveCount(1);
  await expect(nav.locator('a[href="#bar-chart"] .lucide-chart-column')).toHaveCount(1);
  await expect(nav.getByRole("link")).toHaveCount(8);

  const foundations = nav.getByRole("button", { name: "Foundations", exact: true });
  await expect(foundations).toHaveAttribute("aria-expanded", "false");
  await foundations.focus();
  await foundations.press("Enter");
  await expect(foundations).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Design tokens", exact: true })).toBeVisible();
  await foundations.press("Space");
  await expect(foundations).toHaveAttribute("aria-expanded", "false");
  await expect(foundations).toBeFocused();
  await expect(nav.getByRole("link", { name: "Design tokens", exact: true })).toHaveCount(0);
  const layout = nav.getByRole("button", { name: "Layout", exact: true });
  await layout.click();
  await page.reload();
  await expect(layout).toHaveAttribute("aria-expanded", "true");
  await expect(foundations).toHaveAttribute("aria-expanded", "false");

  const files = nav.getByRole("button", { name: "Files & media", exact: true });
  await expect(files).toHaveAttribute("aria-expanded", "false");
  const search = page.getByRole("searchbox", { name: "Search components", exact: true });
  await search.fill("document library");
  await expect(nav.getByRole("link", { name: "Document library", exact: true })).toBeVisible();
  await search.fill("");
  await expect(files).toHaveAttribute("aria-expanded", "false");
  await expect(layout).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("heading", { name: "Buttons", exact: true })).toBeVisible();

  await page.evaluate(() => { window.location.hash = "website-article"; });
  const website = nav.getByRole("button", { name: "Website blocks", exact: true });
  const article = nav.getByRole("link", { name: "Article and documentation", exact: true });
  await expect(website).toHaveAttribute("aria-expanded", "true");
  await expect(article).toHaveAttribute("aria-current", "page");
  await expect(article).toBeInViewport();
  await website.click();
  await expect(website).toHaveAttribute("aria-expanded", "false");
  await page.goBack();
  await expect(nav.getByRole("link", { name: "Buttons", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goForward();
  await expect(website).toHaveAttribute("aria-expanded", "true");
  await expect(article).toHaveAttribute("aria-current", "page");
});

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
  await expect(nav.locator("a.pk-admin-nav-link")).toHaveCount(entries.length);
  await expect(nav.locator("a.pk-admin-nav-link .pk-admin-nav-icon svg")).toHaveCount(entries.length);
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

  const foundations = nav.getByRole("button", { name: "Foundations", exact: true });
  await foundations.focus();
  await expect(page.getByRole("tooltip", { name: "Foundations", exact: true })).toBeVisible();
  await foundations.press("Enter");
  await expect(foundations).toHaveAttribute("aria-expanded", "true");
  await nav.getByRole("link", { name: "Icons", exact: true }).click();
  await expect(page).toHaveURL(/#icons$/);
  await search.fill("lucide");
  await nav.getByRole("link", { name: "Icons", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(nav.locator("a.pk-admin-nav-link")).toHaveCount(entries.length);
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
  await drawer.getByRole("button", { name: "Data & records", exact: true }).click();
  await drawer.getByRole("link", { name: "Data table", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Data table", exact: true })).toBeVisible();
  await trigger.click();
  await expect(drawer.getByRole("link", { name: "Data table", exact: true })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 360, height: 600 });
  await trigger.click();
  const navigation = drawer.getByRole("navigation", { name: "Components", exact: true });
  const brand = drawer.locator(".pk-admin-drawer-brand");
  const footer = drawer.locator(".pk-admin-sidebar-footer");
  const brandBefore = await brand.boundingBox();
  const footerBefore = await footer.boundingBox();
  await navigation.getByRole("button", { name: "Website blocks", exact: true }).click();
  const lastEntry = navigation.getByRole("link", { name: "Article and documentation", exact: true });
  await lastEntry.scrollIntoViewIfNeeded();
  await expect(lastEntry).toBeInViewport();
  expect(await navigation.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  expect((await brand.boundingBox())?.y).toBe(brandBefore?.y);
  expect((await footer.boundingBox())?.y).toBe(footerBefore?.y);
  await expect(brand).toBeInViewport();
  await expect(footer).toBeInViewport();
  await lastEntry.click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Article and documentation", exact: true })).toBeVisible();
  await trigger.click();
  await drawer.getByRole("link", { name: "Evenkit home", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("main#home-main")).toBeVisible();
  await page.getByRole("link", { name: "Browse components", exact: true }).click();
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

for (const kind of ["main-content select", "navbar account menu"] as const) {
  test(`${kind} preserves sticky chrome and independent scroll positions`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const isSelect = kind === "main-content select";
    await page.goto(isSelect ? "/#audit-viewer" : "/#navbar");
    if (isSelect) await expect(page.getByText("6 matching events", { exact: true })).toBeVisible();
    const trigger = isSelect
      ? page.getByRole("combobox", { name: "Actor", exact: true })
      : page.locator(".navbar-application-example").getByRole("button", { name: "Workspace account", exact: true });
    await expect(trigger).toBeVisible();
    await trigger.evaluate(element => window.scrollBy(0, element.getBoundingClientRect().top - 250));
    await expect(trigger).toBeInViewport();
    const frame = page.locator(".catalog-app > .pk-admin-frame");
    const navigation = frame.locator(":scope > .pk-admin-sidebar .pk-admin-navigation");
    await navigation.evaluate(element => { element.scrollTop = 180; });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const geometry = () => frame.evaluate(element => ({
      page: window.scrollY,
      sidebar: element.querySelector(":scope > .pk-admin-sidebar")!.getBoundingClientRect().top,
      header: element.querySelector(":scope > .pk-admin-workspace > .pk-admin-header")!.getBoundingClientRect().top,
      navigation: element.querySelector(".pk-admin-navigation")!.scrollTop,
    }));
    const before = await geometry();
    expect(before.page).toBeGreaterThan(0);
    expect(before.navigation).toBeGreaterThan(0);
    expect(before.sidebar).toBe(0);
    expect(before.header).toBe(0);

    const popup = page.getByRole(isSelect ? "listbox" : "menu");
    await trigger.click();
    await expect(popup).toBeVisible();
    await expect.poll(geometry).toEqual(before);
    await page.mouse.move(1300, 800);
    await page.mouse.wheel(0, 400);
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(await geometry()).toEqual(before);
    await page.getByRole(isSelect ? "option" : "menuitem", { name: isSelect ? "Mira Chen" : "Workspace profile", exact: true }).click();
    await expect(popup).not.toBeVisible();
    await expect(trigger).toBeFocused();
    if (isSelect) await expect(trigger).toContainText("Mira Chen");
    else await expect(page.getByRole("heading", { name: "Your workspace account", exact: true })).toBeVisible();
    await expect.poll(geometry).toEqual(before);

    await trigger.press("ArrowDown");
    await expect(popup).toBeVisible();
    await expect.poll(geometry).toEqual(before);
    await page.keyboard.press("Escape");
    await expect(popup).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect.poll(geometry).toEqual(before);
  });
}
