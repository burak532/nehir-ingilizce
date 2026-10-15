import { store } from "./store";
import { saveSession } from "../data/repository";
import { todayIso } from "./date";

/**
 * Uygulama her açıldığında (sayfa yüklendiğinde) yeni bir oturum kimliği oluşturulur.
 * Süre yalnızca KAYDEDİLİR (ebeveyn paneli CSV dışa aktarımı için) — herhangi bir süre
 * sınırı/kısıtlama uygulanmaz (bkz. kullanıcı kararı: `dailyDurationMin` sadece
 * ebeveynin kendi takibi için, uygulama tarafından zorlanmıyor).
 */
export const sessionId: string = crypto.randomUUID();
export const sessionStartedAt: number = Date.now();

const unitsVisited = new Set<string>();
const PERSIST_INTERVAL_MS = 30_000;

function buildSessionRecord() {
  return {
    sessionId,
    date: todayIso(),
    durationSec: Math.round((Date.now() - sessionStartedAt) / 1000),
    unitsVisited: Array.from(unitsVisited),
    abandonedActivities: 0,
    voluntaryRepeats: 0
  };
}

function persistSession(): void {
  void saveSession(buildSessionRecord());
}

/** main.ts'de bir kez çağrılır: ünite ziyaretlerini izler, süreyi periyodik + sayfa
 *  arka plana geçtiğinde kaydeder. */
export function startSessionTracking(): void {
  store.subscribe((state) => {
    if ("unitId" in state.screen && state.screen.unitId) {
      unitsVisited.add(state.screen.unitId);
    }
  });

  window.setInterval(persistSession, PERSIST_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) persistSession();
  });
  window.addEventListener("pagehide", persistSession);
}
