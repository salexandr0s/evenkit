import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.KIT_CATALOG_PORT ?? "5291");
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error("KIT_CATALOG_PORT must be an integer from 1024 to 65535.");
}

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  timeout: 30_000,
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run preview --workspace @evenkit/catalog -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30_000
  }
});
