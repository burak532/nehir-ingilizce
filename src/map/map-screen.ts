// Geçici yer tutucu — Görev 5'te (Harita ekranı) tam harita UI'si ile değiştirilecek.
import { store } from "../core/store";
import { units } from "../core/content";

export function renderMapScreen(root: HTMLElement): void {
  const items = units
    .map(
      (unit) => `<button data-unit="${unit.id}" style="
        font-size:1.5rem; padding:1rem 2rem; border-radius:1rem; min-height:80px;
        background:#90be6d; color:#1a1a1a;
      ">${unit.titleEn}</button>`
    )
    .join("");

  root.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1.5rem; color:#fff;">
      <h1>Dino Ada 🏝️</h1>
      <div style="display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;">${items}</div>
    </div>
  `;

  root.querySelectorAll<HTMLButtonElement>("button[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unitId = btn.dataset.unit!;
      store.navigate({ name: "unit-intro", unitId });
    });
  });
}
