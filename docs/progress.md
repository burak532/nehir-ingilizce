# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 4 (MVP) GitHub Pages'te canlı: https://burak532.github.io/nehir-ingilizce/** Kullanıcı beş tur geri bildirim verdi, beşi de düzeltildi/eklendi ve push edildi (aşağıda). Kullanıcının son düzeltmeleri iPad'de yeniden denemesi bekleniyor; Aşama 5'e (Playwright testleri, iyileştirme) henüz geçilmedi.

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

## 3. tur geri bildirim ve düzeltmeler
Kullanıcı: **"Türkçe yönergelerin hepsi gitmiş."** Araştırınca iki ayrı, gerçek hata bulundu:
1. **Kritik regresyon — kendi düzeltmem yeni bir hata yaratmış:** `afinfo` ile ölçtüm, Türkçe tanıtma sesleri aslında 3.5-5.4 saniye sürüyor, ama `word-intro.ts` İngilizce sesi sabit 1800ms'de başlatıyordu. 2. tur'da eklediğim "yeni ses başlarken öncekini kes" güvenlik önlemiyle birleşince, **Türkçe ses her seferinde yarıda kesiliyordu.** Kök çözüm: `audioManager.play()` artık sesin bitişini bekleyen bir `Promise` döndürüyor; `word-intro.ts` artık sabit gecikme yerine `await audioManager.play(trAudio)` ile Türkçenin TAMAMEN bitmesini bekleyip öyle İngilizceyi çalıyor. Chrome'da `AudioContext.currentTime` ölçümüyle doğrulandı: Türkçe tam süresince kesintisiz çalıp bitince (0 gecikmeyle) İngilizce başlıyor.
2. **İçerik eksikliği:** Hello ünitesindeki 7 kelimeden 5'inin (bye-bye, yes, no, thank-you, good-morning) Türkçe cümlesi doğrudan çeviriyi hiç söylemiyormuş — sadece bağlamı anlatıyordu (örn. "Ayrılırken Rex el sallar ve 'bye-bye' der" — 'güle güle' hiç geçmiyor). Dino Colors ünitesinde sorun yoktu (renk kelimesi zaten Türkçe söyleniyordu). 5 cümle düzeltilip ("...bu 'güle güle' demek" gibi) TR sesleri yeniden üretildi (~$0.01, kullanıcı onayıyla).

Kullanıcı ayrıca pedagojik bir soru sordu: kelime öğretirken önce anlamın (Türkçe) netleşmesi gerekmez mi? Cevap: Evet, bu zaten tasarımdı (curriculum.md'deki Cummins CUP/scaffolding ilkesi) — yukarıdaki iki hata yüzünden düzgün çalışmıyordu, tasarım tercihi değildi.

## 4. tur geri bildirim ve eklenen özellik
Kullanıcı: **"Doğru ya da yanlış yaptığına dair geri bildirim yok, bilerek mi?"** — Dinle-dokun ve sürükle-bırak oyunlarında doğru cevapta sadece ince bir yeşil çerçeve, yanlışta sessiz soluklaşma vardı; 4 yaşında bir çocuk için yeterince belirgin değildi. Ayrıca orijinal planda istenen "Great job, Nehir!" gibi ölçülü övgü sesleri hiç eklenmemişti (gözden kaçmıştı, tercih değil). Kullanıcı **tekrarlatmayı değil** daha net geri bildirimi tercih etti (haklı olarak — zorla tekrar ettirmek "cezasız, kendi hızında" ilkesini bozar). Eklenenler:
- `AudioManager`'a ücretsiz, sentezlenmiş (Web Audio `OscillatorNode`, TTS gerektirmez) `playSuccessChime()` (doğru — neşeli yükselen iki ton) ve `playGentleRetryTone()` (yanlış — yumuşak, cezalandırıcı olmayan alçalan ton) eklendi.
- `content/shared/praise.json` ile 4 ölçülü İngilizce övgü cümlesi ("Great job, Nehir!", "Well done!", "You did it!", "Nice, Nehir!") eklendi, sesleri üretildi (~$0.00, kullanıcı onayıyla, cedar sesi).
- `listen-touch.ts` ve `drag-drop.ts`: doğru cevapta görsel "pop" animasyonu (scale) + chime + ~%35 ihtimalle (ölçülü, her seferinde değil) bir övgü cümlesi; yanlışta yumuşak ton + doğru cevabın belirgin vurgulanması. Sürükle-bırak'ta yumuşak ton tur başına sadece bir kez çalıyor (tekrar fumble'larda rahatsız etmesin diye).
- Chrome'da uçtan uca test edildi (doğru ve yanlış cevap akışları, konsol hatasız).

## 5. tur geri bildirim ve düzeltmeler
Kullanıcı: **"Hâlâ good morning gibi kelimelerin Türkçesi söylenmiyor, spin around gibi kelimelerin de Türkçesi söylenmiyor — ilk öğretirken Türkçe söylenmesi gerekiyordu, sonraki sesli tekrarlarda gerekmeyebilir."** İki ayrı kök neden bulundu:
1. **Kalıcı durum sorunu (muhtemelen asıl sebep):** `settings.unitsIntroduced[unitId]` bir kez `true` olunca kalıcı (IndexedDB'de) kalıyor — kullanıcı daha önce Hello ünitesinin tanıtma ekranını bir kez gördüğü için (3. tur düzeltmelerinden ÖNCE), cihazında bu bayrak hâlâ `true` ve uygulama her girişte tanıtma ekranını atlayıp doğrudan oyuna geçiyor; içerik ne kadar düzeltilirse düzeltilsin bir daha hiç gösterilmiyordu. **Kök çözüm:** `unitsIntroduced: boolean` yerine `unitsIntroducedHash: Record<string, string>` — ünitenin kelime+introTr içeriğinden hesaplanan bir hash saklanıyor (`core/content.ts` → `getUnitContentHash`). İçerik her değiştiğinde hash de değişir, tanıtma ekranı otomatik tekrar tetiklenir; elle "ilerlemeyi sıfırla" yapmaya gerek kalmaz. Eski kullanıcılarda da (hash alanı hiç yoktu) otomatik olarak bir kerelik yeniden tetiklenir.
2. **İçerik eksikliği — TPR komutları:** "Spin around!" gibi TPR hareket komutları ünite kelime dağarcığının parçası değil, bu yüzden tanıtma ekranında hiç geçmiyor ve Türkçeleri hiç yoktu. `content/shared/tpr.json`'a Türkçe metin+ses eklendi (Ellerini salla!/Zıpla!/Dön!); `tpr.ts` artık oyun tipi "nasıl oynanır" açıklamasıyla aynı azalan eşiğe göre (ilk birkaç kez) her komuttan önce Türkçesini söylüyor, `generate_audio` scripti de shared içerikteki `tr`/`audioTr` alanlarını işleyecek şekilde güncellendi.

## 6. tur geri bildirim ve düzeltmeler
Kullanıcı 5. tur düzeltmelerinin (özellikle `unitsIntroducedHash` kalıcı-durum düzeltmesi) cihazına **hâlâ ulaşmadığını** bildirdi — "tam kapat-aç" yapmasına rağmen. Canlı sitede Chrome üzerinden (temiz IndexedDB, eski service worker kaydı silinmiş, önbellekler temizlenmiş) doğrudan test edildi: JS paketinin hash'i en son commit ile birebir eşleşiyor, `AudioContext.currentTime` log'ları TR→EN sesinin doğru metinle ve sıfır boşlukla çaldığını gösteriyor — yani **sunucudaki kod tamamen doğru**. Sonuç: sorun, kullanıcının cihazındaki service worker'ın yeni sürümü hiç fark etmemesi/uygulamaması olmalı. Kök neden: `sw-register.ts` güncellemeyi yalnızca kullanıcı başlangıç ekranındaysa uyguluyordu — kullanıcı her zaman oyun ortasında kapatıp açtığı için bu koşul hiç sağlanmıyordu.
- `src/core/sw-register.ts` yeniden yazıldı: artık yeni bir service worker bulunduğunda ekran ne olursa olsun **hemen** `SKIP_WAITING` gönderiliyor ve sayfa otomatik yenileniyor; `registration.waiting` varsa (önceki ziyarette hiç uygulanmamışsa) o da hemen uygulanıyor; her sayfa yüklemesinde `registration.update()` ile aktif olarak güncelleme soruluyor.
- Ayrıca kullanıcı **ebeveyn kilidi (dişli) ikonunun iPad'de göründüğünü ama "çok köşede, şarj/saat bilgilerinin altında kaldığını"** bildirdi. `src/map/map-screen.ts`'de `top:12px; right:12px` sabit değerleri `calc(env(safe-area-inset-top, 0px) + 12px)` / `calc(env(safe-area-inset-right, 0px) + 12px)` ile değiştirildi (iOS durum çubuğunu artık hesaba katıyor); ayrıca görünürlüğü artırmak için arka plan opaklığı, beyaz kenarlık ve gölge eklendi.
- Kullanıcı **sesin yüksekliğinin sayfadan sayfaya değiştiğini** bildirdi — farklı TTS seslendirme çağrıları arasında doğal seviye farkı vardı. `src/audio/audio-manager.ts`'e RMS tabanlı ses seviyesi normalizasyonu eklendi: her ses dosyası yüklenirken RMS'i hesaplanıp referans bir hedefe (0.1) göre kazanç (gain, 0.4–3 arası sınırlı) hesaplanıyor ve çalma sırasında bir `GainNode` ile uygulanıyor — tüm sesler artık benzer algılanan seviyede çalıyor.

## 7. tur geri bildirim ve düzeltme
Kullanıcı: **"Bu kırmızı bir dinozor. İngilizce'de buna red deriz diyor, bu açık değil — 'kırmızıya red deriz' gibi daha net bir Türkçe açıklama ekle, diğer renkleri de aynı şekilde güncelle."** Eski kalıp ("Bu kırmızı bir dinozor — İngilizce'de 'red' deriz") "deriz"in dinozora mı renge mi atıfta bulunduğunu belirsiz bırakıyordu. `content/units/02-dino-colors.json`'daki 8 rengin tamamı (red/blue/yellow/green/orange/purple/pink/brown) kullanıcının önerdiği -e/-a hal ekiyle netleştirilmiş kalıba güncellendi (örn. "Bu kırmızı bir dinozor. İngilizce'de kırmızıya 'red' deriz."), 8 Türkçe ses dosyası yeniden üretildi (~$0.01, kullanıcı onayıyla).

## 8. tur geri bildirim ve düzeltmeler
Kullanıcı: **"Tekrar başladığında kelimelerin Türkçelerini söylediği kısmı atlıyor — haritadan tekrar dokununca tanıtma kısmı tekrar gösterilsin ama skip etmeye izin veren bir tuş da olsun. Renkler için de aynısını yap. 'Please'in Türkçesini söylemiyor sanırım, başa dönmediği için kontrol edemedim. Kelimelerden birinin Türkçesi yok. Nest oyununda dinozorlar çok yukarıda, tekrar dinle çok aşağıda, bazı kısımlar ekrandan taşıyor."** Dört ayrı konu:

1. **Tasarım değişikliği — tanıtma ekranı artık her girişte gösteriliyor:** 5. turda eklenen `unitsIntroducedHash` mekanizması "içerik değişmediyse bir daha hiç gösterme" davranışını koruyordu — ama kullanıcı artık bunun yerine "her zaman göster, ama atlanabilir olsun" istiyor. `src/map/unit-intro.ts`'deki hash kontrolü tamamen kaldırıldı — "Başla" artık her zaman `word-intro` ekranına gidiyor. `src/map/word-intro.ts`'ye sağ üstte (safe-area'ya duyarlı) bir **"Atla ⏭"** düğmesi eklendi, her an basılıp doğrudan oyuna geçilebiliyor. Artık kullanılmayan `unitsIntroducedHash` alanı `SettingsRecord`'dan, `getUnitContentHash` fonksiyonu `core/content.ts`'den tamamen silindi (ölü kod bırakılmadı). Bu değişiklik hem Hello hem Dino Colors ünitelerini otomatik olarak kapsıyor (ortak `word-intro.ts` bileşeni).
2. **"please" sesi şüphesi:** İçerik metni ('lütfen' demek) her zaman doğruydu ve `please-intro.mp3` dosyası da mevcuttu, ama kullanıcı tanıtma ekranını bir daha göremediği için (madde 1'deki eski kalıcı-atlama hatası) kendi kulağıyla doğrulayamamıştı. Riski azaltmak için Hello ünitesindeki 7 kelimenin tamamının `introTr` metni tutarlı iki-cümlelik kalıba ("X der. Bu 'Y' demek." — 7. turda Dino Colors'a uygulanan netlik ilkesiyle aynı) çevrildi ve sesleri yeniden üretildi (~$0.01, kullanıcı onayıyla); "please" dahil tüm dosyaların sunucudan taze servis edildiği doğrulandı (fetch + boyut kontrolü).
3. **"Bir kelimenin Türkçesi yok" şüphesi:** Hem Hello (7) hem Dino Colors (8) ünitelerindeki tüm 15 kelimenin `introTr` metni ve karşılık gelen `tr-intro.mp3` dosyası tek tek kontrol edildi — hepsi mevcut, boş değil. İçerik tarafında eksik bulunamadı; büyük olasılıkla 6. turdaki service worker güncelleme sorununun bir başka belirtisi (kullanıcının cihazı eski önbellekli bir ses dosyasını çalıyor olabilir) — 6. tur düzeltmesinin (SW her zaman anında uygulanıyor) bu sorunu da çözmesi bekleniyor; tekrar görülürse hangi kelime olduğu netleştirilip ayrıca bakılacak.
4. **Sürükle-bırak (yuva) oyunu düzen hatası:** `src/games/drag-drop.ts`'deki dış kapsayıcı `justify-content:space-between` kullanıyordu — bu da 3 çocuğu (dinozorlar/yuva/tekrar dinle düğmesi) ekranın en üstüne, tam ortasına ve en altına sabitliyordu; gerçek görünür yükseklik beklenenden farklı olduğunda taşmaya yol açıyordu. `justify-content:center` + sabit `gap:2.5rem` + `overflow:hidden` + `box-sizing:border-box`'a geçildi — üç öğe artık ekranın ortasında bir grup halinde, taşmadan duruyor. Chrome'da uçtan uca doğrulandı (ekran görüntüsü: dinozorlar/yuva/tekrar dinle hepsi ortada, taşma yok).

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
