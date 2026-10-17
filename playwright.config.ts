import { defineConfig } from "@playwright/test";

/**
 * Uçtan uca testler yalnızca WebKit motorunda ve iPad Pro 12,9" (6. nesil)
 * yatay ekran boyutunda çalışır (bkz. ingilizce-uygulama-prompt.md §8,
 * CLAUDE.md "Cihaz"). `webServer`, her çalıştırmada production build'i
 * (`vite preview`) kullanır — service worker sadece production build'de var.
 */
const PORT = 4310;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: "webkit",
    viewport: { width: 1366, height: 1024 },
    hasTouch: true,
    trace: "retain-on-failure"
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
