import { store } from "../core/store";
import { units } from "../core/content";
import { isLearned } from "../core/spaced-repetition";
import { todayIso } from "../core/date";
import {
  addParentObservation,
  getAllParentObservations,
  getAllSessions,
  getAllTrials,
  getAllWordProgress,
  getSettings,
  resetAllProgress,
  updateSettings
} from "../data/repository";
import { downloadCsv, toCsv } from "../data/csv-export";
import type { TurkishSupportLevel } from "../data/types";
import { applyUpdate, hasUpdateAvailable } from "../core/update-manager";

export function renderParentPanel(root: HTMLElement): void {
  root.innerHTML = `<p style="text-align:center; margin-top:2rem;">Yükleniyor...</p>`;
  void renderPanel(root);
}

async function renderPanel(root: HTMLElement): Promise<void> {
  const [settings, progress] = await Promise.all([getSettings(), getAllWordProgress()]);

  const unitRows = units
    .map((unit) => {
      const learned = progress.filter((p) => p.unitId === unit.id && isLearned(p)).length;
      const enabled = settings.unitsEnabled[unit.id] !== false;
      return `
        <tr>
          <td>${unit.titleEn}</td>
          <td>${learned}/${unit.words.length}</td>
          <td><input type="checkbox" data-unit-toggle="${unit.id}" ${enabled ? "checked" : ""}/></td>
        </tr>
      `;
    })
    .join("");

  root.innerHTML = `
    <div style="height:100%; overflow-y:auto; background:#fff; color:#1a1a1a; padding:2rem; font-size:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1>Ebeveyn Paneli</h1>
        <button id="close-panel" style="font-size:1rem; padding:0.5rem 1rem; min-height:50px;">Kapat ✕</button>
      </div>

      <section style="margin-bottom:1.5rem;">
        <h2>Günlük süre</h2>
        <input type="range" id="duration" min="15" max="30" step="5" value="${settings.dailyDurationMin}"/>
        <span id="duration-label">${settings.dailyDurationMin} dk</span>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2>Türkçe destek düzeyi</h2>
        <select id="turkish-level">
          <option value="full" ${settings.turkishSupportLevel !== "off" ? "selected" : ""}>Açık</option>
          <option value="off" ${settings.turkishSupportLevel === "off" ? "selected" : ""}>Kapalı (sadece İngilizce)</option>
        </select>
      </section>

      <section style="margin-bottom:1.5rem;">
        <label>
          <input type="checkbox" id="parent-tips" ${settings.parentTipsEnabled ? "checked" : ""}/>
          Ebeveyn ipuçlarını göster
        </label>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2>Üniteler ve kelime durumu</h2>
        <table style="width:100%; border-collapse:collapse;">
          <thead><tr><th style="text-align:left;">Ünite</th><th>Öğrenilen</th><th>Açık</th></tr></thead>
          <tbody>${unitRows}</tbody>
        </table>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2>Gözlem ekle</h2>
        <p style="font-size:0.9rem; color:#555;">Örn: "Uygulama dışında kendiliğinden kullandı: hello"</p>
        <input type="text" id="observation-text" style="width:70%;" placeholder="Gözlem yaz..."/>
        <button id="save-observation" style="min-height:50px;">Kaydet</button>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2>Veri dışa aktarma</h2>
        <button id="export-csv" style="min-height:60px; font-size:1rem;">Verileri CSV olarak indir</button>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2>İlerlemeyi sıfırla</h2>
        <button id="reset-progress" style="min-height:60px; background:#e76f51; color:#fff;">Tüm ilerlemeyi sıfırla</button>
      </section>

      ${
        hasUpdateAvailable()
          ? `<section>
              <h2>Güncelleme</h2>
              <p>Yeni bir sürüm hazır.</p>
              <button id="apply-update" style="min-height:60px; background:#219ebc; color:#fff;">Şimdi güncelle</button>
            </section>`
          : ""
      }
    </div>
  `;

  wireEvents(root, settings);
}

function wireEvents(
  root: HTMLElement,
  settings: Awaited<ReturnType<typeof getSettings>>
): void {
  root.querySelector<HTMLButtonElement>("#close-panel")?.addEventListener("click", () => {
    store.navigate({ name: "map" });
  });

  const durationInput = root.querySelector<HTMLInputElement>("#duration")!;
  const durationLabel = root.querySelector<HTMLSpanElement>("#duration-label")!;
  durationInput.addEventListener("input", () => {
    durationLabel.textContent = `${durationInput.value} dk`;
  });
  durationInput.addEventListener("change", () => {
    void updateSettings({ dailyDurationMin: Number(durationInput.value) });
  });

  root.querySelector<HTMLSelectElement>("#turkish-level")?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value as TurkishSupportLevel;
    void updateSettings({ turkishSupportLevel: value });
  });

  root.querySelector<HTMLInputElement>("#parent-tips")?.addEventListener("change", (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    void updateSettings({ parentTipsEnabled: checked });
  });

  root.querySelectorAll<HTMLInputElement>("input[data-unit-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const unitId = checkbox.dataset.unitToggle!;
      const unitsEnabled = { ...settings.unitsEnabled, [unitId]: checkbox.checked };
      void updateSettings({ unitsEnabled });
    });
  });

  root.querySelector<HTMLButtonElement>("#save-observation")?.addEventListener("click", () => {
    const input = root.querySelector<HTMLInputElement>("#observation-text")!;
    const text = input.value.trim();
    if (!text) return;
    void addParentObservation({ date: todayIso(), freeText: text }).then(() => {
      input.value = "";
    });
  });

  root.querySelector<HTMLButtonElement>("#export-csv")?.addEventListener("click", () => {
    void exportAllCsv();
  });

  root.querySelector<HTMLButtonElement>("#reset-progress")?.addEventListener("click", () => {
    const confirmed = window.confirm(
      "İlerlemeyi sıfırlamadan önce verileri CSV olarak yedeklediniz mi? Bu işlem geri alınamaz. Sıfırlamak istediğinize eminseniz Tamam'a basın."
    );
    if (!confirmed) return;
    void resetAllProgress().then(() => renderPanel(root));
  });

  root.querySelector<HTMLButtonElement>("#apply-update")?.addEventListener("click", () => {
    applyUpdate();
  });
}

async function exportAllCsv(): Promise<void> {
  const [trials, sessions, observations] = await Promise.all([
    getAllTrials(),
    getAllSessions(),
    getAllParentObservations()
  ]);
  const date = todayIso();
  if (trials.length > 0) downloadCsv(`nehir-denemeler-${date}.csv`, toCsv(trials));
  if (sessions.length > 0) downloadCsv(`nehir-oturumlar-${date}.csv`, toCsv(sessions));
  if (observations.length > 0) downloadCsv(`nehir-gozlemler-${date}.csv`, toCsv(observations));
}
