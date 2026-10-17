import type { GameType } from "./content";

export type Screen =
  | { name: "start" }
  | { name: "map" }
  | { name: "unit-intro"; unitId: string }
  | { name: "word-intro"; unitId: string }
  | { name: "game"; unitId: string; gameType: GameType }
  | { name: "review" }
  | { name: "closing"; unitId: string }
  | { name: "parent" };

interface AppState {
  screen: Screen;
  audioUnlocked: boolean;
}

type Listener = (state: AppState) => void;

class Store {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor(initial: AppState) {
    this.state = initial;
  }

  getState(): AppState {
    return this.state;
  }

  setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  navigate(screen: Screen): void {
    this.setState({ screen });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const store = new Store({ screen: { name: "start" }, audioUnlocked: false });
