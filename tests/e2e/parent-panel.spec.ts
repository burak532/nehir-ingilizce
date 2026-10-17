import { expect, test, type Page } from "@playwright/test";

/** Ebeveyn kilidi: 3 saniye basılı tutma gerektirir (bkz. src/parent/parent-gate.ts). */
async function longPressParentGate(page: Page): Promise<void> {
  const gate = page.locator("#parent-gate");
  const box = await gate.boundingBox();
  if (!box) throw new Error("#parent-gate konumu alınamadı");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
}

test("ebeveyn kilidi kısa dokunuşta açılmaz, 3sn basılı tutmada açılır", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-button").click();
  await expect(page.locator("#parent-gate")).toBeVisible();

  await page.locator("#parent-gate").click();
  await page.waitForTimeout(600);
  await expect(page.locator("#turkish-level")).toHaveCount(0);

  await longPressParentGate(page);
  await expect(page.locator("#turkish-level")).toBeVisible({ timeout: 5000 });
});

test("Türkçe destek düzeyi sadece Açık/Kapalı, ayar kalıcı, azalma eşiği alanı kaldırıldı", async ({
  page
}) => {
  await page.goto("/");
  await page.locator("#start-button").click();
  await longPressParentGate(page);

  const options = await page.locator("#turkish-level option").allTextContents();
  expect(options).toEqual(["Açık", "Kapalı (sadece İngilizce)"]);
  await expect(page.locator("#fade-threshold")).toHaveCount(0);

  await page.locator("#turkish-level").selectOption("off");
  await page.locator("#close-panel").click();

  await longPressParentGate(page);
  await expect(page.locator("#turkish-level")).toHaveValue("off");
});
