# Prior Art Araştırması — Nehir için İngilizce Öğrenme PWA

**Tarih:** 2026-10-13
**Kapsam:** 4 yaşında, Türkçe ana dilli, İngilizce bilmeyen bir çocuk için; dinozor/hayvan/uzay temalı; iPad'de Safari'den "Ana Ekrana Ekle" ile kullanılacak; reklamsız, dış bağlantısız, veri toplamayan bir PWA tasarımı için referans araştırması.

> Not: Bu belgedeki tüm bilgiler kamuya açık incelemeler, mağaza sayfaları, blog yazıları ve GitHub depolarından derlenmiştir. Doğrudan koddan hiçbir satır alınmamıştır — sadece desen/mimari fikirleri özetlenmiştir. Emin olunamayan noktalar "doğrulanamadı" şeklinde işaretlenmiştir.

---

## 1. Ticari çocuk uygulamaları — etkileşim desenleri

### 1.1 Khan Academy Kids
- **Kaynak:** [Khan Academy Kids – Google Play](https://play.google.com/store/apps/details?id=org.khankids.android), [Common Sense Media incelemesi](https://www.commonsensemedia.org/website-reviews/khan-academy), [ideausher.com analiz yazısı](https://ideausher.com/blog/create-app-like-khan-academy-kids/)
- **Navigasyon:** Okuma gerektirmeyen bir yapı. Çocuk, dostça bir hayvan karakteri tarafından karşılanıyor ve tek, büyük bir "Play" butonuna yönlendiriliyor. İkon tabanlı, büyük dokunma alanları (large tap targets) var; her ekranda sesli yönlendirme (read-aloud navigation) mevcut.
- **Ses kullanımı:** Karakter liderliğinde sesli geri bildirim (character-led feedback); pozitif sesler ve animasyonlar doğru cevaplarda ödül olarak kullanılıyor.
- **Geri bildirim:** Ceza/olumsuz geri bildirim yok gibi görünüyor — doğrulanamadı net detay, ama genel konsensüs "hata = nazik yönlendirme" şeklinde.
- **İlerleme/harita:** Konular "skill tree" (beceri ağacı) şeklinde organize edilmiş — yıldız takımyıldızı gibi görselleştirilmiş bir öğrenme yolu (ana Khan Academy platformunda; Kids sürümünde daha basit bir yapı kullanılıyor, net ayrım doğrulanamadı).
- **Ödül:** Rozetler ve ödül sistemi var; detaylı mekanik doğrulanamadı.
- **Dark pattern durumu — TEMİZ:** Common Sense Media'ya göre %100 ücretsiz, reklam yok, uygulama içi satın alma yok, premium katman yok, üçüncü taraf takip/profil çıkarma yok, COPPA uyumlu. Bu alanda **referans/altın standart** olarak değerlendiriliyor.
- **Lisans/erişim:** Kapalı kaynak, ticari (ücretsiz) uygulama.

### 1.2 Duolingo ABC (Duolingo Kids)
- **Kaynak:** [Educational App Store incelemesi](https://www.educationalappstore.com/app/duolingo-abc), [Pastory güvenlik incelemesi](https://pastory.app/articles/is-duolingo-abc-good-and-safe-for-kids/), [screensdesign.com showcase](https://screensdesign.com/showcase/learn-to-read-duolingo-abc)
- **Navigasyon:** Büyük butonlar + ses/görsel ipuçlarıyla 3 yaşındaki bir çocuğun bile minimum yardımla gezinebileceği basitlik.
- **Mekanikler:** Fonetik dersler "misyon" olarak sunuluyor (örn. bir harfi izleyerek karakteri köprüden geçirmek, harf seslerine dokunarak baloncuk patlatmak).
- **Geri bildirim:** Doğru cevaplarda parıldayan madeni para animasyonu + tatmin edici sesler; yanlışta cezalandırıcı değil, sesli/görsel ipucu + "tekrar dene" teşviki.
- **Dark pattern durumu — TEMİZ (bu alt-ürün özelinde):** Duolingo ABC'nin kendisi ücretsiz, reklamsız bir ürün olarak pazarlanıyor.
- **UYARI — ana Duolingo uygulamasından öğrenilecek KÖTÜ desen:** Ana Duolingo (yetişkin) uygulamasında yoğun şekilde eleştirilen bir **suçluluk/kaygı tabanlı dark pattern** var: seri (streak) kaybı korkusu, "Duo'yu üzdün" bildirimleri, üzgün/küskün baykuş yüz ifadeleri. Bu, kaybetme-korkusu (loss aversion) üzerinden motivasyon kurma örneği. ([Duolingo Owl, Dark Patterns, and Digital Guilt](https://opinionsandconditions.substack.com/p/duolingo-owl-dark-patterns-digital-guilt), [screenwiseapp.com – Duolingo Streaks and Anxiety in Kids](https://screenwiseapp.com/guides/duolingo-streaks-and-anxiety-in-kids)) **Nehir projesi için bu kesinlikle kaçınılması gereken bir desen** — 4 yaşındaki bir çocukta suçluluk/kayıp kaygısı yaratacak hiçbir bildirim, karakter yüz ifadesi veya "serini kaybettin" mesajı olmamalı.
- **Lisans/erişim:** Kapalı kaynak, ticari.

### 1.3 Lingokids
- **Kaynak:** [Common Sense Media incelemesi](https://www.commonsensemedia.org/app-reviews/lingokids-play-and-learn), [safeappsforkids.com incelemesi](https://safeappsforkids.com/en/app/lingokids---play-and-learn-global/)
- **Durum:** KidSAFE sertifikalı, reklamsız; abonelik modeli var ama belirgin bir "satın almaya zorlama" dark pattern'i tespit edilmemiş.
- **UYARI — orta düzey sorun:** Bazı kullanıcılar abonelik/deneme süresi şartlarının net olmadığını, ücretlendirme bilgisini bulmanın zor olduğunu bildirmiş (fiyat şeffaflığı sorunu, klasik "zorlama" dark pattern'i değil ama kafa karıştırıcı UX).
- **Nehir projesi için önemi:** Düşük — proje ücretsiz/aboneliksiz olacağı için bu risk zaten yok, ama "gizli/karmaşık şartlar" fikrinin kendisi, şeffaf olmayan her tür UI'dan kaçınmak için hatırlatıcı olarak not edildi.
- **Lisans/erişim:** Kapalı kaynak, ticari (abonelik).

### 1.4 Endless Alphabet
- **Kaynak:** [Macworld incelemesi](https://www.macworld.com/article/221077/review-your-kids-will-love-learning-with-endless-alphabet-for-ios.html), [safeappsforkids.com incelemesi](https://safeappsforkids.com/en/app/endless-alphabet/)
- **Tasarım felsefesi — ÖRNEK ALINACAK EN İYİ PRATİK:** Puan, skor, zaman sınırı YOK. Çocuk istediği kadar yavaş/hızlı oynayabilir, hız ne olursa olsun aynı ödülü (kelimenin canlanması/komik animasyon) alır.
- **Ceza yok:** Zamanlayıcı, yüksek skor tablosu veya kırmızı "TEKRAR DENE" uyarı banner'ı YOK. Oynamanın kendisi ödül olarak tasarlanmış — ekstra rozet/puan sistemi otizm spektrumundaki veya gelişimsel gecikmesi olan çocuklar dahil tüm erken okuyucular için "suçsuzluk hissi" (guilt-free) yaratıyor.
- **Nehir projesi için önemi — YÜKSEK:** 4 yaşındaki, henüz hiç İngilizce bilmeyen bir çocuk için bu "baskısız, cezasız, kendi hızında" felsefesi doğrudan uygulanabilir ana ilke olmalı.
- **Lisans/erişim:** Kapalı kaynak, ticari (Originator Inc.).

### 1.5 Reading Eggs
- **Kaynak:** [Reading Eggs resmi SSS](https://readingeggs.com/info/faqs/), [howtohomeschool.com incelemesi](https://www.howtohomeschool.com/curriculum-reviews/reading/our-reading-eggs-product-review)
- **İlerleme/harita yapısı:** "Progress map" + sticker sistemi — her ders sonunda haritaya sticker eklenir (somut, görsel ilerleme takibi). 130 ders, 3 seviyeye bölünmüş ("Starting Out", "Beginning to Read", "Building Confidence"). Yeni kitap/seviye açmak için belirli sayıda ders tamamlamak gerekiyor (kilit/açma mantığı).
- **Ödül:** Altın yumurtalar (golden eggs), Yeti coin'leri ve gem'ler gibi sanal para/koleksiyon ödülleri; harita üzerindeki quiz'lerle ilerleme doğrulanıyor.
- **Nehir projesi için önemi:** "Harita + sticker" fikri somut ve çocuk dostu; ancak sanal para/coin biriktirme mekaniği muhtemelen gereksiz karmaşıklık (4 yaşında bir çocuk için "gem" kavramı anlam taşımayabilir) — basit yıldız/sticker tercih edilmeli.
- **Lisans/erişim:** Kapalı kaynak, ticari (abonelik).

### 1.6 Novakid
- Canlı, öğretmenli (1:1 video ders) bir İngilizce öğretme servisi olduğu için uygulama içi oyun/harita mekaniklerine dair güvenilir, detaylı kamuya açık bilgi bulunamadı — **doğrulanamadı**. Bu nedenle bu projeye doğrudan aktarılabilecek bir desen tespit edilemedi.

### 1.7 Genel gözlem — ticari uygulamalar arası ortak iyi/kötü desenler
- **İYİ (ortak):** İkon + ses tabanlı, okuma gerektirmeyen navigasyon; büyük dokunma hedefleri; karakter/mascot aracılığıyla yönlendirme; kendi hızında ilerleme; doğru cevapta kısa, net, pozitif ses+animasyon; yanlış cevapta cezalandırıcı değil yönlendirici geri bildirim (ikinci şansı sun, cevabı göster).
- **KÖTÜ (bazı uygulamalarda / sektörde yaygın, FTC raporlarında belgelenmiş):**
  - Sahte/yanıltıcı bildirimler ve suçluluk temelli push mesajları (Duolingo örneği).
  - "Bir tane daha" zorlaması — sonsuz oturum döngüsü, doğal bir bitiş noktası olmaması.
  - Yaşa uygunsuz reklam ve reklam-oyun karışımı (advergames).
  - Uygulama içi satın alma baskısı: FTC'nin 2022 "Bringing Dark Patterns to Light" raporuna göre, çocuk oyunlarında bir seviyeyi ilerletmek için kullanılan yeşil bir butonun aniden "Satın Al" butonuna dönüşmesi gibi, çocukları art arta tıklama alışkanlığından yararlanan tuzaklar belgelenmiş. Epic Games bu konuda FTC ile 500M$ üzerinde anlaşmaya varmıştı. ([FTC raporu PDF](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800+Dark+Patterns+Report+9.14.2022+-+FINAL.pdf), [FTC basın duyurusu](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers))
  - Belirsiz/karışık abonelik ve deneme süresi şartları (Lingokids örneğinde kullanıcı şikayeti).

---

## 2. Açık kaynak / teknik projeler (GitHub, bloglar)

### 2.1 little-learners-pwa
- **Kaynak:** [github.com/umeshsenadeera6-cell/little-learners-pwa](https://github.com/umeshsenadeera6-cell/little-learners-pwa)
- **Hedef kitle:** 3-6 yaş, harfler/sayılar/renkler/hayvanlar/şekiller/kelimeler.
- **Teknoloji:** Vanilla JavaScript (ES modules), framework yok; statik sunulabilir basit yapı.
- **Offline stratejisi:** PWA, ilk ziyaretten sonra tam offline. App shell için **precache**, yazı tipi/medya için **stale-while-revalidate**; varsayılan cache-first yaklaşım.
- **Oyun mekanikleri:** Yıldız + rozet sistemi (merkezi bir `Store.notify()` mekanizmasıyla takip ediliyor), 5 mini oyun, modül bazlı quiz doğru/yanlış takibi, konfeti/yıldız kutlama animasyonları.
- **Lisans:** README'de genel proje lisansı belirtilmemiş; sadece Andika fontunun SIL Open Font License altında olduğu not edilmiş. **Kodu kopyalamadık, sadece mimari deseni not ettik.**
- **Nehir projesi için önemi — YÜKSEK:** Hedef yaş aralığı ve "ücretsiz, reklamsız, offline-first, framework'süz" felsefesi doğrudan örtüşüyor. Basit vanilla JS + service worker mimarisi, bu projenin PWA tarafı için makul bir referans teknik yaklaşım.

### 2.2 kids-education-app (Recorator)
- **Kaynak:** [github.com/Recorator/kids-education-app](https://github.com/Recorator/kids-education-app)
- **Hedef kitle:** 7-15 yaş (Nehir'den daha büyük yaş grubu, ama mimari fikirler aktarılabilir).
- **Teknoloji:** React 18 + TypeScript, Vite 5, Tailwind CSS 3, Zustand (state), IndexedDB (AES-256-GCM şifreleme ile), vite-plugin-pwa, tiny-tts (ONNX tabanlı, tamamen cihaz-içi/offline ses sentezi, ~6MB model).
- **Mimari ilke:** "Hiçbir çocuk verisi cihazdan çıkmaz" — privacy-first, tamamen yerel (local-first) mimari.
- **Offline stratejisi:** Service worker ile app shell + varlık önbellekleme; TTS modeli bir kez indirildikten sonra tamamen offline çalışıyor.
- **Mimari yapı:** Oyunlar bağımsız modüller (`src/games/*`), merkezi bir AI orkestratör dosyası, çocuk+konu bazlı öğrenme belleği, ayrı çocuk/ebeveyn arayüzleri.
- **Lisans:** Belirtilmemiş — doğrulanamadı.
- **Nehir projesi için önemi:** On-device TTS (tiny-tts/ONNX) fikri, "dış bağlantısız" gereksinimiyle doğrudan örtüşüyor — İngilizce seslendirme için harici bir API'ye bağlı kalmadan cihaz üzerinde üretim yapmak mümkün olabilir (teknik fizibilite ayrıca değerlendirilmeli). Ayrıca çocuk/ebeveyn ayrı arayüz deseni faydalı olabilir (örn. ebeveynin ilerlemeyi görebileceği basit bir ekran).

### 2.3 OfflineOrbit
- **Kaynak:** [github.com/Anagha-SR22/OfflineOrbit](https://github.com/Anagha-SR22/OfflineOrbit)
- **Hedef:** İnternetin güvenilmez olduğu okul sınıfları için PWA, yerel dil + İngilizce içerik.
- **Teknoloji:** Vanilla JS, HTML5, CSS3, Vite ile geliştirme; büyük framework yok. Service Worker, IndexedDB, BroadcastChannel, Web Speech API, Web App Manifest kullanılıyor.
- **İlke:** "Offline varsayılan, internet isteğe bağlı."
- **Veri yapısı:** Merkezi `progress` object store; `studentId::lessonId` bileşik anahtarı; ders/soru denemeleri, puanlar, zaman damgaları, senkronizasyon durumu saklanıyor.
- **Lisans:** Belirtilmemiş — doğrulanamadı.
- **Nehir projesi için önemi:** Web Speech API kullanımı (tarayıcı-içi TTS, ek model indirmeden) basit ve hızlı bir alternatif olarak not edildi — iOS Safari'de Web Speech API desteği sınırlı/değişken olabilir, bu ayrıca doğrulanmalı.

### 2.4 Antura ("Learn with Antura")
- **Kaynak:** [github.com/vgwb/Antura](https://github.com/vgwb/Antura)
- **Tanım:** Ödüllü, açık kaynak okuryazarlık ve dil öğrenme oyunu (Arapça, Darija, İngilizce, Fransızca, Lehçe).
- **Teknoloji:** Unity 6.x (oyun motoru) — iOS/Android/masaüstü.
- **Lisans:** Yazılım **BSD 2-Clause**; sanat varlıkları (görsel, 3D model, animasyon, ses) **CC BY 4.0**.
- **Not:** Proje v3.0 için aktif geliştirme aşamasında (doğrulanamadı — 2026 yayın tarihi bekleniyor olarak not edilmiş, kesin değil).
- **Nehir projesi için önemi:** Düşük-orta — Unity tabanlı bir oyun motoru mimarisi PWA hedefiyle uyumlu değil, ancak "çoklu dil öğrenme oyunu, açık lisanslı sanat varlıkları" modeli ilham kaynağı olarak not edilebilir. Kod kopyalanmadı.

### 2.5 eduActiv8
- **Kaynak:** eduactiv8.org (bu oturumda doğrudan erişilemedi — ağ hatası; önceki arama sonucu özeti kullanıldı, **doğrulanamadı/ikincil kaynak**)
- **Tanım (arama sonucu özeti):** 3-10 yaş için matematik, dil, mantık, hafıza aktiviteleri içeren ücretsiz koleksiyon; Windows/macOS/Linux'ta tamamen offline çalışıyor, reklamsız, hesap gerektirmiyor.
- **Nehir projesi için önemi:** Düşük (masaüstü odaklı, PWA değil) — sadece "reklamsız/hesapsız/offline" felsefesinin tekrar doğrulanması amacıyla not edildi.

### 2.6 Claude / AI ile yapılan çocuk uygulamaları
- **K-3 Education App (lookitsKB)** — [github.com/lookitsKB/K-3-Education-App](https://github.com/lookitsKB/K-3-Education-App)
  - "Claude tarafından yapılan" K-3 app olarak tanımlanıyor; okuma/matematik için **mastery-learning** tutor.
  - Teknoloji: Framework'süz vanilla JS, tek `index.html` dosyası, kurulum gerektirmiyor.
  - Mastery mekanizması: ~20 soruluk yerleştirme testi; "son 6 sorudan 5'i doğru" mastery kriteri; 1/3/7/21/60 gün aralıklı spaced repetition; bir hata hakkı sonra cevabı gösterme; 3 hatadan sonra o beceriyi bir sonraki oturuma kadar durdurma.
  - Offline: Şu an sadece browser localStorage; iPad hosting ve offline "missions" planlı ama henüz yapılmamış (README'de "not built yet" olarak işaretli).
  - Lisans: Belirtilmemiş — doğrulanamadı.
  - **Nehir projesi için önemi — YÜKSEK:** Spaced-repetition + mastery-kriteri + "sakin hata yönetimi" (ceza değil, ikinci şans + cevap gösterme) deseni, kelime/ses öğrenimi için doğrudan uyarlanabilir bir mantık. Framework'süz, tek dosyalık basitlik felsefesi de PWA'nın hafif/hızlı olması hedefiyle örtüşüyor.
- **KidCode (statico)** — [github.com/statico/kidcode](https://github.com/statico/kidcode)
  - Bu, bir *dil öğrenme uygulaması değil* — çocukların Claude Code CLI'ı bir sohbet arayüzü üzerinden kullanarak kendi oyunlarını/araçlarını yapmasını sağlayan bir "meta" araç (çocuklar için Claude Desktop benzeri 3 panelli arayüz: proje listesi, sohbet, canlı önizleme).
  - Teknoloji: Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn/ui, Claude Code CLI.
  - Güvenlik notu (sistem promptunda, doğrulanamadı — README özetinden): "Tüm etkileşimleri G-rated ve çocuk dostu tut" talimatı veriliyormuş.
  - Lisans: Belirtilmemiş.
  - **Nehir projesi için önemi:** Doğrudan düşük (farklı bir ürün kategorisi — kod yazma aracı, dil öğretme değil) ama "AI ile üretilen içeriğin her zaman çocuk-güvenli/sade dilde olmasını zorlayan bir sistem talimatı" fikri, Nehir projesinde İngilizce ses/metin üretimi otomatikleştirilirse akılda tutulmalı.
- **"Building an iPhone App for my toddler with Claude Code" (yingyingz blog)** — bu oturumda ağ erişim kısıtlaması nedeniyle **fetch edilemedi** (domain doğrulanamadı hatası). Başlık ve arama özetinden: bir ebeveynin Claude Code ile küçük çocuğu için basit bir iPhone uygulaması yaptığını anlatıyor; detaylar **doğrulanamadı**, bu nedenle mimari/ders bilgisi bu belgeye dahil edilmedi.
- **Diğer bulgular:** "Summer Activity Checklist App for My Kid Using Claude Code" (dreamingloud.com) — bu bir dil öğrenme uygulaması değil, bir ebeveynin Claude Code ile çocuğu için basit görev/aktivite listesi uygulaması yaptığını anlatan bir blog yazısı; dil öğrenimiyle doğrudan ilgisi yok, bu nedenle detaylandırılmadı.

---

## 3. Dark pattern / etik tasarım araştırması (genel, sektörel)

- **FTC "Bringing Dark Patterns to Light" raporu (Eylül 2022):** Çocuk uygulamalarında sıkça görülen dark pattern türleri arasında; sahte aciliyet, gizli maliyetler, "zor vazgeçme" (ör. abonelik iptalini zorlaştırma), ve en kritik olarak **çocukların tekrarlayan tıklama davranışından yararlanarak** ilerleme butonunu satın alma butonuna dönüştürme gibi örnekler belgelenmiş. ([PDF kaynak](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800+Dark+Patterns+Report+9.14.2022+-+FINAL.pdf))
- **Epic Games / FTC davası:** Çocukların ebeveyn kredi kartı bilgilerine yetkisiz erişimle harcama yapmasına izin veren tasarım tuzakları nedeniyle 500M$ üzerinde anlaşma. Çocuklara yönelik tasarımda "kazara satın alma" riskinin ne kadar ciddiye alındığının somut bir göstergesi. ([natlawreview.com özeti](https://natlawreview.com/article/recent-ftc-report-shows-increase-dark-patterns))
- **Streak/guilt mekanikleri (Duolingo örneği, genel sektör eleştirisi):** "Streak creep" olarak adlandırılan, oyunlaştırmanın (gamification) aşırıya gidip asıl öğrenme hedefinin yerini "seriyi kaybetmeme" kaygısının alması riski. ([The Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification))

---

## Bu projeye uygulanabilecek dersler

### Alınacak desenler (benimse)
1. **Okuma gerektirmeyen, ikon + ses tabanlı navigasyon.** Khan Academy Kids ve Duolingo ABC'den: büyük dokunma hedefleri, her ekranda kısa sesli yönlendirme, metin yerine görsel/ikon kullanımı. Nehir henüz okuma bilmediği (hatta Türkçe okuma da henüz gelişmemiş olabilir — 4 yaş) için bu zorunlu, tercih değil.
2. **Kendi hızında, cezasız ilerleme (Endless Alphabet modeli).** Zamanlayıcı yok, yüksek skor tablosu yok, kırmızı "yanlış" uyarısı yok. Yanlış cevapta: nazik bir ses ipucu + doğru cevabı gösterme/tekrar deneme fırsatı — asla "kaybettin" hissi verilmemeli.
3. **Basit, somut ilerleme göstergesi (Reading Eggs'in harita+sticker fikri, sadeleştirilmiş).** Karmaşık sanal para/gem sistemleri yerine (4 yaşındaki bir çocuk için anlamsız kalabilir), basit bir "yıldız" veya "rozet/sticker haritası" — örn. dinozor/uzay temalı bir harita üzerinde ilerleme simgeleri — hem motivasyon hem ebeveyn için görünür ilerleme sağlar.
4. **Mastery / spaced-repetition mantığı (lookitsKB K-3 App'ten uyarlanabilir fikir).** Kelime öğrenimini "bir kere doğru dedi, geçti" değil, zaman aralıklı tekrarla (örn. bir kaç gün sonra tekrar sor) pekiştirme. 4 yaş için basitleştirilmiş bir versiyonu (ör. "bugün öğrendiklerini yarın tekrar göster") uygulanabilir.
5. **Privacy/offline-first mimari (Recorator kids-education-app ve OfflineOrbit'ten).** Service worker ile app-shell önbellekleme + IndexedDB/localStorage ile ilerleme kaydı; hiçbir veri cihaz dışına çıkmıyor. Bu, projenin "veri toplamayan" gereksinimiyle zaten örtüşüyor — teknik olarak kanıtlanmış bir yaklaşım olarak doğrulandı (birden fazla bağımsız proje aynı deseni kullanıyor).
6. **Framework'süz veya hafif framework ile basit, hızlı yüklenen PWA (little-learners-pwa, OfflineOrbit, K-3 App).** 3 bağımsız proje de vanilla JS veya minimal stack tercih etmiş — bu, iPad Safari'de hız ve güvenilirlik için makul bir teknik yön olabilir (proje ekibinin zaten planladığı stack ile karşılaştırılmalı).
7. **Oynamanın kendisi ödül olsun.** Endless Alphabet felsefesi: "ekstra ödül mekanikleri olmadan bile oynamak zevkli olmalı" — rozet/yıldız bir bonus olmalı, temel motivasyon kaynağı olmamalı.

### Kaçınılacak desenler (dark pattern listesi)
1. **Suçluluk/kaygı tabanlı bildirimler ve karakter yüz ifadeleri** (Duolingo owl örneği). Hiçbir zaman "beni üzdün", üzgün/kızgın karakter yüzü, "serini kaybettin" mesajı kullanılmamalı. 4 yaşında bir çocukta bu gerçek duygusal strese yol açabilir.
2. **"Bir tane daha" zorlaması / sonsuz oturum döngüsü.** Oturumların doğal, belirgin bir bitiş noktası olmalı (örn. "harika iş çıkardın, bugünlük bu kadar!" ekranı) — sonsuz "devam et" döngüsü veya otomatik bir sonraki aktiviteye geçiş dayatması olmamalı.
3. **Herhangi bir reklam, satın alma butonu, veya "ilerlemek için tıkla" düğmesinin satın-alma düğmesine dönüşmesi gibi FTC'nin belgelediği tuzaklar.** Proje zaten reklamsız/satın almasız olacağı için bu risk mimari olarak sıfırlanmalı — kodda hiçbir yerde "buy/subscribe/unlock with payment" mantığı olmamalı.
4. **Zamanlayıcı, skor tablosu, hız baskısı.** Hiçbir aktivite süreye karşı yarış şeklinde kurulmamalı; çocuğun "yavaş kaldığı" hissi yaratılmamalı.
5. **Belirsiz/şeffaf olmayan UI metni.** Lingokids'teki abonelik şartları karmaşıklığı örneğinden ders: Proje ücretsiz olduğu için bu doğrudan bir risk değil, ama genel ilke olarak her ekranın ne yaptığı açık ve basit olmalı (ebeveyn paneli dahil).
6. **Sanal para/gem/coin gibi soyut ödül birimleri.** Reading Eggs'teki "Yeti coin" gibi soyut kavramlar 4 yaşında bir çocuk için kafa karıştırıcı olabilir — somut, tematik (dinozor yumurtası, uzay rozeti gibi) ödüller tercih edilmeli.

### Teknik/mimari öneriler (araştırmadan çıkan sinyaller)
- **PWA + Service Worker + cache-first stratejisi** çok yaygın ve kanıtlanmış bir yaklaşım (little-learners-pwa, OfflineOrbit, Recorator projesi) — proje planında zaten PWA hedeflendiği için bu yönde ilerlemek doğru.
- **Ses/TTS için iki seçenek bulundu:** (a) Web Speech API (tarayıcı-içi, ek indirme gerektirmez, ama iOS Safari'de destek/ses kalitesi değişken olabilir — ayrıca doğrulanmalı), (b) önceden kaydedilmiş insan sesi dosyaları (daha güvenilir kalite, ama dosya boyutu/offline paketleme planlanmalı). Recorator projesindeki "tiny-tts/ONNX, cihaz üzerinde ~6MB model" fikri ilginç bir orta yol ama bu proje ölçeğinde fazla karmaşık olabilir — basit önceden kaydedilmiş ses dosyaları muhtemelen daha güvenilir bir başlangıç noktası.
- **İlerleme verisi için IndexedDB veya localStorage** — her iki de birden fazla projede kullanılmış, PWA içinde veri toplamadan (sunucuya göndermeden) cihaz-içi saklama için yeterli ve kanıtlanmış.
- **Lisans notu:** Araştırılan açık kaynak projelerin çoğunda (little-learners-pwa, Recorator kids-education-app, OfflineOrbit, lookitsKB K-3 App, statico/kidcode) **lisans belirtilmemiş** — bu nedenle bu projelerden kod/varlık alınması önerilmez (zaten görev kapsamında kod kopyalanmadı). Sadece Antura projesi net lisanslı (BSD 2-Clause kod, CC BY 4.0 sanat varlıkları) ama Unity tabanlı olduğu için bu PWA projesine doğrudan uygulanabilir değil.

---

## Doğrulanamayan / erişilemeyen kaynaklar
- `blog.yingyingz.com` adresindeki "Building an iPhone App for my toddler with Claude Code" yazısına bu oturumda ağ kısıtlaması nedeniyle erişilemedi — içerik bu belgeye dahil edilmedi.
- `eduactiv8.org` adresine DNS hatası nedeniyle erişilemedi; sadece arama motoru özeti kullanıldı (ikincil kaynak, doğrulanamadı).
- Novakid'in uygulama-içi oyunlaştırma/harita mekanikleri hakkında güvenilir, detaylı kamuya açık bilgi bulunamadı.
- Antura projesinin v3.0 yayın tarihi ve güncel geliştirme durumu doğrulanamadı (README'deki bilgi zaman içinde değişmiş olabilir).
