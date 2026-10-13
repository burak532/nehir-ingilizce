/**
 * navigator.storage.persist() garanti değildir (bkz. docs/technical-plan.md §6) —
 * ek bir sinyal olarak çağrılır, tek güvence "Ana Ekrana Ekle" (standalone mod) kullanımıdır.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!("storage" in navigator) || !("persist" in navigator.storage)) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
