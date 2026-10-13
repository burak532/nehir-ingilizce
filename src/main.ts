import "./style.css";
import { renderStartScreen } from "./core/start-screen";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app kök elemanı bulunamadı");
}

renderStartScreen(app);
