import { readFile, readdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";

test("admin route views and provider SDK stay deferred until needed", async ({ page }, testInfo) => {
  const directory = "apps/admin-starter/.next/static/chunks";
  const chunks = await Promise.all((await readdir(directory)).filter(file => file.endsWith(".js")).map(async file => ({ file, source: await readFile(`${directory}/${file}`, "utf8") })));
  const notification = chunks.filter(chunk => chunk.source.includes("Notification inbox"));
  const team = chunks.filter(chunk => chunk.source.includes("Members and invitations"));
  const provider = chunks.filter(chunk => chunk.source.includes("supabase-js"));
  expect(notification.length).toBeGreaterThan(0); expect(team.length).toBeGreaterThan(0); expect(provider.length).toBeGreaterThan(0);
  const requests = new Set<string>();
  page.on("request", request => requests.add(new URL(request.url()).pathname.split("/").at(-1) ?? ""));
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Workspace report", exact: true })).toBeVisible();
  for (const chunk of [...notification, ...team, ...provider]) expect(requests.has(chunk.file), `${chunk.file} loaded by demo dashboard`).toBe(false);
  const initial = chunks.filter(chunk => requests.has(chunk.file));
  await page.getByRole("navigation", { name: "Admin navigation", exact: true }).getByRole("link", { name: "Notifications", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Notification inbox", exact: true })).toBeVisible();
  for (const chunk of notification) expect(requests.has(chunk.file)).toBe(true);
  for (const chunk of [...team, ...provider]) expect(requests.has(chunk.file), `${chunk.file} loaded by demo notifications`).toBe(false);
  const measurement = (items: typeof chunks) => ({ bytes: items.reduce((sum, item) => sum + Buffer.byteLength(item.source), 0), gzipBytes: items.reduce((sum, item) => sum + gzipSync(item.source).length, 0), files: items.map(item => item.file) });
  if (testInfo.project.name === "chromium") await writeFile(".artifacts/admin-integration/admin-bundle.json", JSON.stringify({ demoDashboardJavascript: measurement(initial), deferredNotifications: measurement(notification), deferredTeam: measurement(team), deferredProvider: measurement(provider), note: "Browser-observed dashboard JS requests, measured per file. CSS, RSC payloads, browser cache and compression headers are excluded; these are local build measurements, not a production budget." }, null, 2) + "\n");
});
