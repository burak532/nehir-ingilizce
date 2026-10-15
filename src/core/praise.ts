/** Ölçülü kullanılan İngilizce övgü sesleri (bkz. content/shared/praise.json). */
export const PRAISE_AUDIO_PATHS = [
  "en/shared/praise-great-job-nehir.mp3",
  "en/shared/praise-well-done.mp3",
  "en/shared/praise-you-did-it.mp3",
  "en/shared/praise-nice-nehir.mp3"
];

export function pickRandomPraisePath(): string {
  return PRAISE_AUDIO_PATHS[Math.floor(Math.random() * PRAISE_AUDIO_PATHS.length)];
}
