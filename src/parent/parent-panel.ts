// Geçici yer tutucu — Görev 11'de (Ebeveyn paneli) tam UI ile değiştirilecek.
import { store } from "../core/store";

export function renderParentPanel(root: HTMLElement): void {
  root.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:1rem; color:#1a1a1a; background:#fff;">
      <h1>Ebeveyn Paneli</h1>
      <p>Yakında: süre ayarı, Türkçe destek düzeyi, kelime durumu, CSV dışa aktarma.</p>
      <button id="close-panel" style="font-size:1.25rem; padding:0.75rem 1.5rem;">Kapat</button>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("#close-panel")?.addEventListener("click", () => {
    store.navigate({ name: "map" });
  });
}
