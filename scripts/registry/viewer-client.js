// This function is embedded in the standalone document. All registry strings
// enter the page through textContent or native form values, never HTML parsing.
export function mountViewer(data, makeInstallCommand) {
  const byId = id => document.getElementById(id);
  const { catalog } = data;
  let selected = catalog.items.find(item => item.name === "record-detail") ?? catalog.items[0];
  let selectedFile = 0;
  let copyGeneration = 0;
  const glyphs = {
    file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z", "M14 2v6h6", "M8 13h8", "M8 17h5"],
    blocks: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
    search: ["M21 21l-5-5", "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0"],
    moon: ["M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"],
    sun: ["M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5", "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"],
    arrow: ["m9 6 6 6-6 6"]
  };
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" })) svg.setAttribute(key, value);
    for (const d of glyphs[name]) {
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", d); svg.append(path);
    }
    return svg;
  }
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function fact(parent, label, value) {
    const group = element("div");
    group.append(element("dt", label), element("dd", value)); parent.append(group);
  }
  function setAppearance(mode) {
    document.documentElement.dataset.kitMode = mode;
    byId("appearance").replaceChildren(icon(mode === "light" ? "moon" : "sun"));
    byId("appearance").setAttribute("aria-label", `Switch to ${mode === "light" ? "dark" : "light"} appearance`);
  }
  setAppearance(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  byId("appearance").addEventListener("click", () => setAppearance(document.documentElement.dataset.kitMode === "light" ? "dark" : "light"));
  byId("search-icon").append(icon("search"));
  byId("block-emblem").append(icon("blocks"));
  fact(byId("snapshot-facts"), "Blocks", String(catalog.items.length).padStart(2, "0"));
  fact(byId("snapshot-facts"), "Source files", String(new Set(catalog.items.flatMap(item => item.files.map(file => file.path))).size).padStart(2, "0"));
  fact(byId("snapshot-facts"), "Revision", catalog.items[0].meta.evenkit.sourceRevision.slice(0, 7));

  function renderLibrary() {
    const query = byId("search").value.trim().toLowerCase();
    const matches = catalog.items.filter(item => [item.name, item.title, item.description, ...item.meta.evenkit.inventoryIds].join(" ").toLowerCase().includes(query));
    byId("block-list").replaceChildren();
    for (const item of matches) {
      const button = element("button", undefined, "block-link");
      button.type = "button";
      button.setAttribute("aria-current", item.name === selected.name ? "true" : "false");
      const copy = element("span", undefined, "block-link-copy");
      copy.append(element("span", item.title, "block-link-title"), element("span", `${item.files.length} ${item.files.length === 1 ? "file" : "files"}`, "block-link-meta"));
      button.append(icon("blocks"), copy, icon("arrow"));
      button.addEventListener("click", () => {
        selected = item; selectedFile = 0; copyGeneration++;
        for (const candidate of byId("block-list").querySelectorAll("button")) candidate.setAttribute("aria-current", candidate === button ? "true" : "false");
        renderItem();
        if (window.matchMedia("(max-width: 768px)").matches) byId("block-heading").focus();
      });
      byId("block-list").append(button);
    }
    byId("item-count").textContent = matches.length;
    byId("empty").hidden = matches.length !== 0;
    byId("search-status").textContent = `${matches.length} ${matches.length === 1 ? "block" : "blocks"} found.`;
  }
  byId("search").addEventListener("input", renderLibrary);
  byId("clear-search").addEventListener("click", () => { byId("search").value = ""; renderLibrary(); byId("search").focus(); });

  function switchTab(name, focus = false) {
    for (const tab of ["overview", "source"]) {
      const active = tab === name;
      byId(`${tab}-tab`).setAttribute("aria-selected", String(active));
      byId(`${tab}-tab`).tabIndex = active ? 0 : -1;
      byId(`${tab}-panel`).hidden = !active;
    }
    if (focus) byId(`${name}-tab`).focus();
  }
  for (const [index, name] of ["overview", "source"].entries()) {
    byId(`${name}-tab`).addEventListener("click", () => switchTab(name));
    byId(`${name}-tab`).addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? "overview" : event.key === "End" ? "source" : ["source", "overview"][index];
      switchTab(next, true);
    });
  }
  function renderSource() {
    copyGeneration++;
    const file = selected.files[selectedFile];
    byId("source-file").value = String(selectedFile);
    byId("source-path").textContent = file.path;
    const lines = file.content.split("\n");
    const preview = lines.slice(0, 5000);
    byId("line-count").textContent = lines.length > preview.length ? `${preview.length} of ${lines.length} lines · Copy source for the complete file` : `${lines.length} lines`;
    byId("source-lines").replaceChildren(...preview.map(line => {
      const li = element("li"); li.append(element("code", line || " ")); return li;
    }));
    byId("code-scroll").scrollTop = 0;
    byId("source-copy-status").textContent = "";
    byId("source-fallback").hidden = true;
  }
  byId("source-file").addEventListener("change", () => { selectedFile = Number(byId("source-file").value); copyGeneration++; renderSource(); });

  function renderItem() {
    byId("item-name").textContent = selected.name;
    byId("block-heading").textContent = selected.title;
    byId("item-description").textContent = selected.description;
    byId("file-count").textContent = selected.files.length;
    byId("file-list").replaceChildren();
    byId("source-file").replaceChildren();
    for (const [index, file] of selected.files.entries()) {
      const row = element("button", undefined, "file-row"); row.type = "button";
      const info = element("span", undefined, "file-info");
      info.append(element("span", file.target, "mono"), element("span", "Editable source", "muted"));
      row.append(icon("file"), info, icon("arrow"));
      row.addEventListener("click", () => { selectedFile = index; renderSource(); switchTab("source", true); });
      byId("file-list").append(row);
      const option = element("option", file.target); option.value = String(index); byId("source-file").append(option);
    }
    byId("dependencies").replaceChildren();
    for (const dependency of selected.meta.evenkit.dependencies) {
      const row = element("li");
      const name = element("span", undefined, "dependency-name"); name.append(element("code", dependency.name));
      if (dependency.distribution === "private") name.append(element("span", "Private", "private-badge"));
      row.append(name, element("code", dependency.range, "muted")); byId("dependencies").append(row);
    }
    byId("revision-short").textContent = selected.meta.evenkit.sourceRevision.slice(0, 7);
    byId("provenance-details").replaceChildren();
    fact(byId("provenance-details"), "Snapshot revision", selected.meta.evenkit.sourceRevision);
    fact(byId("provenance-details"), "Source license", selected.meta.evenkit.license);
    fact(byId("provenance-details"), "Inventory", selected.meta.evenkit.inventoryIds.join(" / "));
    for (const file of selected.meta.evenkit.files) fact(byId("provenance-details"), file.target, `SHA-256 ${file.sha256} · Source revision ${file.sourceRevision}`);
    byId("provenance-details").parentElement.open = false;
    renderSource(); switchTab("overview"); updateCommand();
  }

  function updateCommand() {
    copyGeneration++;
    byId("command-status").textContent = "";
    byId("consumer").removeAttribute("aria-invalid");
    byId("directory").removeAttribute("aria-invalid");
    byId("command-hint").classList.remove("error");
    if (!byId("consumer").value.trim()) {
      byId("install-command").value = "Your dry-run command will appear here.";
      byId("copy-command").disabled = true;
      byId("command-hint").textContent = "Enter your application directory to prepare the command.";
      return;
    }
    try {
      byId("install-command").value = makeInstallCommand({ cliPath: data.cliPath, registry: data.registry, consumer: byId("consumer").value, directory: byId("directory").value, names: [selected.name] });
      byId("copy-command").disabled = false;
      byId("command-hint").textContent = "Run this in your terminal to check files and dependencies before installing.";
    } catch (error) {
      byId("install-command").value = "Correct the path to prepare your command.";
      byId("copy-command").disabled = true;
      byId("command-hint").textContent = error.message;
      byId("command-hint").classList.add("error");
      byId(error.message.includes("relative path") ? "directory" : "consumer").setAttribute("aria-invalid", "true");
    }
  }
  for (const id of ["consumer", "directory"]) byId(id).addEventListener("input", updateCommand);
  async function copy(text, statusId, selectFallback) {
    const generation = copyGeneration;
    try {
      await navigator.clipboard.writeText(text);
      if (generation === copyGeneration) byId(statusId).textContent = "Copied to clipboard.";
    } catch {
      if (generation !== copyGeneration) return;
      selectFallback(); byId(statusId).textContent = "Clipboard unavailable. Text selected; press Ctrl+C or ⌘C to copy.";
    }
  }
  byId("copy-command").addEventListener("click", () => copy(byId("install-command").value, "command-status", () => { byId("install-command").focus(); byId("install-command").select(); }));
  byId("copy-source").addEventListener("click", () => copy(selected.files[selectedFile].content, "source-copy-status", () => {
    const fallback = byId("source-fallback");
    fallback.hidden = false; fallback.value = selected.files[selectedFile].content;
    fallback.focus(); fallback.select();
  }));
  renderLibrary(); renderItem();
}
