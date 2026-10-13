/**
 * Minimal, bağımlılıksız IndexedDB erişim katmanı (bkz. docs/technical-plan.md §6).
 * Store şeması:
 * - trials: her kelime denemesi (autoIncrement id)
 * - wordProgress: ["unitId","wordId"] bileşik anahtarlı, aralıklı tekrar durumu
 * - sessions: sessionId anahtarlı, oturum özeti
 * - parentObservations: autoIncrement id, ebeveyn gözlem kaydı
 * - settings: sabit "default" anahtarlı tek kayıt
 */

const DB_NAME = "nehir-ingilizce";
const DB_VERSION = 1;

export const STORE = {
  trials: "trials",
  wordProgress: "wordProgress",
  sessions: "sessions",
  parentObservations: "parentObservations",
  settings: "settings"
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE.trials)) {
        db.createObjectStore(STORE.trials, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE.wordProgress)) {
        db.createObjectStore(STORE.wordProgress, { keyPath: ["unitId", "wordId"] });
      }
      if (!db.objectStoreNames.contains(STORE.sessions)) {
        db.createObjectStore(STORE.sessions, { keyPath: "sessionId" });
      }
      if (!db.objectStoreNames.contains(STORE.parentObservations)) {
        db.createObjectStore(STORE.parentObservations, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE.settings)) {
        db.createObjectStore(STORE.settings, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDb();
  }
  return dbPromise;
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promisifyTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function addRecord<T>(storeName: string, value: T): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).add(value);
  await promisifyTransaction(tx);
}

export async function putRecord<T>(storeName: string, value: T): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(value);
  await promisifyTransaction(tx);
}

export async function getRecord<T>(storeName: string, key: IDBValidKey | IDBValidKey[]): Promise<T | undefined> {
  const db = await getDb();
  const tx = db.transaction(storeName, "readonly");
  return promisifyRequest(tx.objectStore(storeName).get(key) as IDBRequest<T | undefined>);
}

export async function getAllRecords<T>(storeName: string): Promise<T[]> {
  const db = await getDb();
  const tx = db.transaction(storeName, "readonly");
  return promisifyRequest(tx.objectStore(storeName).getAll() as unknown as IDBRequest<T[]>);
}

export async function clearStore(storeName: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).clear();
  await promisifyTransaction(tx);
}

export async function clearAllStores(): Promise<void> {
  for (const storeName of Object.values(STORE)) {
    await clearStore(storeName);
  }
}
