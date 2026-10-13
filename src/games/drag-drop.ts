import { store } from "../core/store";
import { getUnit } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { applyTrialResult } from "../data/repository";
import { nextAfterGame, shuffle } from "../core/game-flow";
import { sessionId } from "../core/session";
import { todayIso } from "../core/date";

/**
 * Sürükle-bırak: "Put the {renk} one in the nest!" — çocuk doğru renkteki dinozoru
 * yuvaya sürükler (bkz. curriculum.md Bölüm 11, Pointer Events deseni — technical-plan.md §2).
 * Cezasız hata: yanlış dinozor bırakılırsa yerine geri döner, ceza yok.
 */
export function renderDragDrop(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  if (!unit) {
    root.innerHTML = `<p style="color:#fff;">Ünite bulunamadı: ${unitId}</p>`;
    return;
  }

  const words = unit.words;
  let wordIndex = 0;

  function isStillActive(): boolean {
    const current = store.getState().screen;
    return (
      current.name === "game" && current.unitId === unitId && current.gameType === "drag-drop"
    );
  }

  void audioManager.preload(words.map((w) => w.audioEn));

  function playRound(): void {
    if (wordIndex >= words.length) {
      store.navigate(nextAfterGame(unitId, "drag-drop"));
      return;
    }

    const correct = words[wordIndex];
    const distractorCount = Math.min(2, words.length - 1);
    const distractors = shuffle(words.filter((w) => w.id !== correct.id)).slice(
      0,
      distractorCount
    );
    const options = shuffle([correct, ...distractors]);

    root.innerHTML = `
      <div style="position:relative; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:2rem 0; background:#3a6b35;">
        <div id="draggables" style="display:flex; gap:2rem; justify-content:center;"></div>
        <div id="nest" style="
          width:180px; height:140px; border-radius:50% 50% 20% 20%; background:#8a5a2b;
          display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; text-align:center;
        ">Yuva</div>
        <button id="replay" style="font-size:1.25rem; padding:0.75rem 1.5rem; border-radius:9999px; background:#ffb703; min-height:70px;">🔊 Tekrar dinle</button>
      </div>
    `;

    const draggablesEl = root.querySelector<HTMLDivElement>("#draggables")!;
    const nestEl = root.querySelector<HTMLDivElement>("#nest")!;

    draggablesEl.innerHTML = options
      .map(
        (w) => `<button data-word="${w.id}" style="
          width:130px; height:130px; border-radius:1rem; background:#fff; padding:10px; touch-action:none;
        "><img src="${imagePath(w.image)}" style="width:100%; height:100%; pointer-events:none;" alt=""/></button>`
      )
      .join("");

    const instructionAudioPath = `en/02-dino-colors/put-in-nest-${correct.id}.mp3`;
    void audioManager.preload([instructionAudioPath]).then(() => {
      if (isStillActive()) audioManager.play(instructionAudioPath);
    });

    root.querySelector<HTMLButtonElement>("#replay")?.addEventListener("click", () => {
      audioManager.play(instructionAudioPath);
    });

    let answered = false;
    let firstDropRecorded = false;

    draggablesEl.querySelectorAll<HTMLButtonElement>("button[data-word]").forEach((el) => {
      attachDragHandlers(el, nestEl, (droppedOnNest) => {
        if (answered) return false;

        if (!firstDropRecorded) {
          firstDropRecorded = true;
          const isCorrect = el.dataset.word === correct.id && droppedOnNest;
          void applyTrialResult({
            sessionId,
            date: todayIso(),
            unitId,
            wordId: correct.id,
            gameType: "drag-drop",
            imageVariant: "seen",
            correctFirstAttempt: isCorrect,
            distractorCount,
            attemptIndex: 1
          });
        }

        const isCorrectDrop = droppedOnNest && el.dataset.word === correct.id;
        if (isCorrectDrop) {
          answered = true;
          el.style.outline = "6px solid #90be6d";
          window.setTimeout(() => {
            if (!isStillActive()) return;
            wordIndex += 1;
            playRound();
          }, 700);
        }
        return isCorrectDrop;
      });
    });
  }

  playRound();
}

function attachDragHandlers(
  el: HTMLElement,
  dropZone: HTMLElement,
  onDrop: (droppedOnZone: boolean) => boolean
): void {
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;

  el.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startY = event.clientY;
    el.setPointerCapture(event.pointerId);
    el.style.transition = "none";
    el.style.zIndex = "10";
  });

  el.addEventListener("pointermove", (event) => {
    if (!el.hasPointerCapture(event.pointerId)) return;
    dx = event.clientX - startX;
    dy = event.clientY - startY;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  el.addEventListener("pointerup", (event) => {
    if (!el.hasPointerCapture(event.pointerId)) return;
    el.releasePointerCapture(event.pointerId);

    const elRect = el.getBoundingClientRect();
    const zoneRect = dropZone.getBoundingClientRect();
    const elCenterX = elRect.left + elRect.width / 2;
    const elCenterY = elRect.top + elRect.height / 2;
    const droppedOnZone =
      elCenterX >= zoneRect.left &&
      elCenterX <= zoneRect.right &&
      elCenterY >= zoneRect.top &&
      elCenterY <= zoneRect.bottom;

    const shouldStayPlaced = onDrop(droppedOnZone);
    if (!shouldStayPlaced) {
      el.style.transition = "transform 0.3s ease";
      el.style.transform = "translate(0, 0)";
    }
  });
}
