import { store } from "../core/store";
import { audioManager } from "../audio/audio-manager";
import { imagePath } from "../core/image-path";
import { getUnit } from "../core/content";
import { nextAfterGame, shuffle } from "../core/game-flow";
import { renderGameIntroOverlay, shouldShowGameIntro } from "../core/game-intro";

interface TprCommand {
  id: string;
  en: string;
  tr: string;
  audioEn: string;
  audioTr: string;
  /** Ünite-bağımsız jenerik komutlarda kullanılır. */
  emoji?: string;
  /** Ünitenin kendi kelimesinden türetilen komutlarda, emoji yerine kelimenin kendi ikonu gösterilir. */
  image?: string;
}

/**
 * Ünite-bağımsız jenerik TPR komut havuzu — bir ünite kendi kelimelerini TPR
 * komutu olarak kullanmak istemezse (ör. kelimeleri fiziksel bir eyleme
 * doğal olarak karşılık gelmiyorsa, bkz. Hello!) bu havuza düşülür (bkz.
 * curriculum.md §2, §6). Her turda havuzdan rastgele 3 tanesi seçilir
 * (bkz. `pickGenericCommands`) — havuz büyüdükçe (bkz. content/shared/tpr.json)
 * mola kısa kalırken art arda oturumlarda tekrar çeşitleniyor.
 */
const GENERIC_COMMAND_POOL: TprCommand[] = [
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
  },
  {
    id: "clap",
    en: "Clap your hands!",
    tr: "Ellerini çırp!",
    emoji: "👏",
    audioEn: "en/shared/tpr-clap.mp3",
    audioTr: "tr/shared/tpr-clap-intro.mp3"
  },
  {
    id: "stomp",
    en: "Stomp your feet!",
    tr: "Ayaklarını yere vur!",
    emoji: "🦶",
    audioEn: "en/shared/tpr-stomp.mp3",
    audioTr: "tr/shared/tpr-stomp-intro.mp3"
  },
  {
    id: "freeze",
    en: "Freeze!",
    tr: "Dur!",
    emoji: "🛑",
    audioEn: "en/shared/tpr-freeze.mp3",
    audioTr: "tr/shared/tpr-freeze-intro.mp3"
  }
];

const GENERIC_COMMANDS_PER_ROUND = 3;

function pickGenericCommands(): TprCommand[] {
  return shuffle(GENERIC_COMMAND_POOL).slice(0, GENERIC_COMMANDS_PER_ROUND);
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Ünite kendi kelimelerini TPR komutu olarak sunmak için `chunks` içinde
 * `placement: "tpr"` + `template: true` + `tr`/`audioTr` tanımlayabilir
 * (bkz. CLAUDE.md İçerik/veri yapısı, örnek: Let's Move!, How Do You Feel?).
 * Tanımlanmamışsa jenerik havuza düşülür (ör. Hello! — "please"/"thank you"
 * gibi kelimeler tek bir fiziksel komut kalıbına doğal olarak uymuyor).
 */
function buildCommands(unitId: string): TprCommand[] {
  const unit = getUnit(unitId);
  const tprChunk = unit?.chunks.find(
    (c) => c.placement === "tpr" && c.template && c.tr && c.audioTr
  );
  if (!unit || !tprChunk) return pickGenericCommands();

  return unit.words.map((word) => ({
    id: word.id,
    en: capitalizeFirst(tprChunk.en.replace("{word}", word.en)),
    tr: capitalizeFirst(tprChunk.tr!.replace("{word}", word.tr)),
    audioEn: tprChunk.audioEn.replace("{wordId}", word.id),
    audioTr: tprChunk.audioTr!.replace("{wordId}", word.id),
    image: word.image
  }));
}

export function renderTpr(root: HTMLElement, unitId: string): void {
  const commands = buildCommands(unitId);
  let index = 0;
  let includeTurkish = false;

  root.innerHTML = `<p style="color:#fff; text-align:center; margin-top:2rem;">Yükleniyor...</p>`;

  function isStillActive(): boolean {
    const current = store.getState().screen;
    return current.name === "game" && current.unitId === unitId && current.gameType === "tpr";
  }

  void Promise.all([
    audioManager.preload([
      ...commands.map((c) => c.audioEn),
      ...commands.map((c) => c.audioTr)
    ]),
    shouldShowGameIntro()
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
    if (index >= commands.length) {
      store.navigate(nextAfterGame(unitId, "tpr"));
      return;
    }

    const myIndex = index;
    const command = commands[myIndex];
    const visual = command.image
      ? `<img src="${imagePath(command.image)}" style="width:140px; height:140px;" alt=""/>`
      : `<div style="font-size:6rem;">${command.emoji}</div>`;
    root.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; background:#4a7c3a; color:#fff; text-align:center;">
        ${visual}
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
