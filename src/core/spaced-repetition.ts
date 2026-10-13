/**
 * Aralıklı tekrar motoru (bkz. docs/curriculum.md §3, docs/technical-plan.md §6).
 * Zamanlama (1-3-7 gün) literatürde doğrudan test edilmemiş bir varsayımdır —
 * bkz. docs/curriculum.md §12. Sabit, test edilebilir fonksiyonlar olarak tutulur.
 */

export type IntervalStage = 0 | 1 | 3 | 7;

export interface WordProgressRecord {
  wordId: string;
  unitId: string;
  introducedDate: string; // ISO yyyy-mm-dd
  lastSeenDate: string; // ISO yyyy-mm-dd
  nextDueDate: string; // ISO yyyy-mm-dd
  intervalStage: IntervalStage;
  /** Farklı günlerde ilk denemede doğru tanındığı tarihler (curriculum.md §10 "öğrenildi" tanımı). */
  distinctDaysCorrectFirstTry: string[];
}

const STAGE_SEQUENCE: IntervalStage[] = [0, 1, 3, 7];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return toIsoDate(d);
}

export function createInitialProgress(
  wordId: string,
  unitId: string,
  today: Date
): WordProgressRecord {
  const todayIso = toIsoDate(today);
  return {
    wordId,
    unitId,
    introducedDate: todayIso,
    lastSeenDate: todayIso,
    nextDueDate: addDays(todayIso, 1),
    intervalStage: 0,
    distinctDaysCorrectFirstTry: []
  };
}

/**
 * Bir kelime denemesi sonrası ilerlemeyi günceller.
 * - Doğruysa ve bugün için zaten kaydedilmemişse, bugünün tarihi distinctDaysCorrectFirstTry'e eklenir
 *   ve aralık bir sonraki kademeye (0→1→3→7) ilerler.
 * - Yanlışsa, aralık sıfırlanmaz ama bir kademe geriye alınır (fark ettirmeden daha sık tekrar).
 */
export function recordAttempt(
  record: WordProgressRecord,
  correctFirstAttempt: boolean,
  today: Date
): WordProgressRecord {
  const todayIso = toIsoDate(today);
  const currentStageIndex = STAGE_SEQUENCE.indexOf(record.intervalStage);

  if (correctFirstAttempt) {
    const alreadyCountedToday = record.distinctDaysCorrectFirstTry.includes(todayIso);
    const distinctDays = alreadyCountedToday
      ? record.distinctDaysCorrectFirstTry
      : [...record.distinctDaysCorrectFirstTry, todayIso];

    const nextStageIndex = Math.min(currentStageIndex + 1, STAGE_SEQUENCE.length - 1);
    const nextStage = STAGE_SEQUENCE[nextStageIndex];

    return {
      ...record,
      lastSeenDate: todayIso,
      nextDueDate: addDays(todayIso, nextStage === 0 ? 1 : nextStage),
      intervalStage: nextStage,
      distinctDaysCorrectFirstTry: distinctDays
    };
  }

  const prevStageIndex = Math.max(currentStageIndex - 1, 0);
  const prevStage = STAGE_SEQUENCE[prevStageIndex];
  return {
    ...record,
    lastSeenDate: todayIso,
    nextDueDate: addDays(todayIso, 1),
    intervalStage: prevStage
  };
}

/** Curriculum.md §10: en az iki farklı günde ilk denemede doğru tanınmış olmalı. */
export function isLearned(record: WordProgressRecord): boolean {
  return record.distinctDaysCorrectFirstTry.length >= 2;
}

export function isDue(record: WordProgressRecord, today: Date): boolean {
  return record.nextDueDate <= toIsoDate(today);
}
