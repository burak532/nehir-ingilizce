import { store } from "../core/store";
import { getUnit } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { applyTrialResult } from "../data/repository";
import { nextAfterGame, shuffle } from "../core/game-flow";
import { sessionId } from "../core/session";
import { todayIso } from "../core/date";

/**
 * Dinle ve dokun: kelime sesle söylenir, çocuk 2-4 görsel arasından doğrusuna dokunur.
 * Cezasız hata: yanlış dokunuşta ceza yok, doğru cevap nazikçe vurgulanır (bkz. curriculum.md §5).
 * Genelleme testi: her ikinci turda doğru cevap için öğretimde görülmeyen varyant görsel kullanılır
 * (curriculum.md §10).
 */
export function renderListenTouch(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  if (!unit) {
    root.innerHTML = `<p style="color:#fff;">Ünite bulunamadı: ${unitId}</p>`;
    return;
  }

  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  const words = unit.words;
  let wordIndex = 0;

  function isStillActive(): boolean {
    const current = store.getState().screen;
    return (
      current.name === "game" && current.unitId === unitId && current.gameType === "listen-touch"
    );
  }

  void audioManager.preload(words.map((w) => w.audioEn)).then(() => {
    if (isStillActive()) playRound();
  });

  function playRound(): void {
    if (wordIndex >= words.length) {
      store.navigate(nextAfterGame(unitId, "listen-touch"));
      return;
    }

    const correct = words[wordIndex];
    const distractorCount = Math.min(3, words.length - 1);
    const distractors = shuffle(words.filter((w) => w.id !== correct.id)).slice(
      0,
      distractorCount
    );
    const options = shuffle([correct, ...distractors]);
    const useNovelVariant = wordIndex % 2 === 1;
    const correctImage = useNovelVariant
      ? correct.imageVariants[1] ?? correct.image
      : correct.image;

    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:2rem; background:#2a3d66;">
        <button id="replay" style="font-size:1.5rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; min-height:80px;">🔊 Dinle</button>
        <div id="options" style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center;"></div>
      </div>
    `;

    const optionsEl = root.querySelector<HTMLDivElement>("#options")!;
    optionsEl.innerHTML = options
      .map((w) => {
        const img = w.id === correct.id ? correctImage : w.image;
        return `<button data-word="${w.id}" style="width:160px; height:160px; border-radius:1.5rem; background:#fff; padding:12px;">
          <img src="${imagePath(img)}" style="width:100%; height:100%;" alt=""/>
        </button>`;
      })
      .join("");

    const playWordAudio = () => audioManager.play(correct.audioEn);
    root.querySelector<HTMLButtonElement>("#replay")?.addEventListener("click", playWordAudio);
    playWordAudio();

    let answered = false;

    optionsEl.querySelectorAll<HTMLButtonElement>("button[data-word]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const isCorrect = btn.dataset.word === correct.id;

        void applyTrialResult({
          sessionId,
          date: todayIso(),
          unitId,
          wordId: correct.id,
          gameType: "listen-touch",
          imageVariant: useNovelVariant ? "novel" : "seen",
          correctFirstAttempt: isCorrect,
          distractorCount,
          attemptIndex: 1
        });

        if (isCorrect) {
          btn.style.outline = "6px solid #90be6d";
          window.setTimeout(() => {
            if (!isStillActive()) return;
            wordIndex += 1;
            playRound();
          }, 700);
        } else {
          btn.style.opacity = "0.4";
          const correctBtn = optionsEl.querySelector<HTMLButtonElement>(
            `button[data-word="${correct.id}"]`
          );
          if (correctBtn) correctBtn.style.outline = "6px solid #90be6d";
          window.setTimeout(playWordAudio, 150);
          window.setTimeout(() => {
            if (!isStillActive()) return;
            wordIndex += 1;
            playRound();
          }, 1400);
        }
      });
    });
  }
}
