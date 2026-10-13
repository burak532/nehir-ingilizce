// Geçici yer tutucu — Görev 7'de (TPR) tam oyun mantığıyla değiştirilecek.
import { store } from "../core/store";
import { getUnit } from "../core/content";

export function renderTpr(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  root.innerHTML = `<p style="color:#fff;">TPR molası — ${unit?.titleEn ?? unitId} (yakında)</p>
    <button id="next">İleri</button>`;
  root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
    store.navigate({ name: "closing" });
  });
}
