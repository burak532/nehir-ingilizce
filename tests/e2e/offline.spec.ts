import { expect, test } from "@playwright/test";

/**
 * Zorunlu gereksinim (ingilizce-uygulama-prompt.md §4): ilk yüklemeden sonra
 * uygulama tamamen offline çalışmalı. İlk ziyarette service worker kurulur ama
 * sayfayı henüz kontrol etmez (clients.claim() çağrılmıyor — bkz. src/sw.ts);
 * bu yüzden SW'nin devreye girmesi için bir kez daha (hâlâ online) yüklüyoruz,
 * ardından ağı tamamen kapatıp üçüncü kez yüklüyoruz.
 */
test("ilk ziyaretten sonra uygulama ve sesler tamamen ağsız çalışır", async ({ page, context }) => {
  test.setTimeout(60_000);

  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, {
    timeout: 15_000
  });

  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page.locator("#start-button")).toBeVisible({ timeout: 10_000 });

    const audioOk = await page.evaluate(async () => {
      const res = await fetch("audio/en/01-hello/hello.mp3");
      return res.ok;
    });
    expect(audioOk).toBe(true);
  } finally {
    await context.setOffline(false);
  }
});
