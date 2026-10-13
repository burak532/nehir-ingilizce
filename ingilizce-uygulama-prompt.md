# Proje: 4 yaşındaki kızım için iPad'de İngilizce öğrenme uygulaması

> Köşeli parantez içindeki [ ... ] alanları göndermeden önce doldur.

## 0. Nasıl çalışacağız

Bu projeyi aşamalar halinde yürüt. **Hiçbir aşamada bir sonrakine benim onayım olmadan geçme.** Her aşamanın sonunda bana kısa bir özet ver, açık soruları listele ve dur.

1. Araştırma → `docs/research/`
2. Pedagojik tasarım (müfredat, oyun döngüsü, ölçme planı) → `docs/curriculum.md`
3. Teknik plan → `docs/technical-plan.md`
4. MVP geliştirme ve ses üretim hattı
5. Test, iPad'de deneme ve iyileştirme

- İşe plan mode'da başla.
- Proje kökünde bir `CLAUDE.md` oluştur. Verdiğimiz kararları, kodlama kurallarını ve proje yapısını buraya yaz; karar değiştikçe güncelle.
- Emin olmadığın bir konuda varsayım yapma, bana sor (bkz. Bölüm 9).

### Kesintilere dayanıklı çalışma
Bu proje birçok oturuma yayılacak. Oturumlar kota dolduğu için ya da sohbet sıfırlandığı için kesilebilir. Bu yüzden:

- **İlerleme dosyası tut.** `docs/progress.md` dosyasında şunlar her zaman güncel olsun:
  - Şu anki aşama
  - Tamamlanan işler
  - Yarım kalan iş ve tam olarak nerede kaldığı
  - Sıradaki 3-5 adım
  - Bekleyen sorularım
  - Alınan kararlar ve bunların gerekçeleri
- **Sık güncelle.** Bu dosyayı oturum sonunu bekleyerek değil, her anlamlı adımdan sonra güncelle. Oturum her an kesilebilir.
- **İşi küçük parçalara böl.** Her aşamayı tek oturumda bitebilecek görevlere ayır. Her görev çalışır bir hâlde bitsin ve bir git commit'iyle kaydedilsin.
- **Araştırma notlarını dosyaya yaz.** Bulgular yalnızca sohbette kalmasın, ilgili dosyaya ara ara kaydedilsin. Yarım kalan araştırma baştan yapılmasın.
- **Yeni oturuma böyle başla:** Önce `CLAUDE.md` ve `docs/progress.md` dosyalarını oku. Bana nerede kaldığımızı 3-4 satırda özetle, ardından kaldığın yerden devam et.
- **Kotayı idareli kullan.** Paralel alt ajanlar çok kota harcar. Araştırma aşaması dışında yalnızca gerçekten gerekli olduğunda kullan.

## 1. Kullanıcı: çocuk ve kullanım bağlamı

- Yaş: 4. Ana dili Türkçe; **Türkçe dil becerisi yaşına göre ileri düzeyde.** Okuma yazma bilmiyor.
- Mevcut İngilizce düzeyi: **Hiç bilmiyor; en baştan başlanacak.** İlk ünite selamlaşma ve en temel kelimelerle başlamalı. İlk temas "anlamıyorum" hissi yaratmamalı; görsel destek, tekrar ve ilk ünitelerdeki Türkçe destek bunu önlemeli.
- Özel ilgi alanları: **dinozorlar, hayvanlar, uzay.** Genel olarak çok meraklı ve her konuyla ilgileniyor.
- Uygulamada adı kullanılsın: **Adı Nehir.** Bazı övgü ve selamlama seslerinde adıyla hitap edilsin (ör. "Hello, Nehir!", "Great job, Nehir!"). Her cümlede değil, ölçülü kullanılsın.
  - İngilizce TTS sesi Türkçe bir ismi yanlış telaffuz edebilir. Önce adın geçtiği birkaç örnek üret, ben dinleyip onaylayayım.
  - Telaffuz yanlış çıkarsa fonetik yazımı dene (ör. "Neh-heer"). O da olmazsa adın geçtiği seslerde ad kısmını ayrı bir Türkçe ses dosyası olarak üretip birleştirmeyi öner.
- **Kullanım bağlamı:** Günde 15-30 dakika, **her zaman bir ebeveynle birlikte.** Uygulama tek başına oynanan bir oyun gibi değil, ebeveynle birlikte oynanan bir araç olarak tasarlanmalı.
- Cihaz: **iPad Pro 12,9 inç (6. nesil), iPadOS 27.**
  - Ekran yatayda 1366×1024 pt (2732×2048 piksel) ve 120 Hz ProMotion.
  - Tasarımı ve testleri bu ölçülere göre yap. Büyük ekrandan yararlan, ama öğeleri gereğinden fazla dağıtma.
  - Animasyonlar 120 Hz'de akıcı olsun.
  - Teknik araştırmada **iPadOS 27 Safari'sinin** PWA, ses ve mikrofon davranışlarını özellikle kontrol et.
- Uygulama Safari'de açılıp ana ekrana eklenecek (PWA). Geliştirme için Mac'im var.

## 2. Aşama 1 — Araştırma (alt ajanlarla paralel)

Bu aşamada **kod yazma.** Üç alt ajanı paralel çalıştır ve her birinin çıktısını ayrı bir dosyaya yazdır.

### Ajan A — Bilimsel kanıtlar → `docs/research/evidence.md`
Okul öncesi dönemde (3-5 yaş) ikinci dil edinimi ve çocuklar için dijital öğrenme hakkında güncel literatürü tara. Meta-analizler, sistematik derlemeler ve hakemli çalışmalar öncelikli olsun; son 10 yıla ağırlık ver, temel klasik çalışmaları da dahil et.

Cevaplanacak sorular:
- 4 yaşında yabancı dil kelime öğrenimi nasıl gerçekleşiyor? Kaç maruz kalma gerekiyor, hangi bağlamda daha iyi kalıcılık sağlanıyor?
- Hangi yöntemler kanıtla destekleniyor? Ör. anlaşılır girdi, Total Physical Response (TPR), şarkı/ritim/tekerleme, kalıp ifadeler (chunks), aralıklı tekrar ve geri çağırma pratiği.
- Ekrandan öğrenmenin sınırları: video yoksunluğu (video deficit), sosyal etkileşimin rolü, **ebeveynle ortak kullanım (joint media engagement)** ve ebeveynin bu sırada ne yapmasının en etkili olduğu.
- "Eğitici uygulama" tasarım ilkeleri: aktif, dikkat dağıtmayan, anlamlı ve sosyal etkileşimli öğrenme (Hirsh-Pasek ve arkadaşları, 2015 çerçevesi ve sonrası).
- Bu yaş grubu için hata ve geri bildirim nasıl olmalı (hatasız öğrenme, ödüllerin etkisi)?
- Ana dilin (Türkçe) destek amaçlı kullanımı ve **kademeli olarak azaltılması** (scaffolding/fading) hakkında ne biliniyor? Güçlü ana dil becerisi ikinci dil öğrenimine nasıl yansıyor?
- Çocuğun kendi sesini kaydedip model sesle karşılaştırması (record-and-playback) telaffuz ve motivasyon üzerinde etkili mi?
- Okul öncesi çocuklarda kelime öğrenimi nasıl ölçülür? Alıcı ve üretici kelime ölçümü, yeni örneğe genelleme, gecikmeli tekrar testi gibi yöntemlere bak.
- Yaşa uygun kelime ve tema listeleri için referanslar (ör. CEFR Pre-A1, Cambridge Young Learners kelime listeleri; bunların daha büyük yaşlara yönelik olduğunu dikkate al).

Kurallar:
- Her iddiaya kaynak ver (yazar, yıl, başlık, DOI ya da link) ve kanıt düzeyini belirt (meta-analiz / RCT / korelasyonel / uzman görüşü).
- **Kaynak uydurma.** Doğrulayamadığın her şeyi "doğrulanamadı" diye işaretle.
- Yukarıdaki kavramlar başlangıç noktasıdır. Bunları körü körüne kabul etme, güncel bulgularla doğrula ya da düzelt.
- Dosyanın sonuna "Tasarıma çevrilmiş ilkeler" başlıklı bir bölüm ekle. Burada her ilkeyi uygulamada neye karşılık geleceğiyle birlikte yaz.

### Ajan B — Mevcut uygulamalar ve örnekler → `docs/research/prior-art.md`
- İyi bilinen çocuk dil ve öğrenme uygulamalarındaki etkileşim desenlerini incele (ör. Khan Academy Kids, Duolingo ABC, Lingokids ve benzerleri): navigasyon, ses kullanımı, geri bildirim, ilerleme ve harita yapısı. İyi ve kötü örnekleri ayır (dark pattern'ler, reklam, aşırı ödül gibi).
- GitHub'da ve bloglarda, benzer çocuk eğitim uygulamalarını ara; özellikle web tabanlı (PWA) olanlara ve Claude ya da Claude Code ile yapılmış olanlara bak. Mimari, oyun mekaniği ve öğrenilen dersleri özetle.
- **Kod kopyalama.** Yalnızca desenleri ve fikirleri al, lisansları not et.

### Ajan C — Teknik konular → `docs/research/technical.md`
- iPad Safari'de ana ekrana eklenmiş PWA'nın güncel kısıtlarını araştır:
  - Ses çalmanın kullanıcı dokunuşuyla başlatılması ve Web Audio API ile düşük gecikmeli oynatma
  - Mikrofonla kayıt (getUserMedia / MediaRecorder) ve izin davranışı (iznin tekrar sorulup sorulmadığı)
  - Service worker ile offline önbellek, önbellek boyutu sınırları ve güncellemelerin nasıl alınacağı
  - Yerel veri saklama (IndexedDB), verinin silinme koşulları ve kalıcı depolama isteği
  - Yanlışlıkla yakınlaştırma, kaydırma ya da geri gitme hareketlerinin engellenmesi
- Framework seçimi: Basit ve bağımlılığı az bir yapı öner (ör. Vite + TypeScript, gerekirse hafif bir UI kütüphanesi). Tercihini gerekçelendir.
- Ücretsiz statik barındırma (ör. GitHub Pages) ve otomatik yayınlama.
- Çocuk arayüzleri için dokunma hedefi önerileri (Apple Human Interface Guidelines) ve Guided Access ile uyum.
- OpenAI `gpt-4o-mini-tts`: güncel fiyat, ses seçenekleri, `instructions` alanının kullanımı, Türkçe ses kalitesi ve kullanım koşulları.
- Çocuk gizliliğinde iyi uygulamalar (COPPA/KVKK ruhu): veri toplamama, dış bağlantı olmaması.

Araştırma bitince üç dosyayı birleştirip bana bir sayfalık özet ver ve dur.

## 3. Aşama 2 — Pedagojik tasarım → `docs/curriculum.md`

Araştırma bulgularına dayanarak tasarla. Her tasarım kararının yanına hangi kanıta dayandığını not et.

Beklentilerim (araştırma aksini gösterirse bana söyle):

**İçerik ve temalar**
- Tema bazlı üniteler olsun ve **ilgi alanları ana çerçeveyi oluştursun.** Örneğin renkleri dinozorlar üzerinden, sayıları gezegenler ya da roketler üzerinden, vücut parçalarını hayvanlar üzerinden öğret. Temel kelime alanları: selamlaşma, renkler, sayılar (1-10), hayvanlar, dinozorlar, uzay, vücut, yiyecekler, aile, giysiler, duygular, basit eylemler, büyük/küçük ve yukarı/aşağı gibi kavramlar.
- Her ünitede yaklaşık 6-8 hedef kelime ve 2-3 kalıp ifade olsun (ör. "Hello!", "I like...", "Where is the...?", "It's big!").

**Ünite döngüsü**
- Her ünitede şu sıra izlensin: tanıtma (dinle ve gör) → tanıma (dinle ve dokun) → oyunlaştırılmış pekiştirme → şarkı ya da kısa hikâye → kendi sesini kaydet ve dinle → kapanış.

**Tekrar ve ilerleme modeli**
- **Görsel bir harita** kullan (ör. dinozor adası, uzay istasyonu, hayvan ormanı). Tamamlanan bölümler haritada açık kalsın ve **istediği zaman geri dönüp tekrar oynanabilsin.**
- **Planlı aralıklı tekrar:** Önceki ünitelerin kelimeleri sonraki oyunlarda planlı biçimde geri gelsin. Ayrıca kelimeleri karıştıran ayrı bir "tekrar" etkinliği olsun.
- **Uyarlanabilir zorluk:** Çocuk başarılıysa ilerlesin, zorlanıyorsa daha kolay bir etkinliğe dönsün. Bunu oyunun akışı içinde, fark ettirmeden yap.

**Geri bildirim ve ödül**
- **Cezasız hata:** Yanlış dokunuşta "yanlış" sesi ya da can kaybı olmasın. Doğru cevabı nazikçe yeniden göster.
- **Ölçülü ödül:** Kısa animasyon ve övgü yeterli. Puan yarışı, rozet bombardımanı ya da "bir tane daha" baskısı olmasın.

**Seans yapısı (15-30 dakika, ebeveynle)**
- Seansı 2-3 kısa tura böl. Turlar arasında hareketli bir mola olsun (TPR: "Stomp like a dinosaur!", "Fly like a rocket!").
- Ayarlanan süre dolunca doğal bir kapanış olsun ("Bye-bye! See you tomorrow!").

**Ebeveyn rehberliği**
- Ekranın köşesinde, açılıp kapanabilen, ebeveynin okuyacağı kısa Türkçe ipuçları olsun. Örnek: "Ona sorun: Senin tişörtün ne renk?", "Birlikte tekrar edin."
- Her ünite için ekran dışında yapılacak bir etkinlik kartı olsun (ör. evde renk avı, oyuncak dinozorlarla sayma).

**Talimat dili: kademeli azalan Türkçe destek**
- İlk ünitelerde yeni bir oyun tipi ilk kez geldiğinde kısa bir Türkçe açıklama olsun. Hedef kelimeler ve oyun içi talimatlar her zaman İngilizce kalsın.
- Türkçe destek ünite ilerledikçe azalsın, sonunda tamamen İngilizceye geçilsin.
- Azalma kuralını açıkça tanımla (ör. aynı oyun tipi 3 kez başarıyla oynandıktan sonra Türkçe açıklama kalksın). Ebeveyn panelinden ayarlanabilsin.

**Ses kaydı**
- Hedef kelime ya da kalıp önce model sesle söylensin, ardından çocuk bir mikrofon simgesine basıp kendi sesini kaydetsin. İki ses arka arkaya çalınsın.
- **Puanlama ya da konuşma tanıma olmasın.**

**Ölçme planı** (bkz. Bölüm 6)

**Oyun tipi önerileri** (araştırmaya göre seç, gerekirse değiştir):
1. **Dinle ve dokun:** "Where is the T-rex?" sorusu, 2-4 seçenek.
2. **TPR:** "Touch your nose!", "Roar like a dinosaur!" gibi komutlarda çocuk hareketi gerçekte yapar, ardından ekrana dokunur.
3. **Sürükle-bırak:** "Put the red star in the rocket."
4. **Balon ya da yıldız yakalama:** Duyulan kelimeyi yakalama.
5. **Etkileşimli resimli hikâye:** Sayfa çevirince sesli anlatım, nesnelere dokununca kelimesi söylenir.
6. **Şarkı ya da tekerleme:** Özgün sözler yaz; telifli şarkı kullanma.
7. **Kaydet ve dinle**

## 4. Aşama 3 — Teknik plan → `docs/technical-plan.md`

**Platform:** **PWA (Progressive Web App).** iPad Safari'de açılıp ana ekrana eklenecek ve tam ekran çalışacak.
- Yayınlama ücretsiz statik barındırmada olsun (ör. GitHub Pages). Kodu her güncellediğinde otomatik yayınlanmasını sağla.
- Uygulamanın nasıl güncelleneceğini netleştir. Yeni sürüm yayınlandığında iPad'de nasıl alınacağı açık olsun. Güncelleme oyunun ortasında araya girmesin; yalnızca uygulama açılırken ya da ebeveyn alanında uygulansın.
- Mimariyi, içerik ve sesler aynen kalacak şekilde, ileride native bir uygulamaya taşınabilecek biçimde kur. Bu bir zorunluluk değil, iyi bir ayrım ilkesi.

Zorunlu gereksinimler:
- **İlk yüklemeden sonra tamamen offline çalışmalı.** Tüm kod, görsel ve sesler service worker ile önbelleğe alınsın. Çalışma sırasında hiçbir dış ağ isteği yapılmasın; yalnızca kendi barındırma adresinden güncelleme kontrolü yapılabilir.
- **Ses kilidi:** iPad'de ses yalnızca bir dokunuştan sonra başlayabildiği için açılışta çocuğun dokunacağı büyük bir "Başla" ekranı olsun. Sesleri Web Audio API ile önceden yükle ki gecikme olmasın.
- **Tarayıcı davranışlarını engelle:** Yakınlaştırma, metin seçme, uzun basınca çıkan menü, yana kaydırarak geri gitme ve aşağı çekerek yenileme çocuğun oyununu bozmasın.
- **Veri saklama:** İlerleme ve ölçüm verileri IndexedDB'de tutulsun. Tarayıcıdan kalıcı depolama izni iste (`navigator.storage.persist`). Ebeveyn paneli, veri silinmeden önce düzenli CSV yedeği almamı hatırlatsın.
- **Okuma gerektirmeyen arayüz:** Tüm navigasyon simge, görsel ve sesle yapılsın. Dokunma hedefleri büyük olsun (en az ~80 pt) ve aralarında boşluk bulunsun.
- **İçerik koddan ayrı olsun:** Üniteler, kelimeler, cümleler, görsel referansları ve ses dosyası referansları veri dosyalarında (JSON) tutulsun. Kod değiştirmeden yeni ünite eklenebilmeli; bunun nasıl yapılacağını `CLAUDE.md` içinde belgele.
- **Görseller:** Telifsiz ve tutarlı bir stil kullan. Kendi üreteceğin vektör illüstrasyonlar (dinozor, gezegen, hayvan) olabilir. Bilinen çizgi film karakteri ya da marka kullanma.
- **Gizlilik:** Reklam, analitik, dış link, uygulama içi satın alma ve hesap olmayacak. Tüm veri cihazda kalsın.
- **Ses kayıtları:** Çocuğun kayıtları yalnızca bellekte tutulsun, hiçbir yere yüklenmesin ve kalıcı olarak saklanmasın. Mikrofon izni ilk kez ebeveyn eşliğinde istensin. Safari izni tekrar sorarsa çocuk takılıp kalmasın; izin verilmezse bu adım sessizce atlansın.
- **Ebeveyn alanı:** Kilitli olsun (ör. 3 saniye basılı tutma ya da basit bir işlem). İçinde şunlar yer alsın:
  - İlerleme ve kelime durumu
  - Günlük süre ayarı (15-30 dakika)
  - Türkçe destek düzeyi
  - Ebeveyn ipuçlarını açma/kapama
  - Üniteleri açma/kapama
  - Ölçüm verilerini **CSV olarak dışa aktarma**
  - İlerlemeyi sıfırlama
- **Dayanıklılık:** Çift dokunma, hızlı art arda dokunma ya da uygulamadan çıkıp dönme durumunda takılmasın veya ilerleme kaybolmasın.
- Yatay ekran öncelikli olsun. Hareket azaltma ayarına saygı gösterilsin. Anlam yalnızca renkle verilmesin.

## 5. Ses üretim hattı (geliştirme sırasında, Mac'te)

Uygulamadaki tüm sesler **önceden üretilip uygulamanın içine gömülsün.** Uygulama çalışırken TTS servisine bağlanmasın.

- Mac'te çalışan bir script yaz (`tools/generate_audio`). Script içerik JSON'larını okusun, her satır için TTS servisini çağırsın ve ses dosyalarını uygulamanın kaynak klasörüne kaydetsin.
- **Servis:** OpenAI `gpt-4o-mini-tts`. Sesin nasıl söyleneceğini `instructions` alanıyla yönlendir. İngilizce için birkaç farklı ses seçeneğiyle örnek üret, ben seçeyim.
- **İngilizce ses talimatı:** Sıcak, sabırlı, okul öncesi öğretmeni tonu kullanılsın. Tempo hafif yavaş olsun, telaffuz net ve doğal olsun; abartılı ya da çizgi film sesi olmasın.
- Türkçe destek satırları için ayrı ve doğal bir Türkçe ses seç. Önce örnek üret, ben dinleyip onaylayayım.
- **API anahtarı** yalnızca `.env` dosyasında dursun. Bu dosya `.gitignore`'a eklensin ve anahtar hiçbir zaman uygulamanın içine girmesin.
- **Önbellek:** Metin + ses ayarlarının özetine (hash) göre önbellek tut. Yalnızca değişen ya da yeni satırlar yeniden üretilsin.
- **Dinleme listesi:** Üretilen sesleri dinleyip beğenmediklerimi işaretleyebileceğim basit bir liste ya da sayfa hazırla. İşaretlediklerim yeniden üretilsin.
- **Maliyet:** Her üretimden önce tahmini karakter sayısını ve maliyeti göster. Tahmin [ör. 5 USD]'yi aşarsa onayımı al.

## 6. Ölçme ve başarı ölçütleri

Uygulama ilerlemeyi aşağıdaki ilkelerle kaydetsin. Bunları araştırma bulgularına göre gözden geçir ve bana öner.

- **Her kelime için ayrı kayıt:** Sunum sayısı, ilk denemede doğru tanıma, tarih, kullanılan görsel ve dikkat dağıtıcı (yanlış seçenek) sayısı.
- **"Öğrenildi" tanımı:** Kelime, **farklı günlerde** yapılan en az iki gecikmeli kontrolde ilk denemede doğru tanınmış olmalı. Aynı seans içindeki doğrular sayılmasın. Şans düzeyi (ör. 4 seçenekte %25) hesaba katılsın.
- **Genelleme:** Kontrol sorularında, öğretimde kullanılmamış yeni bir görsel kullanılsın (ör. farklı çizilmiş bir kedi).
- **Ünite öncesi kısa ön test:** Her ünite başında çocuğun zaten bildiği kelimeleri ayırt etmek için oyunlaştırılmış kısa bir ön test olsun.
- **Ebeveyn gözlem kaydı:** Ebeveyn panelinde tek dokunuşluk bir kayıt olsun. Örnek: "Uygulama dışında kendiliğinden kullandı: [kelime]".
- **Katılım göstergeleri:** Seans süresi, çocuğun kendi isteğiyle tekrar seçtiği bölümler, yarıda bırakılan etkinlikler.
- **CSV dışa aktarma:** Tüm kayıtlar düzenli (tidy) formatta, satır başına bir deneme olacak şekilde dışa aktarılabilsin. Analizi R ile yapacağım.
- **Dikkat:** Ölçüm oyunun keyfini bozmamalı. Kontrol soruları normal oyun gibi görünsün; test hissi vermesin.

## 7. Aşama 4 — MVP kapsamı

İlk sürümde yalnızca şunlar olsun:
- Harita ve 2 ünite: [ör. Selamlaşma + Dinozor renkleri]
- 3 oyun tipi (Dinle ve dokun, TPR, Sürükle-bırak) ve Kaydet-dinle
- Ses üretim hattı ve bu iki ünitenin sesleri
- Ebeveyn paneli: süre sınırı, Türkçe destek ayarı, kelime durumu, CSV dışa aktarma
- Offline çalışma

MVP'yi bitirdikten sonra şunları adım adım anlat: GitHub hesabımla yayınlamayı nasıl kuracağımı, iPad'de Safari'den ana ekrana nasıl ekleyeceğimi ve güncellemeleri nasıl alacağımı. Geliştirme sırasında Mac'teki sürümü aynı Wi-Fi üzerinden iPad'de nasıl deneyebileceğimi de açıkla. Ben çocukla test edip geri bildirim vermeden yeni ünite ekleme.

## 8. Kalite kontrol

- Her oyun tipi için önce yazılı kabul kriterleri belirle, sonra geliştir.
- Veri modeli, ilerleme ve aralıklı tekrar mantığı, ölçüm kayıtları ve CSV formatı için birim testleri yaz (ör. Vitest).
- Ana akışlar için Playwright ile **WebKit motorunda ve iPad ekran boyutlarında** dokunmatik uçtan uca testler yaz.
- Offline çalışmayı ayrıca test et: ağ kapalıyken uygulama açılıyor ve tüm sesler çalıyor mu?
- MVP bittiğinde, kodu yazmamış **ayrı bir alt ajana** iki denetim yaptır:
  1. Uygulamayı `docs/curriculum.md` ve `docs/research/evidence.md` dosyalarına göre pedagojik açıdan değerlendirsin.
  2. 4 yaşındaki bir çocuğun ve yanındaki ebeveynin gözünden kullanılabilirlik kontrolü yapsın: Okumadan ana menüden oyuna girip çıkabiliyor mu? Bir yerde takılıp kalıyor mu? Yanlışlıkla ebeveyn alanına girebiliyor mu? Ebeveyn ipuçları işe yarıyor mu?
- Bulunan sorunları listele, düzelt ve bana rapor et.

## 9. Bana mutlaka sorman gerekenler

- Bölüm 1-7'de doldurulmamış ya da çelişkili görünen her alan
- Ücret doğuracak her işlem (TTS üretimi, ücretli hesap vb.) ve belirlediğim tutarı aşan her maliyet
- Araştırma bulgularının yukarıdaki beklentilerimle çeliştiği her durum
- Ses tonu ya da ses seçimi (örnekleri dinlemeden toplu üretim yapma)
