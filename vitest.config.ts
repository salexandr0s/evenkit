import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["packages/**/*.test.ts", "tests/llms.test.ts"], passWithNoTests: false }
});
