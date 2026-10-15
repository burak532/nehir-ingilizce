/**
 * Güncelleme akışı (bkz. docs/technical-plan.md §5). Geliştirme/iyileştirme süreci
 * boyunca güncellemenin güvenilir şekilde ulaşması, "oyun ortasında araya girmeme"
 * inceliğinden daha kritik çıktı (kullanıcı birden fazla kez eski sürümde takılı kaldı,
 * standart "tamamen kapat-aç" bile yetmedi) — bu yüzden yeni bir service worker
 * bulunduğunda HER ZAMAN hemen uygulanır (ekran ne olursa olsun), sayfa otomatik
 * yenilenir. İleride gerçek kullanım (Nehir oynarken) başladığında bu yaklaşım
 * gözden geçirilmeli.
 */
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;

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

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
