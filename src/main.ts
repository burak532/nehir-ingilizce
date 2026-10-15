import "./style.css";
import { startRouter } from "./core/router";
import { registerServiceWorker } from "./core/sw-register";
import { requestPersistentStorage } from "./data/persist";
import { startSessionTracking } from "./core/session";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app kök elemanı bulunamadı");
}

startRouter(app);
startSessionTracking();
// Service worker sadece production build'de var (devOptions.enabled: false,
// bkz. vite.config.ts) — dev modda /sw.js servis edilmediği için kayıt denenmemeli.
if (import.meta.env.PROD) {
  registerServiceWorker();
}
void requestPersistentStorage();
