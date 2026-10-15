import { store } from "../core/store";
import { audioManager } from "../audio/audio-manager";
import { nextAfterGame } from "../core/game-flow";
import { recordGamePlayed, renderGameIntroOverlay, shouldShowGameIntro } from "../core/game-intro";

/**
 * TPR (Total Physical Response) molası: üniteler arası hareketli kısa bir ara
 * (bkz. curriculum.md §2, §6). Kelime ölçümü yapılmaz — bu bir hareket molasıdır,
 * oyunlaştırılmış pekiştirme değil.
 *
 * Komutlar ünite kelime dağarcığının parçası olmadığından tanıtma ekranında
 * (word-intro) hiç geçmiyor — bu yüzden Türkçe karşılıkları burada, oyun tipi
 * "nasıl oynanır" açıklamasıyla aynı azalan eşiğe göre (ilk birkaç kez) söylenir.
 */
const TPR_COMMANDS = [
  {
    id: "wave",
    en: "Wave your hands!",
    tr: "Ellerini salla!",
    emoji: "👋",
    audioEn: "en/shared/tpr-wave.mp3",
    audioTr: "tr/shared/tpr-wave-intro.mp3"
  },
  {
    id: "jump",
    en: "Jump up!",
    tr: "Zıpla!",
    emoji: "⬆️",
    audioEn: "en/shared/tpr-jump.mp3",
    audioTr: "tr/shared/tpr-jump-intro.mp3"
  },
  {
    id: "spin",
    en: "Spin around!",
    tr: "Dön!",
    emoji: "🔄",
    audioEn: "en/shared/tpr-spin.mp3",
    audioTr: "tr/shared/tpr-spin-intro.mp3"
  }
];

export function renderTpr(root: HTMLElement, unitId: string): void {
  let index = 0;
  let includeTurkish = false;

  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  function isStillActive(): boolean {
    const current = store.getState().screen;
    return current.name === "game" && current.unitId === unitId && current.gameType === "tpr";
  }

  void Promise.all([
    audioManager.preload([
      ...TPR_COMMANDS.map((c) => c.audioEn),
      ...TPR_COMMANDS.map((c) => c.audioTr)
    ]),
    shouldShowGameIntro("tpr")
  ]).then(([, { show }]) => {
    if (!isStillActive()) return;
    includeTurkish = show;
    if (show) {
      renderGameIntroOverlay(root, "tpr", () => void showCommand());
    } else {
      void showCommand();
    }
  });

  async function showCommand(): Promise<void> {
    if (index >= TPR_COMMANDS.length) {
      void recordGamePlayed("tpr");
      store.navigate(nextAfterGame(unitId, "tpr"));
      return;
    }

    const myIndex = index;
    const command = TPR_COMMANDS[myIndex];
    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#4a7c3a; color:#fff; text-align:center;">
        <div style="font-size:6rem;">${command.emoji}</div>
        ${includeTurkish ? `<p lang="tr" style="font-size:1.4rem; margin:0;">${command.tr}</p>` : ""}
        <h2 style="font-size:2rem; margin:0;">${command.en}</h2>
        <button id="done" style="font-size:1.5rem; padding:1.25rem 2.5rem; border-radius:9999px; background:#ffb703; color:#1a1a1a; min-height:100px; min-width:100px;">Yaptım! ✅</button>
      </div>
    `;

    root.querySelector<HTMLButtonElement>("#done")?.addEventListener("click", () => {
      index += 1;
      void showCommand();
    });

    if (includeTurkish) {
      await audioManager.play(command.audioTr);
      if (!isStillActive() || index !== myIndex) return;
    }
    await audioManager.play(command.audioEn);
  }
}
