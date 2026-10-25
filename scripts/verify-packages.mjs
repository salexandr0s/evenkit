import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "./registry/build.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = await mkdtemp(join(tmpdir(), "evenkit-consumers-"));
const artifacts = join(root, ".artifacts");
const environment = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
const report = { status: "running", allocatedDirectory: scratch, consumers: [], resources: [] };
const verifyRegistry = process.argv.includes("--registry");
const reportFilename = verifyRegistry ? "registry-package-verification.json" : "package-verification.json";

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
    if (kind === "next" && !html.includes("Packed projects")) throw new Error("Next server did not render the client shell/table fixture.");
    if (kind === "next" && !html.includes("Package assistant")) throw new Error("Next server did not render the client chat fixture.");
    if (kind === "next" && !html.includes("Priority package controls")) throw new Error("Next server did not render the new priority control families.");
    if (kind === "next" && !html.includes("Roadmap package controls")) throw new Error("Next server did not render the roadmap controls and blocks.");
    if (kind === "next" && !html.includes("Document library package controls")) throw new Error("Next server did not render the document library fixture.");
    if (kind === "next" && !html.includes("Packed notification family")) throw new Error("Next server did not render notification exports and copied blocks.");
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
    smokeResult = { httpStatus: response.status, stylesheetCount: stylesheets.length };
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
  for (const name of ["tokens", "ui"]) {
    const packed = JSON.parse(run("npm", ["pack", join(root, "packages", name), "--pack-destination", scratch, "--json", "--ignore-scripts"], root));
    const item = packed[0];
    if (!item?.filename || !Array.isArray(item.files)) throw new Error(`Missing ${name} package artifact.`);
    for (const required of ["dist/index.js", "dist/index.d.ts", name === "tokens" ? "dist/tokens.css" : "dist/styles.css"]) {
      if (!item.files.some(file => file.path === required)) throw new Error(`${name} package is missing ${required}.`);
    }
    tarballs[name] = join(scratch, item.filename);
  }
  for (const kind of ["vite", "next"]) {
    console.log(`Checking packed packages in independent ${kind} consumer…`);
    const directory = join(scratch, kind);
    await cp(join(root, "fixtures", kind), directory, { recursive: true });
    await cp(join(root, "fixtures", "priority-fixture.tsx"), join(directory, kind === "next" ? "app" : "", "priority-fixture.tsx"));
    await cp(join(root, "fixtures", "roadmap-fixture.tsx"), join(directory, kind === "next" ? "app" : "", "roadmap-fixture.tsx"));
    await cp(join(root, "fixtures", "document-library-fixture.tsx"), join(directory, kind === "next" ? "app" : "", "document-library-fixture.tsx"));
    await cp(join(root, "fixtures", "team-admin-fixture.tsx"), join(directory, kind === "next" ? "app" : "", "team-admin-fixture.tsx"));
    if (!verifyRegistry) await cp(join(root, "registry", "blocks"), join(directory, kind === "next" ? "app" : "", "blocks"), { recursive: true });
    const manifestPath = join(directory, "package.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.dependencies["@evenkit/tokens"] = `file:${tarballs.tokens}`;
    manifest.dependencies["@evenkit/ui"] = `file:${tarballs.ui}`;
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
    const result = await smoke(kind, directory);
    report.consumers.push({ kind, build: "passed", ...result });
    console.log(`${kind}: production build and stylesheet HTTP smoke passed.`);
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
