import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runnerImport, type Plugin } from "vite";
import { z } from "zod";
import type { CatalogEntry } from "../src/catalog-types.js";

// Builds /llms.txt and /llms-full.txt from the agent guide, the catalog entries
// and the registry block metadata, so the published lists stay in sync.

const siteUrl = "https://evenkit.dev";
const guidePath = fileURLToPath(new URL("./guide.md", import.meta.url));
const metadataDir = fileURLToPath(new URL("../../../registry/metadata/", import.meta.url));
const catalogPath = fileURLToPath(new URL("../src/catalog-data.ts", import.meta.url));
type Catalog = Pick<typeof import("../src/catalog-data.js"), "entries" | "groups">;

const blockSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  inventoryIds: z.array(z.string()),
  files: z.array(z.object({ target: z.string() })),
});
type Block = z.infer<typeof blockSchema>;

function metadataPaths() {
  return readdirSync(metadataDir)
    .filter(file => file.endsWith(".json"))
    .sort()
    .map(file => join(metadataDir, file));
}

function entryUrl(entry: CatalogEntry) {
  return `${siteUrl}/#${entry.id}`;
}

function blocksFor(entry: CatalogEntry, blocks: readonly Block[]) {
  const ids = entry.inventoryIds ?? [];
  return blocks.filter(block => block.inventoryIds.some(id => ids.includes(id)));
}

function entryNotes(entry: CatalogEntry, blocks: readonly Block[]) {
  const notes = [];
  if (entry.inventoryIds?.length) notes.push(`Inventory ${entry.inventoryIds.join(", ")}.`);
  const owned = blocksFor(entry, blocks);
  if (owned.length) {
    const label = owned.length === 1 ? "Editable block" : "Editable blocks";
    notes.push(`${label}: ${owned.map(block => `\`${block.name}\``).join(", ")}.`);
  }
  return notes.join(" ");
}

function fence(code: string) {
  const longest = Math.max(0, ...[...code.matchAll(/`+/g)].map(match => match[0].length));
  return "`".repeat(Math.max(3, longest + 1));
}

function blockSection(blocks: readonly Block[]) {
  const lines = blocks.map(block => {
    const files = block.files.map(file => `\`${file.target}\``).join(", ");
    return `- \`${block.name}\` (${block.inventoryIds.join(", ")}): ${block.description} Installs ${files}.`;
  });
  return `## Block names\n\nPass these names to the registry CLI \`install\`, \`diff\` and \`upgrade\` commands.\n\n${lines.join("\n")}`;
}

function indexSections({ entries, groups }: Catalog, blocks: readonly Block[]) {
  return groups.map(group => {
    const lines = entries.filter(entry => entry.group === group).map(entry => {
      const notes = entryNotes(entry, blocks);
      return `- [${entry.name}](${entryUrl(entry)}): ${entry.description}${notes ? ` ${notes}` : ""}`;
    });
    return `## ${group}\n\n${lines.join("\n")}`;
  });
}

function fullSections({ entries, groups }: Catalog, blocks: readonly Block[]) {
  return groups.map(group => {
    const items = entries.filter(entry => entry.group === group).map(entry => {
      const notes = entryNotes(entry, blocks);
      const marker = fence(entry.usage);
      return [
        `### ${entry.name}`,
        `Catalog: ${entryUrl(entry)}`,
        `${entry.description}${notes ? ` ${notes}` : ""}`,
        `${marker}tsx\n${entry.usage.trimEnd()}\n${marker}`,
      ].join("\n\n");
    });
    return `## ${group}\n\n${items.join("\n\n")}`;
  });
}

function renderLlmsIndex(catalog: Catalog, blocks: readonly Block[], guide: string) {
  const optional = `## Optional\n\n- [Full reference](${siteUrl}/llms-full.txt): this guide plus the usage example for each of the ${catalog.entries.length} catalog entries.`;
  return [guide, blockSection(blocks), ...indexSections(catalog, blocks), optional].join("\n\n") + "\n";
}

function renderLlmsFull(catalog: Catalog, blocks: readonly Block[], guide: string) {
  return [guide, blockSection(blocks), ...fullSections(catalog, blocks)].join("\n\n") + "\n";
}

async function renderFiles() {
  // A fresh runner also reloads transitive catalog imports during build --watch.
  const { module: catalog, dependencies } = await runnerImport<Catalog>(catalogPath, { logLevel: "silent" });
  const paths = metadataPaths();
  const blocks = paths.map(path => blockSchema.parse(JSON.parse(readFileSync(path, "utf8"))));
  const guide = readFileSync(guidePath, "utf8").trimEnd();
  return {
    files: {
      "/llms.txt": renderLlmsIndex(catalog, blocks, guide),
      "/llms-full.txt": renderLlmsFull(catalog, blocks, guide),
    },
    dependencies: [catalogPath, ...dependencies, guidePath, metadataDir, ...paths],
  };
}

export function llmsFiles(): Plugin {
  return {
    name: "evenkit-llms-files",
    buildStart() {
      // Keep watching after an initial parse failure so a correction can rebuild.
      for (const path of [catalogPath, guidePath, metadataDir, ...metadataPaths()]) this.addWatchFile(path);
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0];
        if (path !== "/llms.txt" && path !== "/llms-full.txt") return next();
        if (request.method !== "GET" && request.method !== "HEAD") {
          response.statusCode = 405;
          response.setHeader("Allow", "GET, HEAD");
          response.end();
          return;
        }
        try {
          const { files } = await renderFiles();
          const content = files[path];
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.setHeader("Content-Length", Buffer.byteLength(content));
          response.setHeader("Cache-Control", "no-cache");
          response.end(request.method === "HEAD" ? undefined : content);
        } catch (error) {
          next(error);
        }
      });
    },
    async generateBundle() {
      const { files, dependencies } = await renderFiles();
      for (const path of dependencies) this.addWatchFile(path);
      for (const [path, source] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName: path.slice(1), source });
      }
    },
  };
}
