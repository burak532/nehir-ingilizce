# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 1 — Araştırma** (3 paralel ajan çalışıyor: `docs/research/evidence.md`, `prior-art.md`, `technical.md`)

## Tamamlanan işler
- [x] `ingilizce-uygulama-prompt.md` okundu.
- [x] Plan modunda Aşama 0 + Aşama 1 planı sunuldu ve onaylandı.
- [x] Git deposu başlatıldı (`git init`).
- [x] `.gitignore` oluşturuldu (`.env` dahil).
- [x] `CLAUDE.md` iskeleti oluşturuldu.
- [x] Bu ilerleme dosyası oluşturuldu.
- [ ] İlk commit yapılacak (kurulum dosyaları için).
- [ ] 3 araştırma ajanı başlatılacak.

## Yarım kalan iş / tam olarak nerede kalındı
Henüz araştırma ajanları başlatılmadı. Kurulum commit'i yapıldıktan sonra Ajan A/B/C tek mesajda paralel başlatılacak.

## Sıradaki adımlar
1. Kurulum dosyalarını commit'le.
2. Ajan A, B, C'yi paralel başlat (general-purpose, her biri kendi dosyasına yazacak).
3. Üç ajan bitince bulguları tek sayfalık özette birleştir.
4. Bu dosyayı "Aşama 1 tamamlandı, Aşama 2 onay bekliyor" olacak şekilde güncelle.
5. Kullanıcıya özeti ver, açık soruları listele, **dur** (Aşama 2'ye onaysız geçilmeyecek).

## Bekleyen sorular (kullanıcıya sorulacak/teyit edilecek — şimdilik engelleyici değil)
- TTS üretim maliyeti onay eşiği şu an örnek olarak "5 USD" — Aşama 5'te gerçek rakamı teyit et.
- MVP'deki 2 ünite örneği "Selamlaşma + Dinozor renkleri" — Aşama 7'de teyit et.
- `.env`'deki `OPENAI_API_KEY` değeri bozuk/tekrarlı görünüyor (aynı anahtar ~3 kez art arda yapıştırılmış gibi) — Aşama 5'ten önce kullanıcıdan doğru anahtarı iste.
- Nehir adının İngilizce TTS'teki telaffuzu — Aşama 5'te örnek üretip kullanıcıya dinlet, onay al.

## Alınan kararlar ve gerekçeleri
- **Git deposu + .gitignore ile başlangıç:** `.env` içindeki API anahtarının yanlışlıkla commit'lenmesini önlemek için proje en başından itibaren versiyon kontrollü ve `.env` gitignore'da.
- **Araştırma 3 paralel genel amaçlı ajanla yapılacak:** Prompt dosyası Bölüm 2'de açıkça 3 ayrı ajan ve 3 ayrı dosya isteniyor; kota kullanımı "sadece araştırma aşamasında paralel ajan kullan" talimatına uygun.
