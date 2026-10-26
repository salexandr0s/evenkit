import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.EVENKIT_ADMIN_PORT ?? "5496");
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("EVENKIT_ADMIN_PORT must be a port from 1024 to 65535.");

export default defineConfig({
  testDir: "./tests/admin",
  outputDir: ".artifacts/admin-browser-results",
  fullyParallel: false,
  timeout: 45_000,
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npm run start --workspace @evenkit/admin-starter -- --port ${port}`,
    url: `http://127.0.0.1:${port}/dashboard`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: { EVENKIT_AUTH_MODE: "demo", EVENKIT_APP_ORIGIN: `http://127.0.0.1:${port}`, NEXT_TELEMETRY_DISABLED: "1" },
  },
});
