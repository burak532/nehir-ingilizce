import { store } from "./store";

export function renderClosingScreen(root: HTMLElement): void {
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
