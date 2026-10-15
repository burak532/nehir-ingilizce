import type { GameType } from "./content";
import { getSettings, updateSettings } from "../data/repository";
import type { SettingsRecord } from "../data/types";

/**
 * Oyun tipi başına Türkçe "nasıl oynanır" açıklaması (curriculum.md §8):
 * aynı oyun tipi `turkishFadeThresholdPlays` kez tamamlanana kadar gösterilir, sonra kalkar.
 */
const INSTRUCTIONS_TR: Record<GameType, string> = {
  "listen-touch": "Dinle, sonra duyduğun kelimeye uyan resme dokun!",
  tpr: "Komutu dinle, hareketi yap, sonra 'Yaptım!' butonuna bas.",
  "drag-drop": "Doğru olanı parmağınla sürükleyip yuvaya bırak!",
  record: "Önce dinle, sonra mikrofona basıp kendi sesini kaydet."
};

export async function shouldShowGameIntro(
  gameType: GameType
): Promise<{ show: boolean; settings: SettingsRecord }> {
  const settings = await getSettings();
  if (settings.turkishSupportLevel === "off") {
    return { show: false, settings };
  }
  const count = settings.gamePlaysCount[gameType] ?? 0;
  return { show: count < settings.turkishFadeThresholdPlays, settings };
}

export async function recordGamePlayed(gameType: GameType): Promise<void> {
  const settings = await getSettings();
  const current = settings.gamePlaysCount[gameType] ?? 0;
  await updateSettings({
    gamePlaysCount: { ...settings.gamePlaysCount, [gameType]: current + 1 }
  });
}

export function renderGameIntroOverlay(
  root: HTMLElement,
  gameType: GameType,
  onContinue: () => void
): void {
  root.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#2a3d66; color:#fff; text-align:center; padding:1rem;">
      <p lang="tr" style="font-size:1.4rem; max-width:28rem; margin:0;">${INSTRUCTIONS_TR[gameType]}</p>
      <button id="continue" style="font-size:1.5rem; padding:1.25rem 2.5rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px;">Başla ▶</button>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("#continue")?.addEventListener("click", onContinue);
}
