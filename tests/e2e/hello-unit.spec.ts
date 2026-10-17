import { expect, test } from "@playwright/test";
import { advanceUntil } from "./helpers";

/**
 * Ana akış (bkz. ingilizce-uygulama-prompt.md §8): açılış → harita → ünite → tanıtma
 * (atlanabilir) → her oyun tipi → kapanış → haritaya dönüş, ilerleme güncellenmiş olmalı.
 * Hello ünitesi oyunları: dinle-dokun, TPR, kaydet-dinle (sürükle-bırak yok).
 */
test("Hello ünitesi: baştan sona tüm oyunlar, ilerleme haritada görünür", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/");
  await page.locator("#start-button").click();

  const helloCard = page.locator('button[data-unit="01-hello"]');
  await expect(helloCard).toBeVisible();
  await helloCard.click();

  await page.locator("#continue").click(); // ünite tanıtma ekranı "Başla"

  // Kelime tanıtma ekranı: Türkçe cümle + "Atla" düğmesi
  await expect(page.locator("#skip")).toBeVisible();
  await page.locator("#skip").click();

  // Dinle-dokun: oyun başı Türkçe yönerge her zaman gösterilir (bkz. 9. tur)
  await expect(page.locator("#continue")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Dinle, sonra duyduğun kelimeye uyan resme dokun!")).toBeVisible();
  await page.locator("#continue").click();

  await advanceUntil(page, { clickSelector: "button[data-word]", untilSelector: "#continue" });

  // TPR
  await page.locator("#continue").click();
  await advanceUntil(page, { clickSelector: "#done", untilSelector: "#continue" });

  // Kaydet-dinle (mikrofon izni test ortamında verilmeyebilir — #next her zaman çalışmalı)
  await page.locator("#continue").click();
  await advanceUntil(page, { clickSelector: "#next", untilSelector: "#back-to-map" });

  // Kapanış
  await expect(page.getByText("Bye-bye! 👋")).toBeVisible();
  await page.locator("#back-to-map").click();

  await expect(helloCard).toContainText(/\/7 kelime/);
});
