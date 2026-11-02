import { expect, test, type Locator, type Page } from "@playwright/test";

async function openChat(page: Page) {
  await page.getByRole("tab", { name: "Floating", exact: true }).click();
  await page.getByRole("button", { name: "Open assistant", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Project assistant", exact: true });
  await expect(chat).toBeVisible();
  return chat;
}

async function responsePreview(page: Page, name: string) {
  await page.getByRole("combobox", { name: "Response preview", exact: true }).click();
  await page.getByRole("option", { name, exact: true }).click();
}

async function expectWithinViewport(locator: Locator, page: Page) {
  // visualViewport resize events settle after Playwright updates its viewport dimensions.
  await expect(async () => {
    const box = await locator.boundingBox();
    const viewport = page.viewportSize();
    if (!box || !viewport) throw new Error("Missing chat or viewport bounds.");
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.y).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  }).toPass({ timeout: 5000 });
}

test("chat preserves drafts across opening, maximizing, and conversation changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#chat");
  const embedded = page.locator(".chat-preview-panel");
  await expect(embedded).toBeVisible();
  await expect(page.getByRole("button", { name: "Open assistant", exact: true })).toHaveCount(0);
  await embedded.getByRole("textbox", { name: "Message", exact: true }).fill("Keep this project draft");
  const launcher = page.getByRole("button", { name: "Open assistant", exact: true });
  const chat = await openChat(page);
  const input = chat.getByRole("textbox", { name: "Message", exact: true });
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("Keep this project draft");
  await expect(embedded).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Conversation", exact: true })).toHaveCount(1);
  await chat.getByRole("button", { name: "Close chat", exact: true }).click();
  await expect(launcher).toBeFocused();
  await page.getByRole("tab", { name: "Embedded", exact: true }).click();
  await expect(embedded.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("Keep this project draft");
  await expect(launcher).toHaveCount(0);
  await openChat(page);
  await expect(input).toHaveValue("Keep this project draft");

  await chat.getByRole("button", { name: "Maximize chat", exact: true }).click();
  await expect(chat.locator(".pk-chat-panel")).toHaveAttribute("data-mode", "expanded");
  const history = chat.locator(".pk-chat-history");
  await expect(history).toBeVisible();
  await history.getByRole("button", { name: "Theme setup", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(chat.locator('.pk-chat-message[data-role="user"]')).toHaveCount(1);
  await input.fill("A separate theme draft");
  await history.getByRole("button", { name: "Plan a project", exact: true }).click();
  await expect(input).toHaveValue("Keep this project draft");
  await history.getByRole("button", { name: "Theme setup", exact: true }).click();
  await expect(input).toHaveValue("A separate theme draft");

  const search = history.getByRole("searchbox", { name: "Search chats", exact: true });
  await search.fill("launch");
  await expect(history.getByRole("button", { name: "Theme setup", exact: true })).toHaveCount(0);
  await expect(history.getByRole("button", { name: "Launch checklist", exact: true })).toBeVisible();
  await history.getByRole("button", { name: "New chat", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(input).toHaveValue("");
  await expect(chat.locator(".pk-chat-message")).toHaveCount(0);
  await expect(history.getByRole("button", { name: "New conversation", exact: true })).toHaveAttribute("aria-current", "true");
  await history.getByRole("button", { name: "Delete chat: New conversation", exact: true }).click();
  await expect(history.getByRole("button", { name: "New conversation", exact: true })).toHaveCount(0);
  await expect(search).toBeFocused();
  await expect(input).toHaveValue("Keep this project draft");
});

test("composer respects IME and multiline input, retries once, and keeps the next draft when stopped", async ({ page }) => {
  await page.goto("/#chat");
  await responsePreview(page, "Fail once");
  const chat = await openChat(page);
  const input = chat.getByRole("textbox", { name: "Message", exact: true });
  const users = chat.locator('.pk-chat-message[data-role="user"]');
  const answers = chat.locator('.pk-chat-message[data-role="assistant"]');
  await input.fill("First line");
  await input.press("Shift+Enter");
  await input.pressSequentially("Second line");
  await input.dispatchEvent("compositionstart");
  await input.dispatchEvent("keydown", { key: "Enter", code: "Enter", isComposing: true });
  await expect(users).toHaveCount(0);
  await expect(input).toHaveValue("First line\nSecond line");
  await input.dispatchEvent("compositionend");
  await input.press("Enter");
  await expect(users).toHaveCount(1);
  await expect(users.first()).toContainText("First line\nSecond line");
  const retry = chat.getByRole("button", { name: "Retry response", exact: true });
  await expect(retry).toBeVisible();
  await retry.click();
  await expect(answers).toHaveCount(1);
  await input.fill("Keep this next question");
  await input.press("Enter");
  await expect(users).toHaveCount(1);
  await chat.getByRole("button", { name: "Stop response", exact: true }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("Keep this next question");
  await chat.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(users).toHaveCount(2);
  await expect(answers.last()).toContainText("This is a sample response.");
  await expect(chat.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  await expect(answers).toHaveCount(2);
  await expect(input).toHaveValue("");
});

test("narrow and short RTL chat keeps controls reachable and Escape restores focus in order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#chat");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const chat = await openChat(page);
  const input = chat.getByRole("textbox", { name: "Message", exact: true });
  await expect(chat).toHaveCSS("direction", "rtl");
  await chat.getByRole("button", { name: "Maximize chat", exact: true }).click();
  const history = chat.locator(".pk-chat-history");
  const search = chat.getByRole("searchbox", { name: "Search chats", exact: true });
  await search.focus();
  // The automatic desktop sidebar hides on resize; keyboard focus must remain in the chat.
  await page.setViewportSize({ width: 360, height: 640 });
  await expect(history).not.toBeVisible();
  await expect(chat.getByRole("button", { name: "Show chat history", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(history).toBeVisible();
  // An explicitly opened sidebar instead occupies the narrow panel, hiding the composer.
  await chat.getByRole("button", { name: "Hide chat history", exact: true }).click();
  await chat.getByRole("button", { name: "Show chat history", exact: true }).click();
  await input.focus();
  await page.setViewportSize({ width: 360, height: 640 });
  await expect(search).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(chat.getByRole("button", { name: "Show chat history", exact: true })).toBeFocused();
  await expect(chat.locator(".pk-chat-history")).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(chat.locator(".pk-chat-panel")).toHaveAttribute("data-mode", "compact");
  await expectWithinViewport(chat, page);
  await expectWithinViewport(input, page);

  await page.setViewportSize({ width: 768, height: 320 });
  await expectWithinViewport(chat, page);
  await input.focus();
  await expectWithinViewport(input, page);
  const close = chat.getByRole("button", { name: "Close chat", exact: true });
  await close.focus();
  await expectWithinViewport(close, page);
  expect(await chat.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  const closeTip = page.getByRole("tooltip", { name: "Close chat", exact: true }).and(page.locator(".pk-tooltip-content"));
  await expect(closeTip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(closeTip).toHaveCount(0);
  await expect(chat).toBeVisible();
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(chat).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open assistant", exact: true })).toBeFocused();
});

test("streaming respects reading position and finished responses can be copied after clipboard failure", async ({ page }) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async (text: string) => {
        attempts += 1;
        if (attempts === 1) throw new Error("Clipboard unavailable");
        document.documentElement.dataset.copiedChatText = text;
      },
    } });
  });
  await page.goto("/#chat");
  await responsePreview(page, "Long reply");
  const chat = await openChat(page);
  const input = chat.getByRole("textbox", { name: "Message", exact: true });
  const log = chat.getByRole("region", { name: "Conversation", exact: true });
  await input.fill("Give me a detailed launch review");
  await input.press("Enter");
  await expect.poll(() => log.evaluate(element => element.scrollHeight - element.clientHeight), { timeout: 10_000 }).toBeGreaterThan(200);
  await log.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll")); });
  const jump = chat.getByRole("button", { name: "Jump to latest", exact: true });
  await expect(jump).toBeVisible();
  await expect(chat.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0, { timeout: 10_000 });
  expect(await log.evaluate(element => element.scrollTop)).toBeLessThanOrEqual(1);
  await jump.focus();
  const jumpTip = page.getByRole("tooltip", { name: "Jump to latest", exact: true }).and(page.locator(".pk-tooltip-content"));
  await expect(jumpTip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(jumpTip).toHaveCount(0);
  await expect(chat).toBeVisible();
  await expect(jump).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(log).toBeFocused();
  await expect.poll(() => log.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThanOrEqual(1);
  const copy = chat.getByRole("button", { name: "Copy response", exact: true });
  await copy.click();
  await expect(chat.getByRole("status").filter({ hasText: "Could not copy" })).toBeVisible();
  await copy.click();
  await expect(chat.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
  const content = await chat.locator(".pk-chat-message-content").last().textContent();
  await expect(page.locator("html")).toHaveAttribute("data-copied-chat-text", content!);
});

test("chat copy feedback follows the latest clipboard attempt when writes finish out of order", async ({ page }) => {
  await page.addInitScript(() => {
    let attempt = 0;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: () => new Promise<void>((resolve, reject) => {
        const current = ++attempt;
        document.documentElement.dataset.copyAttempt = String(current);
        window.addEventListener(`settle-copy-${current}`, event => {
          if ((event as CustomEvent<boolean>).detail) resolve();
          else reject(new Error("Clipboard unavailable"));
        }, { once: true });
      }),
    } });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#chat");
  const chat = page.locator(".chat-preview-panel");
  await chat.getByRole("button", { name: "Theme setup", exact: true }).click();
  const message = chat.locator('.pk-chat-message[data-role="assistant"]');
  const copy = message.locator(".pk-chat-message-actions button");
  async function settle(attempt: number, success: boolean) {
    await page.evaluate(async ({ attempt, success }) => {
      window.dispatchEvent(new CustomEvent(`settle-copy-${attempt}`, { detail: success }));
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }, { attempt, success });
  }

  await copy.focus();
  await copy.press("Enter");
  await copy.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-copy-attempt", "2");
  await settle(2, true);
  await expect(copy).toHaveAccessibleName("Copied");
  await settle(1, false);
  await expect(copy).toHaveAccessibleName("Copied");
  await expect(message.getByRole("status")).toHaveText("Copied");

  await copy.press("Enter");
  await copy.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-copy-attempt", "4");
  await settle(4, false);
  await expect(message.getByRole("status")).toContainText("Could not copy");
  await settle(3, true);
  await expect(message.getByRole("status")).toContainText("Could not copy");
  await expect(copy).toHaveAccessibleName("Copy response");
  await expect(copy).toBeFocused();
});
