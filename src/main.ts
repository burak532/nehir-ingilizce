import "./style.css";
import { startRouter } from "./core/router";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app kök elemanı bulunamadı");
}

startRouter(app);
