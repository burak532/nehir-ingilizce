import { store } from "../core/store";
import { getUnit } from "../core/content";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { nextAfterGame } from "../core/game-flow";
import type { Cleanup } from "../core/router";
import { recordGamePlayed, renderGameIntroOverlay, shouldShowGameIntro } from "../core/game-intro";

/**
 * Kaydet ve dinle: model ses önce çalar, çocuk mikrofona kaydeder, iki ses arka arkaya çalınır.
 * Puanlama/konuşma tanıma YOK (bkz. curriculum.md §9). İzin reddedilirse bu adım sessizce
 * atlanır — çocuk takılmaz (docs/technical-plan.md §8).
 */
export function renderRecord(root: HTMLElement, unitId: string): Cleanup {
  const unit = getUnit(unitId);
  if (!unit) {
    root.innerHTML = `<p style="color:#fff;">Ünite bulunamadı: ${unitId}</p>`;
    return;
  }

  const words = unit.words;
  let wordIndex = 0;
  let stream: MediaStream | null = null;
  let micAvailable = true;
  let activeRecorder: MediaRecorder | null = null;
  let recordedUrl: string | null = null;

  void audioManager.preload(words.map((w) => w.audioEn));
  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  function isStillActive(): boolean {
    const current = store.getState().screen;
    return current.name === "game" && current.unitId === unitId && current.gameType === "record";
  }

  function releaseRecordedUrl(): void {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      recordedUrl = null;
    }
  }

  async function ensureMicPermission(): Promise<void> {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      // İzin reddedildi/mikrofon yok — kaydet-dinle adımını sessizce atla.
      micAvailable = false;
      stream = null;
    }
  }

  function renderWord(): void {
    if (wordIndex >= words.length) {
      void recordGamePlayed("record");
      store.navigate(nextAfterGame(unitId, "record"));
      return;
    }

    const word = words[wordIndex];
    releaseRecordedUrl();

    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#5a3e8b; color:#fff; text-align:center;">
        <img src="${imagePath(word.image)}" style="width:150px; height:150px;" alt=""/>
        <h2 style="margin:0;">${word.en}</h2>
        <button id="play-model" style="font-size:1.25rem; padding:1rem 2rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:80px;">🔊 Dinle</button>
        ${
          micAvailable
            ? `<button id="record-btn" style="font-size:1.25rem; padding:1rem 2rem; border-radius:9999px; background:#e76f51; min-height:80px;">🎤 Kaydet</button>`
            : ""
        }
        <button id="next" style="font-size:1.1rem; padding:0.75rem 1.5rem; border-radius:9999px; background:#8ecae6; color:#1a1a1a; min-height:70px;">İleri ▶</button>
      </div>
    `;

    const playModel = () => audioManager.play(word.audioEn);
    root.querySelector<HTMLButtonElement>("#play-model")?.addEventListener("click", playModel);
    playModel();

    if (micAvailable) {
      const recordBtn = root.querySelector<HTMLButtonElement>("#record-btn")!;
      recordBtn.addEventListener("click", () => {
        if (!stream) return;

        if (activeRecorder && activeRecorder.state === "recording") {
          activeRecorder.stop();
          return;
        }

        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(stream);
        activeRecorder = recorder;
        const usedMimeType = recorder.mimeType || "audio/mp4";

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };

        recorder.onstop = () => {
          releaseRecordedUrl();
          const blob = new Blob(chunks, { type: usedMimeType });
          recordedUrl = URL.createObjectURL(blob);
          recordBtn.textContent = "🎤 Tekrar kaydet";

          playModel();
          window.setTimeout(() => {
            if (!isStillActive() || !recordedUrl) return;
            const playback = new Audio(recordedUrl);
            void playback.play();
          }, 900);
        };

        recorder.start();
        recordBtn.textContent = "⏹ Durdur";
        window.setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 4000);
      });
    }

    root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
      wordIndex += 1;
      renderWord();
    });
  }

  void Promise.all([ensureMicPermission(), shouldShowGameIntro("record")]).then(
    ([, { show }]) => {
      if (!isStillActive()) return;
      if (show) {
        renderGameIntroOverlay(root, "record", renderWord);
      } else {
        renderWord();
      }
    }
  );

  return () => {
    stream?.getTracks().forEach((track) => track.stop());
    releaseRecordedUrl();
  };
}
