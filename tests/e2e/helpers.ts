import type { Page } from "@playwright/test";

/**
 * Oyun turları arasındaki gecikme sabit değil (ör. dinle-dokun'da ~%35 ihtimalle
 * ekstra övgü sesi çalınıyor — bkz. src/games/listen-touch.ts). Sabit bekleme yerine,
 * hedef ekran görünene kadar kısa aralıklarla "ilk görünen düğmeyi tıkla" döngüsü
 * kurmak daha güvenilir: zaten cevaplanmış bir turda tıklama sessizce yok sayılır
 * (`if (answered) return`), bu yüzden fazladan tıklamalar zararsızdır.
 */
export async function advanceUntil(
  page: Page,
  options: { clickSelector: string; untilSelector: string; maxIterations?: number; pollMs?: number }
): Promise<void> {
  const { clickSelector, untilSelector, maxIterations = 60, pollMs = 350 } = options;
  for (let i = 0; i < maxIterations; i += 1) {
    if (await page.locator(untilSelector).first().isVisible().catch(() => false)) {
      return;
    }
    const btn = page.locator(clickSelector).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ timeout: 2000 }).catch(() => undefined);
    }
    await page.waitForTimeout(pollMs);
  }
  throw new Error(`advanceUntil: "${untilSelector}" ${maxIterations} denemede görünmedi`);
}
