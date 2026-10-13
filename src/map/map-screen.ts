import { store } from "../core/store";
import { units } from "../core/content";
import { imagePath } from "../core/image-path";
import { getAllWordProgress } from "../data/repository";
import { isLearned } from "../core/spaced-repetition";
import { attachParentGate } from "../parent/parent-gate";

export function renderMapScreen(root: HTMLElement): void {
  root.innerHTML = `
    <div style="position:relative; height:100%; background:linear-gradient(#bde0fe,#a9d6a1); overflow:hidden;">
      <h1 style="text-align:center; color:#1a1a1a; margin:1rem 0;">Dino Ada 🏝️</h1>
      <div id="unit-cards" style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center; padding:1rem;"></div>
      <button id="parent-gate" aria-label="Ebeveyn alanı" style="
        position:absolute; top:12px; right:12px; width:56px; height:56px; border-radius:9999px;
        background:rgba(0,0,0,0.25); color:#fff; font-size:1.5rem;
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

  container.innerHTML = units
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

  container.querySelectorAll<HTMLButtonElement>("button[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unitId = btn.dataset.unit!;
      store.navigate({ name: "unit-intro", unitId });
    });
  });
}
