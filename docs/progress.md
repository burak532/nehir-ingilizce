# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 4 (MVP) GitHub Pages'te canlı: https://burak532.github.io/nehir-ingilizce/** Kullanıcı iki tur geri bildirim verdi, ikisi de düzeltildi ve push edildi (aşağıda). Kullanıcının 2. tur düzeltmeleri iPad'de yeniden denemesi bekleniyor; Aşama 5'e (Playwright testleri, iyileştirme) henüz geçilmedi.

**Önemli not (güncelleme davranışı):** Kullanıcı ilk düzeltmeden sonra "hâlâ eski sürüm görünüyor" dedi — sebep PWA'nın service worker güncellemesini uygulaması için uygulamanın **tamamen kapatılıp yeniden açılması** gerekmesiydi (arka planda askıda kalan bir sekme güncellemeyi yakalamıyor). Tam kapat-aç ile çözüldü. Gelecekte benzer şikayet gelirse önce bunu söyle.

Not: Kullanıcı Aşama 2'nin tüm açık sorularını, Aşama 3'teki framework kararını (Vanilla TS+Vite), Aşama 4'teki ses üretim maliyetini/sesini (cedar) ve GitHub yayınlamasını (public, `nehir-ingilizce`, gh CLI ile) onayladı.

## Kullanıcı geri bildirimi (iPad'de ilk deneme) ve yapılan düzeltmeler
Kullanıcı 3 sorun bildirdi:
1. **"Türkçe başlayıp azalacak demiştik, hiç Türkçe yok."** Kök neden: `introTr` alanı içerikte vardı, TR sesleri de üretilmişti, ama hiçbir oyun ekranı bunları göstermiyor/çalmıyordu — tasarlandı ama bağlanmamış bir özellikti.
2. **Hello ünitesindeki ikonlar anlaşılmıyor** (özellikle "please"). Kök neden: soyut sosyal ifadeler (please, thank you, good morning vb.) somut nesnelerden daha zor ikonlanır (zaten `evidence.md`'nin kendi bulgusu). İlk çizimler yetersizdi.
3. **"Put the green one in the nest" — ne yapılacağı anlaşılmıyor, Türkçe yönerge yok.** Kök neden: curriculum.md'de tasarlanan "oyun tipi ilk kez geldiğinde Türkçe açıklama" kuralı hiçbir oyun ekranında kodlanmamıştı.

Kullanıcı üçünü de düzeltmemi onayladı, soyut kelimeler için "somutlaştıramazsan değiştirebilirsin" dedi. Yapılanlar:
- **Yeni "tanıtma" ekranı** (`src/map/word-intro.ts`): ünite ilk kez açıldığında her kelime için Türkçe çerçeveleme cümlesi (metin+ses) + İngilizce kelime gösteriliyor. `settings.unitsIntroduced` ile bir kez gösterilip sonraki girişlerde atlanıyor.
- **Oyun tipi Türkçe "nasıl oynanır" açıklaması** (`src/core/game-intro.ts`): her oyun tipi ilk `turkishFadeThresholdPlays` (varsayılan 3) kez tamamlanana kadar başlamadan önce kısa Türkçe açıklama gösteriliyor (`settings.gamePlaysCount` ile takip).
- **Hello ünitesi ikonları yeniden çizildi** (14 SVG): thumbs-up (yes), düz "dur" eli (no), kenetlenmiş eller (please), kalp (thank-you), güneş (good-morning) gibi daha evrensel semboller; hello/bye-bye zemin rengi+bağlam farkıyla (güneş vs ufuk çizgisi) birbirinden ayrıldı. Kelime değiştirilmedi — ikon kalitesi + artık gösterilen Türkçe anlatım yeterli görüldü.
- Chrome'da sıfır IndexedDB ile uçtan uca test edildi: Türkçe tanıtma ekranı, oyun Türkçe açıklaması ve yeni ikonlar hepsi doğrulandı.

## 2. tur geri bildirim ve düzeltmeler
Kullanıcı (tam kapat-aç ile güncellemeyi gördükten sonra) 2 yeni sorun bildirdi:
1. **"İngilizce kelimelerin sesleri üst üste biniyor."** Kök neden: `word-intro.ts`'de Türkçe sesten 1.8sn sonra İngilizce sesi çalan `setTimeout`, kullanıcı "İleri"ye hızlı basınca iptal edilmiyordu — önceki kelimenin gecikmeli İngilizce sesi yeni kelimenin üzerine biniyordu. Düzeltme: (a) `audioManager.play()` artık yeni ses başlarken önceki çalan sesi kesiyor (genel/savunmacı çözüm), (b) `word-intro.ts`'de bekleyen timeout artık kelime değişince `clearTimeout` ile iptal ediliyor (kök neden çözümü).
2. **"Görseller yine anlaşılmıyor, bazıları çerçeve dışına taşıyor."** Kullanıcı çözüm olarak animasyon önerdi ("hello'daki el sallamak iyi fikir, böyle somut şeyler bul"); ücretsiz yol (kendi SVG'lerimize CSS animasyonu) ile ücretli yol (AI ile video/GIF üretimi) arasında seçim sundum, kullanıcı ücretsiz yolu onayladı. 14 ikon komple yeniden tasarlandı: başparmak zıplaması (yes), sallanan surat (no, artık yüz bazlı — daha evrensel), kenetli ellerin "yalvarma" zıplaması + parmak detayları (please), atan kalp (thank-you), dönen güneş ışınları (good-morning), el sallarken uzaklaşma hareketi (bye-bye). Her SVG'ye gömülü `<style>` + `@keyframes` eklendi, `prefers-reduced-motion` desteklendi. Önceki taşma hatası (bye-bye-alt) da bu yeniden yazımda düzeltildi.
3. **Test sırasında önemli bir yanlış pozitif bulundu ve düzeltildi:** Chrome'da animasyonu doğrularken iki ekran görüntüsü arasında 1 saniye beklemek "animasyon çalışmıyor" izlenimi verdi — sebep, animasyon periyodunun (1s) tam olarak bekleme süresiyle çakışması (aliasing). 0.35sn ve 2.5sn gibi periyotla örtüşmeyen gecikmelerle tekrar test edilip hem `<img>` hem `<object>` embed'de animasyonun gerçekten çalıştığı doğrulandı — mimari değişiklik gerekmedi.

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
1. **Kullanıcının iPad'de Nehir ile denemesini ve geri bildirimini bekle** — prompt Bölüm 7: "Ben çocukla test edip geri bildirim vermeden yeni ünite ekleme" talimatına uygun, bu arada kapsam genişletilmeyecek.
2. Geri bildirim gelince: bulunan sorunları değerlendirip düzelt, gerekirse curriculum.md/technical-plan.md kararlarını gözden geçir.
3. Playwright WebKit/iPad boyutu uçtan uca testlerini yaz (Aşama 8 kalite kontrolü, geri bildirim sonrası ya da paralel yapılabilir).
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
