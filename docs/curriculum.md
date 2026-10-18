# Müfredat ve Pedagojik Tasarım

Bu doküman, `docs/research/evidence.md` ve `docs/research/prior-art.md` bulgularına dayanır. Her tasarım kararının yanında hangi kanıta dayandığı belirtilmiştir. Kesin kanıt bulunmayan noktalar açıkça "varsayım — test edilecek" olarak işaretlenmiştir (bkz. Bölüm 12).

Hedef kullanıcı: Nehir, 4 yaş, Türkçe ana dili ileri düzey, İngilizce bilmiyor, ilgi alanları dinozor/hayvan/uzay.

---

## 0. Genel ilkeler (araştırmadan damıtılmış)

1. **Az kelime, çok tekrar, aynı bağlam** — her ünite 6-8 kelimeyle sınırlı, hep aynı karakter/sahne içinde tekrarlanır. *(evidence.md §1, Horst 2011)*
2. **Aktif geri çağırma + aralıklı tekrar**, pasif "göster-geç" değil. *(evidence.md §1,§2.5)*
3. **Somut nesne adlarına öncelik** — sıfat/soyut kavramlar daha zor kalıcılık gösteriyor. *(evidence.md §1, Vlach 2012)*
4. **Etkileşimli, duraklamalı anlatım** — otomatik ilerleyen pasif video değil. *(evidence.md §3, §4)*
5. **Ödül göreve içkin, soyut puan/gem değil.** *(evidence.md ilke 13; prior-art.md §1.5, §3)*
6. **Hata cezasız, yönlendirici.** *(evidence.md §5)*
7. **Türkçe destekleyici iskelet, kademeli azalan.** *(evidence.md §6)*
8. **Ebeveyn ortak kullanımı mimariye gömülü, sonradan eklenen bir özellik değil.** *(evidence.md §3.3, ilke 10)*

---

## 1. Ünite sırası ve tema çerçevesi

İlgi alanları (dinozor/hayvan/uzay) ana çerçeveyi oluşturuyor; kavram alanları (renk, sayı, vücut vb.) bu çerçeveler üzerinden öğretiliyor — tam olarak prompt'taki örnekle uyumlu (renkler dinozor, sayılar roket/gezegen, vücut hayvan üzerinden).

| # | Ünite | Kavram alanı | Tema/çerçeve | Hedef kelimeler (6-8) | Kalıp ifadeler (2-3) |
|---|---|---|---|---|---|
| 1 | **Hello!** | Selamlaşma | Rex adlı dost dinozor karakteri çocuğu karşılar | hello, bye-bye, yes, no, please, thank you, good morning | "Hello! I'm Rex!", "Bye-bye! See you!", "Thank you!" |
| 2 | **Dino Colors** | Renkler | Dinozor yumurtaları/derileri | red, blue, yellow, green, orange, purple, pink, brown | "It's red!", "I like blue.", "What color is it?" |
| 3 | **Animal Friends** | Hayvanlar (temel) | Çiftlik/orman hayvanları | dog, cat, bird, fish, cow, duck, pig, frog | "I see a dog!", "The cat says meow.", "Where is the bird?" |
| 4 | **Dino World** | Dinozorlar | Dinozor türleri | T-Rex, Triceratops, Stegosaurus, long-neck (Brontosaurus), flying dino (Pterodactyl), big, small | "I see a T-Rex!", "It's big!", "It's small." |
| 5 | **Count the Rockets!** | Sayılar 1-5 | Roketler/yıldızlar | one, two, three, four, five, rocket, star | "One rocket!", "I see three stars." |
| 6 | **Space Explorer** | Sayılar 6-10 + uzay nesneleri | Gezegenler, ay, güneş | six, seven, eight, nine, ten, planet, moon, sun | "I see the moon!", "Count the planets!" |
| 7 | **Animal Bodies** | Vücut parçaları | Hayvan vücutları → kendi vücuduna transfer | head, nose, ears, hands, feet, tail, wings | "Touch your nose!", "I have two hands." |
| 8 | **Dino Snack Time** | Yiyecekler | Dinozorun yediği basit yiyecekler | apple, banana, egg, leaf, water, meat | "I like apples!", "Yummy!" |
| 9 | **My Family** | Aile | Dinozor ailesi + insan aile kelimeleri | mommy, daddy, baby, grandma, grandpa, family | "This is my mommy.", "I love my family." |
| 10 | **Get Dressed!** | Giysiler | Oyuncak dinozor/hayvana kıyafet giydirme | shirt, hat, shoes, socks, jacket | "Put on your hat!", "Where are my shoes?" |
| 11 | **How Do You Feel?** | Duygular | Dinozor yüz ifadeleri | happy, sad, scared, excited, tired | "I'm happy!", "Are you scared?" |
| 12 | **Let's Move!** | Basit eylemler + büyük/küçük + yukarı/aşağı | TPR-yoğun hareket ünitesi | jump, run, walk, fly, roar, sleep, up, down | "Jump like a dino!", "Fly like a bird!" |
| 13 | **Mix & Match** | — (tekrar ünitesi) | Önceki tüm temalardan kelimeler karışık | *(sabit kelime yok — önceki ünitelerden karışık çekilir)* | — |

**Not (2026-10-18):** Ünite 13 (Mix & Match) ayrı bir içerik ünitesi olarak eklenMEDİ — Aşama 8'de geliştirilen "🔁 Tekrar" ekranı (`src/games/review.ts`) bu ünitenin tarif ettiği şeyi zaten birebir karşılıyor: sabit kelime listesi yok, önceki tüm ünitelerden kelimeler karışık çekiliyor, dinle-dokun mekaniğiyle soruluyor. Tekrar hatta daha iyisini yapıyor — `isDue()` ile sadece vadesi gelen kelimeleri gösteriyor (sabit "tüm kelimeler her zaman karışık" yerine), bu da aralıklı tekrar pedagojisine daha uygun. Haritada ayrı, her zaman erişilebilir bir kart olarak zaten duruyor. Kullanıcı kararı: "sen karar ver... tekrar daha iyi geldi" — bkz. `docs/progress.md` → "Ünite 13 kararı".

**MVP için önerilen ilk 2 ünite: Ünite 1 (Hello!) + Ünite 2 (Dino Colors)** — prompt'taki Bölüm 7 örneğiyle ("Selamlaşma + Dinozor renkleri") tam örtüşüyor; bu, Bölüm 9'da teyit istenen açık sorulardan birini doğal olarak çözüyor. Onaylarsan `docs/progress.md`'deki o açık soruyu kapatırım.

**Not (2026-10-17):** MVP + Aşama 8 kalite kontrolü tamamlanıp kullanıcı onayı alındıktan sonra **Ünite 3 (Animal Friends)** de eklendi — prompt Bölüm 7'nin "çocukla test edip onay almadan yeni ünite ekleme" kuralına uygun olarak her yeni ünite kullanıcı onayı bekleyerek tek tek ekleniyor, bkz. `docs/progress.md` → "Ünite 3 (Animal Friends)".

---

## 2. Ünite içi döngü

Prompt'taki 6 adımlı döngü (tanıtma → tanıma → pekiştirme → şarkı/hikâye → kaydet-dinle → kapanış) şu şekilde oyun tiplerine bağlanıyor:

1. **Tanıtma (dinle ve gör):** Rex her kelimeyi gösterip söylüyor, kısa bir Türkçe çerçeveleme cümlesiyle (bkz. Bölüm 8). Duraklamalı, çocuğun tepki vermesini bekleyen format — otomatik ilerlemiyor. *(evidence.md §3.1, ilke 8)*
2. **Tanıma (dinle ve dokun):** "Where is the T-Rex?" tipi oyun, 2-4 seçenek arasından doğru resme dokunma.
3. **Oyunlaştırılmış pekiştirme:** Üniteye göre TPR, sürükle-bırak veya balon/yıldız yakalama.
4. **Şarkı ya da kısa hikâye:** Her ünitenin 30-45 saniyelik kendi tema şarkısı; interaktif resimli hikâye formatı (sayfa çevirince anlatım, nesnelere dokununca kelime). *(evidence.md §2.3, §3.2 — e-kitap formatı video/oyundan daha güçlü kelime kazanımı gösteriyor)*
5. **Kaydet ve dinle:** Model ses önce, ardından çocuğun kendi kaydı arka arkaya. Puanlama yok, konuşma tanıma yok.
6. **Kapanış:** Rex kısa bir övgü ("Great job, Nehir!" — ölçülü, her cümlede değil) + doğal bitiş ("Bye-bye! See you tomorrow!").

---

## 3. Tekrar ve aralıklı tekrar modeli

- **Görsel harita:** "Dino Ada" (üniteler 1-4), "Uzay İstasyonu" (üniteler 5-6), "Hayvan Ormanı" (üniteler 7-8) gibi bölgelere ayrılmış tek bir büyük harita. Tamamlanan üniteler açık kalır, istenildiği zaman geri dönülüp tekrar oynanabilir.
- **Aralıklı tekrar zamanlaması (Leitner-benzeri, basitleştirilmiş):** Bir kelime ilk öğrenildiğinde → **1 gün sonra** kısa bir hatırlama turunda tekrar gelir → başarılıysa **3 gün sonra** → başarılıysa **7 gün sonra**. Bu, `evidence.md` §1 ve §2.5'teki aralıklı geri çağırma bulgularına dayanıyor (not: bu bulgular büyük ölçüde DLD popülasyonunda yapılmış deneylerden geliyor, tipik gelişen tek dilli L2 öğrenen 4 yaşındaki bir çocuğa genellenebilirliği "muhtemel ama doğrudan doğrulanmamış" — bkz. Bölüm 12).
- **Ayrı "Mix & Match" tekrar etkinliği (Ünite 13):** Önceki ünitelerin kelimelerini karıştırarak sunar, kelime karışıklığını test eder. Harita üzerinde her zaman erişilebilir, ünite tamamlama sırasına bağlı değil.

## 4. Uyarlanabilir zorluk (varsayım — gerçek kullanımla ayarlanacak)

- Bir turda ilk denemede doğruluk **≥%75** (örn. 4 sorudan 3'ü) ise bir sonraki aktiviteye/üniteye geçilir.
- Doğruluk **<%50** ise aynı kelimeler, dikkat dağıtıcı (yanlış seçenek) sayısı 4'ten 2'ye düşürülerek daha kolay bir turda tekrar sunulur; bu fark ettirilmeden, "yeni bir oyun" gibi sunulur.
- Bu eşikler literatürde test edilmiş sabit rakamlar değil, makul bir başlangıç noktasıdır — Nehir'in gerçek tepkilerine göre ebeveyn panelinden ayarlanabilir hale getirilmeli (teknik plan aşamasında).

## 5. Geri bildirim ve ödül

- **Cezasız hata:** Yanlış dokunuşta olumsuz ses/animasyon yok. Doğru cevap nazikçe tekrar gösterilir ("Hadi birlikte bakalım... işte burada!"). *(evidence.md §5 — kesin bir "4 yaş L2'de hangisi daha iyi" formülü bulunamadı, bu orta-yol bir tasarım varsayımı)*
- **Ödül göreve içkin:** Yeni kelime öğrenilince harita üzerinde yeni bir dinozor/gezegen/hayvan "açılır" ve onunla oynanabilir hale gelir. Soyut puan/yıldız biriktirme ekranı **yok**. *(evidence.md ilke 13; prior-art.md'de Reading Eggs'in "gem/coin" modeline karşı uyarı)*
- Övgü sesleri ölçülü kullanılır; Nehir'in adı bazı övgü/selamlama anlarında geçer ama her cümlede değil (prompt Bölüm 1).

## 6. Seans yapısı (15-30 dakika, ebeveynle)

- Seans 2-3 kısa tura bölünür. Her tur bir oyun tipine karşılık gelir (örn. tur 1: dinle-dokun, ara: TPR molası "Stomp like a dinosaur!", tur 2: sürükle-bırak veya hikâye, tur 3: kaydet-dinle).
- Ayarlanan süre (varsayılan 20 dk, ebeveyn panelinden 15-30 dk arası ayarlanabilir) dolunca doğal bir kapanış ekranı gelir: "Bye-bye! See you tomorrow!"
- Süre takibi çocuğa görünür bir sayaç olarak **gösterilmez** (süre baskısı/kaygı riski — evidence.md ilke 2, dikkat dağıtmama ilkesi).

## 7. Ebeveyn rehberliği

Her ünite için: (a) ekranın köşesinde açılıp kapanabilen kısa bir Türkçe ipucu, (b) ekran dışı bir etkinlik kartı.

| Ünite | Ebeveyn ipucu örneği | Ekran dışı etkinlik |
|---|---|---|
| Hello! | "Ona sorun: Rex'e nasıl merhaba dedin?" | Evde birbirinize İngilizce "hello/bye-bye" ile selamlaşma oyunu |
| Dino Colors | "Birlikte tekrar edin: Senin tişörtün ne renk?" | Evde renk avı — kırmızı/mavi/sarı eşyaları bulma |
| Animal Friends | "Hayvan seslerini birlikte taklit edin." | Oyuncak hayvanlarla "hangi hayvan?" oyunu |
| Dino World | "Nehir'e sorun: Bu dinozor büyük mü, küçük mü?" | Oyuncak dinozorları büyük/küçük sıralama |
| Count the Rockets! | "Birlikte 1'den 5'e kadar sayın." | Evdeki eşyaları İngilizce sayma |
| Space Explorer | "Gece gökyüzünde ayı/yıldızları gösterin." | Karton roket yapma |
| Animal Bodies | "Touch your nose deyin, o da yapsın." | Vücut parçaları gösterme oyunu |
| Dino Snack Time | "Yemek sırasında İngilizce isimlerini söyleyin." | Meyve/sebze tanıma oyunu |
| My Family | "Aile fotoğrafına bakıp İngilizce söyleyin." | Aile fotoğrafı albümü üzerinden isimlendirme |
| Get Dressed! | "Giyinirken kıyafetin adını İngilizce sorun." | Oyuncağa kıyafet giydirme |
| How Do You Feel? | "Şu an nasıl hissettiğini İngilizce sorun." | Duygu yüzleri çizme/gösterme |
| Let's Move! | "Komutları birlikte yapın: Jump! Run!" | Ev içinde basit hareket oyunu |

## 8. Talimat dili: Türkçe destek (güncel davranış — bkz. not)

- Hedef kelimeler ve oyun içi talimatlar her zaman İngilizce'dir; Türkçe sadece (a) ünite ilk kez/tekrar açıldığında kelime tanıtma ekranında, (b) her oyun tipine girişte kısa bir "nasıl oynanır" açıklamasında kullanılır.
- **Ebeveyn paneli tek bir anahtar sunar: Açık / Kapalı.** Açıkken hem kelime tanıtma hem oyun-başı Türkçe açıklama **her girişte** (azalmadan) gösterilir; Kapalıyken ikisi de hiç gösterilmez. Her iki ekranda da bir "Atla" düğmesi var, istenirse anında geçilebilir.
- **Önemli not — tasarım değişti (bkz. `docs/progress.md` 8-9. tur, `CLAUDE.md` karar günlüğü 2026-10-15):** Bu bölümün önceki sürümü "aynı oyun tipi 3 kez oynandıktan sonra Türkçe otomatik kalkar" diye bir kademeli azaltma (fading) kuralı tarif ediyordu. Gerçek kullanıcı testinde bu mekanizma iki soruna yol açtı: (1) sayaç ünite bazlı değil tüm üniteler için ortak ve global olduğu için, bir oyun tipi bir ünitede birkaç kez oynanınca diğer tüm ünitelerde de kalıcı olarak susuyordu; (2) kelime tanıtma ekranı bir kez görüldükten sonra bir daha hiç gösterilmiyordu, kullanıcı bunu tekrar dinlemek istediğinde yöntemi yoktu. Kullanıcı kararıyla otomatik azaltma tamamen kaldırıldı, yerine "her zaman göster + manuel Atla + tek Açık/Kapalı anahtarı" modeline geçildi. Zaten bu "3 kez" eşiği hiçbir zaman literatürle doğrulanmış bir sayı değildi (`evidence.md` §6) — bu değişiklik o açık hipotezi kapatıp daha basit, kullanıcı kontrollü bir modelle değiştiriyor.

## 9. Ses kaydı mekaniği

- Hedef kelime/kalıp önce model sesle söylenir, çocuk mikrofon simgesine basıp kendi sesini kaydeder, iki ses arka arkaya çalınır.
- **Puanlama ya da konuşma tanıma yok.** *(prompt zorunluluğu + evidence.md §7: bu mekaniğin pedagojik etkisi doğrudan kanıtlanmamış, düşük riskli ama "kanıtlanmış etkili" olarak sunulmamalı)*
- Bu özellik ebeveyn eşliğinde çerçevelenmeli (örn. ipucu: "Sen de Rex gibi söyle, sonra kendini dinle") — tek başına bırakılan bir "doğru/yanlış" değerlendirmesi beklenmemeli (4 yaşta metabilişsel öz-değerlendirme kapasitesi sınırlı).

## 10. Ölçme planı

Prompt'taki Bölüm 6 beklentileri araştırmayla (`evidence.md` §8, ilke 17) tam örtüşüyor; aşağıda somutlaştırıldı.

**"Öğrenildi" tanımı (dört unsur):**
1. **Alıcı ölçüm:** Çocuğun duyduğu kelimeye doğru resmi ilk denemede seçmesi.
2. **Üretici ölçüm (konuşma tanıma olmadan):** Ebeveyn gözlem kaydı üzerinden ("uygulama dışında kendiliğinden kullandı: [kelime]") — otomatik ölçülemediği için bu kanal üretici veriyi sağlar.
3. **Genelleme:** Kontrol sorularında öğretimde kullanılmamış farklı bir görsel (örn. farklı renkte/pozisyonda çizilmiş aynı dinozor türü) kullanılır.
4. **Gecikmeli test:** **Farklı günlerde** yapılan en az iki kontrolde ilk denemede doğru tanınmış olmalı; aynı seans içindeki doğrular sayılmaz. Şans düzeyi hesaba katılır (örn. 4 seçenekte %25 şans düzeyi göz önünde bulundurulup tek doğru cevap "öğrenildi" kanıtı sayılmaz).

**Kayıt edilecek veri (her kelime denemesi için):** oturum id, tarih, ünite, kelime (İngilizce/Türkçe), oyun tipi, görsel varyantı (öğretimde görülen / yeni), ilk denemede doğru mu, dikkat dağıtıcı sayısı, deneme sırası (seans içindeki kaçıncı deneme).

**Oturum düzeyi veri:** seans süresi, kendi isteğiyle tekrar seçilen bölümler, yarıda bırakılan etkinlikler.

**Ünite öncesi ön test:** Her ünite başında, çocuğun zaten bildiği kelimeleri ayırt etmek için oyunlaştırılmış kısa bir ön test (normal oyun gibi görünür, test hissi vermez).

**CSV dışa aktarma:** Tidy format, satır başına bir deneme — teknik şema Aşama 3'te netleştirilecek.

## 11. Oyun tipleri (prompt'taki 7 öneri, kanıt düzeyiyle)

| Oyun tipi | Kanıt desteği | Not |
|---|---|---|
| Dinle ve dokun | Orta-güçlü (aktif geri çağırma, alıcı ölçüm ile örtüşüyor) | Ana ölçme mekanizması da bu |
| TPR (hareket) | Orta (çok sayıda küçük ölçekli çalışma + embodied cognition teorisi, meta-analiz yok) | "Dokunsal-TPR" olarak uyarlanabilir |
| Sürükle-bırak | Kanıt aranmadı, nötr/makul bir etkileşim deseni | Aktif katılım ilkesiyle uyumlu |
| Balon/yıldız yakalama | Kanıt aranmadı, nötr | Dikkat dağıtmama ilkesine dikkat — abartılı animasyon olmasın |
| Etkileşimli resimli hikâye | Güçlü (e-kitap formatı video/oyundan daha etkili — Jing ve ark. 2023) | Öncelikli format olmalı |
| Şarkı/tekerleme | Orta-güçlü (sistematik derleme, System 2024) | Telifsiz, özgün sözler |
| Kaydet ve dinle | Zayıf/doğrulanamadı (bkz. Bölüm 9) | Düşük riskli, düşük pedagojik ağırlıklı ek özellik olarak konumlandırılmalı |

Her oyun tipi için yazılı kabul kriterleri, geliştirme öncesi Aşama 3/4'te belirlenecek (prompt Bölüm 8 kalite kontrol gereksinimi).

---

## 12. Araştırmayla çelişen veya belirsiz noktalar

Genel değerlendirme: **Araştırma, prompt'taki beklentilerin büyük kısmını destekliyor; hiçbir majör çelişki yok.** Ancak şu noktalarda kanıt zayıf veya yok — bunlar kesin bilimsel kural değil, test edilecek tasarım varsayımı olarak ele alınmalı:

1. **Türkçe fading zamanlaması** ("3 kez başarılı oynama sonrası kaldır") — literatürde bu süreyi/eşiği belirleyen bir çalışma yok (`evidence.md` §6).
2. **Hata toleransı formülü** — tamamen hatasız mı, hafif hataya açık mı daha iyi, 4 yaş L2 bağlamında doğrudan test edilmiş değil (`evidence.md` §5).
3. **Kayıt-dinle (record-and-playback) mekaniğinin etkisi** — doğrudan kanıt bulunamadı, sadece ilişkili (konuşma bozukluğu) popülasyonda zayıf/dolaylı kanıt var (`evidence.md` §7).
4. **Aralıklı tekrar aralıkları (1-3-7 gün)** — bu spesifik zamanlama DLD popülasyonunda test edilmiş, tipik gelişen 4 yaşındaki L2 öğrenenine genellenebilirliği doğrudan doğrulanmamış (`evidence.md` §1, §2.5).
5. **TPR ve balon/yıldız yakalama gibi oyun tiplerinin spesifik etkisi** — meta-analiz düzeyinde kanıt yok, sadece küçük ölçekli çalışmalar/teorik destek var.

Bunların hiçbiri prompt'taki tasarımı **geçersiz kılmıyor** — hepsi zaten düşük riskli, çocuğun deneyimini bozmayacak tasarım kararları. Ancak MVP sonrası kullanım gözlemiyle (Bölüm 6'daki ölçüm verisiyle) ayarlanmaya açık tutulmalı.

---

## 13. Açık sorular / onay gerekenler

- **MVP ilk 2 ünite:** Bölüm 1'deki Ünite 1 (Hello!) + Ünite 2 (Dino Colors) önerisini onaylıyor musun? (prompt'un kendi örneğiyle örtüşüyor)
- **Ünite sırası/sayısı (13 ünite):** Bu sıralama ve kapsam uygun mu, yoksa bazı temaları birleştirmek/çıkarmak ister misin?
- **Aralıklı tekrar aralıkları (1-3-7 gün):** Bu varsayımsal zamanlama ile ilerleyelim mi, yoksa daha sık/seyrek bir başlangıç ister misin?
- **Türkçe fading eşiği ("3 kez"):** Bu sayı ile başlayıp gerçek kullanımla ayarlamak uygun mu?

Bu dosya onaylandıktan sonra Aşama 3'e (Teknik plan → `docs/technical-plan.md`) geçeceğim — talimat gereği onaysız geçmiyorum.
