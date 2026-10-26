import { expect, test } from "@playwright/test";
import { themeNames } from "@evenkit/tokens";

for (const section of ["dashboard", "records", "team", "notifications", "documents", "settings"]) {
  test(`${section} fits mobile and desktop with themed keyboard focus`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${section}`);
    const heading = page.locator("#admin-view-heading");
    await expect(heading).toBeVisible();
    const ready = { dashboard: "Workspace report", records: "Projects", team: "Members and invitations", notifications: "Notification inbox", documents: "Documents", settings: "Profile" }[section];
    await expect(page.locator(".starter-view")).toContainText(ready ?? section);
    await expect(page.locator(".starter-load")).toHaveCount(0);
    if (section === "team") await expect(page.getByText("Morgan Lee", { exact: true })).toBeVisible();
    if (section === "documents") await expect(page.getByRole("button", { name: "Preview Community brief.txt", exact: true })).toBeVisible();
    if (section === "records") await expect(page.getByRole("button", { name: "View Community field guide", exact: true })).toBeVisible();
    await expect(page.locator('.pk-data-table-scroll[aria-busy="true"]')).toHaveCount(0);
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const failures = await page.evaluate(({ palettes }) => {
        const failures: string[] = [];
        const root = document.documentElement;
        for (const theme of palettes) for (const mode of ["light", "dark"]) {
          root.dataset.kitTheme = theme; root.dataset.kitMode = mode;
          if (root.scrollWidth > innerWidth + 1) failures.push(`${theme}/${mode}/${innerWidth}: page overflows by ${root.scrollWidth - innerWidth}`);
          const target = document.querySelector<HTMLElement>("#admin-view-heading");
          target?.focus();
          if (document.activeElement !== target) failures.push(`${theme}/${mode}: page heading cannot receive navigation focus`);
          if (!getComputedStyle(root).getPropertyValue("--pk-color-ring").trim()) failures.push(`${theme}/${mode}: missing focus token`);
        }
        return failures;
      }, { palettes: [...themeNames] });
      expect(failures).toEqual([]);
    }
    await page.setViewportSize({ width: 360, height: 900 });
    const open = page.getByRole("button", { name: "Open navigation", exact: true });
    await open.focus();
    await page.keyboard.press("Enter");
    const drawer = page.getByRole("dialog", { name: "Admin navigation", exact: true });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
    await expect(open).toBeFocused();
    if (testInfo.project.name === "chromium") await page.screenshot({ path: `.artifacts/admin-integration/${section}-mobile.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
