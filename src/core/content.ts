export type GameType = "listen-touch" | "tpr" | "drag-drop" | "record";

export interface WordDef {
  id: string;
  en: string;
  tr: string;
  image: string;
  imageVariants: string[];
  audioEn: string;
  introTr: string;
}

export interface ChunkDef {
  id: string;
  en: string;
  audioEn: string;
  template?: boolean;
}

export interface UnitDef {
  id: string;
  titleEn: string;
  mapRegion: string;
  words: WordDef[];
  chunks: ChunkDef[];
  games: GameType[];
}

// Yeni ünite eklemek için content/units/ altına JSON dosyası eklemek yeterlidir
// (bkz. CLAUDE.md "İçerik/veri yapısı") — bu dosya kod değişikliği gerektirmez.
const unitModules = import.meta.glob<{ default: UnitDef }>("/content/units/*.json", {
  eager: true
});

export const units: UnitDef[] = Object.values(unitModules)
  .map((mod) => mod.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export function getUnit(unitId: string): UnitDef | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getWord(unitId: string, wordId: string): WordDef | undefined {
  return getUnit(unitId)?.words.find((word) => word.id === wordId);
}

/**
 * Ünitenin İngilizce+Türkçe tanıtma içeriğinin kısa bir özeti (hash).
 * `settings.unitsIntroducedHash`'te saklanır: içerik (ör. introTr cümlesi) değişince
 * hash de değişir, bu da tanıtma ekranının kullanıcının cihazında otomatik tekrar
 * gösterilmesini sağlar — elle "ilerlemeyi sıfırla" yapmaya gerek kalmaz.
 */
export function getUnitContentHash(unit: UnitDef): string {
  const raw = unit.words.map((w) => `${w.en}|${w.introTr}`).join("::");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 31 + raw.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}
