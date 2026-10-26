import { expect, test } from "@playwright/test";
import { themeNames } from "@evenkit/tokens";

test("rich content keeps plain text, safe links and keyboard copy feedback", async ({ page }) => {
  await page.goto("/#rich-chat");
  const panel = page.locator(".pk-chat-panel");
  await expect(panel.locator('[data-role="user"]')).toContainText("**these asterisks stay visible**");
  await expect(panel.getByRole("heading", { name: "Release notes", exact: true })).toHaveCount(1);
  await expect(panel.locator(".pk-chat-markdown")).toContainText("<strong>this is not an HTML element</strong>");
  await expect(panel.locator(".pk-chat-markdown strong")).toHaveText("decisions");
  await expect(panel.getByRole("link", { name: "CommonMark reference", exact: true })).toHaveAttribute("href", "https://commonmark.org/help/");
  await expect(panel.getByRole("link", { name: "Blocked source address" })).toHaveCount(0);
  await expect(panel.getByText("Source unavailable", { exact: true })).toHaveCount(2);
  const standalone = page.getByRole("region", { name: "Reusable code block" });
  const copy = standalone.getByRole("button", { name: "Copy code", exact: true });
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard denied"); } } }));
  await copy.focus();
  await page.keyboard.press("Enter");
  await expect(standalone.getByRole("status")).toContainText("Could not copy");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } }));
  await page.keyboard.press("Enter");
  await expect(standalone.getByRole("status")).toContainText("Copied to clipboard.");
  await expect(page.locator("html")).toHaveAttribute("data-copied", 'const title = "Release notes";\nconsole.log(title);');
  const link = panel.getByRole("link", { name: "Markdown reference", exact: true });
  await page.route("https://commonmark.org/help/", route => route.fulfill({ contentType: "text/html", body: "<h1>Reference opened</h1>" }));
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://commonmark.org/help/");
});

test("citations retain RTL, keyboard preview scrolling and modal Escape order", async ({ page }) => {
  await page.goto("/#rich-chat");
  await page.getByRole("button", { name: "Right-to-left layout", exact: true }).click();
  await page.getByRole("button", { name: "Open rich chat", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Rich chat widget", exact: true });
  const trigger = chat.getByRole("button", { name: "Preview: CommonMark reference", exact: true });
  await trigger.focus();
  await expect(page.getByRole("tooltip", { name: "Preview: CommonMark reference", exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  const preview = page.getByRole("dialog", { name: "CommonMark reference", exact: true });
  await expect(preview).toHaveCSS("direction", "rtl");
  const excerpt = preview.locator(".pk-chat-source-excerpt");
  await expect(excerpt).toBeFocused();
  // Constrain the real excerpt to exercise its keyboard overflow without a large demo fixture.
  await excerpt.evaluate(element => { element.style.maxHeight = "20px"; element.style.width = "100px"; });
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => excerpt.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(preview).toHaveCount(0);
  await expect(chat).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  const close = page.getByRole("dialog", { name: "CommonMark reference", exact: true }).getByRole("button", { name: "Close preview", exact: true });
  await close.focus();
  await expect(page.getByRole("tooltip", { name: "Close preview", exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(preview).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(chat).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open rich chat", exact: true })).toBeFocused();
});

test("attachments recover per file, keep focus and send without text", async ({ page }) => {
  await page.goto("/#rich-chat");
  const panel = page.locator(".pk-chat-panel");
  const queue = panel.locator(".pk-upload-queue");
  const send = panel.getByRole("button", { name: "Send message", exact: true });
  await page.getByRole("button", { name: "Fail next upload", exact: true }).click();
  await page.getByRole("button", { name: "Add sample files", exact: true }).click();
  await expect(queue.getByRole("progressbar").first()).toBeVisible();
  await expect(send).toBeDisabled();
  const retry = queue.getByRole("button", { name: "Retry Review notes.txt", exact: true });
  await expect(retry).toBeVisible();
  await expect(queue.locator('[data-state="complete"]')).toHaveCount(1);
  await expect(send).toBeDisabled();
  await retry.focus();
  await page.keyboard.press("Enter");
  await expect(queue.locator('[data-state="complete"]')).toHaveCount(2);
  await expect(send).toBeEnabled();
  await send.focus();
  await page.keyboard.press("Enter");
  await expect(panel.getByRole("textbox", { name: "Message", exact: true })).toBeFocused();
  await expect(queue.locator(".pk-file-row")).toHaveCount(0);
  const sent = panel.locator('[data-role="user"]').last();
  await expect(sent.getByRole("list", { name: "Attachments", exact: true }).getByRole("listitem")).toHaveCount(2);
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const available = await panel.locator(".pk-chat-message-stack").evaluate(element => element.clientWidth);
    expect(await sent.evaluate(element => element.clientWidth)).toBeGreaterThan(available * 0.75);
    expect(await sent.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  }
  await expect(sent.getByRole("link", { name: "Download Review notes.txt", exact: true })).toHaveAttribute("href", /^blob:/);
  await expect(sent.locator("img")).toBeVisible();
  await expect.poll(() => sent.locator("img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Add sample files", exact: true }).click();
  await queue.getByRole("button", { name: "Cancel Review notes.txt", exact: true }).click();
  await expect(queue.locator('[data-state="cancelled"]')).toHaveCount(1);
  await queue.getByRole("button", { name: "Remove Review notes.txt", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(queue.locator('input[type="file"]')).toBeFocused();
  await expect(queue.locator(".pk-file-row")).toHaveCount(1);
  await queue.locator('input[type="file"]').setInputFiles({ name: "not-allowed.exe", mimeType: "application/octet-stream", buffer: Buffer.from("invalid") });
  await expect(queue.getByRole("alert")).toContainText("not-allowed.exe");
  await expect(queue.locator(".pk-file-row")).toHaveCount(1);
  await queue.locator('input[type="file"]').setInputFiles({ name: "broken.png", mimeType: "image/png", buffer: Buffer.from("invalid image bytes") });
  await expect(queue.locator('[data-state="complete"]')).toHaveCount(2);
  await send.click();
  await expect(panel.locator('[data-role="user"]').last()).toContainText("Preview unavailable");
  await expect(panel.locator('[data-role="user"]').last().locator(".pk-chat-message-content")).toHaveCount(0);
});

test("streaming partial fences preserve controls, reader scroll and stop focus", async ({ page }) => {
  await page.goto("/#rich-chat");
  const panel = page.locator(".pk-chat-panel");
  const transcript = panel.getByRole("region", { name: "Conversation", exact: true });
  await page.getByRole("button", { name: "Stream rich reply", exact: true }).click();
  const streaming = panel.locator('[data-streaming="true"]');
  await expect(streaming.locator(".pk-code-block").first()).toBeVisible();
  const copy = streaming.getByRole("button", { name: "Copy code", exact: true }).first();
  await copy.focus();
  await expect.poll(() => streaming.textContent()).toContain("ready: false");
  await expect(copy).toBeFocused();
  await transcript.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll")); });
  await expect(panel.getByRole("button", { name: "Jump to latest", exact: true })).toBeVisible();
  await expect.poll(() => streaming.textContent()).toContain("Release notes");
  expect(await transcript.evaluate(element => element.scrollTop)).toBe(0);
  const draft = panel.getByRole("textbox", { name: "Message", exact: true });
  await draft.fill("Next question");
  await panel.getByRole("button", { name: "Stop response", exact: true }).click();
  await expect(draft).toBeFocused();
  await expect(draft).toHaveValue("Next question");
  await expect(streaming).toHaveCount(0);
  await panel.getByRole("button", { name: "Jump to latest", exact: true }).click();
  await expect(transcript).toBeFocused();
});

test("rich layouts contain long code and tables in every theme, mode and direction", async ({ page }) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#rich-chat");
  const panel = page.locator(".pk-chat-panel");
  await expect(panel).toBeVisible();
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of themeNames) for (const mode of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) {
      await page.evaluate(({ theme, mode, dir }) => {
        document.documentElement.dataset.kitTheme = theme;
        document.documentElement.dataset.kitMode = mode;
        document.querySelector(".pk-chat-panel")?.setAttribute("dir", dir);
      }, { theme, mode, dir });
      expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${theme}/${mode}/${dir}/${width}`).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  // With no explicit mode, each theme follows the browser's color-scheme preference.
  for (const theme of themeNames) for (const colorScheme of ["light", "dark"] as const) {
    await page.evaluate(({ theme, colorScheme }) => {
      document.documentElement.dataset.kitTheme = theme;
      document.documentElement.dataset.kitMode = colorScheme;
    }, { theme, colorScheme });
    const expected = await panel.evaluate(element => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.evaluate(() => { delete document.documentElement.dataset.kitMode; });
    await expect(panel).toHaveCSS("color", expected.color);
    await expect(panel).toHaveCSS("background-color", expected.background);
  }
  await page.setViewportSize({ width: 360, height: 640 });
  const code = panel.getByRole("region", { name: "Code block", exact: true });
  await code.focus();
  await expect(code).toHaveCSS("direction", "ltr");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => code.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  const table = panel.getByRole("region", { name: "Message table", exact: true });
  await table.focus();
  await expect(table).toBeFocused();
  expect(await table.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.screenshot({ path: ".artifacts/rich-chat/narrow-rtl-dark.png", fullPage: true });
  await page.getByRole("button", { name: "Fail next upload", exact: true }).click();
  await page.getByRole("button", { name: "Add sample files", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Retry Review notes.txt", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open rich chat", exact: true }).click();
  const widget = page.getByRole("dialog", { name: "Rich chat widget", exact: true });
  await page.setViewportSize({ width: 768, height: 320 });
  const input = widget.getByRole("textbox", { name: "Message", exact: true });
  await expect(input).toBeInViewport();
  await expect(widget.getByRole("button", { name: "Close chat", exact: true })).toBeInViewport();
  await expect(widget).toHaveCSS("transition-duration", "0s");
  // A failed file and a multiline draft compete for space when the keyboard is open.
  await page.setViewportSize({ width: 360, height: 320 });
  await input.fill("First line\nSecond line\nThird line\nFourth line\nFifth line\nSixth line");
  await expect(input).toBeInViewport({ ratio: 1 });
  await expect(widget.getByRole("button", { name: "Send message", exact: true })).toBeInViewport({ ratio: 1 });
  const retry = widget.getByRole("button", { name: "Retry Review notes.txt", exact: true });
  await retry.focus();
  await expect(retry).toBeInViewport({ ratio: 1 });
  await page.screenshot({ path: ".artifacts/rich-chat/short-widget.png", fullPage: true });
});
