import { execFile, spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { chromium, expect } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = await mkdtemp(join(tmpdir(), "evenkit-website-consumers-"));
const artifacts = join(root, ".artifacts", "website-blocks");
const environment = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
const execute = promisify(execFile);
const report = { status: "running", scratch, consumers: [], resources: [] };
let browser;

async function run(command, args, cwd) {
  try {
    return (await execute(command, args, {
      cwd, env: environment, encoding: "utf8", timeout: 180_000,
      maxBuffer: 8 * 1024 * 1024,
    })).stdout;
  } catch (error) {
    if (error && typeof error === "object") {
      if ("stdout" in error) process.stderr.write(String(error.stdout));
      if ("stderr" in error) process.stderr.write(String(error.stderr));
    }
    throw error;
  }
}

async function allocatePort() {
  const probe = createServer();
  await new Promise((accept, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", accept);
  });
  const address = probe.address();
  if (!address || typeof address === "string") throw new Error("Could not allocate a consumer port.");
  await new Promise((accept, reject) => probe.close(error => error ? reject(error) : accept()));
  return address.port;
}

const fixture = `"use client";
import { useRef, useState } from "react";
import { ArticleExample, WebsiteExample } from "./website/examples";
import { ArticleLayout } from "./website/article-layout";
import { ContactForm, type ContactFormValues } from "./website/contact-form";
import { NewsletterForm } from "./website/newsletter-form";
import type { WebsiteSubmitHandler } from "./website/form-types";

function FormConsumer() {
  const [visible, setVisible] = useState(true);
  const [submissions, setSubmissions] = useState(0);
  const [aborts, setAborts] = useState(0);
  const finish = useRef<(() => void) | null>(null);
  const submit: WebsiteSubmitHandler<ContactFormValues> = async (_values, { signal }) => {
    setSubmissions(count => count + 1);
    await new Promise<void>(resolve => {
      finish.current = resolve;
      signal.addEventListener("abort", () => setAborts(count => count + 1), { once: true });
    });
  };
  return <>
    <button onClick={() => setVisible(value => !value)}>{visible ? "Close first inquiry" : "Open first inquiry"}</button>
    <button onClick={() => finish.current?.()}>Complete pending response</button>
    <output aria-label="Submission count">{submissions}</output>
    <output aria-label="Abort count">{aborts}</output>
    {visible ? <ContactForm heading="First copied inquiry" onSubmit={submit} /> : null}
    <ContactForm heading="Second copied inquiry" onSubmit={async () => {}} />
    <NewsletterForm heading="First copied newsletter" onSubmit={async () => {}} />
    <NewsletterForm heading="Second copied newsletter" onSubmit={async () => {}} />
  </>;
}

export function Consumer({ view = "" }: { view?: string }) {
  if (view === "forms") return <FormConsumer />;
  return view === "article" ? <><ArticleExample /><ArticleLayout id="copied-article" headingAs="h2" title="Copied article title" contentsLabel="Collision contents"
    sections={[{ id: "title", title: "Section named title", content: <p>The section must have its own anchor.</p> }]} /></> : <WebsiteExample
    onContact={async () => {}}
    onNewsletter={async () => {}}
  />;
}
`;

async function prepare(kind, tarballs) {
  const directory = join(scratch, kind);
  await mkdir(directory);
  const manifest = JSON.parse(await readFile(join(root, "fixtures", kind, "package.json"), "utf8"));
  manifest.name = `evenkit-website-${kind}-consumer`;
  manifest.dependencies["@evenkit/tokens"] = `file:${tarballs.tokens}`;
  manifest.dependencies["@evenkit/ui"] = `file:${tarballs.ui}`;
  await writeFile(join(directory, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
  await cp(join(root, "fixtures", kind, "tsconfig.json"), join(directory, "tsconfig.json"));
  const sourceDirectory = kind === "next" ? join(directory, "app") : directory;
  await mkdir(sourceDirectory, { recursive: true });
  await cp(join(root, "registry", "blocks", "website"), join(sourceDirectory, "website"), { recursive: true });
  await writeFile(join(sourceDirectory, "consumer.tsx"), fixture);
  if (kind === "next") {
    await cp(join(root, "fixtures", "next", "app", "layout.tsx"), join(sourceDirectory, "layout.tsx"));
    await writeFile(join(sourceDirectory, "page.tsx"), `import { Consumer } from "./consumer";
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  return <Consumer view={(await searchParams).view ?? ""} />;
}
`);
  } else {
    await cp(join(root, "fixtures", "vite", "index.html"), join(directory, "index.html"));
    await writeFile(join(directory, "src.tsx"), `import { createRoot } from "react-dom/client";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { Consumer } from "./consumer";
const root = document.getElementById("root");
if (!root) throw new Error("Consumer root is missing.");
createRoot(root).render(<Consumer view={new URLSearchParams(location.search).get("view") ?? ""} />);
`);
  }
  await run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], directory);
  await run("npm", ["run", "build"], directory);
  return directory;
}

async function smoke(kind, directory) {
  const port = await allocatePort();
  const origin = `http://127.0.0.1:${port}`;
  const args = kind === "next"
    ? [join(directory, "node_modules", "next", "dist", "bin", "next"), "start", "--hostname", "127.0.0.1", "--port", String(port)]
    : [join(directory, "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"];
  const child = spawn(process.execPath, args, { cwd: directory, env: environment, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  const resource = { kind, pid: child.pid, port, cleaned: false };
  report.resources.push(resource);
  let hasClosed = false;
  let startupError;
  let logs = "";
  const closed = new Promise(accept => child.once("close", () => { hasClosed = true; accept(); }));
  child.on("error", error => { startupError = error; });
  for (const stream of [child.stdout, child.stderr]) stream.on("data", chunk => { logs = (logs + String(chunk)).slice(-8_000); });
  let page;
  let result;
  let failure;
  const errors = [];
  try {
    page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && /hydrat|Minified React error/i.test(message.text())) errors.push(message.text());
    });
    const deadline = Date.now() + 30_000;
    let response;
    while (Date.now() < deadline) {
      if (startupError) throw startupError;
      if (hasClosed) throw new Error(`${kind} consumer exited: ${logs}`);
      try {
        response = await fetch(origin, { signal: AbortSignal.timeout(1_000) });
        if (response.ok) break;
      } catch { /* The owned production server may still be starting. */ }
      await new Promise(accept => setTimeout(accept, 100));
    }
    if (!response?.ok) throw new Error(`${kind} consumer did not become ready: ${logs}`);
    const html = await response.text();
    if (kind === "next" && !html.includes("Contact the fictional studio")) throw new Error("Next did not server-render the copied website example.");
    await page.goto(origin);
    await expect(page.getByRole("heading", { name: "Contact the fictional studio", exact: true })).toBeVisible();
    await expect(page.locator(".pk-navbar")).toBeVisible();
    const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => link.getAttribute("href")));
    const css = (await Promise.all(styles.filter(Boolean).map(async path => {
      const response = await fetch(new URL(path, origin));
      if (!response.ok) throw new Error(`${kind} stylesheet failed: ${path}`);
      return response.text();
    }))).join("\n");
    for (const selector of ["--pk-color-accent", ".pk-navbar", ".pk-website-", ".pk-image"]) {
      if (!css.includes(selector)) throw new Error(`${kind} is missing copied or package CSS: ${selector}`);
    }
    const question = page.locator(".pk-accordion-trigger").first();
    await question.focus();
    const expanded = await question.getAttribute("aria-expanded");
    await question.press("Enter");
    await expect(question).toHaveAttribute("aria-expanded", expanded === "true" ? "false" : "true");
    const contact = page.getByRole("form", { name: "Contact the fictional studio", exact: true });
    await contact.getByRole("button", { name: /send/i }).click();
    await expect(contact.locator(".pk-form-summary")).toBeVisible();
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(page.locator(".pk-navbar")).toHaveAttribute("data-compact", width < 768 ? "true" : "false");
      const overflow = await page.evaluate(() => ({
        viewport: innerWidth, document: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll("body *")].filter(element => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && (box.right > innerWidth + 1 || box.left < -1) && !element.closest("pre");
        }).slice(0, 12).map(element => ({ tag: element.tagName, className: element.className, width: element.getBoundingClientRect().width })),
      }));
      expect(overflow.document <= width + 1, `${kind} at ${width}px: ${JSON.stringify(overflow)}`).toBe(true);
    }
    await page.screenshot({ path: join(artifacts, `${kind}-website.png`), fullPage: true });
    await page.goto(`${origin}/?view=article`);
    await expect(page.getByRole("heading", { name: "Keeping a field notebook", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page", exact: true })).toBeVisible();
    await page.screenshot({ path: join(artifacts, `${kind}-article.png`), fullPage: true });
    const articleIds = await page.locator("[id]").evaluateAll(elements => elements.map(element => element.id));
    expect(new Set(articleIds).size, `${kind} article IDs`).toBe(articleIds.length);
    const titleLink = page.getByRole("navigation", { name: "Collision contents", exact: true }).getByRole("link", { name: "Section named title", exact: true });
    await expect(titleLink).not.toHaveAttribute("href", "#copied-article-title");
    await titleLink.press("Enter");
    await expect(page.getByRole("heading", { name: "Section named title", exact: true })).toBeFocused();
    await page.goto(`${origin}/?view=forms`);
    const first = page.getByRole("form", { name: "First copied inquiry", exact: true });
    await expect(first).toBeVisible();
    const ids = await page.locator("[id]").evaluateAll(elements => elements.map(element => element.id));
    expect(new Set(ids).size, `${kind} repeated form IDs`).toBe(ids.length);
    await first.getByRole("textbox", { name: "Name", exact: true }).fill("Copied form example");
    await first.getByRole("textbox", { name: "Email", exact: true }).fill("copy@example.test");
    await first.getByRole("textbox", { name: "Message", exact: true }).fill("Check the copied handler boundary.");
    await first.evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
    await expect(page.getByRole("status", { name: "Submission count", exact: true })).toHaveText("1");
    await expect(first.getByRole("button", { name: "Send inquiry", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Close first inquiry", exact: true }).click();
    await expect(page.getByRole("status", { name: "Abort count", exact: true })).toHaveText("1");
    await page.getByRole("button", { name: "Open first inquiry", exact: true }).click();
    await page.getByRole("button", { name: "Complete pending response", exact: true }).click();
    await expect(first.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
    await expect(first.locator('.pk-action-message[data-tone="success"]')).toHaveCount(0);
    const second = page.getByRole("form", { name: "Second copied inquiry", exact: true });
    await second.getByRole("button", { name: "Send inquiry", exact: true }).click();
    await second.getByRole("link", { name: "Enter your name.", exact: true }).click();
    await expect(second.getByRole("textbox", { name: "Name", exact: true })).toBeFocused();
    expect(errors, `${kind} runtime and hydration errors`).toEqual([]);
    result = { kind, build: "passed", render: "passed", interaction: "passed", duplicateSubmission: "passed", unmountAbort: "passed", repeatedForms: "passed", stylesheets: styles.length, runtimeErrors: errors };
  } catch (error) {
    failure = error;
    await page?.screenshot({ path: join(artifacts, `${kind}-failure.png`), fullPage: true }).catch(() => undefined);
  } finally {
    function signal(signal) {
      if (!child.pid || hasClosed) return;
      try { process.kill(-child.pid, signal); }
      catch (error) {
        if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ESRCH") throw error;
      }
    }
    async function waitForClose() {
      let timer;
      await Promise.race([closed, new Promise(accept => { timer = setTimeout(accept, 2_000); })]);
      clearTimeout(timer);
    }
    try {
      await page?.close();
      signal("SIGTERM");
      await waitForClose();
      if (!hasClosed) { signal("SIGKILL"); await waitForClose(); }
    } catch (cleanupError) {
      failure = failure === undefined ? cleanupError : new AggregateError([failure, cleanupError], `${kind} verification and cleanup failed.`);
    }
    resource.cleaned = hasClosed;
  }
  if (failure !== undefined) throw failure;
  if (!hasClosed) throw new Error(`Could not confirm ${kind} consumer server cleanup.`);
  if (!result) throw new Error(`${kind} consumer produced no verification result.`);
  return result;
}

try {
  await mkdir(artifacts, { recursive: true });
  const tarballs = {};
  for (const name of ["tokens", "ui"]) {
    const packed = JSON.parse(await run("npm", ["pack", join(root, "packages", name), "--pack-destination", scratch, "--json", "--ignore-scripts"], root));
    if (!packed[0]?.filename) throw new Error(`Missing packed ${name} package.`);
    tarballs[name] = join(scratch, packed[0].filename);
  }
  browser = await chromium.launch();
  for (const kind of ["vite", "next"]) {
    console.log(`Checking copied website blocks in independent ${kind} consumer...`);
    const directory = await prepare(kind, tarballs);
    report.consumers.push(await smoke(kind, directory));
    console.log(`${kind}: production build, copied styles, render and keyboard/form smoke passed.`);
  }
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.message : String(error);
  report.stack = error instanceof Error ? error.stack : undefined;
  console.error(report.error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  report.scratchRemoved = report.resources.every(resource => resource.cleaned);
  if (report.scratchRemoved) await rm(scratch, { recursive: true, force: true });
  else console.error(`Retained ${scratch} because server cleanup was not confirmed.`);
  await writeFile(join(artifacts, "copied-consumption.json"), JSON.stringify(report, null, 2) + "\n");
}
