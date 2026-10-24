import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../src/styles.css", import.meta.url),
  new URL("../dist/styles.css", import.meta.url),
);
await writeFile(new URL("../dist/styles.d.ts", import.meta.url), "export {};\n");
