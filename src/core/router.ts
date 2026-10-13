import { store } from "./store";
import { renderStartScreen } from "./start-screen";
import { renderMapScreen } from "../map/map-screen";
import { renderUnitIntro } from "../map/unit-intro";
import { renderListenTouch } from "../games/listen-touch";
import { renderTpr } from "../games/tpr";
import { renderDragDrop } from "../games/drag-drop";
import { renderRecord } from "../games/record";
import { renderClosingScreen } from "./closing-screen";
import { renderParentPanel } from "../parent/parent-panel";

export function startRouter(root: HTMLElement): void {
  const render = () => {
    const { screen } = store.getState();
    root.innerHTML = "";

    switch (screen.name) {
      case "start":
        renderStartScreen(root);
        break;
      case "map":
        renderMapScreen(root);
        break;
      case "unit-intro":
        renderUnitIntro(root, screen.unitId);
        break;
      case "game":
        switch (screen.gameType) {
          case "listen-touch":
            renderListenTouch(root, screen.unitId);
            break;
          case "tpr":
            renderTpr(root, screen.unitId);
            break;
          case "drag-drop":
            renderDragDrop(root, screen.unitId);
            break;
          case "record":
            renderRecord(root, screen.unitId);
            break;
        }
        break;
      case "closing":
        renderClosingScreen(root);
        break;
      case "parent":
        renderParentPanel(root);
        break;
    }
  };

  store.subscribe(render);
  render();
}
