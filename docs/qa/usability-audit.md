# Kullanılabilirlik Denetimi — Nehir'in İngilizcesi

**Tarih:** 2026-10-17
**Denetçi:** Bağımsız QA denetimi (Claude, ayrı oturum — uygulamanın kodunu yazan ekipten bağımsız)
**Ortam:** Canlı site https://burak532.github.io/nehir-ingilizce/, Chrome masaüstü tarayıcı, pencere ~1366×1024 (iPad Pro 12,9" yatay boyutuna yakın), dokunma etkileşimleri simüle edilerek test edildi.
**Kapsam:** Açılış → Harita → Hello! ünitesi (tanıtma + dinle-dokun + TPR + kaydet-dinle) → Dino Colors ünitesi (tanıtma + dinle-dokun + sürükle-bırak), ebeveyn kilidi, ebeveyn paneli.

## Özet

Uygulamanın temel akışı (harita → ünite → oyunlar) büyük ölçüde sağlam: dokunma hedefleri çoğu yerde büyük ve iyi aralıklı, "cezasız hata" tasarımı (yanlış cevapta ceza yok, doğru cevap nazikçe vurgulanır) belgelendiği gibi çalışıyor, Dino Colors'taki renkli dinozor ikonları son derece net. Ancak testler sırasında **1 kritik, gerçek bir "tam kilitlenme" noktası** doğrulandı: kaydet-dinle (Record) oyunu mikrofon izni istediğinde, izin isteği hemen yanıtlanmazsa ekran süresiz olarak boş bir "Yükleniyor..." yazısında donuyor — geri dönüş butonu, atlama seçeneği veya zaman aşımı yok. Ayrıca servis çalışanı (service worker) güncellemesinin oturum ortasında habersizce tam sıfırlamaya (başlangıç ekranına) yol açması bağımsız olarak doğrulandı (ekip tarafından zaten bilinen/kabul edilmiş bir ödünleşim). Orta öncelikli birkaç bulgu (tanıtma ekranında "İleri" düğmesinin çift dokunmaya karşı korumasız olması, ebeveyn kilidi ikonunun önerilen dokunma hedefi boyutunun altında kalması) ve birkaç küçük/öneri niteliğinde gözlem de aşağıda listelendi.

**Bulgu sayısı:** 2 kritik, 5 orta, 4 küçük/öneri.

---

## Kritik

### K1 — Kaydet-dinle (Record) oyunu: mikrofon izni yanıtlanmazsa ekran süresiz donuyor, çıkış yolu yok
**Nerede:** Hello! ünitesi → 3. oyun (kaydet-dinle), `src/games/record.ts`

Record ekranına girildiğinde kod önce `navigator.mediaDevices.getUserMedia({audio:true})` çağırıyor ve bu Promise çözülene kadar ekranda sadece ortalanmamış, sade bir "Yükleniyor..." metni gösteriyor (`root.innerHTML` başlangıç durumu). Test sırasında tarayıcının yerel mikrofon izni istemi (native permission prompt) hemen yanıtlanmadığında:
- `navigator.permissions.query({name:'microphone'})` durumu **8+ saniye boyunca `"prompt"`** olarak kaldı (yani tarayıcı gerçekten yanıt bekliyordu).
- Ekranda "Yükleniyor..." dışında hiçbir şey yok: geri dön butonu yok, atla seçeneği yok, zaman aşımı/otomatik devam yok, ebeveyn kilidi dişli ikonu bile bu ekranda görünmüyor (sadece harita ekranında var).
- Tek çıkış yolu sayfayı tamamen yeniden yüklemek (iPad'de uygulamayı kapatıp açmak) — bu da aşağıdaki K2 ile birleşince kullanıcıyı doğrudan **en baştaki "Nehir'in İngilizcesi / Başla!" ekranına** atıyor (haritaya bile değil), o oturumdaki tüm ekran ilerlemesi kayboluyor.

Gerçek kullanımda: iPad'de ilk kez mikrofon istendiğinde iOS/Safari bir sistem izni penceresi gösterir. 4 yaşındaki bir çocuğun yanındaki ebeveyn o anda dikkati dağılmışsa (çok olası — küçük çocukla oturumda sürpriz değil) veya pencereyi yanlışlıkla kapatırsa/başka yere dokunursa, uygulama kalıcı olarak anlamsız bir "Yükleniyor..." ekranında donar; okuma bilmeyen Nehir için bu ekran hiçbir ipucu vermez.

Kodda izin **reddedilirse** (`catch` bloğu) `micAvailable=false` olup adımın sessizce atlandığı doğru şekilde yazılmış (bkz. `record.ts:43-51` yorumu: "İzin reddedilirse bu adım sessizce atlanır — çocuk takılmaz"). Sorun, iznin **ne kabul ne red edilip askıda kaldığı** durumun hiç ele alınmaması.

**Öneri:** `getUserMedia` çağrısına bir zaman aşımı (`Promise.race` ile örn. 5-8 sn) ekleyip süre dolunca `micAvailable=false` fallback'ine düşmek; ayrıca "Yükleniyor..." ekranına her zaman görünür bir "Atla"/"Haritaya dön" düğmesi eklemek (özellikle mikrofon izni gibi harici/öngörülemez bir adımda).

### K2 — Servis çalışanı güncellemesi oturum ortasında habersizce tam sıfırlamaya yol açıyor (bağımsız doğrulandı)
**Nerede:** `src/core/sw-register.ts`, tüm ekranlar

Test sırasında Hello! ünitesinin tanıtma ekranında ("bye-bye" kelimesindeyken) uygulama aniden en baştaki "Nehir'in İngilizcesi / Başla!" ekranına döndü — bu, `sw-register.ts` içindeki "yeni sürüm bulununca ekran ne olursa olsun hemen uygula + `window.location.reload()`" davranışıyla birebir örtüşüyor. Bu davranış `CLAUDE.md` karar günlüğünde (2026-10-15, "6. tur") zaten bilinçli bir ödünleşim olarak kayıtlı ve gerekçesi makul (önceki turlarda güncellemenin hiç ulaşmaması daha büyük bir sorundu). Yine de bağımsız test burada şunu doğruluyor:
- Reload **gerçekten her ekranda** tetiklenebiliyor (burada tanıtma ekranının ortasında oldu).
- Reload sonrası uygulama **haritaya değil, en baştaki başlangıç ekranına** dönüyor (ekran durumu hiç kalıcı tutulmuyor — `store`'un başlangıç değeri her zaman `{name:"start"}`).
- Bu, K1 ile birleştiğinde: Record ekranında donan bir oturumun kurtarılma yolu olan "uygulamayı kapat-aç" da kullanıcıyı sıfırdan başlatıyor.

**Öneri:** Kayıt günlüğünde zaten not edilmiş olan "gerçek kullanım başlayınca gözden geçirilmeli" maddesi şimdi devreye alınabilir: en azından `screen` durumunu (hangi ünite/oyun tipinde olunduğunu) `sessionStorage`'da tutup reload sonrası kaldığı yere (en azından haritaya) dönmek, başlangıç ekranına değil.

---

## Orta

### O1 — Tanıtma ekranında "İleri" düğmesi çift dokunmaya karşı korumasız, bir kelime sessizce atlanabiliyor
**Nerede:** `src/map/word-intro.ts`, Hello! ve Dino Colors tanıtma ekranları

Kontrollü testte: "yes" kelimesinde iki ardışık tıklama (aralarında render için yeterli gecikme varken bile) doğrudan "please" kelimesine atladı, "no" kelimesi hiç gösterilmeden/dinlenmeden geçildi. Kodda `#next` düğmesine tıklanınca `index += 1; showWord()` çalışıyor ama `answered`/`disabled` gibi bir kilit yok (listen-touch ve drag-drop oyunlarında olduğu gibi). 4 yaşındaki, sabırsız bir çocuğun aynı yere iki kez hızlı dokunması gayet olası bir senaryo — bu durumda o kelimenin Türkçe açıklaması ve İngilizce sesi hiç duyulmadan geçilmiş oluyor.

**Öneri:** `listen-touch.ts`'deki `answered` kilidine benzer bir koruma: düğmeye tıklanır tıklanmaz geçici olarak devre dışı bırakılsın veya en azından TR+EN ses bitene kadar yeniden tıklama yok sayılsın.

### O2 — Ebeveyn kilidi (dişli ikon) önerilen dokunma hedefi boyutunun altında
**Nerede:** `src/map/map-screen.ts`, harita ekranı sağ üst köşe

Ölçülen gerçek boyut: **56×56 CSS px** (görev talimatındaki ~80pt önerisinin altında). 3 saniye basılı tutma gereksinimiyle birlikte düşünüldüğünde küçük boyut aslında kazara tetiklenmeyi zorlaştırdığı için kısmen savunulabilir bir tasarım tercihi, ama aynı zamanda gerçek bir ebeveynin de isabetli basılı tutmasını zorlaştırabilir. Tek dokunuşla (kazara) açılmadığı doğrulandı — asıl risk yanlışlıkla açılma değil, meşru kullanımda ebeveynin hedefi tutturmakta zorlanması.

**Öneri:** iPad'de gerçek parmakla denenip rahat basılabiliyorsa mevcut haliyle bırakılabilir; zorlanılıyorsa 64-72px'e çıkarılması düşünülebilir.

### O3 — Bir kez, tek dokunuşla tüm ünitenin atlandığı gözlemlendi; güvenilir şekilde tekrarlanamadı
**Nerede:** Hello! ünitesi, dinle-dokun oyunu, 1. tur

Bir test turunda, dinle-dokun oyununun 1. turunda bir cevaba TEK (gerçek, sentetik olmayan) dokunuşla tıklandıktan hemen sonra ekran doğrudan bir sonraki ünitenin ("Dino Colors") tanıtma ekranına geçti — yani kalan 6 dinle-dokun turu, tüm TPR ve tüm kaydet-dinle adımları atlanmış oldu. 3 ayrı temiz tekrar denemesinde bu davranış **bir daha gözlenmedi** (her tur beklendiği gibi tek tur ilerledi), bu yüzden kesin bir hata olarak değil, düşük güvenilirlikli/tekrarlanamayan bir gözlem olarak kaydediyorum — otomasyon araçlarının art arda çok hızlı gönderdiği olaylardan kaynaklanan bir test ortamı artefaktı olması mümkün. Ancak `docs/progress.md`'ye göre Playwright uçtan uca testleri henüz yazılmadığı için, bunu bağımsız doğrulayacak bir regresyon testi yok.

**Öneri:** `nextAfterGame`/`playRound` akışına "bir cevap tıklamasının yalnızca bir tur ilerletmesi gerektiğini" doğrulayan bir Playwright testi eklenmesi, gelecekte bu riski ortadan kaldırır.

### O4 — "Please" ikonu tek başına soyut kalıyor
**Nerede:** Hello! ünitesi, "please" kelimesi

İkon iki el + yıldız şeklinde, mor zemin üzerinde — önceki turlarda düzeltilmiş olsa da hâlâ somut bir nesneyi değil soyut bir "dileme/rica" hissini temsil ediyor. Tanıtma ekranında Türkçe cümle ("Bir şey istediğinde 'please' dersin...") anlamı taşıdığı için sorun değil; ama oyun ekranlarında (dinle-dokun seçeneklerinden biri olarak) sadece göze bakarak "please" olduğunu çıkarmak zor. Oyun tasarımı zaten ses odaklı olduğu için (önce dinle, sonra dokun) bu ciddi bir engel değil, ama 7 ikon içinde en az "kendi kendine açıklayıcı" olanı bu.

### O5 — "Hello" ve "bye-bye" ikonları birbirine çok benziyor
**Nerede:** Hello! ünitesi

İkisi de el sallama hareketi; farkları sadece arka plan rengi (açık mavi / çamurlu teal) ve "bye-bye" ikonundaki ince bir yatay çizgi. Gerçek hayatta aynı el hareketi kullanıldığı için kavramsal olarak doğru, ama saf görsel ayırt edicilik düşük. Yine ses-öncelikli oyun tasarımı bunu büyük ölçüde telafi ediyor.

---

## Küçük / Öneri

### S1 — "Yükleniyor..." ekranı ortalanmamış ve ilerleme göstergesi yok
Diğer tüm ekranlar dikey/yatay ortalanmışken, oyun geçişlerindeki "Yükleniyor..." metni sol üstte, küçük punto ile duruyor (tutarsız). Daha önemlisi: dönen bir spinner veya başka bir canlılık işareti olmadığı için, normal (kısa) bir yükleme ile K1'de tarif edilen gerçek "donma" durumu arasında ebeveyn için görsel fark yok.

### S2 — "Atla" (tanıtma ekranını geç) düğmesi küçük
`word-intro.ts` içindeki "Atla ⏭" düğmesi yaklaşık 50-55px yükseklikte, ekranın sağ üst köşesinde — ebeveyn kilidiyle benzer şekilde önerilen boyutun altında. Yıkıcı bir eylem olmadığı için risk düşük, ama uygulamadaki en küçük ikinci dokunma hedefi.

### S3 — Başlangıç ve ünite-giriş ekranları tamamen Türkçe metne dayanıyor
"Nehir'in İngilizcesi / Başla! ▶" ve "Hello! / Başla ▶" ekranları okuma bilmeyen bir çocuk için kendi başına anlaşılır değil (yalnızca ▶ ikonu evrensel). Görev kapsamında ebeveyn her zaman yanında olduğu için ciddi bir sorun değil — bu ekranlar zaten günde bir kez, oturum başında ebeveynle birlikte geçiliyor.

### S4 — Dokunma hedefi boyutu genel olarak tutarlı ve iyi
Olumlu not: harita kartları (160×176), dinle-dokun seçenekleri (160×160), sürükle-bırak parçaları (130×130) ve yuva (180×140), TPR/ana CTA düğmeleri (min 80-100px) hepsi önerilen aralığın ya içinde ya üstünde. 1366×1024 ekranda hiçbir yerde taşma/sıkışma gözlenmedi. Sadece dişli ikonu (O2) ve Atla düğmesi (S2) bu tutarlılığın dışında kalıyor.

---

## Olumlu gözlemler (denge için)

- Harita → ünite → oyun akışı sorunsuz; her geçişte beklenen ekran geldi (K2/O3 dışında).
- "Cezasız hata" tasarımı belgelendiği gibi çalışıyor: yanlış cevapta ceza yok, yanlış seçenek soluklaşıyor, doğru seçenek yeşil çerçeveyle vurgulanıp sesi tekrar çalınıyor, sonra otomatik ilerliyor.
- Dino Colors'taki renkli dinozor ikonları mükemmel: sadece renge bakarak anında ve kesin ayırt edilebiliyor — uygulamadaki en iyi ikon seti.
- TPR (hareket molası) ekranı sade, büyük emoji + kısa İngilizce/Türkçe metin + büyük "Yaptım! ✅" düğmesiyle çok anlaşılır.
- Ebeveyn kilidi tek dokunuşla **açılmıyor** (doğrulandı) — 3 saniyelik basılı tutma gereksinimi gerçekten işlevsel.
- Oyun tipi başına gösterilen Türkçe "nasıl oynanır" açıklamaları (örn. "Dinle, sonra duyduğun kelimeye uyan resme dokun!") kısa, net ve her yeni oyun tipinden önce doğru şekilde beliriyor.
- Sürükle-bırak (Pointer Events tabanlı) gerçek sürükleme hareketiyle test edildi, doğru parça yuvaya bırakılınca bir sonraki tura geçiyor; yanlış bırakımda yumuşak bir ton çalıp parça yerine geri dönüyor.

---

## Test edilmeyen / kapsam dışı notlar
- Kaydet-dinle oyununun mikrofon izni **verildiğinde** kayıt/çalma akışı, bu ortamda (Chrome otomasyonu, gerçek mikrofon erişimi onaylanamadı) uçtan uca doğrulanamadı — kod okuması üzerinden mantıksal olarak doğru görünüyor.
- Dino Colors'ın kaydet-dinle adımı ve kapanış ekranı zaman kısıtı nedeniyle tekrar test edilmedi (Hello! ünitesinde zaten aynı kod yolu test edildi).
- Gerçek iPad/Safari'de (VoiceOver kapalı, gerçek parmak dokunuşuyla, gerçek mikrofon izniyle) yeniden doğrulama öneriyoruz — bu denetim masaüstü Chrome simülasyonuyla yapıldı.
