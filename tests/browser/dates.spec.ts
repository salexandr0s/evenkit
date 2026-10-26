import { expect, test } from "@playwright/test";

test("calendar keyboard movement preserves unavailable days and changes months", async ({ page }) => {
  await page.goto("/#calendar");
  const calendar = page.getByRole("grid", { name: "Calendar, October 2026" });
  const selected = calendar.locator('[data-date="2026-10-26"]');
  await selected.hover();
  const contrast = await selected.evaluate(element => {
    const style = getComputedStyle(element);
    const luminance = (color: string) => {
      const channels = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map(value => { const channel = value / 255; return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; });
      return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
    };
    const text = luminance(style.color), background = luminance(style.backgroundColor);
    return (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await selected.focus();
  await selected.press("ArrowRight");
  const unavailable = calendar.locator('[data-date="2026-10-27"]');
  await expect(unavailable).toBeFocused();
  await expect(unavailable).toHaveAttribute("aria-disabled", "true");
  await unavailable.press("Enter");
  await expect(selected).toHaveAttribute("data-selected", "true");
  await unavailable.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(calendar.locator('[data-date="2026-10-28"]')).toHaveAttribute("data-selected", "true");
  await page.keyboard.press("PageDown");
  await expect(page.locator('[data-date="2026-11-28"]')).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.locator('[data-date="2026-11-23"]')).toBeFocused();
});

test("date picker validates drafts, restores focus and respects canceled form resets", async ({ page }) => {
  await page.goto("/#date-picker");
  const form = page.getByRole("form", { name: "Deadline form" });
  const input = page.getByRole("textbox", { name: "Deadline", exact: true });
  await input.fill("2026-02-30");
  await input.blur();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(form.locator('input[name="deadline"]')).toHaveValue("");
  await form.getByRole("button", { name: "Save deadline" }).click();
  await expect(form.getByRole("status")).toContainText("No deadline saved");
  const trigger = page.getByRole("button", { name: "Choose deadline", exact: true });
  await trigger.focus();
  await expect(page.getByRole("tooltip", { name: "Choose deadline", exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-date="2026-10-25"]')).toBeFocused();
  await page.locator('[data-date="2026-10-28"]').click();
  await expect(input).toHaveValue("2026-10-28");
  await expect(page.getByRole("button", { name: "Choose deadline, Oct 28, 2026" })).toBeFocused();
  await form.evaluate(element => element.addEventListener("reset", event => event.preventDefault(), { once: true }));
  await form.getByRole("button", { name: "Reset deadline" }).click();
  await expect(input).toHaveValue("2026-10-28");
  await form.getByRole("button", { name: "Reset deadline" }).click();
  await expect(input).toHaveValue("2026-10-26");
  await form.getByRole("button", { name: "Save deadline" }).click();
  await expect(form.getByRole("status")).toContainText("Saved deadline: 2026-10-26");
});

test("range picker completes two selections, rejects reversed typed ranges and applies presets", async ({ page }) => {
  await page.goto("/#date-range");
  const form = page.getByRole("form", { name: "Reporting period form" });
  await form.getByRole("button", { name: "Choose date range" }).click();
  await page.locator('[data-date="2026-10-26"]').click();
  await expect(page.getByRole("dialog", { name: "Choose date range" })).toBeVisible();
  await page.locator('[data-date="2026-10-29"]').click();
  await expect(form.getByRole("textbox", { name: "Start date" })).toHaveValue("2026-10-26");
  await expect(form.getByRole("textbox", { name: "End date" })).toHaveValue("2026-10-29");
  await form.getByRole("textbox", { name: "End date" }).fill("2026-10-22");
  await expect(form.getByRole("alert")).toContainText("on or after");
  await form.getByRole("button", { name: "Apply period" }).click();
  await expect(form.getByRole("status")).toContainText("Choose a reporting period");
  await form.getByRole("button", { name: "Reset period" }).click();
  await form.getByRole("button", { name: "Choose date range" }).click();
  await page.getByRole("button", { name: "October", exact: true }).click();
  await form.getByRole("button", { name: "Apply period" }).click();
  await expect(form.getByRole("status")).toContainText("2026-10-01 through 2026-10-31");
});

test("12-hour entry submits canonical local time and rejects off-step drafts", async ({ page }) => {
  await page.goto("/#time-field");
  await page.getByRole("combobox", { name: "Time format" }).click();
  await page.getByRole("option", { name: "12-hour", exact: true }).click();
  const form = page.getByRole("form", { name: "Appointment form" });
  const input = form.getByRole("textbox", { name: "Appointment time" });
  await expect(input).toHaveValue("9:30 AM");
  await input.fill("12:00 PM");
  await form.getByRole("button", { name: "Save appointment" }).click();
  await expect(form.getByRole("status")).toContainText("Saved time: 12:00");
  await input.fill("9:10 AM");
  await input.blur();
  await expect(form.getByRole("alert")).toContainText("15-minute intervals");
  await expect(form.locator('input[name="appointment"]')).toHaveValue("");
  await input.fill("9:15 AM");
  await form.getByRole("button", { name: "Save appointment" }).click();
  await expect(form.getByRole("status")).toContainText("Saved time: 09:15");
});
