import { mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
const sources = [
  "icons.css", "styles.css", "tooltip.css", "admin-shell.css", "data-table.css", "chat.css",
  "foundations.css", "selection-controls.css", "form-controls.css", "navigation.css", "overlays.css", "data-workflows.css",
  "date-controls.css",
  "multi-value.css", "number-field.css", "table-controls.css", "activity-timeline.css", "workspace-settings.css",
  "upload-queue.css", "image.css", "command-palette.css", "step-indicator.css",
  "chart.css", "statistic.css", "reporting.css",
];
const styles = await Promise.all(sources.map(file => readFile(new URL(`../src/${file}`, import.meta.url), "utf8")));
await writeFile(new URL("../dist/styles.css", import.meta.url), styles.join("\n"));
await writeFile(new URL("../dist/styles.d.ts", import.meta.url), "export {};\n");
