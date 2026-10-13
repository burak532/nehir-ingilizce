# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 3 tamamlandı — `docs/technical-plan.md` yazıldı. Aşama 4'e (MVP geliştirme + ses üretim hattı) geçiş için kullanıcı onayı bekleniyor.**

Not: Kullanıcı Aşama 2'nin tüm açık sorularını (MVP ilk 2 ünite, 13 ünite kapsamı, 1-3-7 gün aralıklı tekrar, "3 kez" Türkçe fading eşiği) onayladı.

## Tamamlanan işler
- [x] `ingilizce-uygulama-prompt.md` okundu.
- [x] Plan modunda Aşama 0 + Aşama 1 planı sunuldu ve onaylandı.
- [x] Git deposu başlatıldı (`git init`).
- [x] `.gitignore` oluşturuldu (`.env` dahil).
- [x] `CLAUDE.md` iskeleti oluşturuldu.
- [x] İlerleme dosyası oluşturuldu.
- [x] Kurulum dosyaları commit'lendi (ilk commit).
- [x] 3 araştırma ajanı paralel çalıştırıldı ve tamamlandı:
  - [x] `docs/research/evidence.md` — bilimsel kanıt taraması (18 "tasarıma çevrilmiş ilke" ile)
  - [x] `docs/research/prior-art.md` — mevcut uygulamalar ve açık kaynak örnekler
  - [x] `docs/research/technical.md` — iPad Safari PWA kısıtları, framework/hosting/TTS önerileri
- [x] Kullanıcıya tek sayfalık özet verildi.

## Yarım kalan iş / tam olarak nerede kalındı
`docs/technical-plan.md` tamamlandı: framework kararı (Vanilla TS+Vite), klasör yapısı, içerik/veri modeli (ünite JSON şeması), ses sistemi (AudioContext unlock), offline/service worker stratejisi (vite-plugin-pwa injectManifest), IndexedDB şeması (trials/wordProgress/sessions/parentObservations/settings), ebeveyn paneli kapsamı, mikrofon/kayıt stratejisi, jest engelleme, GitHub Pages+Actions CI, test stratejisi (Vitest+Playwright WebKit), native taşınabilirlik ilkesi. `CLAUDE.md`'nin "Kodlama kuralları" ve "İçerik/veri yapısı" bölümleri bu kararlarla dolduruldu. **Kullanıcı onayı alınmadan Aşama 4'e (MVP geliştirme) başlanmayacak.**

## Sıradaki adımlar
1. Kullanıcıdan technical-plan.md'deki açık soruları (framework kararı, GitHub repo adı/görünürlüğü) ve Aşama 4'e geçiş onayını al.
2. Onay gelirse: proje iskeletini kur (`npm create vite` + TS template, klasör yapısı, `vite-plugin-pwa`, temel manifest), ilk commit.
3. Ünite 1 (Hello!) ve Ünite 2 (Dino Colors) için `content/units/*.json` içerik dosyalarını curriculum.md'deki kelime/kalıp listesine göre oluştur.
4. Harita, 3 oyun tipi (dinle-dokun, TPR, sürükle-bırak) ve kaydet-dinle akışını MVP kapsamında (prompt Bölüm 7) geliştir.
5. Ses üretim hattını (`tools/generate_audio`) kur — bu noktada `.env` anahtarını düzelt/doğrula, TTS bütçe eşiğini teyit et, Nehir adının telaffuzu için örnek ses üretip kullanıcıya dinlet.
6. `docs/progress.md`'yi sık güncelle, her görevi commit'le.

## Bekleyen sorular (kullanıcıya sorulacak/teyit edilecek — şimdilik engelleyici değil)
- TTS üretim maliyeti onay eşiği şu an örnek olarak "5 USD" — Aşama 5'te gerçek rakamı teyit et.
- MVP'deki 2 ünite örneği "Selamlaşma + Dinozor renkleri" — Aşama 7'de teyit et.
- `.env`'deki `OPENAI_API_KEY` değeri bozuk/tekrarlı görünüyor (aynı anahtar ~3 kez art arda yapıştırılmış gibi) — Aşama 5'ten önce kullanıcıdan doğru anahtarı iste.
- Nehir adının İngilizce TTS'teki telaffuzu — Aşama 5'te örnek üretip kullanıcıya dinlet, onay al.

## Alınan kararlar ve gerekçeleri
- **Git deposu + .gitignore ile başlangıç:** `.env` içindeki API anahtarının yanlışlıkla commit'lenmesini önlemek için proje en başından itibaren versiyon kontrollü ve `.env` gitignore'da.
- **Araştırma 3 paralel genel amaçlı ajanla yapılacak:** Prompt dosyası Bölüm 2'de açıkça 3 ayrı ajan ve 3 ayrı dosya isteniyor; kota kullanımı "sadece araştırma aşamasında paralel ajan kullan" talimatına uygun.

## Araştırmadan çıkan önemli bulgular (Aşama 2'yi etkileyecek)
- **"Ana Ekrana Ekle" (standalone PWA) teknik olarak zorunlu** — Safari'nin 7 günlük ITP veri silme kuralından sadece standalone modda muafiyet var (`technical.md` §1.4).
- **Framework önerisi: Svelte+Vite+TS veya Vanilla TS+Vite** (React gibi ağır çözümler gereksiz) — Aşama 3'te netleştirilecek.
- **Türkçe fading (azaltma) için kesin bir bilimsel zamanlama formülü yok** — "3 kez başarılı oynama" kuralı literatürle doğrulanmış değil, test edilecek bir tasarım varsayımı olarak ele alınmalı (`evidence.md` §6, ilke 15).
- **Kayıt-dinle (record-and-playback) özelliğinin pedagojik etkisi doğrudan kanıtlanmamış** — düşük riskli ama "kesin faydalı" diye sunulmamalı, puanlama/değerlendirme eklenmemeli (`evidence.md` §7, ilke 16).
- **Ödül sistemi göreve içkin olmalı, soyut puan/gem olmamalı** — Reading Eggs'in "gem/coin" modeli ve genel overjustification etkisi nedeniyle kaçınılmalı (`evidence.md` ilke 13, `prior-art.md` §1.5).
- **Duolingo'nun suçluluk/streak mekaniği kesinlikle kaçınılacak bir dark pattern** olarak işaretlendi (`prior-art.md` §1.2, §3).
- **"Öğrenildi" ölçümü dört unsur gerektiriyor:** alıcı + üretici ölçüm, yeni görselle genelleme testi, en az 1 gün gecikmeli tekrar test (`evidence.md` §8, ilke 17) — bu, kullanıcının Bölüm 6'daki beklentisiyle uyumlu, aynen uygulanabilir.
- **Cambridge Pre-A1 listesi 7+ yaş için tasarlanmış**, doğrudan kullanılamaz — sadece "doğrulama kaynağı" olarak kullanılmalı; dinozor/uzay kelime listesi elle küratörlük gerektiriyor (`evidence.md` §9, ilke 18).
