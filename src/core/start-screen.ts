import { audioManager } from "../audio/audio-manager";
import { store } from "./store";

/**
 * Açılış ekranı: iPad Safari'de ses yalnızca bir kullanıcı dokunuşuyla
 * başlatılabildiği için (bkz. docs/technical-plan.md §4), uygulama bu ekranla
 * başlar. Dokunuş aynı zamanda AudioContext kilidini açar.
 */
/** iOS Safari standalone mod tespiti (resmi TS lib tiplerinde yok). */
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function renderStartScreen(root: HTMLElement): void {
  const nav = navigator as NavigatorWithStandalone;
  // "Ana Ekrana Ekle" zorunluluğu: standalone modda değilse veri 7 gün sonra silinebilir
  // (bkz. docs/technical-plan.md §5, technical.md §1.4).
  const showAddToHomeScreenHint = nav.standalone === false;

  root.innerHTML = `
    <div style="
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      height:100%; gap:2rem; color:#fff; text-align:center;
    ">
      <h1 style="font-size:2.5rem; margin:0;">Nehir'in İngilizcesi</h1>
      ${
        showAddToHomeScreenHint
          ? `<p style="max-width:28rem; font-size:1.1rem; background:#ffffff22; padding:1rem; border-radius:1rem;">
              💡 En iyi deneyim için: Safari paylaş menüsünden <strong>"Ana Ekrana Ekle"</strong> seçeneğini kullanın.
            </p>`
          : ""
      }
      <button id="start-button" style="
        font-size:2rem; padding:1.5rem 3rem; border-radius:9999px;
        background:#ffb703; color:#1a1a1a; min-width:120px; min-height:120px;
      ">Başla! ▶</button>
    </div>
  `;

  const button = root.querySelector<HTMLButtonElement>("#start-button");
  button?.addEventListener("click", () => {
    // Senkron çağrı zinciri içinde kalmalı — audioManager.unlock() bu yüzden
    // burada, doğrudan tıklama handler'ı içinde çağrılıyor.
    audioManager.unlock();
    store.setState({ audioUnlocked: true });
    store.navigate({ name: "map" });
  });
}
