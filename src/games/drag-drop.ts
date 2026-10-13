// Geçici yer tutucu — Görev 8'de (Sürükle-bırak) tam oyun mantığıyla değiştirilecek.
import { store } from "../core/store";
import { getUnit } from "../core/content";

export function renderDragDrop(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  root.innerHTML = `<p style="color:#fff;">Sürükle-bırak — ${unit?.titleEn ?? unitId} (yakında)</p>
    <button id="next">İleri</button>`;
  root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
    store.navigate({ name: "closing" });
  });
}
