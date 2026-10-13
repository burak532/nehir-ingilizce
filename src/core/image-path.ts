// BASE_URL kullanılıyor ki GitHub Pages alt-yol dağıtımında (örn. /nehir-ingilizce/)
// görseller köke değil, doğru alt-yola göre çözülsün (bkz. vite.config.ts base: "./").
export function imagePath(relativePath: string): string {
  return `${import.meta.env.BASE_URL}images/${relativePath}`;
}
