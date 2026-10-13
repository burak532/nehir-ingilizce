/**
 * Ebeveyn alanı kilidi: çocuğun yanlışlıkla tetiklemesi zor, ebeveyn için basit —
 * bir ikon üzerinde 3 saniye basılı tutma (bkz. docs/technical-plan.md §7).
 */
export function attachParentGate(element: HTMLElement, onUnlock: () => void, holdMs = 3000): void {
  let timer: number | undefined;

  const start = () => {
    timer = window.setTimeout(onUnlock, holdMs);
  };
  const cancel = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  element.addEventListener("pointerdown", start);
  element.addEventListener("pointerup", cancel);
  element.addEventListener("pointerleave", cancel);
  element.addEventListener("pointercancel", cancel);
}
