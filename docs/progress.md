# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 4 (MVP geliştirme) kod tarafı tamamlandı. Ses üretimi (tools/generate_audio ile gerçek TTS dosyalarının üretilmesi) kullanıcı girdisine bağlı olarak bekliyor — bkz. "Bekleyen sorular".**

Not: Kullanıcı Aşama 2'nin tüm açık sorularını ve Aşama 3'teki framework kararını (Vanilla TS+Vite) onayladı; GitHub repo adı MVP sonunda belirlenecek.

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
- [x] Node.js v24 (LTS) ve npm kuruldu (kullanıcı onayıyla, resmi nodejs.org paketi).
- [x] Proje iskeleti: Vite+TS, çalışan build/dev server.
- [x] Ünite 1 (Hello!) ve Ünite 2 (Dino Colors) içerik JSON'ları + şema.
- [x] 30 özgün SVG illüstrasyon (her kelime için 2 varyant — genelleme testi için).
- [x] Core: store, router (cleanup destekli), içerik yükleyici, aralıklı tekrar motoru (1-3-7 gün).
- [x] Ses sistemi: tek AudioContext ile kilit açma + preload.
- [x] Harita ekranı (ünite kartları, ilerleme göstergesi, 3sn basılı tutma ile ebeveyn kilidi).
- [x] 4 oyun tipi: Dinle ve dokun, TPR, Sürükle-bırak (Pointer Events), Kaydet-dinle (MediaRecorder, izin reddinde sessiz atlama).
- [x] IndexedDB veri katmanı: trials/wordProgress/sessions/parentObservations/settings, CSV export, persist() isteği.
- [x] Ebeveyn paneli: süre, Türkçe destek düzeyi+fading eşiği, ünite aç/kapa, kelime durumu, gözlem ekleme, CSV indirme, ilerleme sıfırlama (yedek hatırlatmalı), güncelleme bölümü.
- [x] PWA: vite-plugin-pwa (injectManifest), manifest+app ikonları (PIL ile üretildi), kontrollü güncelleme akışı (sadece açılışta veya ebeveyn panelinde), jest engelleme CSS, standalone-mod hatırlatması.
- [x] Vitest: aralıklı tekrar, CSV, içerik şema doğrulama (ajv), IndexedDB katmanı (fake-indexeddb) — 14 test, hepsi geçiyor.
- [x] `tools/generate_audio/generate.mjs`: cost/sample/full modları, hash önbellek, maliyet tahmini, `.env` anahtar doğrulama. `npm run audio:cost` ile test edildi (61 satır, ~$0.03 tahmini — API çağrısı yapılmadan).

## Yarım kalan iş / tam olarak nerede kalındı
Kod tarafı MVP kapsamını (prompt Bölüm 7) karşılıyor ve `npm run build`/`npm run test` temiz geçiyor. **Gerçek ses dosyaları henüz üretilmedi** — bu, kullanıcı onayı/girdisi gerektiren 3 noktada bekliyor (aşağıdaki "Bekleyen sorular"). Playwright uçtan uca testleri ve gerçek iPad'de deneme henüz yapılmadı (Aşama 5/8 kapsamında).

## Sıradaki adımlar
1. Kullanıcıdan: (a) `.env`'e geçerli bir `OPENAI_API_KEY` girmesini, (b) `npm run audio:sample -- --yes` ile üretilecek birkaç örnek sesin (~$0.01 altı) maliyetini onaylamasını iste.
2. Onay gelince `npm run audio:sample -- --yes` çalıştırıp örnekleri kullanıcıya dinlet; İngilizce ses (ve Türkçe destek sesi) seçimini ve Nehir adının telaffuzunu onaylat.
3. Seçilen seslerle `npm run audio:generate -- --voice=<seçilen> --yes` çalıştırıp tüm içerik satırlarının sesini üret (tahmini maliyet ~$0.03, ama kullanıcıya tekrar göster).
4. Playwright WebKit/iPad boyutu uçtan uca testlerini yaz (Aşama 8 kalite kontrolü ile birlikte ya da önce temel bir akış testi).
5. MVP'yi tamamladıktan sonra GitHub'da yayınlamayı, iPad'de Safari'den ana ekrana eklemeyi ve aynı Wi-Fi'de Mac'ten deneme yapmayı adım adım anlat (prompt Bölüm 7).
6. Bu dosyayı sık güncellemeye devam et.

## Bekleyen sorular (kullanıcıdan onay/girdi gerekiyor)
- **`.env`'deki `OPENAI_API_KEY` bozuk** (aynı anahtar ~3 kez art arda yapıştırılmış, 492 karakter) — `npm run audio:sample` bunu otomatik tespit edip hata veriyor. Geçerli bir anahtar girilmeden ses üretilemez.
- **TTS maliyet onayı:** `npm run audio:cost` şu an için ~$0.03 (61 satır, 1338 karakter) gösteriyor — örnek üretim (birkaç ses × birkaç cümle) daha da ucuz. Kullanıcının onayı gerekiyor (prompt Bölüm 9: ücretli her işlem için onay şart).
- **Ses seçimi:** İngilizce ve Türkçe destek sesleri için örnekler henüz üretilmedi/dinletilmedi.
- **Nehir adının telaffuzu:** `npm run audio:sample` çıktısında test edilecek, henüz onaylanmadı.
- MVP'deki 2 ünite "Selamlaşma + Dinozor renkleri" zaten curriculum.md onayıyla netleşti (artık açık değil).

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
