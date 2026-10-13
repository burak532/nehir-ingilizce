import { store } from "./store";
import { setUpdateAvailable } from "./update-manager";

/**
 * Güncelleme akışı (bkz. docs/technical-plan.md §5): yeni service worker hazır olduğunda
 * çocuk açılış ekranındaysa (kaybedecek ilerleme yok) sessizce uygulanır; aksi halde
 * ebeveyn paneline "güncelleme var" olarak bırakılır — oyun ortasında asla araya girmez.
 */
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;

    navigator.serviceWorker.register(swUrl).then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            const apply = () => newWorker.postMessage({ type: "SKIP_WAITING" });
            if (store.getState().screen.name === "start") {
              apply();
            } else {
              setUpdateAvailable(apply);
            }
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
