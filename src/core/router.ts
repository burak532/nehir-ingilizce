import { store } from "./store";
import { renderStartScreen } from "./start-screen";
import { renderMapScreen } from "../map/map-screen";
import { renderUnitIntro } from "../map/unit-intro";
import { renderWordIntro } from "../map/word-intro";
import { renderListenTouch } from "../games/listen-touch";
import { renderTpr } from "../games/tpr";
import { renderDragDrop } from "../games/drag-drop";
import { renderRecord } from "../games/record";
import { renderClosingScreen } from "./closing-screen";
import { renderParentPanel } from "../parent/parent-panel";

export type Cleanup = void | (() => void);

export function startRouter(root: HTMLElement): void {
  let cleanup: (() => void) | undefined;

  const render = () => {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }

    const { screen } = store.getState();
    root.innerHTML = "";
    let result: Cleanup;

    switch (screen.name) {
      case "start":
        result = renderStartScreen(root);
        break;
      case "map":
        result = renderMapScreen(root);
        break;
      case "unit-intro":
        result = renderUnitIntro(root, screen.unitId);
        break;
      case "word-intro":
        result = renderWordIntro(root, screen.unitId);
        break;
      case "game":
        switch (screen.gameType) {
          case "listen-touch":
            result = renderListenTouch(root, screen.unitId);
            break;
          case "tpr":
            result = renderTpr(root, screen.unitId);
            break;
          case "drag-drop":
            result = renderDragDrop(root, screen.unitId);
            break;
          case "record":
            result = renderRecord(root, screen.unitId);
            break;
        }
        break;
      case "closing":
        result = renderClosingScreen(root);
        break;
      case "parent":
        result = renderParentPanel(root);
        break;
    }

    if (typeof result === "function") {
      cleanup = result;
    }
  };

  store.subscribe(render);
  render();
}
