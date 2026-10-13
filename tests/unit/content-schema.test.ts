import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const unitsDir = path.resolve(__dirname, "../../content/units");
const schemaPath = path.resolve(__dirname, "../../content/schema/unit.schema.json");

const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));

describe("content/units/*.json şema doğrulaması", () => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const files = readdirSync(unitsDir).filter((f) => f.endsWith(".json"));

  it("en az bir ünite dosyası bulunmalı", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`${file} şemaya uyuyor`, () => {
      const data = JSON.parse(readFileSync(path.join(unitsDir, file), "utf-8"));
      const valid = validate(data);
      expect(valid, JSON.stringify(validate.errors, null, 2)).toBe(true);
    });
  }

  it("template chunk'lar {word}/{wordId} yer tutucusu içerir", () => {
    for (const file of files) {
      const data = JSON.parse(readFileSync(path.join(unitsDir, file), "utf-8"));
      for (const chunk of data.chunks ?? []) {
        if (chunk.template) {
          expect(chunk.en).toContain("{word}");
          expect(chunk.audioEn).toContain("{wordId}");
        }
      }
    }
  });
});
