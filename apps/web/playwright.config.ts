import { defineConfig, devices } from "@playwright/test";

const workerHealth = process.env.WORKER_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.CI
    ? undefined
    : [
        {
          command:
            "cd ../worker && PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000",
          url: `${workerHealth}/health`,
          reuseExistingServer: true,
          timeout: 120_000,
        },
        {
          command: "pnpm dev",
          url: "http://localhost:3000",
          reuseExistingServer: true,
          env: { WORKER_URL: workerHealth },
        },
      ],
});
