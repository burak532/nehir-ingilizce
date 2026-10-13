import { describe, expect, it } from "vitest";
import { toCsv } from "../../src/data/csv-export";

describe("toCsv", () => {
  it("boş dizi için boş string döner", () => {
    expect(toCsv([])).toBe("");
  });

  it("başlık satırı üretir ve virgül/tırnak karakterlerini escape eder", () => {
    const csv = toCsv([
      { a: 1, b: 'hello, "world"' },
      { a: 2, b: "plain" }
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("a,b");
    expect(lines[1]).toBe('1,"hello, ""world"""');
    expect(lines[2]).toBe("2,plain");
  });
});
