# Teknik Araştırma — 4 Yaş İçin İngilizce Öğrenme PWA (iPad)

**Hedef cihaz:** iPad Pro 12,9" (6. nesil), iPadOS 17/18 ve sonrası, Safari → "Ana Ekrana Ekle" ile standalone PWA, tamamen offline, 1366×1024 pt yatay, 120 Hz ProMotion.

**Not:** iOS/iPadOS Safari davranışları sürümden sürüme değişebiliyor. Her bulguda hangi sürüm/tarih için geçerli olduğu belirtilmiştir. Doğrulanamayan veya çelişkili bulgular açıkça işaretlenmiştir. Araştırma tarihi: 2026-10-13.

---

## 1. Ana ekrana eklenmiş PWA kısıtları (iPadOS 17/18+)

### 1.1 Ses çalma — kullanıcı dokunuşu gereksinimi

- iOS Safari'de (standalone PWA dahil) hem `<audio>`/`<video>` elementleri hem de Web Audio API `AudioContext`, bir kullanıcı jesti (tap/touchstart/click) **içinde** başlatılmadıkça sesi oynatmaz veya `AudioContext`'i "suspended" durumunda tutar. Bu, WebKit'in otomatik oynatma (autoplay) politikasının bir sonucudur.
- **Pratik sorun:** Jest penceresi (gesture window) çok kısadır. Jestin *dışında* (örn. bir ağ isteği veya `setTimeout` sonrasında) oluşturulan yeni bir `Audio()` nesnesi veya `resume()` çağrısı WebKit tarafından reddedilir / sessiz kalır. Bu yüzden "her cümle için yeni ses nesnesi" gibi yaklaşımlar iOS'ta ilk cümleden sonra sessiz kalmaya başlar.
- **Önerilen desen (AudioContext unlock pattern):**
  1. Uygulama açılışında (ilk dokunuşta) **bir tane** `AudioContext` oluşturulur ve aynı jest içinde `resume()` çağrılır ya da kısa, sessiz bir buffer çalınır ("silent unlock").
  2. Bu context ve/veya tek bir `<audio>` elementi **oturum boyunca yeniden kullanılır**; her yeni ses için `src` değiştirilir veya `AudioBufferSourceNode` yeniden oluşturulup var olan context üzerinde çalınır — yeni `AudioContext` veya yeni `Audio()` nesnesi **oluşturulmaz**.
  3. Uygulamaya her girişte (PWA yeniden açıldığında context süspanse olabilir) context durumu kontrol edilip `state === 'suspended'` ise ilk dokunuşta tekrar `resume()` çağrılmalı.
  4. Önceden yüklenmiş (offline, service worker cache'inden) ses dosyaları `decodeAudioData` ile önceden decode edilip bellekte tutulursa, oynatma gecikmesi daha da azalır — bu düşük gecikmeli oynatma için önemlidir (120 Hz / dokunsal geri bildirim senkronu gereken bir çocuk uygulamasında faydalı).
  - Kaynak: [Unlock JavaScript Web Audio in Safari and Chrome](https://www.mattmontag.com/web/unlock-web-audio-in-safari-for-ios-and-macos), [Implementing audio/video autoplay unlocking (gist)](https://gist.github.com/TimvanScherpenzeel/c870b35358fb96fa643d9ed1ea606efd) — bu desen yıllardır stabil, 2025-2026 GitHub PR'larında da (ör. elevenlabs/packages #1025, achappell/hermes-relay-tui #233) hâlâ aynı temel kalıpla "fix" edildiği görülüyor, yani WebKit davranışı köklü ve değişmemiş.
  - **Doğrulanamadı:** iPadOS 18/19'da bu jest-pencere davranışının süresi (ms) resmi olarak belgelenmiş değil; WebKit kaynak kodunda sabit değilse de ampirik olarak "senkron çağrı zinciri" dışına çıkan her şey riskli kabul edilmeli.

### 1.2 Mikrofon erişimi (getUserMedia / MediaRecorder) ve izin kalıcılığı

- `getUserMedia`/`MediaRecorder` API'leri standalone PWA'da da çalışır (Safari bu API'leri destekler), ancak **izin kalıcılığı normal Safari sekmesine göre daha zayıftır**:
  - Standart Safari sekmesinde mikrofon izni origin bazında kalıcı olarak hatırlanır.
  - **Ana ekrana eklenmiş (standalone) PWA'larda** birden fazla kaynak, iznin **kalıcı olmadığını veya oturumlar arasında yeniden sorulduğunu** bildiriyor; bazı raporlarda rota değişiminde veya uygulama her yeniden açıldığında izin isteminin tekrar tetiklendiği görülüyor (Capacitor/Ionic ekosistemindeki benzer şikayetler de aynı WebKit davranışına işaret ediyor).
  - W3C WebRTC listesindeki (2025 Haziran) tartışmada belirtilen genel kural: aktif bir capture varsa izin istemi 24 saat tekrarlanmaz; capture aktif değilse ~1 dakikalık hareketsizlikten sonra tekrar sorulabilir — ancak bu genel bir WebRTC önerisi, Safari'nin standalone modda **tam olarak** bu kurala uyduğu resmî olarak doğrulanmadı.
  - **Doğrulanamadı / çelişkili:** "Her açılışta mutlaka tekrar sorar mı" sorusunun kesin, sürüm-spesifik bir cevabı yok; pratikte **güvenilir izin kalıcılığına güvenilmemeli** — uygulama her oturum başında izin durumunu (`navigator.permissions.query({name:'microphone'})` destekleniyorsa, ya da doğrudan `getUserMedia` deneyip hata yakalayarak) kontrol edip kullanıcıya (bu durumda ebeveyne) nazik bir şekilde tekrar izin isteyecek bir akış kurgulamalı.
  - Kaynak: [WebKit Bug 215884](https://bugs.webkit.org/show_bug.cgi?id=215884), [Ionic/Capacitor Issue #5580](https://github.com/ionic-team/capacitor/issues/5580), [W3C WebRTC listesi 2025-06](https://lists.w3.org/Archives/Public/public-webrtc-logs/2025Jun/0089.html), [MagicBell: PWA iOS Limitations 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide).
- **Ekstra not:** iOS Safari, `getUserMedia` ile mikrofon kullanılırken ses çıkışını zorla hoparlöre yönlendirebilir (kulaklık/Bluetooth yönlendirmesini bypass edebilir) — kayıt sırasında ses geri bildirimi veriliyorsa test edilmeli. Kaynak: [iOS Safari forces audio output to speakers when using getUserMedia](https://medium.com/@python-javascript-php-html-css/ios-safari-forces-audio-output-to-speakers-when-using-getusermedia-2615196be6fe) (ikincil kaynak, resmi değil — doğrulanmalı).

### 1.3 Service worker ile offline önbellek

- **Disk kotası (2025-2026 itibarıyla geçerli, Safari 17+ WebKit Storage Policy):**
  - Eski "iOS'ta Cache Storage için 50MB sabit limit var" bilgisi **artık güncel değil** — bu, çok eski bir WebKit davranışının hâlâ kopyala-yapıştır dolaşan bir efsanesi.
  - Safari 17 ve sonrasında (iOS/iPadOS 17, Ağustos 2023 itibarıyla) kota, **sabit bir sayı değil, kullanılabilir disk alanının yüzdesi** olarak hesaplanıyor:
    - **Origin quota:** Tarayıcı uygulamaları (Safari ve home screen web app'ler dahil) için toplam disk alanının **%60'ına kadar**.
    - **Overall quota:** Tüm origin'ler toplamında disk alanının **%80'ine kadar**.
    - (Tarayıcı olmayan native uygulamalar için bu oranlar daha düşük: %15 / %20.)
  - Bu kota bir **üst sınırdır, garanti değildir**; `QuotaExceededError` yakalanmalı. WebKit, parmak izi (fingerprinting) riskini azaltmak için bildirilen kota değerini kullanım geçmişine göre kasıtlı olarak değiştirebiliyor — yani bir kere ölçülen değere güvenilmemeli.
  - Depolama baskısı altında WebKit, origin bazında **LRU (en uzun süre kullanılmayanı sil)** politikasıyla veri siliyor.
  - Kaynak: [WebKit Blog — Updates to Storage Policy (10 Ağustos 2023, Safari 17/iOS 17/macOS Sonoma için)](https://webkit.org/blog/14403/updates-to-storage-policy/).
- **Güncellemelerin algılanması (service worker update lifecycle):**
  - Standart yaşam döngüsü: `installing` → `installed` (waiting) → `activating` → `active`.
  - Tarayıcı, sayfa her yüklendiğinde service worker dosyasını arka planda tekrar indirip **byte-byte** eski sürümle karşılaştırır; fark varsa yeni bir worker `installing` durumuna geçer. (24 saatten eski bir fetch önbellekten değil ağdan yapılır.)
  - Yeni worker `installed` (waiting) durumuna geçtiğinde, henüz sayfaları kontrol etmez — açık sekmeler/PWA örneği kapanana kadar bekler. Bu noktada `updatefound` eventi ve ardından `newWorker.state === 'installed' && navigator.serviceWorker.controller` koşuluyla **kullanıcıya "yeni sürüm hazır, şimdi güncelle" bildirimi gösterilebilir**.
  - Kullanıcı onayladığında `skipWaiting()` + `self.clients.claim()` ile yeni sürüm hemen devreye alınır, `controllerchange` eventi dinlenip `window.location.reload()` yapılır.
  - 4 yaşındaki kullanıcı için bu akışın **ebeveyn tarafında** (örn. basit bir "Güncelleme var" rozeti/butonu, çocuğun göremeyeceği bir ayarlar ekranında) sunulması, çocuğun ortasında oyunken sayfanın aniden yenilenmesini önler.
  - Kaynak: [MDN — Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [MDN — ServiceWorkerRegistration.update()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update).

### 1.4 Yerel veri saklama (IndexedDB) ve silinme koşulları

- **ITP'nin 7 günlük script-writable storage temizliği:** Safari'de ITP (Intelligent Tracking Prevention), bir origin 7 gün boyunca **Safari sekmesinde** kullanıcı etkileşimi almazsa IndexedDB, LocalStorage, Cache Storage, SessionStorage ve Service Worker kayıt/cache'lerini siler. Kaynak: [WebKit Blog — Intelligent Tracking Prevention 2.3](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/).
- **Ana ekrana eklenmiş (standalone) PWA'lar için kritik muafiyet:** Home screen web app'in first-party domaini, ITP'nin veri silme algoritmasında **her zaman atlanır** — yani bu 7 günlük kurala tabi değildir. WebKit'in resmi açıklaması: home screen uygulamasının site verisi Safari'den **izole** tutulur ve Safari'deki izleme sınıflandırmasından etkilenmez; ayrıca home screen uygulamasının "kullanım günü" sayacı kendine özeldir ve uygulamayı kullanmak bu sayacı sıfırlar.
  - **Sonuç:** Projenin "Ana Ekrana Ekle" ile kurulması zorunlu/kritik bir adım — hem bu araştırmanın önceki bulgularıyla (standalone olmayan sekme modunda veri 7 günde silinebilir) hem de genel UX hedefiyle uyumlu.
- **`navigator.storage.persist()` davranışı:**
  - API destekleniyor, ancak Safari **kullanıcıya herhangi bir izin diyaloğu göstermez** — karar sessizce, dahili sezgisel (heuristic) değerlendirmeyle verilir (örn. site home screen'e eklenmiş mi, kullanıcı etkileşimi var mı).
  - Bu nedenle `persist()` çağrısının **true dönmesi garanti değildir** ve "güvenilir" olarak nitelendirilemez — asıl güvenceyi sağlayan home screen'e ekleme (standalone mod) + düzenli kullanımdır, `persist()` çağrısı ek bir sinyal/iyileştirme olarak düşünülmeli, tek başına garanti olarak değil.
  - **Doğrulanamadı:** Safari'nin bu heuristic'in tam kriterleri (hangi sinyaller, hangi eşikler) resmi olarak yayınlanmamış.
  - Kaynak: (ikincil, çapraz doğrulanmış) [qnotepad — IndexedDB Storage Limits & Eviction Rules 2026](https://qnotepad.com/blog/indexeddb-storage-limits-safari-firefox-chrome), [browser-storage.com — iOS Safari 7-Day Storage Eviction Workaround](https://www.browser-storage.com/browser-storage-fundamentals-quotas/storage-quotas-eviction-policies/ios-safari-7-day-storage-eviction-workaround/).
- **Pratik öneri:** Kritik ilerleme verisi (çocuğun kaydettiği sesler, tamamladığı dersler) hem IndexedDB'de tutulmalı hem de mümkünse ebeveynin dışa aktarabileceği bir yedekleme mekanizması (örn. JSON export, "Ayarlar" ekranından paylaş) sunulmalı — tamamen offline bir uygulamada cihaz değişimi/silinme senaryosunda veri kaybı riski olduğu için.

### 1.5 İstenmeyen jestlerin engellenmesi (zoom, metin seçme, swipe-back, pull-to-refresh)

- **Pinch-zoom / double-tap zoom:**
  - Viewport meta etiketi: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">` — ancak `user-scalable=no` tek başına erişilebilirlik açısından tartışmalı ve her WebKit sürümünde garanti değildir.
  - Daha standart/sağlam yöntem: CSS `touch-action` özelliği. `touch-action: manipulation` panning'e izin verir ama double-tap-zoom gibi standart olmayan ek jestleri kapatır (ve tıklama olaylarındaki gecikmeyi de kaldırır). Pinch-zoom'u tamamen kapatmak için `touch-action: pan-x pan-y` (pinch-zoom hariç sadece kaydırma) kullanılabilir.
  - Kaynak: [MDN — touch-action](https://developer.mozilla.org/Web/CSS/touch-action), [Disabling Double-Tap Zoom with CSS touch-action](https://raulmelo.me/en/til/disable-double-tap-zoom-css-touch-action).
- **Metin seçimi:** `user-select: none; -webkit-user-select: none;` kök elemente (body) uygulanmalı; çocuğun yanlışlıkla metni seçip büyüteç/kopyala menüsünü açmasını önler. Giriş alanları (varsa) için istisna tanımlanmalı.
- **Swipe-back (sayfa geçmişinde geri gitme jesti):** Bu, standalone PWA'da genelde **devre dışıdır** çünkü standalone modda Safari'nin kendi gezinme çubuğu/edge-swipe-back jesti yoktur (bu jest Safari sekme görünümüne özgüdür). Yine de SPA içinde kendi "geri" jestlerini (örn. kaydırmalı menüler) kullanıyorsanız, kenardan başlayan dokunuşları `touchstart`/`touchmove` ile yakalayıp `preventDefault()` çağırmak gerekebilir. **Not:** Bu tam garantili değildir — sayfa scroll durumundaysa native davranış JS'in önüne geçebilir.
- **Pull-to-refresh:** CSS `overscroll-behavior-y: none` (veya `overscroll-behavior: none`) modern tarayıcılarda standart çözümdür, ancak **Safari/iOS bu özelliği tutarlı desteklemiyor** — bu nedenle ek olarak JS tabanlı bir önlem gerekir: sayfanın en üstündeyken `touchmove` eventinde parmağın yönü aşağı ise `event.preventDefault()` çağırmak. Uygulamanın tamamında `body { position: fixed; overflow: hidden; }` + içeride scroll edilen bir `<div>` kullanmak (yani body'nin kendisinin hiç scroll olmaması) bu sınıf sorunları büyük ölçüde ortadan kaldırır — çocuk uygulamaları için önerilen yaklaşım budur.
  - Kaynak: [CSS Overscroll Behavior Module Level 1 (W3C)](https://www.w3.org/TR/css-overscroll-1), [Prevent overscroll/bounce in iOS MobileSafari (CSS only)](https://www.bram.us/2016/05/02/prevent-overscroll-bounce-in-ios-mobilesafari-pure-css/).
- **Genel öneri:** Tüm sayfa `touch-action: manipulation; user-select: none; -webkit-user-select: none;` ile başlasın, `body`/`html` sabit (`position: fixed`, `overflow: hidden`) tutulsun, uygulamanın kendi iç container'ı scroll edilsin (gerekiyorsa). Bu, kiosk-tarzı çocuk uygulamalarında standart pratiktir.

---

## 2. Framework seçimi

Proje profili: karmaşık state yönetimi yok, ağırlıklı olarak animasyon + ses + dokunma etkileşimi, küçük/orta ölçekli kod tabanı, tek geliştirici/küçük ekip, offline-first, uzun vadede bakım kolaylığı önemli.

| Seçenek | Bundle boyutu (runtime) | Artılar | Eksiler |
|---|---|---|---|
| **Vanilla TypeScript + Vite** | ~0–1 KB (framework yok) | Sıfır abstraction, en küçük ayak izi, debug kolay, PWA/service worker entegrasyonu dolaysız, Vite TS'i yerleşik destekler | State/DOM güncellemesi elle yazılır; animasyon-yoğun UI'da kod tekrarı artabilir |
| **Preact (+ Vite)** | ~3 KB gzip (compat layer hariç) | React'e çok benzer component/hook modeli, küçük öğrenme eğrisi, JSX ile bildirimsel UI, React kütüphaneleriyle uyumlu | Yine de bir "framework" — gereksiz karmaşıklık riski var |
| **Svelte (+ Vite)** | ~2–6 KB gzip (derleme-zamanlı, virtual DOM yok) | Derleme zamanında doğrudan DOM manipülasyonuna derlenir, animasyon/transition için yerleşik birinci sınıf destek (`transition:`, `animate:`), HTML/CSS/JS'e yakın sözdizimi | Ek derleyici/araç zinciri, ekip Svelte'e yabancıysa öğrenme maliyeti |
| **React (+ Vite)** | ~40–45 KB gzip runtime | Geniş ekosistem, çok kaynak | Bu proje için gereksiz ağır; 4 yaşlık çocuk arayüzü için fazladan karmaşıklık/bundle boyutu anlamsız |

**Değerlendirme:**
- Proje "karmaşık state yönetimi yok" + "ağırlıklı animasyon/ses/dokunma" profiline en iyi uyan iki seçenek **Vanilla TS + Vite** ve **Svelte + Vite**'tir.
- Svelte'in yerleşik `transition`/`animate` direktifleri ve CSS-scoped component yapısı, "karakter konuşuyor, obje sahneye uçuyor, dokunulan şey zıplıyor" tarzı bir çocuk arayüzü için vanilla TS'e göre **gözle görülür geliştirme hızı avantajı** sağlar; buna karşın derleme adımı Vite ile zaten var olduğundan ek karmaşıklık marjinaldir.
- Eğer ekip TypeScript'e aşinaysa ve ileride state biraz büyürse (örn. ilerleme/rozet sistemi, çoklu ders modülü), hafif bir state kütüphanesi (örn. `nanostores` ~1KB veya Svelte'in kendi store'ları) yeterli olur; Redux/MobX gibi ağır çözümler gerekmez.
- **Öneri: Svelte + Vite (TypeScript ile) + SvelteKit olmadan, sade SPA modu (`adapter-static` benzeri, aslında SvelteKit'e gerek yok — düz Svelte+Vite şablonu yeterli).** Eğer ekip Svelte'e hiç aşina değilse ve en düşük risk/öğrenme maliyeti isteniyorsa, **Vanilla TypeScript + Vite** de tamamen meşru ve daha "şeffaf" bir alternatiftir — özellikle offline PWA + service worker debug'ının her adımının tam kontrolde olmasının değerli olduğu bu projede.
- Kaynak (bundle boyutu karşılaştırmaları, ikincil ama çoklu kaynakla tutarlı): [js-framework-comparison (GitHub)](https://github.com/MarioVieilledent/js-framework-comparison), genel 2026 framework karşılaştırma yazıları (bnxt.ai, freetechlearner.com) — bu rakamlar kaynaktan kaynağa ±%20-30 değişebiliyor, kesin KB değerleri değil **büyüklük mertebesi** olarak okunmalı.

---

## 3. Ücretsiz statik barındırma: GitHub Pages + GitHub Actions

- GitHub Pages, statik dosyaları (HTML/CSS/JS, service worker, manifest, ses/görsel assetleri) ücretsiz barındırabilir; özel domain ve HTTPS (PWA'nın service worker çalışması için **zorunlu**, `localhost` hariç secure context gerekir) desteklenir.
- Önerilen akış (2025-2026 güncel pratiği):
  1. Repo ayarlarında **Settings → Pages → Build and deployment → Source: "GitHub Actions"** seçilir (klasik "Deploy from a branch" yönteminden farklı, daha modern yol).
  2. Resmi Actions zinciri kullanılır: `actions/checkout` → (varsa build adımı, örn. `npm ci && npm run build`) → `actions/configure-pages` → `actions/upload-pages-artifact` (build çıktısı, örn. `dist/`) → `actions/deploy-pages`.
  3. Workflow izinleri: `permissions: { contents: read, pages: write, id-token: write }`.
  4. Tetikleyici: `on: push: branches: [main]` — her `main`'e push'ta otomatik yayın; isteğe bağlı `workflow_dispatch` ile manuel tetikleme de eklenebilir.
  5. PWA'ya özgü not: GitHub Pages projeleri genelde `https://<kullanıcı>.github.io/<repo-adı>/` gibi bir alt-yol altında yayınlanır; `manifest.json`'daki `start_url`/`scope` ve service worker'ın `register()` çağrısındaki `scope` bu alt-yolla **tam eşleşmeli**, aksi halde standalone mod veya offline cache çalışmayabilir.
- Örnek iskelet (açıklayıcı amaçlı, proje için gerçek dosya değil):
  ```yaml
  # .github/workflows/deploy.yml
  on:
    push:
      branches: [main]
  permissions:
    contents: read
    pages: write
    id-token: write
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: 20 }
        - run: npm ci && npm run build
        - uses: actions/upload-pages-artifact@v3
          with: { path: dist }
    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
      steps:
        - id: deployment
          uses: actions/deploy-pages@v4
  ```
- Kaynak: [GitHub — starter-workflows/pages/static.yml](https://github.com/actions/starter-workflows/blob/main/pages/static.yml), [actions/deploy-pages](https://github.com/actions/deploy-pages) (resmi GitHub Actions), genel 2025 pratiği.

---

## 4. Çocuk arayüzleri: dokunma hedefi boyutları ve Guided Access uyumluluğu

### 4.1 Dokunma hedefi (tap target) boyutları

- Apple Human Interface Guidelines'ın yerleşik, uzun süredir değişmemiş kuralı: **tüm interaktif kontroller için minimum 44×44 pt** dokunma alanı. Bu, iOS ve iPadOS'un her ikisi için de aynı standarttır.
- Fiziksel karşılığı yaklaşık **9–12 mm** — ortalama bir yetişkin parmak ucu büyüklüğü baz alınır.
- **4 yaşındaki bir çocuk için öneri:** 44pt mutlak minimumdur, çocuk motor becerileri (hassasiyet, hedefleme) yetişkinden daha düşük olduğundan **pratikte çok daha büyük hedefler** kullanılmalı. Sektör pratiğinde çocuk uygulamalarında genelde **80–120 pt** aralığında ana etkileşim butonları/karakterleri önerilir (bu, HIG'in resmi bir "çocuklar için" sayısı değildir — HIG sadece genel 44pt minimumunu belirtir; çocuğa özel büyütme bu araştırmanın pratik çıkarımıdır).
- Dokunma hedefleri arasında yeterli boşluk (spacing) bırakılmalı — yanlışlıkla bitişik elemente dokunmayı önlemek için, özellikle küçük parmaklar hâlâ hedefleme hatası yapabildiğinden.
- **Doğrulanamadı:** Apple'ın resmi HIG "Layout" sayfası (`developer.apple.com/design/human-interface-guidelines/layout`) doğrudan fetch edilmeye çalışıldı ancak JS-render edilen sayfa içeriği alınamadı; 44×44pt rakamı çok sayıda ikincil kaynakta (blog, accessibility rehberleri) tutarlı şekilde doğrulandı ama bu araştırmada Apple'ın birincil sayfasından doğrudan alıntı yapılamadı — ekip gerçek geliştirme öncesi bu sayfayı tarayıcıda açıp teyit etmeli: https://developer.apple.com/design/human-interface-guidelines/layout

### 4.2 Guided Access ile PWA uyumluluğu

- **Guided Access**, iPad'de herhangi bir uygulama (PWA'nın standalone ikonu dahil) içinden üç tık (triple-click side/home button) ile başlatılan, **oturum bazlı** bir erişilebilirlik özelliğidir: ekranı tek bir uygulamaya kilitler, Home'a çıkmayı/uygulama değiştirmeyi engeller, isteğe bağlı olarak belirli ekran bölgelerine dokunmayı da devre dışı bırakabilir.
- PWA'nın home screen ikonuna dokunup açıldıktan sonra Guided Access başlatılırsa, kilitlenen "uygulama" o anda görüntülenen Safari standalone web view'ıdır — yani çocuk sadece bu PWA ile etkileşime girebilir, tarayıcı arayüzüne (adres çubuğu, sekme değiştirme) veya başka bir uygulamaya geçemez.
- **Sınırlamalar:**
  - Guided Access **oturum bazlıdır**: cihaz kapanıp açılırsa (pil bitmesi, yeniden başlatma) Guided Access kendiliğinden kapanır ve bir sonraki kullanıcı normal Home ekranını görür — "Single App Mode" (MDM/Apple Configurator ile supervised cihazlarda kalıcı kilitleme) kadar güçlü değildir.
  - Guided Access, PIN veya Face ID ile kilitlenip açılır; ebeveyn PIN'i unutursa cihaz kilitli kalabilir — kurulumda bu risk not edilmeli.
  - Guided Access'in "belirli bölgelere dokunmayı devre dışı bırak" özelliği **statik dairesel/dörtgen bölgeler** tanımlar; PWA'nın dinamik UI'ı (öğeler sahne değiştirince konum değiştiriyorsa) bu statik maskelerle iyi uyuşmayabilir — bu nedenle PWA tasarımında kritik olmayan "çıkış" butonlarının sabit, ekranın kolayca maskelenebilir bir köşesinde olması önerilir.
- **Pratik kurulum (ebeveyn tarafı):** Ayarlar → Erişilebilirlik → Guided Access'i aç → PWA'yı aç → Home/yan tuşa üç kez bas → Başlat. Bu adım, uygulamanın kendisi tarafından otomatikleştirilemez (iOS güvenlik modeli gereği bir web sayfası Guided Access'i kendi başına tetikleyemez) — ürün dokümantasyonunda ebeveynlere bu adımın manuel olarak anlatılması gerekir.
- Kaynak: [Apple Support — Lock iPad to one app with Guided Access](https://support.apple.com/en-in/guide/ipad/ipada16d1374/ipados), [Kiosk Mode on iPads with PWAs and Guided Access Mode](https://timmyomahony.com/blog/kiosk-mode-on-ipads-with-pwa/), [Esper — What is Single App Mode?](https://www.esper.io/blog/what-is-single-app-mode) (Guided Access vs Single App Mode farkı için).

---

## 5. OpenAI `gpt-4o-mini-tts` API

- **Model:** Mart 2025'te tanıtıldı, OpenAI'nin "steerable" (yönlendirilebilir) TTS modeli — aynı ses `instructions` parametresiyle farklı ton/tempo/duygu ile konuşturulabiliyor. Kaynak: [OpenAI — Text to speech guide](https://developers.openai.com/api/docs/guides/text-to-speech), [PromptLayer — GPT-4o-Mini-TTS blog](https://blog.promptlayer.com/gpt-4o-mini-tts-steerable-low-cost-speech-via-simple-apis/).
- **Fiyatlandırma (token bazlı, karakter bazlı değil):**
  - **$0.60 / 1M metin girdi token'ı**
  - **$12.00 / 1M ses çıktı token'ı**
  - Bu, OpenAI'nin kendi yaklaşık tahminine göre **~$0.015/dakika ses** anlamına geliyor; "$15/1M karakter" gibi rakamlar üçüncü taraf hesaplayıcıların metin→token oranı tahminine dayanan **yaklaşık** değerlerdir, gerçek maliyet girdi metninin tokenizasyonuna göre değişir.
  - Çapraz doğrulama: Birden fazla bağımsız üçüncü taraf fiyat takip sitesi (cloudprice.net, portkey.ai, futureagi.com, getmaxim.ai) aynı $0.60/$12 rakamlarını teyit ediyor — ancak bunların hepsi ikincil kaynak; OpenAI'nin resmi `openai.com/api/pricing/` sayfası bu araştırmada doğrudan fetch edilemedi (403 engeli alındı), ekip canlı entegrasyon öncesi resmi fiyat sayfasını kontrol etmeli.
- **Ses seçenekleri (voices):** `alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, marin, cedar` — toplam 13 ses. OpenAI dokümantasyonu en iyi kalite için **`marin` veya `cedar`** seslerini öneriyor (bunlar daha yeni eklenen sesler).
- **`instructions` parametresi:** Doğal dilde yönerge vererek aksan, duygusal aralık, tonlama, konuşma hızı, ton, fısıltı gibi özellikleri yönlendirebiliyorsunuz (örn. "warm, slow, and encouraging, like a kindergarten teacher talking to a 4-year-old"). Bu parametre `tts-1`/`tts-1-hd` gibi eski modellerde **yok** — sadece `gpt-4o-mini-tts` ve ailesinde var.
- **Dil desteği ve Türkçe kalitesi:** Model Whisper'a benzer şekilde 90+ dili destekliyor ve herhangi bir dilde metin verilince o dilde ses üretebiliyor; **ancak yerleşik sesler İngilizce için optimize edilmiş** ve kalite dilden dile, aksana, özel isimlere, teknik terimlere göre değişebiliyor — OpenAI'nin kendi dokümantasyonu bunu açıkça not ediyor ve "yayın öncesi temsili test yapın" tavsiyesi veriyor. **Türkçe kalitesine özel somut, ölçülmüş bir veri bulunamadı (doğrulanamadı)** — bu, ekibin kendi örnek metinlerle (çocuklara özgü kelime/isim telaffuzları dahil) erken ve kapsamlı test yapması gerektiği anlamına geliyor.
- **Model sürüm notu (önemli, 2025-2026):** OpenAI Aralık 2025'te bir snapshot güncellemesi yaptı (`gpt-4o-mini-tts-2025-12-15`): kelime hata oranını (WER) %35 azalttığı bildiriliyor, ancak bazı geliştiriciler yeni sürümün Mart 2025 orijinaline göre sesin "sıcaklığını/samimiyetini" kaybettiğini bildiriyor. API çağrısını spesifik sürüme (`gpt-4o-mini-tts-2025-03-20`) sabitleyerek orijinal tonu koruma mümkün. **Bu bilgi topluluk/ikincil kaynaklıdır (OpenAI community forumu), resmi changelog ile çapraz doğrulanmadı — doğrulanamadı olarak işaretlendi**, ancak proje bir çocuk sesi/tonu seçtiğinde model sürümünü **sabitlemek** (pin) iyi bir pratik olarak önerilir (sürüm güncellemesi sesin karakterini sessizce değiştirebilir).
- **Kullanım koşulları / rate limit:**
  - OpenAI kullanım politikaları, üretilen yapay ses içeriğinin son kullanıcıya **yapay (AI-generated) olduğunun açıkça bildirilmesini** zorunlu kılıyor — çocuk uygulamasında bu, ebeveyn yönünde bir bilgilendirme (örn. "Bu uygulamadaki sesler yapay zeka ile üretilmiştir") olarak karşılanabilir.
  - İstek başına karakter sınırı eski `tts-1` ailesinde 4096 karakter (~5 dakika ses) olarak biliniyor; `gpt-4o-mini-tts` için giriş token limiti **2000 input token** olarak bildiriliyor (üçüncü taraf kaynak, resmi dokümandan net doğrulanamadı).
  - Rate limit (istek/dakika), OpenAI'nin genel **kullanım kademeleri (usage tiers)** sistemine bağlı — hesabın kümülatif harcaması ve yaşına göre artıyor; `tts-1` ailesi için Tier 1'de ~50 RPM, Tier 5'te ~500 RPM gibi rakamlar bildiriliyor. `gpt-4o-mini-tts` için özel rakamlar bu araştırmada bulunamadı — **ekip OpenAI hesap panelindeki kendi tier/limit sayfasını kontrol etmeli (doğrulanamadı)**.
  - Offline-first bir uygulama olduğu için: TTS API'si ancak **build/içerik üretim zamanında** (geliştirme makinesinde, önceden) çağrılabilir ve üretilen ses dosyaları statik asset olarak pakete/service worker cache'ine gömülebilir — çalışma zamanında (çocuğun cihazında) canlı API çağrısı yapılmamalı. Bu hem offline gereksinimini karşılar hem de "çocuk verisinin cihaz dışına çıkmaması" ilkesiyle örtüşür (bkz. Bölüm 6).

---

## 6. Çocuk gizliliği: COPPA ruhu ve KVKK bağlamında teknik öneriler

### 6.1 Genel ilkeler

- **COPPA (ABD, referans çerçeve olarak):** Çocuklara yönelik hizmetlerde üçüncü taraf davranışsal reklam/analitik SDK'ları yasak kabul edilir; kalıcı tanımlayıcılar (device ID, advertising ID), hassas konum, fotoğraf/video ve **biyometrik/ses verisi** COPPA kapsamında özel risk taşıyan veri kategorileri olarak listeleniyor. 2025 güncellemeleri üçüncü taraf onay, veri saklama süresi, tedarikçi sorumluluğu ve yazılı güvenlik planı gereksinimlerini sıkılaştırdı.
  - Önemli, projeye doğrudan uygulanabilir nokta: **"Çocuk tanımlayıcıları veya ses kaydı içeren istekleri OpenAI/Anthropic gibi harici model uç noktalarına göndermek, üçüncü tarafa veri ifşası (third-party disclosure) sayılabilir."** Bu, projenin TTS kullanımını (Bölüm 5'te önerildiği gibi) **yalnızca içerik üretim/geliştirme aşamasında, çocuğa ait hiçbir veri içermeyen sabit ders metinleriyle** sınırlamasını doğrudan destekliyor.
  - Kaynak: [BigID — Data Minimization for COPPA](https://bigid.com/blog/data-minimization-for-coppa-compliance/), [Beancount — COPPA 2026 guide](https://beancount.io/blog/2026/09/12/coppa-kids-privacy-app-website-parental-consent-retention-guide), [Promise Legal — COPPA Compliance 2025](https://blog.promise.legal/startup-central/coppa-compliance-in-2025-a-practical-guide-for-tech-edtech-and-kids-apps/).
- **KVKK (Türkiye):** Genel ilkeler (hukuka ve dürüstlük kurallarına uygunluk, amaçla sınırlılık, veri minimizasyonu) çocuk verisinde **daha sıkı** uygulanmalı. KVKK'nın yayınladığı rehberlerde özellikle: (a) çocuklara yönelik hizmetlerde veri işleme miktarının en aza indirilmesi, (b) şeffaflık/aydınlatmanın çocuğun (burada ebeveynin) anlayabileceği sade dilde yapılması, (c) profil oluşturma ve çevrimiçi pazarlama amaçlı veri toplamadan kesinlikle kaçınılması vurgulanıyor.
  - Kaynak: [KVKK — Çocukların Kişisel Verilerinin Korunması Bakımından Dikkat Edilmesi Gerekenler](https://www.kvkk.gov.tr/Icerik/6737/Cocuklarin-Kisisel-Verilerinin-Korunmasi-Bakimindan-Dikkat-Edilmesi-Gerekenler).

### 6.2 Bu projeye somut teknik öneriler

1. **Hiç sunucu/backend olmasın (ya da minimal olsun):** Uygulama tamamen statik dosyalardan (GitHub Pages) servis edilip tarayıcıda çalıştığından, varsayılan olarak **hiçbir veri hiçbir sunucuya gitmiyor**. Bu, en güçlü gizlilik garantisidir — "veri toplamıyoruz" iddiasını mimari olarak doğrular.
2. **Üçüncü taraf analitik/reklam SDK'sı eklenmemeli** — Google Analytics, Firebase Analytics, reklam SDK'ları, crash-reporting servisleri (Sentry vb.) dahi çocuğun cihaz/kullanım bilgisini üçüncü bir sunucuya gönderir; bunlardan **tamamen kaçınılmalı**. Gerekirse sadece yerel (cihaz içi, dışa göndermeyen) hata loglama yapılabilir.
3. **Mikrofon kaydı cihaz dışına çıkmamalı:** Çocuğun telaffuz pratiği için kaydedilen ses (varsa bir konuşma tanıma/karşılaştırma özelliği), mümkünse **tamamen cihaz üzerinde (on-device)** işlenmeli (örn. Web Speech API'nin cihaz üstü tanıma özellikleri, ya da basit ses seviyesi/süre analizi). Eğer bulut tabanlı bir konuşma tanıma servisine ihtiyaç duyulursa, bu açıkça ebeveyn onayına bağlanmalı ve KVKK/COPPA'nın "biyometrik/ses verisi" hassas kategorisi olarak ele alınmalı — **bu projenin varsayılan tasarımında bulut STT kullanılmaması önerilir.**
4. **TTS üretimi build-time'da yapılmalı, runtime'da değil:** Bölüm 5'te detaylandırıldığı gibi, OpenAI TTS API'si sadece geliştirme sürecinde sabit ders/karakter repliklerini seslendirmek için kullanılsın; çalışan uygulama hiçbir zaman çocuğun girdisini (varsa) OpenAI'ye göndermesin.
5. **Kalıcı tanımlayıcı/çevrimiçi kimlik oluşturulmamalı:** Rastgele, cihaza özel, sunucuya hiç gönderilmeyen bir yerel ID (sadece IndexedDB içinde ilerleme takibi için) kullanılabilir; ancak bu ID hiçbir zaman ağ üzerinden iletilmemeli, reklam/analiz amaçlı kullanılmamalı.
6. **Veri minimizasyonu:** Sadece ilerleme durumu (hangi ders tamamlandı, hangi rozet kazanıldı) gibi işlevsel veriler yerelde saklansın; isim, yaş, fotoğraf, konum gibi kimliklendirici veriler **hiç toplanmasın**.
7. **Ebeveyn şeffaflığı:** Uygulamanın "Hakkında/Gizlilik" ekranında, teknik olarak doğru ve sade bir dille "bu uygulama internete veri göndermez, tüm veriler sadece bu cihazda saklanır" ifadesi somut ve doğrulanabilir bir iddia olarak yer alabilir (mimari buna izin veriyor).
8. **Üçüncü taraf font/CDN/iframe kullanılmamalı:** Service worker + offline gereksinimiyle zaten uyumlu, ama gizlilik açısından da önemli — harici bir CDN'den font/script çekmek, kullanıcının IP'sini üçüncü bir tarafa sessizce ifşa edebilir. Tüm asset'ler pakete gömülmeli (self-contained).

---

## Bu proje için net öneriler

- **Framework:** **Svelte + Vite + TypeScript**, SvelteKit kullanılmadan düz SPA şablonu ile. Ekip Svelte'e hiç aşina değilse veya en basit/şeffaf yapıyı istiyorsa **Vanilla TypeScript + Vite** eşit derecede geçerli bir alternatif — framework karmaşıklığına ihtiyaç yok. State için (gerekirse) Svelte store'ları veya `nanostores` yeterli; Redux/MobX gibi ağır çözümlere gerek yok.
- **Hosting/CI:** **GitHub Pages**, yayın kaynağı "GitHub Actions" olarak ayarlanmış, `actions/upload-pages-artifact` + `actions/deploy-pages` zinciriyle her `main` push'unda otomatik deploy. `manifest.json` ve service worker `scope`'unun GitHub Pages'in alt-yol (`/repo-adi/`) yapısıyla tam uyumlu olduğundan erken aşamada mutlaka test edilmeli.
- **Offline strateji:** Service worker ile "cache-first" (app shell + tüm ses/görsel assetleri önceden cache'lenir); kullanıcıya yeni sürüm bildirimi `updatefound`/`controllerchange` event'leriyle, ebeveyn tarafında sade bir "güncelle" uyarısı olarak sunulsun, çocuğun aktif oturumunu kesmesin. IndexedDB kalıcılığı için **"Ana Ekrana Ekle" (standalone PWA) zorunlu adım** olarak ürün akışına konulmalı — bu, ITP'nin 7 günlük veri silme kuralından tamamen muaf olmanın tek güvenilir yolu.
- **Ses/mikrofon stratejisi:** (a) Tüm TTS sesleri **build-time'da** `gpt-4o-mini-tts` ile (sürümü sabitleyerek, örn. belirli bir snapshot'a pin ederek) üretilip statik dosya olarak pakete gömülsün — runtime'da hiçbir API çağrısı yapılmasın. (b) Oynatma için tek, oturum boyunca yeniden kullanılan bir `AudioContext`/`<audio>` elementi, ilk kullanıcı dokunuşunda unlock edilsin (Bölüm 1.1'deki desen). (c) Mikrofon kaydı özelliği eklenecekse izin durumu her oturumda yeniden kontrol edilsin ve varsayılan tasarımda ses verisi **cihaz dışına hiç çıkmasın** (bulut STT'den kaçınılsın).
- **Dokunma hedefleri:** Apple HIG'in 44×44pt mutlak minimumunun oldukça üzerinde, **80–120 pt** aralığında büyük, aralıklı dokunma alanları; tüm kök elemanlarda `touch-action: manipulation`, `user-select: none`, `body { position: fixed; overflow: hidden }` + iç scroll container ile zoom/metin seçme/pull-to-refresh/swipe-back riskleri en aza indirilsin.
- **Guided Access:** Ürün, Guided Access'i kendi başına tetikleyemez (iOS kısıtı) — ebeveyn dokümantasyonuna "PWA'yı açın, üç kez yan/Home tuşuna basın, Guided Access'i başlatın" adımları açıkça yazılmalı; kritik olmayan UI elemanları (varsa çıkış/ayarlar butonu) sabit ve kolay maskelenebilir bir köşede tutulmalı.
- **Gizlilik mimarisi:** Backend yok, üçüncü taraf analitik/reklam/CDN yok, kalıcı tanımlayıcı yok, çocuk sesi cihaz dışına çıkmıyor — bu beş ilke COPPA'nın ruhuna ve KVKK'nın veri minimizasyonu ilkesine mimari düzeyde uyumu garanti eder ve ayrıca "tamamen offline" ürün gereksinimiyle doğal olarak örtüşür.
