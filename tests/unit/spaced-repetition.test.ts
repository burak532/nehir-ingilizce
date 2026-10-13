import { describe, expect, it } from "vitest";
import {
  createInitialProgress,
  isDue,
  isLearned,
  recordAttempt
} from "../../src/core/spaced-repetition";

const day = (n: number) => new Date(Date.UTC(2026, 0, n));

describe("spaced-repetition", () => {
  it("yeni kelime ertesi gün tekrara düşer (stage 0)", () => {
    const record = createInitialProgress("red", "02-dino-colors", day(1));
    expect(record.intervalStage).toBe(0);
    expect(record.nextDueDate).toBe("2026-01-02");
    expect(record.distinctDaysCorrectFirstTry).toEqual([]);
  });

  it("doğru cevapta kademe ilerler ve gün kaydedilir", () => {
    let record = createInitialProgress("red", "02-dino-colors", day(1));
    record = recordAttempt(record, true, day(1));
    expect(record.intervalStage).toBe(1);
    expect(record.distinctDaysCorrectFirstTry).toEqual(["2026-01-01"]);
    expect(record.nextDueDate).toBe("2026-01-02");
  });

  it("aynı gün içindeki doğrular tekrar sayılmaz", () => {
    let record = createInitialProgress("red", "02-dino-colors", day(1));
    record = recordAttempt(record, true, day(1));
    record = recordAttempt(record, true, day(1));
    expect(record.distinctDaysCorrectFirstTry).toEqual(["2026-01-01"]);
  });

  it("'öğrenildi' sayılması için en az iki farklı gün gerekir", () => {
    let record = createInitialProgress("red", "02-dino-colors", day(1));
    record = recordAttempt(record, true, day(1));
    expect(isLearned(record)).toBe(false);
    record = recordAttempt(record, true, day(4));
    expect(isLearned(record)).toBe(true);
  });

  it("yanlış cevapta kademe bir geri alınır (cezalandırıcı olmayan sıklaştırma)", () => {
    let record = createInitialProgress("red", "02-dino-colors", day(1));
    record = recordAttempt(record, true, day(1)); // 0 -> 1
    record = recordAttempt(record, true, day(2)); // 1 -> 3
    record = recordAttempt(record, false, day(2)); // 3 -> 1
    expect(record.intervalStage).toBe(1);
    expect(record.nextDueDate).toBe("2026-01-03");
  });

  it("isDue, nextDueDate'e göre doğru sonuç verir", () => {
    const record = createInitialProgress("red", "02-dino-colors", day(1));
    expect(isDue(record, day(1))).toBe(false);
    expect(isDue(record, day(2))).toBe(true);
  });
});
