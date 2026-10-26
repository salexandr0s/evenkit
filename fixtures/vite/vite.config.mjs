import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  build: {
    outDir: mode === "minimal" ? "dist-minimal" : "dist",
    manifest: true,
    rolldownOptions: { input: mode === "minimal" ? "minimal.html" : "index.html" },
  },
  plugins: [{
    name: "packed-consumer-module-report",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter(chunk => chunk.type === "chunk").map(chunk => ({
        file: chunk.fileName,
        entry: chunk.isEntry,
        imports: chunk.imports,
        dynamicImports: chunk.dynamicImports,
        modules: Object.keys(chunk.modules).map(id => id.replaceAll("\\", "/")),
      }));
      this.emitFile({ type: "asset", fileName: "bundle-modules.json", source: JSON.stringify(chunks, null, 2) });
    },
  }],
}));
