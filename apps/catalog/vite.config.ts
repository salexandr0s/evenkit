import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { llmsFiles } from "./llms/llms-plugin.js";

export default defineConfig({
  plugins: [react(), llmsFiles()],
  server: { strictPort: true },
  preview: { strictPort: true },
  build: { sourcemap: true, manifest: true }
});
