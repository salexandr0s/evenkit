import { expect, test, type Locator, type Page } from "@playwright/test";
import { themeNames, themes } from "@evenkit/tokens";

const entryIds = ["website-shell", "website-heroes", "website-features", "website-cta", "website-faq", "website-forms", "website-article"];

function rgb(hex: string) {
  return `rgb(${[1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(", ")})`;
}

async function expectContained(page: Page, stage: Locator) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const clipped = await stage.locator("h1, h2, h3, h4, p, label, button, a, figcaption").evaluateAll(elements => elements.flatMap(element => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    // Navbar deliberately clips this helper until focus; the shell test checks its focused state.
    if (!box.width || !box.height || !element.clientWidth || style.position === "fixed" || element.matches(".pk-navbar-skip:not(:focus)")) return [];
    const clipsHorizontally = element.scrollWidth > element.clientWidth + 1;
    const clipsVertically = ["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
    return clipsHorizontally || clipsVertically ? [element.textContent?.slice(0, 100) ?? element.tagName] : [];
  }));
  expect(clipped, "Website text and controls must wrap without clipping").toEqual([]);
}

test("website shell connects its skip link and mobile navigation to host content", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/#website-shell");
  const stage = page.locator(".website-preview-stage");
  const skip = stage.getByRole("link", { name: "Skip to content", exact: true });
  await skip.focus();
  await expect(skip).toBeInViewport();
  const targetId = (await skip.getAttribute("href"))?.slice(1);
  expect(targetId).toBeTruthy();
  await skip.press("Enter");
  await expect(stage.locator(`[id="${targetId}"]`)).toBeFocused();
  const menu = stage.getByRole("button", { name: "Open navigation", exact: true });
  await menu.focus();
  await menu.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Fictional studio navigation", exact: true });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.press("Enter");
  await drawer.getByRole("link", { name: "Field notes", exact: true }).press("Enter");
  await expect(drawer).toBeHidden();
  await expect(stage.locator(`[id="${targetId}"]`)).toBeFocused();
  await expect(stage.getByRole("navigation", { name: "Explore the example", exact: true })).toBeVisible();
});

test("FAQ questions retain section headings and keyboard disclosure", async ({ page }) => {
  await page.goto("/#website-faq");
  const stage = page.locator(".website-preview-stage");
  await expect(stage.getByRole("heading", { name: "Questions about this example", level: 3 })).toBeVisible();
  const first = stage.getByRole("button", { name: "Is this a real studio?", exact: true });
  const second = stage.getByRole("button", { name: "What should I bring?", exact: true });
  await expect(stage.getByRole("heading", { name: "Is this a real studio?", level: 4 })).toBeVisible();
  await first.focus();
  await first.press("ArrowDown");
  await expect(second).toBeFocused();
  await second.press("Enter");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(stage.getByText(/For this imagined session/)).toBeVisible();
  await second.press("Space");
  await expect(second).toHaveAttribute("aria-expanded", "false");
  await expect(second).toBeFocused();
});

test("contact validation, pending and failure recovery retain the editable draft", async ({ page }) => {
  await page.goto("/#website-forms");
  const form = page.getByRole("form", { name: "Contact the fictional studio", exact: true });
  const submit = form.getByRole("button", { name: "Send inquiry", exact: true });
  await submit.click();
  const summary = form.locator(".pk-form-summary");
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link")).toHaveCount(4);
  await summary.getByRole("link", { name: "Enter your name.", exact: true }).press("Enter");
  const name = form.getByRole("textbox", { name: "Name", exact: true });
  await expect(name).toBeFocused();
  await name.pressSequentially("Ada Example");
  await expect(name).toBeFocused();
  const email = form.getByRole("textbox", { name: "Email", exact: true });
  await email.fill("not-an-email");
  await form.getByRole("textbox", { name: "Organization", exact: true }).fill("Fictional drawing group");
  await form.getByRole("textbox", { name: "Message", exact: true }).fill("A sample inquiry about the imagined specimen sheet.");
  await form.getByRole("checkbox", { name: "I have read the fictional inquiry note.", exact: true }).check();
  await submit.click();
  await expect(summary.getByRole("link")).toHaveCount(1);
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await summary.getByRole("link", { name: "Enter a valid email address.", exact: true }).press("Enter");
  await expect(email).toBeFocused();
  await email.fill("ada@example.test");
  await page.getByRole("checkbox", { name: "Fail the next submission", exact: true }).check();
  await submit.click();
  await expect(submit).toBeDisabled();
  await expect(submit).toBeFocused();
  await expect(name).toBeDisabled();
  await expect(form.getByRole("status")).toHaveText("Sending inquiry…");
  const failure = form.locator('.pk-action-message[data-tone="error"]');
  await expect(failure).toBeFocused();
  await expect(failure).toContainText("Your answers are still here.");
  await expect(form).not.toContainText("Simulated failure");
  await expect(name).toHaveValue("Ada Example");
  await expect(email).toHaveValue("ada@example.test");
  await expect(form.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("A sample inquiry about the imagined specimen sheet.");
  await form.getByRole("button", { name: "Try again", exact: true }).click();
  const sent = form.locator('.pk-action-message[data-tone="success"]');
  await expect(sent).toBeFocused();
  await expect(sent).toContainText("Inquiry sent");
  await expect(submit).toHaveCount(0);
  await form.getByRole("button", { name: "Write another inquiry", exact: true }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveValue("");
  await expect(email).toHaveValue("");
  await expect(form.getByRole("checkbox")).not.toBeChecked();
});

test("newsletter consent, retry and reset remain independent of the contact form", async ({ page }) => {
  await page.goto("/#website-forms");
  const form = page.getByRole("form", { name: "Fictional field notes", exact: true });
  const contact = page.getByRole("form", { name: "Contact the fictional studio", exact: true });
  await contact.getByRole("textbox", { name: "Name", exact: true }).fill("Preserved draft");
  const ids = await page.locator(".website-preview-stage [id]").evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size, "Each form must own its field and feedback IDs").toBe(ids.length);
  const email = form.getByRole("textbox", { name: "Email", exact: true });
  await email.fill("reader@example.test");
  await form.getByRole("button", { name: "Subscribe", exact: true }).click();
  const summary = form.locator(".pk-form-summary");
  await expect(summary).toBeFocused();
  await summary.getByRole("link", { name: "Choose whether to receive the fictional newsletter.", exact: true }).click();
  const consent = form.getByRole("checkbox", { name: "I would like to receive the fictional newsletter.", exact: true });
  await expect(consent).toBeFocused();
  await consent.press("Space");
  await page.getByRole("checkbox", { name: "Fail the next submission", exact: true }).check();
  await form.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(email).toBeDisabled();
  await expect(form.getByRole("alert")).toContainText("Subscription could not be submitted");
  await expect(email).toHaveValue("reader@example.test");
  await form.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(form.locator('.pk-action-message[data-tone="success"]')).toBeFocused();
  await form.getByRole("button", { name: "Use another email", exact: true }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveValue("");
  await expect(consent).not.toBeChecked();
  await expect(contact.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("Preserved draft");

  await email.fill("another@example.test");
  await consent.check();
  await page.clock.install();
  await form.getByRole("button", { name: "Subscribe", exact: true }).click();
  await page.getByRole("navigation", { name: "Components", exact: true }).getByRole("link", { name: "Website FAQ", exact: true }).click();
  await page.clock.fastForward(1000);
  await page.goto("/#website-forms");
  await expect(form.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("");
  await expect(form.locator('.pk-action-message[data-tone="success"]')).toHaveCount(0);
});

test("article contents move keyboard focus and code scrolls within the reading column", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/#website-article");
  const stage = page.locator(".website-preview-stage");
  await expect(stage.getByRole("heading", { name: "Keeping a field notebook", level: 3 })).toBeVisible();
  await expect(stage.locator("time")).toHaveAttribute("datetime", "2026-10-25");
  const contents = stage.getByRole("navigation", { name: "On this page", exact: true });
  await contents.getByRole("link", { name: "Describe the specimen", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(stage.getByRole("heading", { name: "Describe the specimen", level: 4 })).toBeFocused();
  const code = stage.getByRole("region", { name: "Notebook example (JSON)", exact: true });
  await code.focus();
  await expect(code).toBeFocused();
  await expect(code).toHaveCSS("direction", "ltr");
  const gaps = await code.evaluate(element => {
    const frame = element.closest(".pk-website-code-frame");
    if (!frame) throw new Error("The labeled code region needs its frame.");
    const box = frame.getBoundingClientRect();
    const previous = frame.previousElementSibling?.getBoundingClientRect();
    const next = frame.nextElementSibling?.getBoundingClientRect();
    return { before: previous ? box.top - previous.bottom : 0, after: next ? next.top - box.bottom : 0 };
  });
  expect(gaps.before, "The paragraph before code needs reading space").toBeGreaterThan(0);
  expect(gaps.after, "The paragraph after code needs reading space").toBeGreaterThan(0);
  expect(await code.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await code.press("ArrowRight");
  await expect.poll(() => code.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await expectContained(page, stage);
  await page.getByRole("checkbox", { name: "Preview RTL", exact: true }).check();
  await expect(code).toHaveCSS("direction", "ltr");
  await expectContained(page, stage);
});

for (const theme of themeNames) {
  for (const mode of ["light", "dark"] as const) {
    test(`website blocks preserve long content, RTL and mobile layout in ${theme} ${mode}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.addInitScript(({ theme, mode }) => {
        localStorage.setItem("evenkit.catalog.theme", theme);
        localStorage.setItem("evenkit.catalog.appearance", mode);
      }, { theme, mode });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const runtimeErrors: string[] = [];
      page.on("pageerror", error => runtimeErrors.push(error.message));
      for (const id of entryIds) {
        await page.goto(`/#${id}`);
        const stage = page.locator(".website-preview-stage");
        await expect(stage).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("data-kit-theme", theme);
        await expect(page.locator("html")).toHaveAttribute("data-kit-mode", mode);
        await expect(stage).toHaveCSS("background-color", rgb(themes.neutral.modes[mode].bg));
        await page.getByRole("checkbox", { name: "Long localized content", exact: true }).check();
        const headingLevels = await stage.getByRole("heading").evaluateAll(elements => elements.map(element => Number(element.tagName.slice(1))));
        expect(headingLevels.length).toBeGreaterThan(0);
        expect(headingLevels[0]).toBe(3);
        for (let index = 1; index < headingLevels.length; index++) expect(headingLevels[index]! - headingLevels[index - 1]!).toBeLessThanOrEqual(1);
        for (const [width, rtl] of [[1440, false], [360, true]] as const) {
          await page.setViewportSize({ width, height: 900 });
          await page.getByRole("checkbox", { name: "Preview RTL", exact: true }).setChecked(rtl);
          await expect(stage).toHaveCSS("direction", rtl ? "rtl" : "ltr");
          await expectContained(page, stage);
          const primary = stage.locator('.pk-button[data-variant="primary"]').first();
          if (await primary.count()) await expect(primary).toHaveCSS("background-color", rgb(themes[theme].modes[mode].accent));
        }
      }
      expect(runtimeErrors).toEqual([]);
    });
  }
}

test("website blocks fit intermediate widths and retain visible keyboard focus", async ({ page }) => {
  for (const id of entryIds) {
    await page.goto(`/#${id}`);
    const stage = page.locator(".website-preview-stage");
    await page.getByRole("checkbox", { name: "Long localized content", exact: true }).check();
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await expectContained(page, stage);
    }
    const control = stage.locator('a[href]:visible, button:visible, input:visible, pre[tabindex="0"]:visible').first();
    if (await control.count()) {
      await page.keyboard.press("Tab");
      await control.focus();
      await expect(control).toBeFocused();
      const focus = await control.evaluate(element => {
        const style = getComputedStyle(element);
        return { outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0, shadow: style.boxShadow !== "none" };
      });
      expect(focus.outline || focus.shadow, `${id} keyboard focus indicator`).toBe(true);
    }
  }
});
