// Geçici yer tutucu — Görev 9'da (Kaydet ve dinle) tam mantıkla değiştirilecek.
import { store } from "../core/store";
import { getUnit } from "../core/content";

export function renderRecord(root: HTMLElement, unitId: string): void {
  const unit = getUnit(unitId);
  root.innerHTML = `<p style="color:#fff;">Kaydet ve dinle — ${unit?.titleEn ?? unitId} (yakında)</p>
    <button id="next">İleri</button>`;
  root.querySelector<HTMLButtonElement>("#next")?.addEventListener("click", () => {
    store.navigate({ name: "closing" });
  });
}
