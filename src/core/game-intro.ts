import type { GameType } from "./content";
import { getSettings } from "../data/repository";
import type { SettingsRecord } from "../data/types";

/**
 * Oyun tipi başına Türkçe "nasıl oynanır" açıklaması (curriculum.md §8):
 * Türkçe destek açıkken bu oyun tipine her girişte gösterilir (tek dokunuşla
 * "Başla" ile geçilir) — ebeveyn panelinden tamamen kapatılabilir.
 */
const INSTRUCTIONS_TR: Record<GameType, string> = {
  "listen-touch": "Dinle, sonra duyduğun kelimeye uyan resme dokun!",
  tpr: "Komutu dinle, hareketi yap, sonra 'Yaptım!' butonuna bas.",
  "drag-drop": "Doğru olanı parmağınla sürükle, hedefe bırak!",
  record: "Önce dinle, sonra mikrofona basıp kendi sesini kaydet."
};

export async function shouldShowGameIntro(): Promise<{
  show: boolean;
  settings: SettingsRecord;
}> {
  const settings = await getSettings();
  return { show: settings.turkishSupportLevel !== "off", settings };
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
