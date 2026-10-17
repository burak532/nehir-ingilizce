import { store } from "../core/store";
import { units, getWord, type WordDef } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { applyTrialResult, getAllWordProgress, getSettings } from "../data/repository";
import { isDue } from "../core/spaced-repetition";
import { shuffle } from "../core/game-flow";
import { sessionId } from "../core/session";
import { todayIso } from "../core/date";
import { pickRandomPraisePath, PRAISE_AUDIO_PATHS } from "../core/praise";
import type { Cleanup } from "../core/router";

interface ReviewItem {
  unitId: string;
  word: WordDef;
}

/**
 * Tekrar (aralıklı hatırlama) ekranı (bkz. curriculum.md §3: "önceki ünitelerin
 * kelimeleri sonraki oyunlarda planlı biçimde geri gelsin... ayrı bir 'tekrar'
 * etkinliği olsun"). `spaced-repetition.ts`'deki isDue() ile vadesi gelen
 * kelimeler ünitelerarası karıştırılarak dinle-dokun ile aynı mekanikte sorulur.
 * Haritadan her zaman erişilebilir; vadesi gelen kelime yoksa nazik bir boş
 * durum ekranı gösterilir.
 */
export function renderReview(root: HTMLElement): Cleanup {
  let cancelled = false;
  let items: ReviewItem[] = [];
  let index = 0;
  let includeTurkish = false;

  function isStillActive(): boolean {
    return store.getState().screen.name === "review";
  }

  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  void Promise.all([getAllWordProgress(), getSettings()]).then(([progress, settings]) => {
    if (cancelled) return;
    const today = new Date();
    const due = progress.filter((p) => isDue(p, today));
    items = shuffle(
      due
        .map((p) => {
          const word = getWord(p.unitId, p.wordId);
          return word ? { unitId: p.unitId, word } : null;
        })
        .filter((x): x is ReviewItem => x !== null)
    );
    includeTurkish = settings.turkishSupportLevel !== "off";

    if (items.length === 0) {
      showEmptyState();
      return;
    }

    void audioManager
      .preload([...items.map((i) => i.word.audioEn), ...PRAISE_AUDIO_PATHS])
      .then(() => {
        if (!isStillActive()) return;
        if (includeTurkish) {
          showIntro();
        } else {
          playRound();
        }
      });
  });

  function showEmptyState(): void {
    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#4a5a8a; color:#fff; text-align:center; padding:1rem;">
        <div style="font-size:4rem;">🌱</div>
        <p lang="tr" style="font-size:1.4rem; max-width:28rem; margin:0;">Bugün tekrar edilecek kelime yok, hepsi taze!</p>
        <button id="back" style="font-size:1.25rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px;">Haritaya dön</button>
      </div>
    `;
    root.querySelector<HTMLButtonElement>("#back")?.addEventListener("click", () => {
      store.navigate({ name: "map" });
    });
  }

  function showIntro(): void {
    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#2a3d66; color:#fff; text-align:center; padding:1rem;">
        <p lang="tr" style="font-size:1.4rem; max-width:28rem; margin:0;">Hatırladığın kelimeleri tekrar deneyelim! Dinle, sonra doğru resme dokun.</p>
        <button id="continue" style="font-size:1.5rem; padding:1.25rem 2.5rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px;">Başla ▶</button>
      </div>
    `;
    root.querySelector<HTMLButtonElement>("#continue")?.addEventListener("click", playRound);
  }

  function playRound(): void {
    if (index >= items.length) {
      store.navigate({ name: "map" });
      return;
    }

    const correct = items[index];
    const pool: ReviewItem[] = units.flatMap((u) => u.words.map((word) => ({ unitId: u.id, word })));
    const distractorPool = pool.filter(
      (p) => !(p.word.id === correct.word.id && p.unitId === correct.unitId)
    );
    const distractorCount = Math.min(3, distractorPool.length);
    const distractors = shuffle(distractorPool).slice(0, distractorCount);
    const options = shuffle([correct, ...distractors]);

    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:2rem; background:#2a3d66;">
        <button id="replay" style="font-size:1.5rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; min-height:80px;">🔊 Dinle</button>
        <div id="options" style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center;"></div>
      </div>
    `;

    const optionsEl = root.querySelector<HTMLDivElement>("#options")!;
    optionsEl.innerHTML = options
      .map(
        (o) => `<button data-word="${o.word.id}" data-unit="${o.unitId}" style="width:160px; height:160px; border-radius:1.5rem; background:#fff; padding:12px;">
          <img src="${imagePath(o.word.image)}" style="width:100%; height:100%;" alt=""/>
        </button>`
      )
      .join("");

    const playWordAudio = () => audioManager.play(correct.word.audioEn);
    root.querySelector<HTMLButtonElement>("#replay")?.addEventListener("click", playWordAudio);
    playWordAudio();

    let answered = false;
    optionsEl.querySelectorAll<HTMLButtonElement>("button[data-word]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const isCorrect = btn.dataset.word === correct.word.id && btn.dataset.unit === correct.unitId;

        void applyTrialResult({
          sessionId,
          date: todayIso(),
          unitId: correct.unitId,
          wordId: correct.word.id,
          gameType: "listen-touch",
          imageVariant: "seen",
          correctFirstAttempt: isCorrect,
          distractorCount,
          attemptIndex: 1
        });

        if (isCorrect) {
          btn.style.outline = "6px solid #90be6d";
          btn.style.transition = "transform 0.25s ease";
          btn.style.transform = "scale(1.12)";
          audioManager.playSuccessChime();

          void (async () => {
            await new Promise((resolve) => window.setTimeout(resolve, 500));
            if (!isStillActive()) return;
            if (Math.random() < 0.35) {
              await audioManager.play(pickRandomPraisePath());
              if (!isStillActive()) return;
            }
            index += 1;
            playRound();
          })();
        } else {
          btn.style.opacity = "0.4";
          const correctBtn = optionsEl.querySelector<HTMLButtonElement>(
            `button[data-word="${correct.word.id}"][data-unit="${correct.unitId}"]`
          );
          if (correctBtn) {
            correctBtn.style.outline = "6px solid #90be6d";
            correctBtn.style.transition = "transform 0.25s ease";
            correctBtn.style.transform = "scale(1.08)";
          }
          audioManager.playGentleRetryTone();

          void (async () => {
            await new Promise((resolve) => window.setTimeout(resolve, 500));
            if (!isStillActive()) return;
            await audioManager.play(correct.word.audioEn);
            if (!isStillActive()) return;
            index += 1;
            playRound();
          })();
        }
      });
    });
  }

  return () => {
    cancelled = true;
  };
}
