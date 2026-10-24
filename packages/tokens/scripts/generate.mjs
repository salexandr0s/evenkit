import { writeFile } from "node:fs/promises";
import { generateCss, tokenDocument } from "../dist/index.js";

await Promise.all([
  writeFile(new URL("../dist/tokens.css", import.meta.url), generateCss()),
  writeFile(new URL("../dist/tokens-css.d.ts", import.meta.url), "export {};\n"),
  writeFile(new URL("../dist/tokens.json", import.meta.url), `${JSON.stringify(tokenDocument, null, 2)}\n`),
]);
