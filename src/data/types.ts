import type { GameType } from "../core/content";

/** Curriculum.md §10: satır başına bir deneme (tidy format, CSV'nin kaynağı). */
export interface TrialRecord {
  id?: number;
  sessionId: string;
  date: string; // ISO yyyy-mm-dd
  unitId: string;
  wordId: string;
  gameType: GameType;
  imageVariant: "seen" | "novel";
  correctFirstAttempt: boolean;
  distractorCount: number;
  attemptIndex: number;
}

export interface SessionRecord {
  sessionId: string;
  date: string;
  durationSec: number;
  unitsVisited: string[];
  abandonedActivities: number;
  voluntaryRepeats: number;
}

export interface ParentObservationRecord {
  id?: number;
  date: string;
  wordId?: string;
  freeText: string;
}

export type TurkishSupportLevel = "full" | "reduced" | "off";

export interface SettingsRecord {
  key: "default";
  dailyDurationMin: number;
  turkishSupportLevel: TurkishSupportLevel;
  turkishFadeThresholdPlays: number;
  parentTipsEnabled: boolean;
  unitsEnabled: Record<string, boolean>;
  deviceLocalId: string;
  /** Oyun tipi başına kaç kez tamamlandığı — Türkçe "nasıl oynanır" açıklamasının azalma eşiği için. */
  gamePlaysCount: Partial<Record<GameType, number>>;
}

export const DEFAULT_SETTINGS: SettingsRecord = {
  key: "default",
  dailyDurationMin: 20,
  turkishSupportLevel: "full",
  turkishFadeThresholdPlays: 3,
  parentTipsEnabled: true,
  unitsEnabled: {},
  deviceLocalId: "",
  gamePlaysCount: {}
};
