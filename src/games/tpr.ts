import { store } from "../core/store";
import { audioManager } from "../audio/audio-manager";
import { nextAfterGame } from "../core/game-flow";

/**
 * TPR (Total Physical Response) molası: üniteler arası hareketli kısa bir ara
 * (bkz. curriculum.md §2, §6). Kelime ölçümü yapılmaz — bu bir hareket molasıdır,
 * oyunlaştırılmış pekiştirme değil.
 */
const TPR_COMMANDS = [
  { id: "wave", en: "Wave your hands!", emoji: "👋", audioEn: "en/shared/tpr-wave.mp3" },
  { id: "jump", en: "Jump up!", emoji: "⬆️", audioEn: "en/shared/tpr-jump.mp3" },
  { id: "spin", en: "Spin around!", emoji: "🔄", audioEn: "en/shared/tpr-spin.mp3" }
];

export function renderTpr(root: HTMLElement, unitId: string): void {
  let index = 0;

  void audioManager.preload(TPR_COMMANDS.map((c) => c.audioEn));

  function showCommand(): void {
    if (index >= TPR_COMMANDS.length) {
      store.navigate(nextAfterGame(unitId, "tpr"));
      return;
    }

    const command = TPR_COMMANDS[index];
    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:2rem; background:#4a7c3a; color:#fff; text-align:center;">
        <div style="font-size:6rem;">${command.emoji}</div>
        <h2 style="font-size:2rem; margin:0;">${command.en}</h2>
        <button id="done" style="font-size:1.5rem; padding:1.25rem 2.5rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:100px; min-width:100px;">Yaptım! ✅</button>
      </div>
    `;

    audioManager.play(command.audioEn);

    root.querySelector<HTMLButtonElement>("#done")?.addEventListener("click", () => {
      index += 1;
      showCommand();
    });
  }

  showCommand();
}
