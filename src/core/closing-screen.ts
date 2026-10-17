import { store } from "./store";
import { getUnit } from "./content";
import { audioManager } from "../audio/audio-manager";

export function renderClosingScreen(root: HTMLElement, unitId: string): void {
  const closingChunk = getUnit(unitId)?.chunks.find((c) => c.placement === "closing");
  if (closingChunk) {
    void audioManager.preload([closingChunk.audioEn]).then(() => {
      void audioManager.play(closingChunk.audioEn);
    });
  }

  root.innerHTML = `
    <div style="
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      height:100%; gap:1.5rem; color:#fff; text-align:center;
    ">
      <h1 style="font-size:2.5rem; margin:0;">Bye-bye! 👋</h1>
      <p style="font-size:1.5rem; margin:0;">See you tomorrow!</p>
      <button id="back-to-map" style="
        font-size:1.25rem; padding:1rem 2rem; border-radius:9999px;
        background:#8ecae6; color:#1a1a1a; min-width:80px; min-height:80px;
      ">Haritaya dön</button>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("#back-to-map")?.addEventListener("click", () => {
    store.navigate({ name: "map" });
  });
}
