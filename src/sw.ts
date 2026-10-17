/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

// Cache-first app-shell + içerik önbellekleme (bkz. docs/technical-plan.md §5).
// Güncelleme SKIP_WAITING mesajı alınca uygulanır (bkz. src/core/sw-register.ts —
// sadece "güvenli" bir ekrandayken tetiklenir). clients.claim() olmadan, skipWaiting()
// yeni sürümü arka planda aktif etse bile AÇIK OLAN sayfa bunu hiç devralmıyor —
// controllerchange hiç ateşlenmiyor, sw-register.ts'nin reload()'u hiç tetiklenmiyor.
// Bulunan gerçek hata (bkz. kullanıcı geri bildirimi): "tam kapat-aç bile yetmiyor"
// şikayetinin kökü tam olarak buydu — ilk kapat-aç yeni sürümü arka planda aktif
// ediyordu ama mevcut sayfa hâlâ eskiyi gösteriyordu, ancak İKİNCİ kapat-aç'ta
// (yeni navigasyon zaten aktif olan yeni worker'a denk geldiği için) güncelleme
// görünüyordu. clients.claim() ile aktif olan worker açık sayfayı hemen devralır,
// controllerchange senkron ateşlenir, tek kapat-aç (hatta tek oturum içinde) yeterli olur.
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});
