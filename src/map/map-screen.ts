import { store } from "../core/store";
import { units } from "../core/content";
import { imagePath } from "../core/image-path";
import { getAllWordProgress } from "../data/repository";
import { isDue, isLearned } from "../core/spaced-repetition";
import { attachParentGate } from "../parent/parent-gate";

export function renderMapScreen(root: HTMLElement): void {
  root.innerHTML = `
    <div style="position:relative; height:100%; background:linear-gradient(#bde0fe,#a9d6a1); overflow:hidden;">
      <h1 style="text-align:center; color:#1a1a1a; margin:1rem 0;">Dino Ada 🏝️</h1>
      <div id="unit-cards" style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center; padding:1rem;"></div>
      <button id="parent-gate" aria-label="Ebeveyn alanı" style="
        position:absolute; top:calc(env(safe-area-inset-top, 0px) + 12px); right:calc(env(safe-area-inset-right, 0px) + 12px);
        width:56px; height:56px; border-radius:9999px;
        background:rgba(0,0,0,0.45); color:#fff; font-size:1.5rem;
        border:2px solid rgba(255,255,255,0.6); box-shadow:0 2px 6px rgba(0,0,0,0.3); z-index:10;
      ">⚙️</button>
    </div>
  `;

  const gateButton = root.querySelector<HTMLButtonElement>("#parent-gate")!;
  attachParentGate(gateButton, () => store.navigate({ name: "parent" }));

  renderUnitCards(root);
}

async function renderUnitCards(root: HTMLElement): Promise<void> {
  const container = root.querySelector<HTMLDivElement>("#unit-cards");
  if (!container) return;

  const progress = await getAllWordProgress();
  const dueCount = progress.filter((p) => isDue(p, new Date())).length;

  const unitCards = units
    .map((unit) => {
      const learnedCount = progress.filter(
        (p) => p.unitId === unit.id && isLearned(p)
      ).length;
      const thumbnail = unit.words[0]?.image;
      return `
        <button data-unit="${unit.id}" style="
          display:flex; flex-direction:column; align-items:center; gap:0.5rem;
          font-size:1.25rem; padding:1rem; border-radius:1.25rem; min-width:160px; min-height:160px;
          background:#ffffffcc; color:#1a1a1a;
        ">
          ${thumbnail ? `<img src="${imagePath(thumbnail)}" alt="" style="width:80px; height:80px;"/>` : ""}
          <span>${unit.titleEn}</span>
          <span style="font-size:0.9rem; color:#555;">${learnedCount}/${unit.words.length} kelime</span>
        </button>
      `;
    })
    .join("");

  const reviewCard = `
    <button id="review-card" style="
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem;
      font-size:1.25rem; padding:1rem; border-radius:1.25rem; min-width:160px; min-height:160px;
      background:#ffe8b3cc; color:#1a1a1a;
    ">
      <div style="font-size:2.5rem;">🔁</div>
      <span>Tekrar</span>
      <span style="font-size:0.9rem; color:#555;">${dueCount > 0 ? `${dueCount} kelime hazır` : "bugün hepsi taze"}</span>
    </button>
  `;

  container.innerHTML = unitCards + reviewCard;

  container.querySelectorAll<HTMLButtonElement>("button[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unitId = btn.dataset.unit!;
      store.navigate({ name: "unit-intro", unitId });
    });
  });

  container.querySelector<HTMLButtonElement>("#review-card")?.addEventListener("click", () => {
    store.navigate({ name: "review" });
  });
}
