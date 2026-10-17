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

export type ChunkPlacement = "intro" | "closing" | "correct-answer" | "drop-target";

export interface ChunkDef {
  id: string;
  en: string;
  audioEn: string;
  template?: boolean;
  /** Bu kalıp ifadenin otomatik çalınacağı yer (bkz. CLAUDE.md İçerik/veri yapısı). */
  placement?: ChunkPlacement;
}

export interface UnitDef {
  id: string;
  titleEn: string;
  mapRegion: string;
  words: WordDef[];
  chunks: ChunkDef[];
  games: GameType[];
  /** Sürükle-bırak oyunundaki bırakma hedefinin Türkçe etiketi (ör. "Yuva", "Çiftlik"). */
  dropZoneLabel?: string;
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
