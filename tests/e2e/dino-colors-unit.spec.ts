import { expect, test } from "@playwright/test";
import { advanceUntil } from "./helpers";

/**
 * Dino Colors ünitesi: dinle-dokun + sürükle-bırak (gerçek dokunmatik sürükleme,
 * tıklama değil) + kaydet-dinle. Sürükle-bırak'ta doğru dinozoru belirlemek için
 * her tur başında fetch edilen "put-in-nest-<renk>.mp3" ses isteğini dinleyip
 * oradan doğru kelimeyi çıkarıyoruz (bkz. src/games/drag-drop.ts).
 */
test("Dino Colors ünitesi: dinle-dokun + gerçek sürükle-bırak + kaydet-dinle", async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto("/");
  await page.locator("#start-button").click();

  const dinoCard = page.locator('button[data-unit="02-dino-colors"]');
  await dinoCard.click();
  await page.locator("#continue").click();
  await expect(page.locator("#skip")).toBeVisible();
  await page.locator("#skip").click();

  // Dinle-dokun (8 kelime)
  await expect(page.locator("#continue")).toBeVisible({ timeout: 10_000 });
  await page.locator("#continue").click();
  await advanceUntil(page, { clickSelector: "button[data-word]", untilSelector: "#continue" });

  // Sürükle-bırak (yuva) — 8 tur, her turda gerçek sürükleme
  let requestPromise = page.waitForRequest(/put-in-nest-[a-z]+\.mp3/, { timeout: 15_000 });
  await page.locator("#continue").click();

  for (let i = 0; i < 8; i += 1) {
    const req = await requestPromise;
    const match = req.url().match(/put-in-nest-([a-z]+)\.mp3/);
    expect(match).not.toBeNull();
    const correctId = match![1];

    const isLastRound = i === 7;
    if (!isLastRound) {
      requestPromise = page.waitForRequest(/put-in-nest-[a-z]+\.mp3/, { timeout: 15_000 });
    }

    const draggable = page.locator(`button[data-word="${correctId}"]`);
    await expect(draggable).toBeVisible({ timeout: 10_000 });
    const nest = page.locator("#nest");

    const dBox = await draggable.boundingBox();
    const nBox = await nest.boundingBox();
    if (!dBox || !nBox) throw new Error("sürükle-bırak elemanlarının konumu alınamadı");

    await page.mouse.move(dBox.x + dBox.width / 2, dBox.y + dBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(nBox.x + nBox.width / 2, nBox.y + nBox.height / 2, { steps: 15 });
    await page.mouse.up();
  }

  // Kaydet-dinle (8 kelime)
  await expect(page.locator("#continue")).toBeVisible({ timeout: 10_000 });
  await page.locator("#continue").click();
  await advanceUntil(page, { clickSelector: "#next", untilSelector: "#back-to-map" });

  await page.locator("#back-to-map").click();
  await expect(dinoCard).toContainText(/\/8 kelime/);
});
