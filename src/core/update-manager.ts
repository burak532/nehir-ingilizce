type ApplyFn = () => void;

let pendingApply: ApplyFn | null = null;
const listeners = new Set<(pending: boolean) => void>();

export function setUpdateAvailable(apply: ApplyFn): void {
  pendingApply = apply;
  listeners.forEach((listener) => listener(true));
}

export function hasUpdateAvailable(): boolean {
  return pendingApply !== null;
}

export function applyUpdate(): void {
  pendingApply?.();
  pendingApply = null;
}

export function onUpdateAvailableChange(listener: (pending: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
