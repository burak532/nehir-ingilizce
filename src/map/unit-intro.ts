import { store } from "../core/store";
import { getUnit } from "../core/content";

export function renderUnitIntro(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  if (!unit) {
    root.innerHTML = `<p>Ünite bulunamadı: ${unitId}</p>`;
    return;
  }

  root.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; color:#fff; text-align:center;">
      <h1>${unit.titleEn}</h1>
      <button id="continue" style="
        font-size:1.5rem; padding:1.25rem 2.5rem; border-radius:9999px; min-height:80px;
        background:#ffb703; color:#1a1a1a;
      ">Başla ▶</button>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("#continue")?.addEventListener("click", () => {
    const firstGame = unit.games[0];
    store.navigate({ name: "game", unitId: unit.id, gameType: firstGame });
  });
}
