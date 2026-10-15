import { addRecord, clearAllStores, getAllRecords, getRecord, putRecord, STORE } from "./db";
import {
  DEFAULT_SETTINGS,
  type ParentObservationRecord,
  type SessionRecord,
  type SettingsRecord,
  type TrialRecord
} from "./types";
import {
  createInitialProgress,
  recordAttempt,
  type WordProgressRecord
} from "../core/spaced-repetition";

export async function recordTrial(trial: TrialRecord): Promise<void> {
  await addRecord(STORE.trials, trial);
}

export async function getAllTrials(): Promise<TrialRecord[]> {
  return getAllRecords<TrialRecord>(STORE.trials);
}

export async function getWordProgress(
  unitId: string,
  wordId: string
): Promise<WordProgressRecord | undefined> {
  return getRecord<WordProgressRecord>(STORE.wordProgress, [unitId, wordId]);
}

export async function getAllWordProgress(): Promise<WordProgressRecord[]> {
  return getAllRecords<WordProgressRecord>(STORE.wordProgress);
}

/** Bir deneme sonrası wordProgress'i günceller (yoksa oluşturur) ve ilgili trial'ı kaydeder. */
export async function applyTrialResult(
  trial: TrialRecord,
  today: Date = new Date()
): Promise<WordProgressRecord> {
  await recordTrial(trial);
  const existing = await getWordProgress(trial.unitId, trial.wordId);
  const base = existing ?? createInitialProgress(trial.wordId, trial.unitId, today);
  const updated = recordAttempt(base, trial.correctFirstAttempt, today);
  await putRecord(STORE.wordProgress, updated);
  return updated;
}

export async function saveSession(session: SessionRecord): Promise<void> {
  await putRecord(STORE.sessions, session);
}

export async function getAllSessions(): Promise<SessionRecord[]> {
  return getAllRecords<SessionRecord>(STORE.sessions);
}

export async function addParentObservation(
  observation: ParentObservationRecord
): Promise<void> {
  await addRecord(STORE.parentObservations, observation);
}

export async function getAllParentObservations(): Promise<ParentObservationRecord[]> {
  return getAllRecords<ParentObservationRecord>(STORE.parentObservations);
}

export async function getSettings(): Promise<SettingsRecord> {
  const existing = await getRecord<SettingsRecord>(STORE.settings, "default");
  if (existing) {
    // Eski kayıtlarda eksik olabilecek alanları (şema genişlemesi) varsayılanla doldur.
    return { ...DEFAULT_SETTINGS, ...existing };
  }
  const fresh: SettingsRecord = {
    ...DEFAULT_SETTINGS,
    deviceLocalId: crypto.randomUUID()
  };
  await putRecord(STORE.settings, fresh);
  return fresh;
}

export async function updateSettings(partial: Partial<SettingsRecord>): Promise<SettingsRecord> {
  const current = await getSettings();
  const updated = { ...current, ...partial, key: "default" as const };
  await putRecord(STORE.settings, updated);
  return updated;
}

/** Ebeveyn paneli "ilerlemeyi sıfırla" eylemi — önce CSV yedek alma hatırlatması UI katmanında yapılmalı. */
export async function resetAllProgress(): Promise<void> {
  await clearAllStores();
}
