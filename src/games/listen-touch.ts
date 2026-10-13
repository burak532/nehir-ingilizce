// Geçici yer tutucu — Görev 6'da (Dinle ve dokun) tam oyun mantığıyla değiştirilecek.
import { store } from "../core/store";
import { getUnit } from "../core/content";

export function renderListenTouch(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  root.innerHTML = `<p style="color:#fff;">Dinle ve dokun — ${unit?.titleEn ?? unitId} (yakında)</p>
    <button id="next">İleri</button>`;
  root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
    store.navigate({ name: "closing" });
  });
}
