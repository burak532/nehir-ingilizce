# Nehir için İngilizce Öğrenme Uygulaması — CLAUDE.md

Bu dosya, bu proje üzerinde çalışan her Claude Code oturumunun önce okuması gereken referans dosyasıdır. Kararlar değiştikçe burayı güncelle. Detaylı süreç talimatı: `ingilizce-uygulama-prompt.md`. Oturum devamlılığı için: `docs/progress.md`.

## Canlı site
https://burak532.github.io/nehir-ingilizce/ — `main`'e her push'ta otomatik yayınlanır (`.github/workflows/deploy.yml`). GitHub repo: https://github.com/burak532/nehir-ingilizce (public).

**iPad'de test etme:** Mac'ten aynı Wi-Fi üzerinden `npm run dev -- --host` ile canlı deneme **çalışmıyor** — kullanıcının iPad'inde (iPadOS 27) Safari, `http://` adresleri otomatik `https://`'ye yükseltmeye çalışıyor ve yerel dev sunucusu düz HTTP olduğu için bağlantı hiç kurulamıyor (Mac tarafında istek bile görünmüyor). Bu yüzden iş akışı: **değişiklik yap → `main`'e push et → ~1 dk sonra `https://burak532.github.io/nehir-ingilizce/`'yi iPad'de yenile.** Yerel ağ üzerinden anlık deneme istenirse `mkcert` ile yerel HTTPS sertifikası kurmak gerekir (denenmedi, kullanıcı bu karmaşıklığı istemedi).

## Proje özeti
4 yaşındaki Nehir için iPad'de (Safari, ana ekrana eklenmiş PWA) çalışacak, ebeveynle birlikte kullanılan bir İngilizce öğrenme uygulaması. Nehir İngilizce bilmiyor, Türkçe yaşına göre ileri düzeyde. İlgi alanları: dinozorlar, hayvanlar, uzay. Günde 15-30 dakika, her zaman bir ebeveynle.

Cihaz: iPad Pro 12,9" (6. nesil), iPadOS 27, 1366×1024 pt yatay, 120 Hz.

Tam gereksinimler için `ingilizce-uygulama-prompt.md`'ye bakılmalı — bu dosya onun özetini ve projede alınan somut kararları tutar.

## Nasıl çalışıyoruz (süreç)
- Proje aşamalar halinde yürütülüyor: 1) Araştırma 2) Pedagojik tasarım 3) Teknik plan 4) MVP geliştirme + ses üretimi 5) Test/iyileştirme.
- **Bir aşamadan sonrakine kullanıcı onayı almadan geçilmez.**
- Her oturum başında önce bu dosya ve `docs/progress.md` okunur, kullanıcıya nerede kalındığı özetlenir.
- İlerleme `docs/progress.md`'de sık güncellenir (oturum sonunu beklemeden).
- Her görev, çalışır bir hâlde bitip bir git commit'iyle kaydedilir.
- Emin olunmayan konularda varsayım yapılmaz, kullanıcıya sorulur.

## Karar günlüğü
| Tarih | Karar | Gerekçe |
|---|---|---|
| 2026-10-13 | Proje git deposu olarak başlatıldı, `.env` gitignore'a eklendi | API anahtarının commit'lenmemesi gerekiyor |
| 2026-10-13 | Aşama 0 (kurulum) + Aşama 1 (araştırma) planı onaylandı; Aşama 1'de 3 paralel araştırma ajanı kullanılacak | `ingilizce-uygulama-prompt.md` Bölüm 0 ve 2 |
| 2026-10-13 | Aşama 1 (araştırma) tamamlandı: `docs/research/evidence.md`, `prior-art.md`, `technical.md` yazıldı | Detaylar `docs/progress.md` → "Araştırmadan çıkan önemli bulgular" |
| 2026-10-13 | Aşama 2 (pedagojik tasarım) tamamlandı: `docs/curriculum.md` yazıldı; 13 ünite, MVP ilk 2 ünite Hello!+Dino Colors **onaylandı** (kullanıcı tüm Bölüm 13 sorularını onayladı) | `docs/curriculum.md` |
| 2026-10-13 | Aşama 3 (teknik plan) tamamlandı: `docs/technical-plan.md` yazıldı; framework **Vanilla TypeScript + Vite**, hosting GitHub Pages+Actions, IndexedDB veri modeli, service worker (vite-plugin-pwa injectManifest) | `docs/technical-plan.md`; framework kararı onaylandı, repo adı Aşama 4 sonunda belirlenecek |
| 2026-10-13 | Aşama 4 (MVP) kod tarafı tamamlandı: Node.js kuruldu, proje iskeleti, Ünite 1-2 içerik+görseller, tüm oyun tipleri, IndexedDB veri katmanı, ebeveyn paneli, PWA/service worker, Vitest testleri, ses üretim scripti yazıldı | `docs/progress.md` |
| 2026-10-13 | Kullanıcı geçerli `OPENAI_API_KEY` sağladı (.env güncellendi); her iki dil için de **"cedar"** sesi onaylandı; tüm 61 satırın sesi üretildi (`public/audio/`, ~$0.03 harcandı) ve tarayıcıda gerçek sesle doğrulandı | `tools/generate_audio/` |
| 2026-10-13 | GitHub'da **public** `burak532/nehir-ingilizce` reposu oluşturuldu, GitHub Pages "GitHub Actions" kaynağıyla etkinleştirildi, `.github/workflows/deploy.yml` eklendi, ilk deploy yapıldı | Canlı: https://burak532.github.io/nehir-ingilizce/ |
| 2026-10-13 | **Bulunup düzeltilen hata:** `imagePath`/`audio-manager.ts` mutlak kök yol (`/images/...`, `/audio/...`) kullanıyordu — GitHub Pages alt-yolunda (`/nehir-ingilizce/`) köke gidip 404 veriyordu. `import.meta.env.BASE_URL` ile düzeltildi, canlı sitede doğrulandı | commit 1b6f115 |
| 2026-10-15 | **Kullanıcı iPad'de ilk kez denedi, 3 eksiklik bildirdi:** Türkçe destek hiç görünmüyordu (kodlanmış ama bağlanmamıştı), Hello ünitesi ikonları (özellikle "please") anlaşılmıyordu, sürükle-bırak yönergesi ("put the green one in the nest") Türkçe açıklama olmadan anlaşılmıyordu. Üçü de düzeltildi: yeni "tanıtma" ekranı (Türkçe kelime girişi), oyun tipi başına Türkçe "nasıl oynanır" açıklaması (azalan, `gamePlaysCount`), 14 Hello ikonu yeniden çizildi. Kelime değiştirilmedi (kullanıcı izin vermişti, gerek kalmadı) | `docs/progress.md` → "Kullanıcı geri bildirimi" |

## Bilinen açık konular (bkz. `docs/progress.md` → "Bekleyen sorular")
- Playwright uçtan uca testleri henüz yazılmadı (Aşama 8 kalite kontrolü kapsamında).
- Kullanıcının 2. tur düzeltmeleri (ses üst üste binmesi + ikon animasyonu) iPad'de denemesi bekleniyor.

## Not: SVG ikon animasyonu (`<img src="...svg">` + içine gömülü CSS `@keyframes`)
Chrome'da doğrulandı: hem `<img>` hem `<object>` ile embed edilen SVG'lerde CSS animasyonları çalışıyor — mimari değişiklik (inline SVG / `<object>` geçişi) gerekmedi. Animasyonu test ederken ekran görüntüleri arasında **animasyon periyoduna eşit veya tam katı bir bekleme süresi kullanma** (örn. 1s periyotluk animasyon + 1s bekleme = yanıltıcı şekilde "değişmiyor" görünür, aliasing). Periyotla örtüşmeyen bir gecikme (örn. 0.35s, 2.5s) kullan.

## Kodlama kuralları
- **Dil/araç:** TypeScript + Vite, framework yok ("Vanilla TS"). Gerekçe ve alternatif değerlendirmesi: `docs/technical-plan.md` §1.
- **State yönetimi:** `src/core/` içinde elle yazılmış küçük bir store/event-emitter; dış state kütüphanesi kullanılmıyor.
- **Animasyon:** CSS transition/keyframe + Web Animations API; framework transition sistemi yok.
- **Test:** Vitest (birim), Playwright WebKit motoru + iPad ekran boyutu (uçtan uca). Detaylar: `docs/technical-plan.md` §11.
- **Service worker:** `vite-plugin-pwa` (`injectManifest` modu) — yaşam döngüsü elle kontrol edilir, güncelleme asla oyun ortasında uygulanmaz (`docs/technical-plan.md` §5).
- **Ses:** Tek, oturum boyunca yeniden kullanılan `AudioContext`; TTS üretimi sadece build-time'da (`tools/generate_audio`), runtime'da hiçbir dış API çağrısı yok. Seçilen ses: **cedar** (hem İngilizce hem Türkçe destek satırları için).

## İçerik/veri yapısı
- Üniteler `content/units/NN-slug.json` dosyalarında tutulur, kod değişmeden yeni ünite eklenir. Şema ve örnek: `docs/technical-plan.md` §3.
- Ses dosyaları: `public/audio/en/<unitId>/<wordId>.mp3`, `public/audio/tr/<lineId>.mp3`; üretim/önbellekleme kontratı `docs/technical-plan.md` §4.
- İlerleme/ölçüm verisi IndexedDB object store'ları (`trials`, `wordProgress`, `sessions`, `parentObservations`, `settings`) — şema: `docs/technical-plan.md` §6.
- **Türkçe destek akışı (`src/map/word-intro.ts`, `src/core/game-intro.ts`):** Ünite ilk kez açıldığında "tanıtma" ekranı her kelimenin `introTr` metnini/sesini gösterir (`settings.unitsIntroduced` ile bir kez). Her oyun tipi `settings.gamePlaysCount[gameType] < turkishFadeThresholdPlays` olduğu sürece başlamadan önce Türkçe "nasıl oynanır" açıklaması gösterir (`game-intro.ts` içindeki `INSTRUCTIONS_TR`). Yeni bir oyun tipi eklenirse bu map'e satır eklemeyi unutma.
- **Yeni ünite eklemenin adımları:** (1) `content/units/` altına yeni JSON dosyası ekle, şemaya uy; (2) görselleri/ses referanslarını JSON'da tanımla; (3) `tools/generate_audio` ile sesleri üret; (4) haritada bölge/sıra ata; kod dosyalarına dokunulmaz.
- **Ses üretim hattı (`tools/generate_audio/generate.mjs`):**
  - `npm run audio:cost` — API çağrısı yapmadan toplam satır/karakter/tahmini maliyeti gösterir.
  - `npm run audio:sample -- --yes` — birkaç örnek cümleyi (Nehir adı dahil) birden fazla sesle üretip `tools/generate_audio/samples/` altına yazar; kullanıcı dinleyip ses seçer.
  - `npm run audio:generate -- --voice=<seçilen-ses> --yes` — tüm içerik satırlarını (sadece yeni/değişenleri, hash önbellekli) üretip `public/audio/`'ya yazar.
  - `--yes` verilmeden hiçbir ücretli istek yapılmaz, sadece tahmini maliyet gösterilir.
  - `.env`'deki `OPENAI_API_KEY` otomatik doğrulanır (uzunluk/önek kontrolü); bozuksa script hata verip durur.

## Dosya/klasör yapısı (şu an)
```
nehir/
├── CLAUDE.md                     # bu dosya
├── ingilizce-uygulama-prompt.md  # orijinal süreç talimatı
├── .env                          # OPENAI_API_KEY (gitignore'da, commit edilmez)
├── package.json / vite.config.ts / vitest.config.ts / tsconfig.json
├── index.html
├── src/
│   ├── main.ts, style.css
│   ├── core/                     # store, router, content loader, aralıklı tekrar, ses kaydı/tarih, sw-register
│   ├── audio/                    # AudioContext unlock + preload
│   ├── games/                    # listen-touch, tpr, drag-drop, record
│   ├── map/                      # harita + ünite giriş ekranı
│   ├── parent/                   # ebeveyn paneli + kilit
│   ├── data/                     # IndexedDB katmanı, CSV export
│   └── sw.ts                     # özel service worker kaynağı (vite-plugin-pwa injectManifest)
├── content/
│   ├── schema/unit.schema.json
│   ├── units/01-hello.json, 02-dino-colors.json
│   └── shared/tpr.json
├── public/
│   ├── images/units/...           # özgün SVG illüstrasyonlar
│   ├── icons/                     # PWA app ikonları
│   └── audio/                     # TTS çıktısı (henüz üretilmedi)
├── tools/generate_audio/generate.mjs
├── tests/unit/                    # Vitest
└── docs/
    ├── progress.md, curriculum.md, technical-plan.md
    └── research/evidence.md, prior-art.md, technical.md
```
