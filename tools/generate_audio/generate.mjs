#!/usr/bin/env node
/**
 * Ses üretim hattı (bkz. ingilizce-uygulama-prompt.md Bölüm 5, docs/technical-plan.md §4).
 * Servis: OpenAI gpt-4o-mini-tts. Üretilen sesler public/audio/ altına gömülür;
 * uygulama çalışırken hiçbir TTS API çağrısı yapmaz.
 *
 * Kullanım:
 *   node tools/generate_audio/generate.mjs --mode=cost
 *     → Hiçbir API çağrısı yapmadan toplam satır/karakter/tahmini maliyeti gösterir.
 *   node tools/generate_audio/generate.mjs --mode=sample --yes
 *     → Birkaç örnek cümleyi (Nehir adı dahil) birden fazla sesle üretir,
 *       tools/generate_audio/samples/ altına yazar. Dinleyip ses seçimi yapmak için.
 *   node tools/generate_audio/generate.mjs --mode=full --voice=<ses> --yes
 *     → Tüm içerik satırlarını seçilen sesle üretir (sadece değişen/yeni satırlar).
 *
 * --yes verilmezse hiçbir ücretli istek yapılmaz; sadece tahmini maliyet gösterilip durur
 * (bkz. ingilizce-uygulama-prompt.md Bölüm 9: "Ücret doğuracak her işlem... onayımı al").
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CONTENT_UNITS_DIR = path.join(ROOT, "content/units");
const CONTENT_SHARED_DIR = path.join(ROOT, "content/shared");
const AUDIO_OUT_DIR = path.join(ROOT, "public/audio");
const CACHE_PATH = path.join(__dirname, "cache-manifest.json");
const SAMPLES_OUT_DIR = path.join(__dirname, "samples");
const MODEL = "gpt-4o-mini-tts";

// Sıcak, sabırlı, okul öncesi öğretmeni tonu; hafif yavaş tempo, abartısız (prompt Bölüm 5).
const EN_INSTRUCTIONS =
  "Warm, patient preschool teacher speaking gently to a 4-year-old child. " +
  "Slightly slow pace, clear and natural pronunciation. Not exaggerated or cartoonish.";
const TR_INSTRUCTIONS =
  "Sıcak, sabırlı, 4 yaşındaki bir çocukla konuşan okul öncesi öğretmeni tonu. " +
  "Hafif yavaş tempo, net ve doğal Türkçe telaffuz, abartısız.";

// OpenAI'nin önerdiği/yeni sesleri (technical.md §5) — kullanıcı dinleyip seçecek.
const EN_SAMPLE_VOICES = ["marin", "cedar", "nova", "alloy"];
const TR_SAMPLE_VOICES = ["marin", "cedar", "shimmer"];

// Nehir adının telaffuzu için özellikle test edilen örnekler (prompt Bölüm 1).
const SAMPLE_LINES_EN = [
  { id: "sample-hello-nehir", text: "Hello, Nehir!" },
  { id: "sample-great-job", text: "Great job, Nehir!" },
  { id: "sample-dino-colors", text: "Look, it's a red dinosaur!" }
];
const SAMPLE_LINES_TR = [
  { id: "sample-tr-intro", text: "Bu kırmızı bir dinozor — İngilizce'de 'red' deriz." }
];

function loadEnvApiKey() {
  const envPath = path.join(ROOT, ".env");
  if (!existsSync(envPath)) {
    throw new Error(".env dosyası bulunamadı. Kök dizine OPENAI_API_KEY=... ekleyin.");
  }
  const content = readFileSync(envPath, "utf-8");
  const match = content.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!match) {
    throw new Error(".env içinde OPENAI_API_KEY satırı bulunamadı.");
  }
  const key = match[1].trim();
  // Bilinen bir .env sorunu: aynı anahtarın yanlışlıkla birkaç kez art arda yapıştırılması.
  // Gerçek OpenAI anahtarları ~164 karakter civarındadır; çok daha uzunsa muhtemelen bozuktur.
  if (!key.startsWith("sk-") || key.length > 250) {
    throw new Error(
      `OPENAI_API_KEY değeri geçersiz görünüyor (uzunluk: ${key.length}). ` +
        "Muhtemelen birden fazla anahtar birleşmiş/bozuk kopyalanmış. " +
        "Lütfen .env dosyasını kontrol edip tek, geçerli bir anahtarla değiştirin."
    );
  }
  return key;
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function hashLine({ text, voice, instructions }) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ text, voice, instructions, model: MODEL }))
    .digest("hex")
    .slice(0, 16);
}

/** content/units ve content/shared altındaki tüm üretilecek satırları toplar. */
function collectLines() {
  const lines = [];

  const unitFiles = existsSync(CONTENT_UNITS_DIR)
    ? readdirSync(CONTENT_UNITS_DIR).filter((f) => f.endsWith(".json"))
    : [];

  for (const file of unitFiles) {
    const unit = JSON.parse(readFileSync(path.join(CONTENT_UNITS_DIR, file), "utf-8"));

    for (const word of unit.words) {
      lines.push({ id: `${unit.id}:${word.id}:en`, lang: "en", text: word.en, outPath: word.audioEn });
      lines.push({
        id: `${unit.id}:${word.id}:tr-intro`,
        lang: "tr",
        text: word.introTr,
        outPath: `tr/${unit.id}/${word.id}-intro.mp3`
      });
    }

    for (const chunk of unit.chunks ?? []) {
      if (chunk.template) {
        for (const word of unit.words) {
          lines.push({
            id: `${unit.id}:${chunk.id}:${word.id}:en`,
            lang: "en",
            text: chunk.en.replace("{word}", word.en),
            outPath: chunk.audioEn.replace("{wordId}", word.id)
          });
        }
      } else {
        lines.push({ id: `${unit.id}:${chunk.id}:en`, lang: "en", text: chunk.en, outPath: chunk.audioEn });
      }
    }
  }

  const sharedFiles = existsSync(CONTENT_SHARED_DIR)
    ? readdirSync(CONTENT_SHARED_DIR).filter((f) => f.endsWith(".json"))
    : [];

  for (const file of sharedFiles) {
    const shared = JSON.parse(readFileSync(path.join(CONTENT_SHARED_DIR, file), "utf-8"));
    for (const line of shared.lines ?? []) {
      lines.push({ id: `shared:${line.id}:en`, lang: "en", text: line.en, outPath: line.audioEn });
      if (line.tr && line.audioTr) {
        lines.push({ id: `shared:${line.id}:tr`, lang: "tr", text: line.tr, outPath: line.audioTr });
      }
    }
  }

  return lines;
}

/**
 * Kaba maliyet tahmini — OpenAI'nin resmi fiyat sayfası bu projede doğrudan doğrulanamadı
 * (bkz. docs/research/technical.md §5). ~750 karakter/dakika konuşma hızı ve ~$0.015/dakika
 * çıktı maliyeti varsayımına dayanır; gerçek maliyet API'den dönen kullanım bilgisiyle
 * farklılık gösterebilir.
 */
function estimateCostUsd(lines) {
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  const estimatedMinutes = totalChars / 750;
  const estimatedCost = estimatedMinutes * 0.015;
  return { totalChars, estimatedMinutes, estimatedCost };
}

async function synthesize({ apiKey, text, voice, instructions }) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model: MODEL, voice, input: text, instructions, response_format: "mp3" })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS isteği başarısız (HTTP ${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (prefix, fallback) => {
    const found = args.find((a) => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : fallback;
  };
  return {
    mode: get("--mode=", "cost"),
    voice: get("--voice=", undefined),
    yes: args.includes("--yes")
  };
}

async function runCostMode() {
  const lines = collectLines();
  const { totalChars, estimatedMinutes, estimatedCost } = estimateCostUsd(lines);
  console.log(`Toplam satır: ${lines.length}`);
  console.log(`Toplam karakter: ${totalChars}`);
  console.log(`Tahmini ses süresi: ~${estimatedMinutes.toFixed(1)} dakika`);
  console.log(`Tahmini maliyet (kaba tahmin): ~$${estimatedCost.toFixed(2)}`);
}

async function runSampleMode({ apiKey, yes }) {
  mkdirSync(SAMPLES_OUT_DIR, { recursive: true });

  const enJobs = EN_SAMPLE_VOICES.flatMap((voice) =>
    SAMPLE_LINES_EN.map((line) => ({ ...line, voice, instructions: EN_INSTRUCTIONS, lang: "en" }))
  );
  const trJobs = TR_SAMPLE_VOICES.flatMap((voice) =>
    SAMPLE_LINES_TR.map((line) => ({ ...line, voice, instructions: TR_INSTRUCTIONS, lang: "tr" }))
  );
  const jobs = [...enJobs, ...trJobs];

  const { totalChars, estimatedCost } = estimateCostUsd(jobs);
  console.log(`Örnek üretim: ${jobs.length} ses dosyası, ~${totalChars} karakter.`);
  console.log(`Tahmini maliyet (kaba tahmin): ~$${estimatedCost.toFixed(4)}`);

  if (!yes) {
    console.log("\nOnaylamak için komutu --yes ekleyerek tekrar çalıştırın.");
    return;
  }

  for (const job of jobs) {
    const buf = await synthesize({ apiKey, text: job.text, voice: job.voice, instructions: job.instructions });
    const outPath = path.join(SAMPLES_OUT_DIR, `${job.lang}-${job.voice}-${job.id}.mp3`);
    writeFileSync(outPath, buf);
    console.log(`Yazıldı: ${path.relative(ROOT, outPath)}`);
  }

  console.log(`\nÖrnekler ${path.relative(ROOT, SAMPLES_OUT_DIR)} klasöründe. Dinleyip bir ses seçin.`);
}

async function runFullMode({ apiKey, voice, yes }) {
  if (!voice) {
    throw new Error("--voice=<ses-adı> belirtmelisiniz (örnekleri dinleyip seçtiğiniz İngilizce ses).");
  }
  const trVoice = process.env.TR_VOICE || voice;

  const cache = loadCache();
  const lines = collectLines();
  const pending = [];

  for (const line of lines) {
    const instructions = line.lang === "en" ? EN_INSTRUCTIONS : TR_INSTRUCTIONS;
    const lineVoice = line.lang === "en" ? voice : trVoice;
    const key = hashLine({ text: line.text, voice: lineVoice, instructions });
    if (cache[line.id] !== key) {
      pending.push({ ...line, voice: lineVoice, instructions, key });
    }
  }

  if (pending.length === 0) {
    console.log("Her şey güncel — üretilecek yeni/değişmiş satır yok.");
    return;
  }

  const { totalChars, estimatedCost } = estimateCostUsd(pending);
  console.log(`${pending.length} satır üretilecek (~${totalChars} karakter).`);
  console.log(`Tahmini maliyet (kaba tahmin): ~$${estimatedCost.toFixed(2)}`);

  if (!yes) {
    console.log("\nOnaylamak için komutu --yes ekleyerek tekrar çalıştırın.");
    return;
  }

  for (const line of pending) {
    const buf = await synthesize({ apiKey, text: line.text, voice: line.voice, instructions: line.instructions });
    const outPath = path.join(AUDIO_OUT_DIR, line.outPath);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, buf);
    cache[line.id] = line.key;
    saveCache(cache);
    console.log(`Üretildi: ${line.outPath}`);
  }
}

async function main() {
  const { mode, voice, yes } = parseArgs();

  if (mode === "cost") {
    await runCostMode();
    return;
  }

  const apiKey = loadEnvApiKey();

  if (mode === "sample") {
    await runSampleMode({ apiKey, yes });
  } else if (mode === "full") {
    await runFullMode({ apiKey, voice, yes });
  } else {
    console.error(`Bilinmeyen mod: ${mode}. Kullanım: --mode=cost|sample|full [--voice=<ses>] [--yes]`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Hata: ${error.message}`);
  process.exitCode = 1;
});
