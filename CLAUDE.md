# Nehir için İngilizce Öğrenme Uygulaması — CLAUDE.md

Bu dosya, bu proje üzerinde çalışan her Claude Code oturumunun önce okuması gereken referans dosyasıdır. Kararlar değiştikçe burayı güncelle. Detaylı süreç talimatı: `ingilizce-uygulama-prompt.md`. Oturum devamlılığı için: `docs/progress.md`.

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
| 2026-10-13 | Aşama 3 (teknik plan) tamamlandı: `docs/technical-plan.md` yazıldı; framework **Vanilla TypeScript + Vite**, hosting GitHub Pages+Actions, IndexedDB veri modeli, service worker (vite-plugin-pwa injectManifest) | `docs/technical-plan.md`; framework kararı ve repo adı onay bekliyor |

## Bilinen açık konular (bkz. `docs/progress.md` → "Bekleyen sorular")
- `.env` içindeki `OPENAI_API_KEY` değeri bozuk/tekrarlı görünüyor; Aşama 5'ten (ses üretimi) önce düzeltilmesi/doğrulanması gerekiyor.
- TTS üretim maliyeti onay eşiği ("5 USD") şu an sadece örnek; gerçek rakam Aşama 5'te teyit edilecek.
- Nehir adının İngilizce TTS telaffuzu Aşama 5'te örneklerle onaylanacak.
- Framework kararı (Vanilla TS+Vite) ve GitHub repo adı/görünürlüğü onay bekliyor (`docs/technical-plan.md` sonu).

## Kodlama kuralları
- **Dil/araç:** TypeScript + Vite, framework yok ("Vanilla TS"). Gerekçe ve alternatif değerlendirmesi: `docs/technical-plan.md` §1.
- **State yönetimi:** `src/core/` içinde elle yazılmış küçük bir store/event-emitter; dış state kütüphanesi kullanılmıyor.
- **Animasyon:** CSS transition/keyframe + Web Animations API; framework transition sistemi yok.
- **Test:** Vitest (birim), Playwright WebKit motoru + iPad ekran boyutu (uçtan uca). Detaylar: `docs/technical-plan.md` §11.
- **Service worker:** `vite-plugin-pwa` (`injectManifest` modu) — yaşam döngüsü elle kontrol edilir, güncelleme asla oyun ortasında uygulanmaz (`docs/technical-plan.md` §5).
- **Ses:** Tek, oturum boyunca yeniden kullanılan `AudioContext`; TTS üretimi sadece build-time'da (`tools/generate_audio`), runtime'da hiçbir dış API çağrısı yok.

## İçerik/veri yapısı
- Üniteler `content/units/NN-slug.json` dosyalarında tutulur, kod değişmeden yeni ünite eklenir. Şema ve örnek: `docs/technical-plan.md` §3.
- Ses dosyaları: `public/audio/en/<unitId>/<wordId>.mp3`, `public/audio/tr/<lineId>.mp3`; üretim/önbellekleme kontratı `docs/technical-plan.md` §4.
- İlerleme/ölçüm verisi IndexedDB object store'ları (`trials`, `wordProgress`, `sessions`, `parentObservations`, `settings`) — şema: `docs/technical-plan.md` §6.
- **Yeni ünite eklemenin adımları:** (1) `content/units/` altına yeni JSON dosyası ekle, şemaya uy; (2) görselleri/ses referanslarını JSON'da tanımla; (3) `tools/generate_audio` ile sesleri üret; (4) haritada bölge/sıra ata; kod dosyalarına dokunulmaz.

## Dosya/klasör yapısı (şu an)
```
nehir/
├── CLAUDE.md                     # bu dosya
├── ingilizce-uygulama-prompt.md  # orijinal süreç talimatı
├── .env                          # OPENAI_API_KEY (gitignore'da, commit edilmez)
├── .gitignore
└── docs/
    ├── progress.md               # oturum devamlılığı
    ├── curriculum.md             # Aşama 2 çıktısı
    ├── technical-plan.md         # Aşama 3 çıktısı
    └── research/                 # Aşama 1 çıktıları
        ├── evidence.md
        ├── prior-art.md
        └── technical.md
```
Aşama 4'te oluşturulacak hedef yapı için `docs/technical-plan.md` §2'ye bakılmalı.
