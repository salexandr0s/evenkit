import { readFile, open } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadRegistry, safeRelativePath } from "./catalog.mjs";
import { mountViewer } from "./viewer-client.js";

export function shellQuote(value) {
  if (typeof value !== "string" || !value.trim() || [...value].some(character => {
    const code = character.codePointAt(0);
    return code < 32 || (code >= 127 && code <= 159);
  })) throw new Error("Enter a path without control characters.");
  return `'${value.replaceAll("'", "'\\''")}'`;
}

export function makeInstallCommand({ cliPath, registry, consumer, directory = "src/blocks", names }) {
  safeRelativePath(directory);
  if (!Array.isArray(names) || !names.length || names.some(name => typeof name !== "string" || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name))) throw new Error("Choose a registered block.");
  return `node ${shellQuote(cliPath)} install ${names.map(shellQuote).join(" ")} \\\n  --registry ${shellQuote(registry)} \\\n  --cwd ${shellQuote(consumer)} --dir ${shellQuote(directory)} --dry-run`;
}

const scriptJson = value => JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
const cspHash = text => createHash("sha256").update(text).digest("base64");

export async function createViewer({ registry, output, cliPath = fileURLToPath(new URL("./cli.mjs", import.meta.url)) }) {
  if (typeof output !== "string" || !output.trim()) throw new Error("Provide a new HTML output path.");
  const catalog = await loadRegistry(registry);
  let tokens;
  try { tokens = await readFile(new URL("../../packages/tokens/dist/tokens.css", import.meta.url), "utf8"); }
  catch (error) {
    if (error.code === "ENOENT") throw new Error("Build the viewer's design tokens first: npm run build --workspace @evenkit/tokens", { cause: error });
    throw error;
  }
  const css = await readFile(new URL("./viewer.css", import.meta.url), "utf8");
  const logo = (await readFile(new URL("../../apps/catalog/public/evenkit-logo.png", import.meta.url))).toString("base64");
  const style = `${tokens}\n${css}\n.brand-mark { mask: url(data:image/png;base64,${logo}) center / contain no-repeat; }`;
  const script = `${safeRelativePath.toString()}\n${shellQuote.toString()}\n${makeInstallCommand.toString()}\n(${mountViewer.toString()})(JSON.parse(document.getElementById("registry-data").textContent), makeInstallCommand);`;
  const data = { catalog, registry: resolve(registry), cliPath: resolve(cliPath) };
  const policy = `default-src 'none'; script-src 'sha256-${cspHash(script)}'; style-src 'sha256-${cspHash(style)}'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'`;
  const html = `<!doctype html>
<html lang="en" data-kit-theme="grove" data-kit-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${policy}">
<meta name="color-scheme" content="light dark">
<title>Block registry · Evenkit</title>
<style>${style}</style>
</head>
<body>
<a class="skip-link" href="#block-heading">Skip to block details</a>
<header class="topbar shell">
  <div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>evenkit</span><span class="brand-divider" aria-hidden="true">/</span><span class="brand-context">Block registry</span></div>
  <div class="header-actions"><span class="local-label"><span class="status-dot" aria-hidden="true"></span>Local snapshot</span><span class="appearance-control"><button id="appearance" class="button icon-button" type="button" aria-label="Switch to dark appearance"></button><span id="appearance-tooltip" class="appearance-tooltip" role="tooltip" hidden></span></span></div>
</header>
<main class="shell">
  <section class="intro" aria-labelledby="page-heading">
    <div><p class="eyebrow">EVENKIT / SOURCE LIBRARY</p><h1 id="page-heading">Editable blocks.</h1><p class="intro-copy">Start with a complete flow. <br>Adapt the source in your own application.</p></div>
    <dl class="snapshot-facts" id="snapshot-facts"></dl>
  </section>
  <div class="workspace">
    <aside class="library" aria-label="Block library">
      <div class="library-heading"><h2>Library</h2><span id="item-count" class="count"></span></div>
      <label class="search-label" for="search">Find a block</label><div class="search-wrap"><span id="search-icon" aria-hidden="true"></span><input id="search" type="search" placeholder="Search blocks…" autocomplete="off" aria-controls="block-list"></div>
      <div id="search-status" class="sr-only" role="status"></div>
      <nav id="block-list" class="block-list" aria-label="Choose a block"></nav><p id="library-scroll-hint" class="library-scroll-hint" hidden>Scroll to browse blocks.</p>
      <div id="empty" class="empty" hidden><p>No matching blocks.</p><button id="clear-search" type="button" class="text-button">Clear search</button></div>
      <div class="library-note"><span class="eyebrow">APPLICATION SOURCE</span><p>Install source into your app.<br>Keep the changes you make.</p><span class="private-note">Private Evenkit packages required</span></div>
    </aside>
    <section class="inspector" aria-labelledby="block-heading">
      <div class="inspector-heading"><div class="block-emblem" id="block-emblem" aria-hidden="true"></div><div class="inspector-title"><p class="eyebrow" id="item-name"></p><h2 id="block-heading" tabindex="-1"></h2><p id="item-description"></p></div><span class="source-badge">Editable source</span></div>
      <div class="tabs" role="tablist" aria-label="Block details"><button id="overview-tab" type="button" role="tab" aria-selected="true" aria-controls="overview-panel">Overview</button><button id="source-tab" type="button" role="tab" aria-selected="false" aria-controls="source-panel" tabindex="-1">Source <span id="file-count" class="count"></span></button></div>
      <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
        <div class="overview-grid"><section><div class="section-heading"><h3>Files you’ll own</h3><span class="muted">Copied into your app</span></div><div id="file-list" class="file-list"></div><p class="file-note">Select a file to inspect its source.</p></section><section><div class="section-heading"><h3>Packages you’ll need</h3></div><ul id="dependencies" class="dependencies"></ul><p class="file-note">Install private packages from local tarballs or your authenticated registry.</p></section></div>
        <details class="provenance"><summary>Source provenance <span id="revision-short" class="mono"></span></summary><dl id="provenance-details"></dl></details>
      </div>
      <div id="source-panel" role="tabpanel" aria-labelledby="source-tab" hidden><div class="source-toolbar"><div><label for="source-file">Source file</label><select id="source-file"></select></div><button id="copy-source" class="button" type="button">Copy source</button></div><div class="code-caption"><span id="source-path"></span><span id="line-count"></span></div><div id="code-scroll" class="code-scroll" tabindex="0" role="region" aria-label="Source code"><ol id="source-lines"></ol></div><textarea id="source-fallback" readonly rows="4" aria-label="Source to copy" hidden></textarea><div id="source-copy-status" class="copy-status" role="status"></div></div>
      <section class="install-panel" aria-labelledby="install-heading"><div class="install-heading"><div><p class="eyebrow">NEXT STEP</p><h3 id="install-heading">Try a dry run.</h3></div><span class="dry-run-label">Checks first. No files changed.</span></div><div class="install-fields"><div><label for="consumer">Application directory</label><input id="consumer" type="text" placeholder="/path/to/your-app" autocomplete="off" spellcheck="false" aria-describedby="command-hint"></div><div><label for="directory">Copy files into</label><input id="directory" type="text" value="src/blocks" autocomplete="off" spellcheck="false" aria-describedby="command-hint"></div></div><div class="command-wrap"><div class="command-header"><span><span aria-hidden="true">&gt;_</span> Terminal · sh / zsh</span><button id="copy-command" type="button" class="button" disabled>Copy dry-run command</button></div><textarea id="install-command" readonly rows="4" spellcheck="false" aria-label="Dry-run installation command"></textarea></div><p id="command-hint" class="command-hint">Enter your application directory to prepare the command.</p><p id="command-status" class="copy-status" role="status"></p></section>
    </section>
  </div>
  <footer class="footer"><p>Local source snapshot · Nothing runs in your application from this page.</p><span>Evenkit / Block registry</span></footer>
</main>
<noscript><p class="shell">Enable JavaScript to explore this local snapshot, or use the registry CLI to inspect its source.</p></noscript>
<script id="registry-data" type="application/json">${scriptJson(data)}</script>
<script>${script}</script>
</body>
</html>
`;
  const destination = resolve(output);
  const handle = await open(destination, "wx", 0o644);
  try { await handle.writeFile(html); }
  finally { await handle.close(); }
  return { output: destination, items: catalog.items.map(item => item.name), validated: true };
}
