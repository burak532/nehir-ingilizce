/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

// Cache-first app-shell + içerik önbellekleme (bkz. docs/technical-plan.md §5).
// Güncelleme asla otomatik devreye girmez — sadece "SKIP_WAITING" mesajı alınca
// (uygulama açılışında ya da ebeveyn panelinde tetiklenir).
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});
