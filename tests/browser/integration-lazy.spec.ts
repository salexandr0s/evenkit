import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("workstream previews and Markdown renderer load only when visited", async ({ page }) => {
  const manifest = JSON.parse(await readFile("apps/catalog/dist/.vite/manifest.json", "utf8")) as Record<string, { file: string; name?: string }>;
  const fileFor = (source: string) => {
    const match = Object.entries(manifest).find(([key]) => key.endsWith(source));
    if (!match) throw new Error(`Missing built lazy entry ${source}`);
    return `/${match[1].file}`;
  };
  const files = { rich: fileFor("rich-chat-preview.tsx"), markdown: "/" + Object.values(manifest).find(chunk => chunk.name === "chat")!.file, reporting: fileFor("reporting-preview.tsx"), documents: fileFor("document-library-preview.tsx"), team: fileFor("team-admin-preview.tsx"), notifications: fileFor("notification-center-preview.tsx"), website: fileFor("website-preview.tsx"), auth: fileFor("auth-preview.tsx") };
  const requests = new Set<string>();
  page.on("request", request => requests.add(new URL(request.url()).pathname));
  await page.goto("/#buttons");
  await expect(page.getByRole("heading", { name: "Buttons", exact: true })).toBeVisible();
  for (const file of Object.values(files)) expect(requests.has(file), `${file} loaded before its view`).toBe(false);
  await page.goto("/#rich-chat");
  await expect(page.locator(".pk-chat-markdown").first()).toBeVisible();
  expect(requests.has(files.rich)).toBe(true);
  expect(requests.has(files.markdown)).toBe(true);
  for (const key of ["reporting", "documents", "team", "notifications", "website", "auth"] as const) expect(requests.has(files[key]), `${key} loaded by rich chat`).toBe(false);
  await page.goto("/#dashboard");
  await expect(page.locator(".pk-dashboard")).toBeVisible();
  expect(requests.has(files.reporting)).toBe(true);
  await page.goto("/#document-library");
  await expect(page.locator(".pk-document-library")).toBeVisible();
  expect(requests.has(files.documents)).toBe(true);
});
