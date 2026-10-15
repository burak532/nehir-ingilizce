import { store } from "../core/store";
import { getUnit, getUnitContentHash } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { getSettings, updateSettings } from "../data/repository";
import type { Cleanup } from "../core/router";

/**
 * Tanıtma adımı (curriculum.md §2): ünite ilk kez açıldığında her kelime için
 * Türkçe çerçeveleme cümlesi + İngilizce kelime gösterilir. Sonraki girişlerde
 * (settings.unitsIntroducedHash içerikle eşleşiyorsa) atlanır, doğrudan oyuna geçilir —
 * introTr/en içeriği değişirse hash de değişir, tanıtma otomatik tekrar gösterilir.
 *
 * Türkçe ses bitene kadar İngilizce ses başlamaz (sabit gecikme yerine
 * audioManager.play()'in bitişini bekleriz) — Türkçe sesler 3-5 saniye
 * sürebiliyor, sabit bir gecikme Türkçeyi yarıda keserdi (bkz. kullanıcı
 * geri bildirimi).
 */
export function renderWordIntro(root: HTMLElement, unitId: string): Cleanup {
  const unit = getUnit(unitId);
  if (!unit) {
    root.innerHTML = `<p style="color:#fff;">Ünite bulunamadı: ${unitId}</p>`;
    return;
  }

  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  let index = 0;
  let cancelled = false;

  const trAudioPaths = unit.words.map((w) => `tr/${unitId}/${w.id}-intro.mp3`);
  const enAudioPaths = unit.words.map((w) => w.audioEn);

  void Promise.all([
    audioManager.preload([...enAudioPaths, ...trAudioPaths]),
    getSettings()
  ]).then(([, settings]) => {
    if (cancelled) return;
    if (settings.turkishSupportLevel === "off") {
      void finish();
      return;
    }
    void showWord();
  });

  async function showWord(): Promise<void> {
    if (index >= unit!.words.length) {
      void finish();
      return;
    }

    const myIndex = index;
    const word = unit!.words[myIndex];
    const trAudio = `tr/${unitId}/${word.id}-intro.mp3`;

    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.25rem; background:#2a3d66; color:#fff; text-align:center; padding:1rem;">
        <img src="${imagePath(word.image)}" style="width:150px; height:150px;" alt=""/>
        <p lang="tr" style="font-size:1.3rem; max-width:32rem; margin:0;">${word.introTr}</p>
        <h2 style="font-size:2rem; margin:0;">${word.en}</h2>
        <button id="next" style="font-size:1.25rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px; min-width:80px;">İleri ▶</button>
      </div>
    `;

    root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
      index += 1;
      void showWord();
    });

    await audioManager.play(trAudio);
    if (cancelled || index !== myIndex) return;
    await audioManager.play(word.audioEn);
  }

  async function finish(): Promise<void> {
    const settings = await getSettings();
    await updateSettings({
      unitsIntroducedHash: {
        ...settings.unitsIntroducedHash,
        [unitId]: getUnitContentHash(unit!)
      }
    });
    if (!cancelled) {
      store.navigate({ name: "game", unitId, gameType: unit!.games[0] });
    }
  }

  return () => {
    cancelled = true;
  };
}
