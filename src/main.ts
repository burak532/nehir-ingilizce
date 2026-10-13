import "./style.css";
import { startRouter } from "./core/router";
import { registerServiceWorker } from "./core/sw-register";
import { requestPersistentStorage } from "./data/persist";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app kök elemanı bulunamadı");
}

startRouter(app);
registerServiceWorker();
void requestPersistentStorage();
