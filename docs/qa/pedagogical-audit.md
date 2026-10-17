# Pedagojik Kalite Denetimi — Hello! + Dino Colors (MVP)

**Denetim tarihi:** 2026-10-17
**Denetçi:** Bağımsız denetim ajanı (kodu yazan oturumdan ayrı, taze gözle)
**Kapsam:** Canlı site https://burak532.github.io/nehir-ingilizce/ — gerçek tarayıcı etkileşimiyle (Chrome DevTools/automation) uçtan uca denendi: açılış → harita → Hello! (word-intro, listen-touch, tpr, record) → harita → Dino Colors (word-intro, listen-touch, drag-drop kodu). Davranış, `docs/curriculum.md` ve `docs/research/evidence.md`'deki tasarım ilkeleriyle karşılaştırıldı; ayrıca ilgili kaynak dosyalar (`src/core/spaced-repetition.ts`, `src/core/game-intro.ts`, `src/map/word-intro.ts`, `src/games/*.ts`, `src/core/sw-register.ts`, `src/data/types.ts`, `src/parent/parent-panel.ts`) okunarak canlı gözlemler doğrulandı.

## Özet

İki ünitenin **çekirdek etkileşim döngüsü** (dinle-dokun, TPR, sürükle-bırak, kaydet-dinle) pedagojik açıdan sağlam ve kanıt temelli: cezasız hata, ölçülü övgü, genelleme testi (yeni görsel varyant) ve aktif geri çağırma gerçekten çalışıyor ve curriculum.md §5, §10 ile tutarlı. Ancak **curriculum.md'de "çekirdek" olarak tanımlanan birkaç mekanizma kodda ya hiç yok ya da veri olarak üretiliyor ama hiçbir ekranda kullanılmıyor** — en başta, projenin en güçlü kanıt temeline sahip iki ilkesi: **aralıklı tekrar** (evidence.md §1/§2.5, en güçlü deneysel kanıt) ve **kademeli azalan Türkçe destek** (evidence.md §6, Cummins CUP). Bunlara ek olarak şarkı/hikâye adımı (evidence.md'nin en güçlü meta-analitik kanıta sahip formatı) MVP'de hiç yok.

**Toplam bulgu:** 3 kritik, 7 orta, 4 küçük/öneri.

**En önemli 3 bulgu:**
1. Türkçe destek **hiçbir zaman azalmıyor** — curriculum.md §8'in "3 kez sonra kalkar" kuralı kodda yok; `turkishSupportLevel` sadece ebeveynin elle açıp kapattığı ikili bir anahtar (full/off). Hem word-intro hem oyun-içi Türkçe açıklama ekranı aynı oturumda tekrar tekrar aynen gösteriliyor (canlı testte 3+ kez doğrulandı).
2. Aralıklı tekrar motoru (`spaced-repetition.ts`, 1-3-7 gün) veriyi doğru hesaplayıp kaydediyor ama `isDue()` fonksiyonu **kod tabanında hiçbir yerde çağrılmıyor** — yani "ertesi gün/3 gün sonra/7 gün sonra hatırlama turu" hiç gerçekleşmiyor. Oyunlar her zaman ünitedeki tüm kelimeleri sırayla gösteriyor, kelimenin "vadesi gelmiş" olup olmadığına hiç bakmıyor.
3. Şarkı/hikâye adımı (curriculum.md §2 adım 4) **tamamen yok** — ne kod ne içerik dosyalarında böyle bir ekran var; evidence.md'de bu, en güçlü meta-analitik kanıta sahip format olarak işaretlenmiş (Jing ve ark. 2023, 63 çalışma).

---

## Kritik

### K1 — Türkçe destek "kademeli azalan" değil, ikili aç/kapa
**Referans:** curriculum.md §8 ("Aynı oyun tipi 3 kez başarıyla oynandıktan sonra Türkçe açıklama kalkar"); evidence.md ilke #15 (Cummins CUP, scaffolding/fading).

`src/data/types.ts`'de `turkishSupportLevel: "full" | "off"` — sadece iki durum var, "kaç kez oynandı" sayan bir alan (`gamePlaysCount` gibi) **hiçbir yerde tanımlı değil**. `src/core/game-intro.ts`'deki `shouldShowGameIntro()` tek kriterle karar veriyor: `settings.turkishSupportLevel !== "off"`. Aynı şekilde `src/map/word-intro.ts` ünite her açıldığında (kaçıncı kez olursa olsun) tüm kelimelerin Türkçe çerçeveleme cümlesini baştan gösteriyor.

Canlı testte doğrulandı: Hello ünitesinin listen-touch, TPR oyun-içi Türkçe "nasıl oynanır" ekranı ("Dinle, sonra duyduğun kelimeye uyan resme dokun!", "Komutu dinle, hareketi yap...") **aynı oturum içinde üç kez** aynen tekrar gösterildi (her yeniden girişte) — hiç azalmadı, hiç kısalmadı.

CLAUDE.md'nin karar günlüğünde (2026-10-15, 5. tur) `unitsIntroducedHash` ve `gamePlaysCount`/`turkishFadeThresholdPlays` alanlarının eklendiği belirtilmiş, ancak kod tabanında bu alanlara dair **hiçbir iz yok** (`grep` ile sıfır eşleşme) — görünen o ki bu değişiklik ya hiç uygulanmadı ya da sonradan geri alındı/kayboldu. Bu, projenin kendi karar günlüğü ile canlı davranış arasında ciddi bir tutarsızlık.

**Etki:** Curriculum'un en somut, test edilebilir "fading" hipotezi şu anda fiilen test edilmiyor çünkü uygulanmıyor. Nehir'in İngilizcesi ilerledikçe Türkçe desteğin azalması gerekiyor; şu anda tek yol ebeveynin elle "Kapalı (sadece İngilizce)" seçmesi — bu, curriculum'un öngördüğü otomatik/kademeli modelden tamamen farklı bir tasarım.

### K2 — Aralıklı tekrar (spaced repetition) motoru hesaplanıyor ama hiç kullanılmıyor
**Referans:** curriculum.md §3 ("1 gün sonra → 3 gün sonra → 7 gün sonra tekrar"), ilke #2 ("Bir ünite, aynı oturumda değil, ertesi gün/günlerde kısa bir hatırlama turu ile tekrar açılmalı"); evidence.md §1/§2.5 (Leonard ve ark. 2022 — projenin en güçlü deneysel kanıtlarından biri).

`src/core/spaced-repetition.ts` doğru ve iyi yazılmış: her deneme sonrası `nextDueDate`/`intervalStage` güncelleniyor, `isDue(record, today)` fonksiyonu tanımlı. Ama `grep -rn "isDue"` kod tabanında **sadece tanımlandığı satırı buluyor — hiçbir çağıran yok**. `src/games/listen-touch.ts` ve `drag-drop.ts` her zaman `unit.words`'ün TÜMÜNÜ sırayla gösteriyor; hangi kelimenin "vadesi geldiğini" hiç sormuyor. Harita ekranı (`map-screen.ts`) sadece `isLearned()` ile öğrenilen kelime sayısını gösteriyor, due-kelime bazlı bir "hatırlama turu" tetiklemiyor.

**Etki:** Proje dokümantasyonunda "çekirdek mekanik" olarak tanıtılan ve en güçlü bilimsel dayanağa sahip özellik (aralıklı geri çağırma) şu anda **veri tabanında sessizce biriktiriliyor ama çocuğun deneyimine hiç yansımıyor**. Nehir aynı üniteyi istediği gün tekrar oynasa, hep aynı 7-8 kelimeyi aynı sırada görür; "ertesi gün hatırlama turu" diye bir şey olmaz. Bu, ölçme planındaki (curriculum.md §10) "farklı günlerde en az iki kez ilk denemede doğru" tanımının pasif olarak kaydedilmesini sağlıyor (iyi), ama bunu tetikleyecek/yönlendirecek bir UI akışı yok.

### K3 — Şarkı/hikâye adımı tamamen yok
**Referans:** curriculum.md §2 adım 4 ("Her ünitenin 30-45 saniyelik kendi tema şarkısı; interaktif resimli hikâye formatı"); curriculum.md §11 tablosu ("Etkileşimli resimli hikâye — Güçlü kanıt — Öncelikli format olmalı"); evidence.md §3.2 (Jing ve ark. 2023, 63 çalışma meta-analizi — e-kitap formatı video/oyundan daha güçlü kelime kazanımı gösteriyor).

Kod tabanında `song`/`story`/`book` içerikli hiçbir dosya yok (`find` ile doğrulandı). `content/units/*.json`'daki `games` dizileri sadece `["listen-touch","tpr","record"]` (Hello) ve `["listen-touch","drag-drop","record"]` (Dino Colors) — altıncı adımdan (kapanış) önce gelmesi gereken "şarkı ya da kısa hikâye" adımı hiç yok.

**Etki:** Evidence.md'nin en net ve en büyük örneklemli (N=11.413) bulgusuyla desteklenen format MVP'de tamamen eksik. Bu bir "sonra eklenir" notu değil — curriculum.md bunu "öncelikli format olmalı" diye özellikle vurgulamış.

---

## Orta

### O1 — "red" ve "orange" dinozor ikonları görsel olarak ayırt edilmesi zor
Canlı testte iki ikon yan yana karşılaştırıldı: "red" dinozoru mercan/turuncu-kırmızı bir ton (#e8674a civarı), "orange" dinozoru da benzer sıcaklıkta, biraz daha açık bir turuncu (#f0975a civarı). Bir renk ünitesinde, İngilizce bilmeyen 4 yaşındaki bir çocuk için bu iki rengin arasındaki fark ince; "red" kelimesi kök olarak genelde parlak/doygun bir kırmızıyla temsil edilir (ör. kiremit kırmızısı, elma kırmızısı), burada kullanılan ton buna net biçimde ulaşmıyor. Bu hem kavramsal netliği zedeler hem de listen-touch'taki alıcı ölçümün geçerliliğini riske atar (yanlış dokunuş kelime bilgisizliğinden değil ikon belirsizliğinden kaynaklanabilir).

### O2 — "hello" ve "bye-bye" ikonları (orijinal varyant) neredeyse özdeş
Zoom ile karşılaştırıldığında: ikisi de aynı el-sallama silueti, aynı köşede küçük bir daire; tek fark arka plan rengi (açık mavi / koyu teal) ve "bye-bye"da elin altında ince bir çizgi. 4 yaşındaki, henüz okuma yazma bilmeyen bir çocuk için bu iki kavramı yalnızca renk tonuyla ayırt etmek güvenilir değil — özellikle "hello" ve "bye-bye" ünitenin ilk iki kelimesi olduğu ve listen-touch'ta sık sık yan yana seçenek olarak çıktığı için (canlı testte doğrulandı).

### O3 — Uyarlanabilir zorluk (adaptive difficulty) hiç uygulanmamış
**Referans:** curriculum.md §4 ("İlk denemede doğruluk ≥%75 ise ilerle; <%50 ise dikkat dağıtıcı sayısı 4'ten 2'ye düşürülerek, fark ettirilmeden tekrar sun").

Kod tabanında `grep` ile "accuracy/threshold/0.75" aramasında sıfır sonuç. `src/core/game-flow.ts`'deki `nextAfterGame()` tamamen doğrusal: ünitenin `games` dizisindeki bir sonraki oyuna geçiyor, performansa hiç bakmıyor. `listen-touch.ts` ve `drag-drop.ts`'de dikkat dağıtıcı sayısı sabit (`Math.min(3,...)` / `Math.min(2,...)`), performansa göre değişmiyor.

Not: curriculum.md bunu zaten "varsayım — test edilecek" olarak işaretlemişti, bu nedenle Kritik değil Orta olarak sınıflandırıldı — ama MVP'de hiç bulunmaması, Nehir çok zorlandığında ya da çok kolay bulduğunda uygulamanın hiç tepki vermeyeceği anlamına geliyor.

### O4 — Kalıp ifadeler (chunks) büyük ölçüde üretildi ama kullanılmıyor
**Referans:** evidence.md §2.4 (Hakuta 1974), ilke #7 ("Kelimeler her zaman kısa, günlük kalıp cümleler içinde sunulmalı").

Her iki ünite JSON'unda `chunks` dizisi tanımlı ve sesleri üretilmiş (`im-rex`, `see-you`, `thank-you-chunk`, `its-color`, `i-like-color`, `what-color`, `put-in-nest`). `grep` ile kontrol edildiğinde sadece `put-in-nest-{id}.mp3` gerçekten çalınıyor (drag-drop talimatı olarak); "Hello! I'm Rex!", "Bye-bye! See you!", "It's red!", "I like blue.", "What color is it?" gibi tüm diğer kalıp cümleler **hiçbir ekranda hiç çalınmıyor**. Kelimeler sadece izole biçimde (`red`, `hello`) sunuluyor, evidence.md'nin önerdiği "chunk içinde kelime" modeli fiilen uygulanmıyor.

### O5 — Ebeveyn rehberliği (§7) kodda yok; `parentTipsEnabled` ayarı işlevsiz
**Referans:** curriculum.md §7 ("Her ünite için ekranın köşesinde Türkçe ipucu + ekran dışı etkinlik kartı"); evidence.md ilke #10 (Taylor ve ark. 2024 meta-analizi, co-use/joint media engagement).

`src/data/types.ts`'de `parentTipsEnabled: boolean` alanı var, varsayılan `true`, ebeveyn panelinde açılıp kapatılabiliyor (`src/parent/parent-panel.ts`). Ancak `grep -rn "parentTipsEnabled"` sonucu bu ayarın **sadece tanımlandığı ve panelde gösterildiği yerler** — hiçbir oyun/ünite ekranı bu bayrağı okuyup bir ipucu göstermiyor. Curriculum.md'nin önerdiği ünite başına somut ipucu metinleri (ör. "Ona sorun: Rex'e nasıl merhaba dedin?") içerik olarak da hiçbir JSON dosyasında yok.

### O6 — Kaydet-dinle ekranı mikrofon izni akışında süresiz takılabiliyor
Canlı testte doğrulandı: "record" oyununa girişte `ensureMicPermission()` (`navigator.mediaDevices.getUserMedia`) promise'i beklenirken ekranda sadece "Yükleniyor..." yazısı var — ne "Atla" butonu, ne zaman aşımı/fallback var. İzin isteği yanıtsız kaldığında (test ortamında 15+ saniye gözlemlendi, hiç ilerlemedi) çocuk/ebeveyn bu ekranda tamamen tıkanıp kalıyor; tek çıkış yolu uygulamayı tamamen kapatıp açmak. iPad Safari'de izin diyaloğu gecikirse veya ebeveyn hemen yanıtlamazsa aynı durum gerçek kullanımda da yaşanabilir.

### O7 — Service worker güncellemesi oyun ortasında sayfayı aniden yeniliyor
**Referans:** CLAUDE.md "Kodlama kuralları" ("güncelleme asla oyun ortasında uygulanmaz") vs. `src/core/sw-register.ts` yorumu ve davranışı.

`sw-register.ts` içindeki yorum açıkça şunu söylüyor: *"yeni bir service worker bulunduğunda HER ZAMAN hemen uygulanır (ekran ne olursa olsun), sayfa otomatik yenilenir."* Bu, projenin kendi "güncelleme asla oyun ortasında uygulanmaz" ilkesiyle doğrudan çelişiyor (bilinçli bir ödünleşim olarak 6. tur'da belgelenmiş). Canlı test sırasında bu davranış birkaç kez gözlemlendi: bir listen-touch doğru cevabının hemen ardından ve kaydet-dinle mikrofon izni beklenirken uygulama beklenmedik şekilde başlangıç ekranına döndü, aktif oyun akışını kesti. (Not: test ortamının otomasyon katmanı da bu gözlemde rol oynamış olabilir, kesin kök neden tek başına doğrulanamadı — ama kodun kendisi bu riski açıkça kabul ediyor ve "ekran ne olursa olsun" yeniliyor.) 4 yaşındaki bir çocuk için, oyunun ortasında ekranın aniden sıfırlanması kafa karıştırıcı ve hayal kırıklığı yaratıcı olabilir — tam olarak evidence.md'nin "dikkat dağıtmama/meşguliyet" ilkesinin (Dört Sütun çerçevesi, ilke #11b) karşıtı bir deneyim.

---

## Küçük / Öneri

### S1 — Harita ekranı curriculum.md'deki "bölgelere ayrılmış ada" konseptinden uzak
curriculum.md §3 "Dino Ada", "Uzay İstasyonu", "Hayvan Ormanı" gibi görsel bölgelere ayrılmış tek büyük bir harita tarif ediyor. Şu anki harita (`map-screen.ts`) düz bir gradyan arka plan üzerinde 2 basit kart listesi — görsel olarak "ada" hissi vermiyor. MVP aşamasında (sadece 2 ünite) anlaşılır bir basitleştirme, ama ünite sayısı arttıkça bu konu yeniden ele alınmalı.

### S2 — Rex karakteri hiçbir ekranda görsel olarak yok
Rex sadece Türkçe metinlerde ismen geçiyor ("Rex seni görünce 'hello' der"); hiçbir ekranda görsel bir Rex illüstrasyonu/animasyonu yok. evidence.md ilke #8 "karakterlerin doğrudan çocuğa bakıyormuş gibi konuşması"nı öneriyor — şu anki haliyle bu sosyal/duyarlı karakter deneyimi tamamen metinsel, görsel karşılığı yok.

### S3 — "please" ikonu hâlâ soyut
CLAUDE.md'nin karar günlüğünde (2. tur) "please" ikonunun somutlaştırıldığı belirtilmiş. Canlı gözlemde ikon, yıldıza doğru uzanan iki el — "lütfen/rica etme" kavramını doğrudan çağrıştırmaktan çok "dilek tutma" gibi de okunabilir soyut bir kompozisyon. Tamamen anlaşılmaz değil ama 4 yaşındaki bir çocuk için en net seçim olmayabilir; ebeveynle test edilmesi önerilir.

### S4 — "no" kelimesinin iki görsel varyantı arasında üslup tutarsızlığı
Orijinal "no" ikonu somut bir yüz ifadesi (surat asmış emoji-tarzı), alternatif (genelleme) varyantı ise soyut bir X sembolü. İkisi de makul ama görsel dilin tutarlılığı açısından not edilebilir — diğer kelimelerin varyant çiftleri genelde aynı görsel dilde (ör. iki farklı poz) kalıyor.

---

## Olumlu bulgular (kayıt için)

- **Cezasız hata gerçekten uygulanmış:** Yanlış dokunuşta ceza sesi/animasyonu yok; buton %40 opaklığa düşüyor, doğru seçenek yeşil çerçeve + büyüme animasyonuyla nazikçe vurgulanıyor, ardından doğru kelimenin sesi tekrar çalınıyor. curriculum.md §5 ile tam örtüşüyor.
- **Ölçülü övgü:** Praise sesleri %35 ihtimalle çalıyor (her doğru cevapta değil), Nehir'in adı bazı övgülerde geçiyor ama hepsinde değil — curriculum.md §5 ve evidence.md ilke #13 ile uyumlu. Soyut puan/rozet ekranı yok.
- **Genelleme testi gerçekten çalışıyor:** `listen-touch.ts`'de her ikinci turda öğretimde görülmemiş görsel varyant (`imageVariants[1]`) kullanılıyor ve bu `imageVariant: "novel"` olarak kaydediliyor — curriculum.md §10'daki "öğrenildi" tanımının genelleme bacağıyla tutarlı; canlı testte doğrulandı (bye-bye ve no kelimelerinin alternatif görselleri gerçekten farklı çizimdi).
- **"Öğrenildi" tanımı kod düzeyinde doğru:** `spaced-repetition.ts`'deki `isLearned()` iki farklı günde ilk denemede doğru şartını doğru uyguluyor; `recordAttempt()` yanlış cevapta bir kademe geriye alıyor (fark ettirmeden sık tekrar) — curriculum.md §10 ile birebir tutarlı. (Sorun bunun kullanılmaması, K2'de ayrıca belirtildi.)
- **TPR ekranı sade ve net:** Büyük emoji, kısa Türkçe+İngilizce metin, "Yaptım!" ile ilerleme — ölçüm baskısı yok, dikkat dağıtıcı öğe yok.
