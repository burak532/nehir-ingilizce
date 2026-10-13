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

## Bilinen açık konular (bkz. `docs/progress.md` → "Bekleyen sorular")
- `.env` içindeki `OPENAI_API_KEY` değeri bozuk/tekrarlı görünüyor; Aşama 5'ten (ses üretimi) önce düzeltilmesi/doğrulanması gerekiyor.
- TTS üretim maliyeti onay eşiği ("5 USD") şu an sadece örnek; gerçek rakam Aşama 5'te teyit edilecek.
- MVP'deki ilk 2 ünite ("Selamlaşma + Dinozor renkleri") şu an sadece örnek; Aşama 7'de teyit edilecek.
- Nehir adının İngilizce TTS telaffuzu Aşama 5'te örneklerle onaylanacak.

## Kodlama kuralları
_(Aşama 3 — Teknik plan sırasında doldurulacak: dil/araç seçimi, klasör yapısı, test stratejisi, linting/format kuralları.)_

## İçerik/veri yapısı
_(Aşama 3/4 sırasında doldurulacak: ünite/kelime JSON şeması, ses dosyası referans kuralları, yeni ünite eklemenin adımları.)_

## Dosya/klasör yapısı (şu an)
```
nehir/
├── CLAUDE.md                     # bu dosya
├── ingilizce-uygulama-prompt.md  # orijinal süreç talimatı
├── .env                          # OPENAI_API_KEY (gitignore'da, commit edilmez)
├── .gitignore
└── docs/
    ├── progress.md               # oturum devamlılığı
    └── research/                 # Aşama 1 çıktıları
        ├── evidence.md
        ├── prior-art.md
        └── technical.md
```
