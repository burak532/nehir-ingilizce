# Teknik Plan

Bu plan, `docs/research/technical.md` bulgularına ve `docs/curriculum.md`'deki pedagojik gereksinimlere dayanır. İlke: **az bağımlılık, tam kontrol, çok oturumlu bakım kolaylığı.** Bu proje aylarca sürecek, farklı Claude Code oturumlarında geliştirilecek — framework'e özgü gizli davranışlardan kaçınıp her şeyin (özellikle service worker/ses kilidi gibi iPad'e özgü kritik kısımların) şeffaf ve debug edilebilir olması, geliştirici ergonomisinden daha önemli.

---

## 1. Framework kararı: **Vanilla TypeScript + Vite**

Teknik araştırma (technical.md §2) Svelte+Vite+TS ve Vanilla TS+Vite'yi eşit derecede geçerli buldu. **Vanilla TypeScript + Vite'yi seçiyorum:**
- Hiçbir derleyici-özel davranış yok — service worker/AudioContext/IndexedDB gibi iPad'e özgü kritik kodun her satırı şeffaf; bir sonraki oturumda hata ayıklarken "bu Svelte'in mi yoksa bizim kodun mu davranışı" sorusu çıkmaz.
- Animasyon ihtiyacı (karakter konuşması, obje uçması, dokunma tepkisi) CSS transition/keyframe + Web Animations API ile karşılanacak kadar sınırlı — bir framework'ün transition sistemine ihtiyaç yok.
- Bundle sıfıra yakın; 120 Hz ekranda gereksiz çalışma zamanı yükü olmaz.
- Vite zaten TS'i yerleşik destekliyor, HMR ve build pipeline'ı hazır.

State yönetimi için küçük, elle yazılmış bir event-emitter/store yeterli (örn. `src/core/store.ts`, ~30 satır) — Redux/Zustand/nanostores gibi bağımlılıklar gerekmiyor.

**Karar günlüğüne not:** Eğer ileride animasyon karmaşıklığı CSS'in sınırlarını zorlarsa, bu kararın gözden geçirilmesi CLAUDE.md'ye not edilecek.

---

## 2. Proje klasör yapısı

```
nehir/
├── src/
│   ├── core/              # state/store, routing (ekran geçişleri), aralıklı tekrar motoru
│   ├── audio/              # AudioContext unlock, preload, playback yardımcıları
│   ├── games/              # her oyun tipi bir modül (listen-touch, tpr, drag-drop, story, record)
│   ├── map/                # harita ekranı (Dino Ada, Uzay İstasyonu, Hayvan Ormanı)
│   ├── parent/             # ebeveyn paneli (kilit, ayarlar, CSV export)
│   ├── data/               # progress/trials/settings için IndexedDB erişim katmanı
│   └── main.ts
├── content/                # KOD DEĞİL — üniteler/kelimeler/cümleler (bkz. Bölüm 3)
│   ├── units/
│   │   ├── 01-hello.json
│   │   ├── 02-dino-colors.json
│   │   └── ...
│   └── schema/              # JSON Schema (içerik dosyalarını doğrulamak için)
├── public/
│   └── audio/
│       ├── en/<unitId>/<wordId>.mp3
│       └── tr/<lineId>.mp3
├── tools/
│   └── generate_audio/     # Aşama 5'te yazılacak, TTS üretim scripti
├── tests/
│   ├── unit/                # Vitest
│   └── e2e/                 # Playwright (WebKit)
├── .github/workflows/deploy.yml
├── vite.config.ts
└── CLAUDE.md
```

---

## 3. İçerik/veri modeli — kod değişmeden yeni ünite eklenebilsin

Her ünite `content/units/NN-slug.json` dosyasında tanımlanır. Örnek şema (basitleştirilmiş):

```json
{
  "id": "02-dino-colors",
  "titleEn": "Dino Colors",
  "mapRegion": "dino-island",
  "words": [
    {
      "id": "red",
      "en": "red",
      "tr": "kırmızı",
      "image": "dino-colors/red-dino.svg",
      "imageVariants": ["dino-colors/red-dino.svg", "dino-colors/red-dino-alt.svg"],
      "audioEn": "en/02-dino-colors/red.mp3",
      "introTr": "Bu kırmızı bir dinozor — İngilizce'de 'red' deriz."
    }
  ],
  "chunks": [
    { "id": "its-color", "en": "It's {color}!", "audioEn": "en/02-dino-colors/its-color.mp3" }
  ],
  "games": ["listen-touch", "drag-drop", "story", "record"]
}
```

- `imageVariants`: genelleme testleri için öğretimde kullanılan görselden farklı bir varyant (bkz. curriculum.md §10, ölçme planı).
- Yeni ünite eklemek = yeni bir JSON dosyası + görsel/ses varlıkları eklemek; kod değişikliği gerekmez. İçerik dosyaları `content/schema/unit.schema.json` ile derleme zamanında doğrulanır (Vitest testi: tüm ünite dosyaları şemaya uyuyor mu).
- Bu belge `CLAUDE.md`'nin "İçerik/veri yapısı" bölümüne referans olarak işlenecek.

---

## 4. Ses sistemi

**Ses kilidi (AudioContext unlock pattern, technical.md §1.1):**
1. Açılışta büyük bir "Başla" ekranı (prompt zorunluluğu). Çocuğun dokunuşuyla **tek bir** `AudioContext` oluşturulur, aynı jest içinde `resume()` çağrılır.
2. Bu context oturum boyunca yeniden kullanılır; yeni ses için yeni `AudioContext`/`Audio()` **oluşturulmaz**.
3. Her ünitenin sesleri, o üniteye girişte `decodeAudioData` ile önceden belleğe alınır (gecikmesiz oynatma, 120 Hz akıcılığına uygun).
4. Her uygulama açılışında context durumu kontrol edilir; `suspended` ise ilk dokunuşta tekrar `resume()`.

**Dosya organizasyonu:** `public/audio/en/<unitId>/<wordId|chunkId>.mp3` ve `public/audio/tr/<lineId>.mp3`. Aşama 5'teki `tools/generate_audio` scripti bu yapıyı üretecek ve bir `audio-manifest.json` (metin+ses-ayarı hash'i → dosya adı) tutarak sadece değişen satırları yeniden üretecek — bu kontrat burada sabitleniyor ki Aşama 5 doğrudan bu yapıyı hedefleyebilsin.

---

## 5. Offline strateji ve service worker

- **`vite-plugin-pwa`, `injectManifest` modu** kullanılacak: precache manifesti otomatik üretilir (app shell + tüm JS/CSS + `content/` JSON + `public/audio/*`), ama service worker'ın yaşam döngüsü (`updatefound`/`skipWaiting` zamanlaması) elle kontrol edilir — tam otomatik "sessizce güncelle" davranışı istemiyoruz.
- **Cache stratejisi:** cache-first (app shell + content + audio); ağ isteği sadece kendi barındırma adresinden güncelleme kontrolü için (technical.md §1.3).
- **Güncelleme akışı:** Yeni service worker `installed` (waiting) durumuna geçtiğinde, çocuk aktif oyunday ise **hiçbir şey göstermez**. Güncelleme sadece (a) uygulama açılış ekranında ("Başla" ekranından önce, sessizce `skipWaiting()` + reload) veya (b) ebeveyn panelinde küçük bir "Güncelleme var" rozeti olarak uygulanır — asla oyunun ortasında araya girmez (prompt zorunluluğu).
- **"Ana Ekrana Ekle" zorunluluğu:** Açılış ekranında, standalone modda değilse (`navigator.standalone === false`), kısa bir Türkçe yönlendirme gösterilir ("Bu uygulamayı ana ekranına ekle") — technical.md §1.4'teki kritik bulgu nedeniyle (standalone olmayan modda veri 7 gün sonra silinebilir).

---

## 6. Veri saklama (IndexedDB)

Object store'lar:

| Store | Alanlar (özet) | Amaç |
|---|---|---|
| `trials` | sessionId, date, unitId, wordId, gameType, imageVariant (seen/novel), correctFirstAttempt, distractorCount, attemptIndex | Curriculum.md §10 tidy CSV'nin kaynağı |
| `wordProgress` | wordId, unitId, introducedDate, lastSeenDate, nextDueDate, intervalStage (1/3/7), distinctDaysCorrectFirstTry | Aralıklı tekrar motoru + "öğrenildi" hesaplaması |
| `sessions` | sessionId, date, durationSec, unitsVisited, abandonedActivities, voluntaryRepeats | Katılım göstergeleri |
| `parentObservations` | id, date, wordId\|freeText | "Uygulama dışında kendiliğinden kullandı" kaydı |
| `settings` | dailyDurationMin, turkishSupportLevel, parentTipsEnabled, unitsEnabled[], deviceLocalId | Ebeveyn paneli ayarları |

- Uygulama açılışında `navigator.storage.persist()` çağrılır (garanti değil, ek sinyal — technical.md §1.4).
- CSV dışa aktarma: `trials` birincil CSV (satır=deneme), `sessions` ve `parentObservations` ayrı CSV'ler — tümü tidy format, R'da kolayca birleştirilebilir.
- İlerleme sıfırlama (ebeveyn paneli) tüm store'ları temizler; **önce CSV yedek alma hatırlatması** gösterilir (prompt zorunluluğu).

---

## 7. Ebeveyn paneli

- **Kilit:** Küçük bir ikon üzerinde 3 saniye basılı tutma (çocuğun yanlışlıkla tetiklemesi zor, ama ebeveyn için basit).
- **İçerik:** ilerleme/kelime durumu, günlük süre ayarı (15-30 dk slider), Türkçe destek düzeyi (otomatik azaltma eşiği override), ebeveyn ipuçlarını aç/kapa, ünite aç/kapa, CSV dışa aktar, ilerlemeyi sıfırla (yedek hatırlatmalı).
- Ebeveyn paneli, çocuğun göreceği ana arayüzden tamamen ayrı bir route/ekran (`src/parent/`).

---

## 8. Mikrofon ve kayıt

- İzin ilk kez ebeveyn eşliğinde, Ünite 1'in "kaydet-dinle" adımında istenir.
- `getUserMedia` reddedilirse veya hata verirse: kaydet-dinle adımı **sessizce atlanır**, çocuk takılmaz (technical.md §1.2, prompt zorunluluğu).
- Kayıt sadece `MediaRecorder` ile bellekte (bir `Blob`/`ArrayBuffer`) tutulur, çalma bitince serbest bırakılır (`URL.revokeObjectURL`). **Hiçbir yere yazılmaz, IndexedDB'ye de kaydedilmez.**
- Konuşma tanıma/puanlama yok (prompt zorunluluğu + curriculum.md §9).

---

## 9. Jest/davranış engelleme

Tüm kök elemanlara uygulanacak:
```css
html, body {
  touch-action: manipulation;
  user-select: none; -webkit-user-select: none;
  position: fixed; overflow: hidden; inset: 0;
}
#app { position: absolute; inset: 0; overflow-y: auto; } /* gerekiyorsa iç scroll */
```
+ `touchmove` üzerinde en üstteyken aşağı yön tespit edilip `preventDefault()` (pull-to-refresh için, `overscroll-behavior` Safari'de tutarsız — technical.md §1.5).

---

## 10. Hosting + CI

- **GitHub Pages**, "Settings → Pages → Source: GitHub Actions".
- `.github/workflows/deploy.yml`: `checkout` → `setup-node` → `npm ci && npm run build` → `upload-pages-artifact` (dist/) → `deploy-pages`. Her `main` push'unda otomatik yayın.
- `vite.config.ts`'de `base` alanı repo adıyla eşleşecek (`/nehir/` gibi); `manifest.json` `start_url`/`scope` ve service worker `scope` bu alt-yolla uyumlu olacak.
- GitHub repo adı/görünürlüğü Aşama 4 sonunda, yayına alırken kullanıcıyla netleştirilecek (prompt Bölüm 7'nin kendi talebi).

---

## 11. Test stratejisi

- **Vitest:** veri modeli (IndexedDB erişim katmanı), aralıklı tekrar motoru (tarih hesaplamaları), "öğrenildi" hesaplama mantığı, CSV üretimi, içerik JSON şema doğrulama.
- **Playwright, WebKit motoru, iPad ekran boyutu (1366×1024)**: ana akışlar (harita → ünite → oyun tipleri → kaydet-dinle → kapanış), dokunmatik etkileşim simülasyonu.
- **Offline testi:** Playwright'ta `context.setOffline(true)` ile ağ kapalıyken açılış + tüm ses çalma testi.
- Bu testler Aşama 4/8'de (MVP geliştirme + kalite kontrol) yazılacak; burada sadece araç seçimi sabitleniyor.

---

## 12. Native'e taşınabilirlik ilkesi

- `content/` (JSON) ve `public/audio/` tamamen platform-bağımsız — ileride native bir uygulamaya geçilirse bu klasörler aynen taşınabilir.
- `src/games/*` modülleri DOM'a bağımlı ama iş mantığı (hangi kelime ne zaman gelir, doğru/yanlış mantığı) `src/core/` içinde render'dan ayrı tutulacak — zorunluluk değil ama ileride ayrım kolaylığı sağlar (prompt'un kendi notu).

---

## Açık sorular / onay gerekenler

- **Framework kararı (Vanilla TS+Vite)** onaylanıyor mu, yoksa Svelte'i mi tercih edersin?
- **GitHub repo adı/görünürlüğü** şimdiden belirlenecek mi, yoksa Aşama 4 sonuna mı bırakalım? (prompt'un kendi önerisi: sona bırak)
- Bu teknik plan onaylanırsa Aşama 4'e (MVP geliştirme + ses üretim hattı) geçeceğim — ilk adım olarak proje iskeletini (`npm create vite`, klasör yapısı, ilk commit) kurarım.
