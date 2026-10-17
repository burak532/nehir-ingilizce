import { store } from "../core/store";
import { getUnit } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { getSettings } from "../data/repository";
import type { Cleanup } from "../core/router";

/**
 * Tanıtma adımı (curriculum.md §2): ünite haritadan her açıldığında her kelime için
 * Türkçe çerçeveleme cümlesi + İngilizce kelime gösterilir — bir kerelik değil, her
 * girişte (kullanıcı geri bildirimi: tekrar dinlemek isteyebiliyor). "Atla" düğmesi
 * istenirse doğrudan oyuna geçmeyi sağlar.
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
  const introChunk = unit.chunks.find((c) => c.placement === "intro");

  void Promise.all([
    audioManager.preload([...enAudioPaths, ...trAudioPaths, ...(introChunk ? [introChunk.audioEn] : [])]),
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
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.25rem; background:#2a3d66; color:#fff; text-align:center; padding:1rem;">
        <button id="skip" style="position:absolute; top:calc(env(safe-area-inset-top, 0px) + 12px); right:calc(env(safe-area-inset-right, 0px) + 12px); font-size:0.95rem; padding:0.6rem 1rem; border-radius:9999px; background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.5);">Atla ⏭</button>
        <img src="${imagePath(word.image)}" style="width:150px; height:150px;" alt=""/>
        <p lang="tr" style="font-size:1.3rem; max-width:32rem; margin:0;">${word.introTr}</p>
        <h2 style="font-size:2rem; margin:0;">${word.en}</h2>
        <button id="next" style="font-size:1.25rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px; min-width:80px;">İleri ▶</button>
      </div>
    `;

    let advanced = false;
    root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
      // Çift dokunma koruması (bkz. kullanılabilirlik denetimi) — hızlı art arda
      // tıklama bir kelimenin Türkçe/İngilizce sesini hiç duyurmadan atlamasın.
      if (advanced) return;
      advanced = true;
      index += 1;
      void showWord();
    });

    root.querySelector<HTMLButtonElement>("#skip")?.addEventListener("click", () => {
      void finish();
    });

    if (myIndex === 0 && introChunk) {
      await audioManager.play(introChunk.audioEn);
      if (cancelled || index !== myIndex) return;
    }

    await audioManager.play(trAudio);
    if (cancelled || index !== myIndex) return;
    await audioManager.play(word.audioEn);
  }

  async function finish(): Promise<void> {
    if (!cancelled) {
      store.navigate({ name: "game", unitId, gameType: unit!.games[0] });
    }
  }

  return () => {
    cancelled = true;
  };
}
