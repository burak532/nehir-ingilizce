import { store } from "./store";

/**
 * Güncelleme akışı (bkz. docs/technical-plan.md §5). Yeni bir service worker
 * bulunduğunda hemen `SKIP_WAITING` ile aktif edilir (bu kısım sayfayı etkilemez,
 * sadece arka planda yeni sürümü hazırlar) — önceki turlarda güncellemenin hiç
 * ulaşmaması bununla çözüldü. Ama asıl sayfa yenilemesi (`location.reload()`)
 * artık HER ekranda değil, yalnızca "güvenli" bir ekrandayken (başlangıç, harita,
 * ebeveyn paneli, kapanış) uygulanıyor — kalite denetiminde hem oyun ortasında
 * (tanıtma ekranında) hem de ekranın en başa (haritaya bile değil) dönmesi ciddi
 * bir kesinti olarak işaretlendi. Güncelleme hazır olduğunda kullanıcı zaten sık
 * sık bu güvenli ekranlara uğrar (her ünite dönüşü, her haritaya dönüş), bu yüzden
 * teslimat güvenilirliği kaybolmadan kesinti önlenmiş olur.
 */
const SAFE_SCREENS: ReadonlyArray<string> = ["start", "map", "parent", "closing"];

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    let updateReady = false;
    let refreshing = false;

    const reloadIfSafeScreen = (): void => {
      if (!updateReady || refreshing) return;
      if (!SAFE_SCREENS.includes(store.getState().screen.name)) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.register(swUrl).then((registration) => {
      // Zaten bekleyen bir sürüm varsa (önceki ziyarette hiç uygulanmamışsa) hemen uygula.
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      // Pasif tarayıcı kontrolüne güvenmek yerine her açılışta aktif olarak sor.
      void registration.update();
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      updateReady = true;
      reloadIfSafeScreen();
    });

    // Güncelleme hazır ama kullanıcı o an bir oyun/tanıtma ekranındaysa, bir
    // sonraki güvenli ekrana geçişte (ör. ünite biter, haritaya döner) uygula.
    store.subscribe(reloadIfSafeScreen);
  });
}
