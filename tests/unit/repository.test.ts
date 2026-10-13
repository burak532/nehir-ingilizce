import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyTrialResult,
  getAllTrials,
  getSettings,
  getWordProgress,
  resetAllProgress,
  updateSettings
} from "../../src/data/repository";

describe("repository (fake-indexeddb)", () => {
  beforeEach(async () => {
    await resetAllProgress();
  });

  it("bir deneme kaydeder ve wordProgress oluşturur/günceller", async () => {
    const today = new Date("2026-01-01T00:00:00Z");
    await applyTrialResult(
      {
        sessionId: "s1",
        date: "2026-01-01",
        unitId: "01-hello",
        wordId: "hello",
        gameType: "listen-touch",
        imageVariant: "seen",
        correctFirstAttempt: true,
        distractorCount: 3,
        attemptIndex: 1
      },
      today
    );

    const trials = await getAllTrials();
    expect(trials).toHaveLength(1);
    expect(trials[0].wordId).toBe("hello");

    const progress = await getWordProgress("01-hello", "hello");
    expect(progress?.intervalStage).toBe(1);
    expect(progress?.distinctDaysCorrectFirstTry).toEqual(["2026-01-01"]);
  });

  it("ayarlar varsayılanla oluşturulur ve güncellenebilir", async () => {
    const settings = await getSettings();
    expect(settings.dailyDurationMin).toBe(20);

    const updated = await updateSettings({ dailyDurationMin: 25 });
    expect(updated.dailyDurationMin).toBe(25);

    const again = await getSettings();
    expect(again.dailyDurationMin).toBe(25);
  });
});
