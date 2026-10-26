import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "./registry/build.mjs";
import { gzipSync } from "node:zlib";
import { chromium, expect } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = await mkdtemp(join(tmpdir(), "evenkit-consumers-"));
const artifacts = join(root, ".artifacts");
const environment = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
const verifyRegistry = process.argv.includes("--registry");
const reportFilename = verifyRegistry ? "registry-package-verification.json" : "package-verification.json";
const report = { status: "running", startedAt: new Date().toISOString(), node: process.version, allocatedDirectory: scratch, packages: [], consumers: [], resources: [] };

async function browserSmoke(url, kind) {
  const browser = await chromium.launch();
  let page;
  const errors = [];
  const consoleErrors = [];
  const failedRequests = [];
  try {
    page = await browser.newPage();
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto(url);
    await expect(page.getByRole("heading", { name: "Packed package check", exact: true })).toBeVisible();
    const trigger = page.getByRole("button", { name: "Open package dialog", exact: true });
    if (kind === "next") await expect(trigger).toHaveAttribute("data-package-hydrated", "true");
    await expect(trigger).toBeEnabled();
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Package dialog", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    const checkbox = page.getByRole("checkbox", { name: "Accept package preview", exact: true });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    const documentTrigger = page.getByRole("button", { name: "Preview Packed document.txt", exact: true });
    await documentTrigger.click();
    const preview = page.getByRole("dialog", { name: "Packed document.txt", exact: true });
    await expect(preview.getByText("Document content from an independent consumer.", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(documentTrigger).toBeFocused();
    if (errors.length) throw new Error(`Packed consumer browser errors: ${errors.join("; ")}`);
    return { browser: "Chromium", hydration: "passed", dialogFocus: "passed", controlledInput: "passed", copiedDocumentAction: "passed" };
  } catch (error) {
    const diagnostics = { kind, url, error: error instanceof Error ? error.message : String(error), pageErrors: errors, consoleErrors, failedRequests };
    const diagnosticPath = join(artifacts, `${verifyRegistry ? "registry-" : ""}package-${kind}-browser-failure.json`);
    try {
      if (page && !page.isClosed()) {
        diagnostics.page = await page.evaluate(() => ({
          url: location.href, readyState: document.readyState,
          triggers: [...document.querySelectorAll("button")].filter(button => button.textContent?.trim() === "Open package dialog").map(button => button.outerHTML),
          dialogs: [...document.querySelectorAll('[role="dialog"]')].map(dialog => dialog.outerHTML),
          activeElement: document.activeElement?.outerHTML,
        }));
        diagnostics.screenshot = join(artifacts, `${verifyRegistry ? "registry-" : ""}package-${kind}-browser-failure.png`);
        await page.screenshot({ path: diagnostics.screenshot });
      }
    } catch (captureError) {
      diagnostics.captureError = captureError instanceof Error ? captureError.message : String(captureError);
    }
    report.browserFailures ??= [];
    report.browserFailures.push(diagnostics);
    await writeFile(diagnosticPath, JSON.stringify(diagnostics, null, 2) + "\n");
    throw new Error(`${diagnostics.error}\n${kind} browser page errors: ${errors.join("; ") || "none"}. Diagnostics: ${diagnosticPath}`, { cause: error });
  } finally {
    await browser.close();
  }
}

async function inspectViteBundle(directory, variant) {
  const output = join(directory, variant === "minimal" ? "dist-minimal" : "dist");
  const chunks = JSON.parse(await readFile(join(output, "bundle-modules.json"), "utf8"));
  const forbidden = /\/node_modules\/(?:next\/|@supabase\/|@evenkit\/auth-next\/|server-only\/)/;
  const heavy = /\/node_modules\/(?:recharts\/|shiki\/|@shikijs\/|react-markdown\/|remark-gfm\/|unified\/|d3-[^/]+\/)/;
  const modules = [...new Set(chunks.flatMap(chunk => chunk.modules))];
  const forbiddenModules = modules.filter(id => forbidden.test(id) || (variant === "minimal" && heavy.test(id)));
  if (forbiddenModules.length) throw new Error(`Unexpected ${variant} Vite dependencies: ${forbiddenModules.join(", ")}`);
  const sizes = await Promise.all(chunks.map(async chunk => {
    const bytes = await readFile(join(output, chunk.file));
    return { file: chunk.file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, entry: chunk.entry, imports: chunk.imports, dynamicImports: chunk.dynamicImports };
  }));
  return { variant, modules: modules.length, forbiddenModules, jsBytes: sizes.reduce((sum, chunk) => sum + chunk.bytes, 0), gzipBytes: sizes.reduce((sum, chunk) => sum + chunk.gzipBytes, 0), chunks: sizes };
}

async function verifyServerBoundary(directory) {
  const route = join(directory, "app", "invalid-client");
  await mkdir(route);
  await writeFile(join(route, "page.tsx"), '"use client";\nimport { trustedOrigin } from "@evenkit/auth-next/server";\nexport default function InvalidBoundary() { return <p>{trustedOrigin("http://localhost:3000")}</p>; }\n');
  try {
    let output = "";
    try {
      execFileSync("npm", ["run", "build"], { cwd: directory, env: environment, encoding: "utf8", timeout: 180_000, maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      if (!error || typeof error !== "object") throw error;
      output = ["stdout" in error ? String(error.stdout) : "", "stderr" in error ? String(error.stderr) : ""].join("\n");
    }
    if (!output.includes("server-only") || !/Client Component|client component/i.test(output) || !output.includes("invalid-client")) {
      throw new Error(`Expected the packed auth server entry to reject a Client Component import. ${output.slice(-4_000)}`);
    }
    return "rejected client import";
  } finally {
    await rm(route, { recursive: true, force: true });
  }
}

function run(command, args, cwd) {
  try {
    return execFileSync(command, args, {
      cwd, env: environment, encoding: "utf8", timeout: 180_000,
      maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    if (error && typeof error === "object") {
      if ("stdout" in error && error.stdout) process.stderr.write(String(error.stdout));
      if ("stderr" in error && error.stderr) process.stderr.write(String(error.stderr));
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
  if (!address || typeof address === "string") throw new Error("Could not allocate a fixture port.");
  await new Promise((accept, reject) => probe.close(error => error ? reject(error) : accept()));
  return address.port;
}

async function smoke(kind, directory) {
  const port = await allocatePort();
  const binary = kind === "next" ? "next/dist/bin/next" : "vite/bin/vite.js";
  const args = kind === "next"
    ? [join(directory, "node_modules", binary), "start", "--hostname", "127.0.0.1", "--port", String(port)]
    : [join(directory, "node_modules", binary), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"];
  const child = spawn(process.execPath, args, {
    cwd: directory, env: environment, detached: true, stdio: ["ignore", "pipe", "pipe"]
  });
  let logs = "";
  let startupError;
  let hasClosed = false;
  const closed = new Promise(accept => child.once("close", () => { hasClosed = true; accept(); }));
  child.on("error", error => { startupError = error; });
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", chunk => { logs = (logs + String(chunk)).slice(-8_000); });
  }
  const resource = { kind, pid: child.pid, port, directory, cleaned: false };
  report.resources.push(resource);

  async function waitForClose(milliseconds) {
    if (hasClosed) return true;
    let timeout;
    const result = await Promise.race([
      closed.then(() => true),
      new Promise(accept => { timeout = setTimeout(() => accept(false), milliseconds); })
    ]);
    clearTimeout(timeout);
    return result;
  }

  function signalOwnedGroup(signal) {
    if (!child.pid || hasClosed) return;
    try { process.kill(-child.pid, signal); }
    catch (error) {
      if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ESRCH") throw error;
    }
  }

  let smokeResult;
  let failure;
  try {
    await writeFile(join(artifacts, reportFilename), JSON.stringify(report, null, 2));
    const deadline = Date.now() + 30_000;
    let response;
    while (Date.now() < deadline) {
      if (startupError) throw startupError;
      if (hasClosed) throw new Error(`${kind} fixture exited: ${logs}`);
      try {
        response = await fetch(`http://127.0.0.1:${port}`, { signal: AbortSignal.timeout(1_000) });
        if (response.ok) break;
      } catch { /* The owned server may still be starting. */ }
      await new Promise(accept => setTimeout(accept, 150));
    }
    if (!response?.ok) throw new Error(`${kind} fixture did not become ready: ${logs}`);
    const html = await response.text();
    if (kind === "next" && !html.includes("Packed package check")) throw new Error("Next server did not render the package fixture.");
    if (kind === "next" && !["Packed login", "Packed signup", "Packed password reset", "Packed new password"].every(title => html.includes(title))) throw new Error("Next server did not render the packed authentication pages.");
    if (kind === "next" && !html.includes("Packed projects")) throw new Error("Next server did not render the client shell/table fixture.");
    if (kind === "next" && !html.includes("Package assistant")) throw new Error("Next server did not render the client chat fixture.");
    if (kind === "next" && !html.includes("Packed rich chat")) throw new Error("Next server did not render the rich chat fixture.");
    if (kind === "next" && !html.includes("Priority package controls")) throw new Error("Next server did not render the new priority control families.");
    if (kind === "next" && !html.includes("Roadmap package controls")) throw new Error("Next server did not render the roadmap controls and blocks.");
    if (kind === "next" && !html.includes("Document library package controls")) throw new Error("Next server did not render the document library fixture.");
    if (kind === "next" && !html.includes("Packed notification family")) throw new Error("Next server did not render notification exports and copied blocks.");
    if (kind === "next" && !html.includes("Website block package controls")) throw new Error("Next server did not render the copied website blocks.");
    if (kind === "next" && !["Reporting package controls", "Packed reporting dashboard", "Packed monthly activity", "View data table"].every(text => html.includes(text))) throw new Error("Next server did not render the reporting chart and copied dashboard block.");
    if (kind === "next" && !html.includes("Packed primary navigation")) throw new Error("Next server did not render the complete navbar fixture.");
    if (kind === "next" && !html.includes("Packed editable projects")) throw new Error("Next server did not render the independently copied page blocks.");
    if (kind === "vite" && !html.includes('id="root"')) throw new Error("Vite did not serve the package fixture.");
    const stylesheets = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"/g)].map(match => match[1]);
    const styles = await Promise.all(stylesheets.map(async path => {
      const css = await fetch(new URL(path, `http://127.0.0.1:${port}`));
      if (!css.ok) throw new Error(`${kind} fixture stylesheet failed: ${path}`);
      return css.text();
    }));
    const css = styles.join("\n");
    if (!css.includes(".pk-auth-layout")) throw new Error(`${kind} fixture did not ship the authentication page styles.`);
    if (!["--pk-color-accent", ".pk-button", ".pk-icon", ".pk-tooltip-content", ".pk-admin-shell", ".pk-data-table", ".pk-chat", ".pk-card", ".pk-check-control", ".pk-combobox", ".pk-tabs", ".pk-menu", ".pk-filter-bar", ".pk-navbar"].every(selector => css.includes(selector))) {
      throw new Error(`${kind} fixture did not ship the existing and priority component styles.`);
    }
    const roadmapSelectors = [".pk-calendar", ".pk-date-range", ".pk-multi-field", ".pk-number-field", ".pk-sort-control", ".pk-activity-timeline", ".pk-settings-layout", ".pk-upload-queue", ".pk-image", ".pk-command", ".pk-step-indicator"];
    if (!roadmapSelectors.every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship the roadmap styles.`);
    if (![".pk-file-preview", ".pk-file-lightbox", ".pk-document-library", ".pk-avatar-upload"].every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship the document library styles.`);
    const teamSelectors = [".pk-team-members", ".pk-invitation-acceptance", ".pk-role-editor", ".pk-audit-viewer"];
    if (!teamSelectors.every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship the team administration styles.`);
    if (kind === "next" && !html.includes("Team administration package controls")) throw new Error("Next server did not render team administration controls.");
    if (![".pk-notification-list", ".pk-notification-preferences", ".pk-persistent-banner", ".pk-presence-indicator"].every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship notification family styles.`);
    if (![".pk-code-block", ".pk-chat-markdown", ".pk-chat-attachments", ".pk-chat-sources"].every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship rich chat styles.`);
    if (![".pk-website-section", ".pk-website-form", ".pk-website-article"].every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship the copied website styles.`);
    const reportingSelectors = [".pk-statistic", ".pk-reporting-controls", ".pk-export-action", ".pk-chart", "--pk-chart-series-1", "--pk-chart-series-6"];
    if (!reportingSelectors.every(selector => css.includes(selector))) throw new Error(`${kind} fixture did not ship the reporting styles and chart series tokens.`);
    const browser = await browserSmoke(`http://127.0.0.1:${port}`, kind);
    if (kind === "next") {
      const authResponse = await fetch(`http://127.0.0.1:${port}/auth-package`);
      const authHtml = await authResponse.text();
      if (!authResponse.ok || !authHtml.includes("Packed auth boundaries") || !authHtml.includes("/dashboard") || !authHtml.includes("Packed auth client")) {
        throw new Error("Packed Next auth subpaths did not render their server/client fixture.");
      }
    }
    smokeResult = { httpStatus: response.status, stylesheetCount: stylesheets.length, ...browser };
  } catch (error) {
    failure = error;
  } finally {
    try {
      if (!hasClosed) {
        signalOwnedGroup("SIGTERM");
        if (!await waitForClose(2_000)) {
          signalOwnedGroup("SIGKILL");
          await waitForClose(2_000);
        }
      }
    } catch (cleanupError) {
      failure = failure !== undefined
        ? new AggregateError([failure, cleanupError], `The ${kind} fixture and its cleanup failed.`)
        : cleanupError;
    }
    resource.cleaned = hasClosed;
  }
  if (failure !== undefined) throw failure;
  if (!hasClosed) throw new Error(`Could not confirm cleanup of the owned ${kind} fixture server ${child.pid}.`);
  if (!smokeResult) throw new Error(`${kind} fixture produced no smoke result.`);
  return smokeResult;
}

try {
  await mkdir(artifacts, { recursive: true });
  const registry = verifyRegistry ? await buildRegistry({ root, output: join(scratch, "registry") }) : null;
  const tarballs = {};
  for (const name of ["tokens", "ui", "auth-next"]) {
    const packed = JSON.parse(run("npm", ["pack", join(root, "packages", name), "--pack-destination", scratch, "--json", "--ignore-scripts"], root));
    const item = packed[0];
    if (!item?.filename || !Array.isArray(item.files)) throw new Error(`Missing ${name} package artifact.`);
    const requiredFiles = name === "auth-next"
      ? ["dist/server.js", "dist/server.d.ts", "dist/client.js", "dist/client.d.ts", "dist/paths.js", "dist/paths.d.ts", "dist/policy.js", "dist/policy.d.ts"]
      : ["dist/index.js", "dist/index.d.ts", name === "tokens" ? "dist/tokens.css" : "dist/styles.css"];
    for (const required of requiredFiles) {
      if (!item.files.some(file => file.path === required)) throw new Error(`${name} package is missing ${required}.`);
    }
    if (name === "ui") for (const required of ["licenses/d3-shape.txt", "licenses/d3-path.txt"]) {
      if (!item.files.some(file => file.path === required)) throw new Error(`UI package is missing ${required}.`);
    }
    tarballs[name] = join(scratch, item.filename);
    report.packages.push({ name: item.name, version: item.version, integrity: item.integrity, unpackedSize: item.unpackedSize });
  }
  for (const kind of ["vite", "next"]) {
    console.log(`Checking packed packages in independent ${kind} consumer…`);
    const directory = join(scratch, kind);
    await cp(join(root, "fixtures", kind), directory, { recursive: true });
    const sharedFixtures = (await readdir(join(root, "fixtures"))).filter(name => name.endsWith("-fixture.tsx"));
    for (const fixture of sharedFixtures) {
      await cp(join(root, "fixtures", fixture), join(directory, kind === "next" ? "app" : "", fixture));
    }
    if (!verifyRegistry) await cp(join(root, "registry", "blocks"), join(directory, kind === "next" ? "app" : "", "blocks"), { recursive: true });
    const manifestPath = join(directory, "package.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.dependencies["@evenkit/tokens"] = `file:${tarballs.tokens}`;
    manifest.dependencies["@evenkit/ui"] = `file:${tarballs.ui}`;
    if (kind === "next") manifest.dependencies["@evenkit/auth-next"] = `file:${tarballs["auth-next"]}`;
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], directory);
    if (registry) {
      const args = [join(root, "scripts/registry/cli.mjs"), "install", ...registry.items.map(item => item.name), "--registry", join(scratch, "registry"), "--cwd", directory, "--dir", kind === "next" ? "app/blocks" : "blocks"];
      const preview = JSON.parse(run(process.execPath, [...args, "--dry-run"], root));
      const installed = JSON.parse(run(process.execPath, args, root));
      const repeated = JSON.parse(run(process.execPath, args, root));
      if (preview.blocked || !installed.applied || repeated.applied) throw new Error(`Registry lifecycle failed in ${kind}.`);
      report.registry ??= [];
      report.registry.push({ kind, items: registry.items.map(item => item.name), sourceRevision: registry.items[0].meta.evenkit.sourceRevision, files: installed.files, dependencies: installed.dependencies, dryRun: "passed", install: "passed", repeated: "passed" });
    }
    run("npm", ["run", "build"], directory);
    run("npm", ["run", "typecheck"], directory);
    const result = await smoke(kind, directory);
    if (kind === "vite") {
      run("npm", ["run", "build:minimal"], directory);
      const bundles = await Promise.all([inspectViteBundle(directory, "full"), inspectViteBundle(directory, "minimal")]);
      report.consumers.push({ kind, build: "passed", strictTypes: "passed", ...result, bundles });
    } else {
      const serverBoundary = await verifyServerBoundary(directory);
      report.consumers.push({ kind, build: "passed", strictTypes: "passed", ...result, serverBoundary });
    }
    console.log(`${kind}: production build, strict types, browser interaction, and package boundary checks passed.`);
  }
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
  console.error(report.error);
} finally {
  if (report.resources.every(resource => resource.cleaned)) {
    await rm(scratch, { recursive: true, force: true });
    report.allocatedDirectoryRemoved = true;
  } else {
    report.allocatedDirectoryRemoved = false;
    report.status = "failed";
    process.exitCode = 1;
    console.error(`Preserved ${scratch} because server cleanup could not be confirmed.`);
  }
  await writeFile(join(artifacts, reportFilename), JSON.stringify(report, null, 2) + "\n");
}
