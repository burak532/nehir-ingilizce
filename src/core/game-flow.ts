import type { GameType } from "./content";
import { getUnit } from "./content";
import type { Screen } from "./store";

/** Bir oyun tipi bitince ünitenin games dizisindeki sıradaki oyuna, yoksa kapanışa geçer. */
export function nextAfterGame(unitId: string, currentGameType: GameType): Screen {
  const unit = getUnit(unitId);
  if (!unit) return { name: "map" };
  const index = unit.games.indexOf(currentGameType);
  const next = unit.games[index + 1];
  if (next) {
    return { name: "game", unitId, gameType: next };
  }
  return { name: "closing" };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
