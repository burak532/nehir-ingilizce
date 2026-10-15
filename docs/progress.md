# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 4 (MVP) tamamen bitti ve GitHub Pages'te canlı: https://burak532.github.io/nehir-ingilizce/** Sırada: Aşama 5 (test, iPad'de deneme, iyileştirme) için kullanıcı onayı.

Not: Kullanıcı Aşama 2'nin tüm açık sorularını, Aşama 3'teki framework kararını (Vanilla TS+Vite), Aşama 4'teki ses üretim maliyetini/sesini (cedar) ve GitHub yayınlamasını (public, `nehir-ingilizce`, gh CLI ile) onayladı.

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
- [x] `tools/generate_audio/generate.mjs`: cost/sample/full modları, hash önbellek, maliyet tahmini, `.env` anahtar doğrulama.
- [x] Kullanıcı geçerli `OPENAI_API_KEY` sağladı; `.env` güncellendi.
- [x] 15 örnek ses üretildi (4 İngilizce ses × 3 cümle + 3 Türkçe ses × 1 cümle, ~$0.0075) — kullanıcı dinleyip her iki dil için de **"cedar"** seçti.
- [x] Tüm 61 satırın sesi `cedar` ile üretildi (~$0.03 harcandı), `public/audio/`'ya yazıldı.
- [x] Chrome'da gerçek tarayıcı testi yapıldı: açılış→harita→ünite→Dinle-dokun akışı, IndexedDB kaydı, 3sn ebeveyn kilidi, ebeveyn paneli UI, production build'de service worker (41→106 precache girişi, gerçek seslerle) — hepsi çalışıyor.
- [x] Test sırasında bulunan hata düzeltildi: dev modda service worker kaydı artık denenmiyor (sadece production build'de).
- [x] Homebrew yok, bu yüzden GitHub CLI (`gh`) resmi .pkg ile kuruldu; kullanıcı `gh auth login --web` ile giriş yaptı (ilk denemede iki kez gerekti: önce login, sonra `workflow` scope eksikliği için `gh auth refresh`).
- [x] `burak532/nehir-ingilizce` adında **public** repo oluşturuldu, GitHub Pages "GitHub Actions" kaynağıyla etkinleştirildi (`gh api repos/.../pages -X POST -f build_type=workflow`).
- [x] `.github/workflows/deploy.yml` eklendi (checkout→setup-node→npm ci→npm test→npm run build→upload-pages-artifact→deploy-pages), push edildi, ilk deploy başarılı.
- [x] **Bulunup düzeltilen hata:** `vite.config.ts`'deki `base: "./"` doğruydu ama `src/core/image-path.ts` ve `src/audio/audio-manager.ts` mutlak `/images/...`, `/audio/...` yolu kullanıyordu — alt-yolda (`/nehir-ingilizce/`) köke gidip görseller/sesler 404 veriyordu. `import.meta.env.BASE_URL` ile düzeltildi, yerel alt-yol simülasyonuyla ve canlı sitede doğrulandı.
- [x] Canlı site https://burak532.github.io/nehir-ingilizce/ üzerinde tam akış test edildi: harita, görseller, service worker aktif, 102 dosya önbellekte.
- [x] iPad'de "Ana Ekrana Ekle" ve güncelleme akışı kullanıcıya anlatıldı.
- [x] **Aynı Wi-Fi'de Mac'ten dev sürümü deneme çalışmıyor** — kullanıcının iPad'inde (iPadOS 27) Safari `http://` adresleri otomatik `https://`'ye yükseltiyor, yerel Vite dev sunucusu düz HTTP olduğu için bağlantı hiç kurulamıyor (elle yazma, QR kod taratma denendi, hiçbiri çalışmadı — Mac tarafında istek bile görünmüyor). Kullanıcıyla karar: bunun yerine **push → ~1dk bekle → gerçek HTTPS sitesini iPad'de yenile** iş akışı kullanılacak. Yerel dev sunucusu durduruldu.

## Yarım kalan iş / tam olarak nerede kalındı
MVP (prompt Bölüm 7 kapsamı) **tamamen bitti ve GitHub Pages'te canlı**. `npm run build`/`npm run test` temiz geçiyor. Henüz yapılmayanlar: Playwright uçtan uca testleri (Aşama 8 kalite kontrolü kapsamında), gerçek iPad'de Nehir ile deneme (Aşama 5).

## Sıradaki adımlar
1. Kullanıcıdan Aşama 5'e (test, iPad'de deneme, iyileştirme) geçiş onayı al.
2. Playwright WebKit/iPad boyutu uçtan uca testlerini yaz.
3. Gerçek iPad'de Nehir ile deneyip geri bildirim topla (prompt Bölüm 7: "Ben çocukla test edip geri bildirim vermeden yeni ünite ekleme").
4. Bu dosyayı sık güncellemeye devam et.

## Bekleyen sorular
_(şu an yok — GitHub repo adı/görünürlüğü dahil tüm açık sorular yanıtlandı)_

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
