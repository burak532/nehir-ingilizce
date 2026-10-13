# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 2 tamamlandı — `docs/curriculum.md` yazıldı. Aşama 3'e (Teknik plan → `docs/technical-plan.md`) geçiş için kullanıcı onayı bekleniyor.**

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

## Yarım kalan iş / tam olarak nerede kalındı
`docs/curriculum.md` tamamlandı: 13 ünitelik tema sırası (Hello! → Dino Colors → ... → Mix & Match), ünite içi döngü, aralıklı tekrar modeli (1-3-7 gün), uyarlanabilir zorluk kuralı, ödül/geri bildirim kuralları, ebeveyn rehberliği tablosu, Türkçe fading kuralı, ölçme planı, oyun tipi değerlendirmesi ve araştırmayla çelişen/belirsiz noktalar bölümü yazıldı. MVP ilk 2 ünite önerisi (Hello! + Dino Colors) curriculum.md Bölüm 1'de verildi, kullanıcı onayı bekliyor. **Kullanıcı onayı alınmadan Aşama 3'e başlanmayacak.**

## Sıradaki adımlar
1. Kullanıcıdan curriculum.md'deki açık soruları (Bölüm 13: MVP ilk 2 ünite, 13 ünite kapsamı, aralıklı tekrar aralıkları, Türkçe fading eşiği) ve Aşama 3'e geçiş onayını al.
2. Onay gelirse: `docs/technical-plan.md`'yi hazırla — framework seçimi (teknik araştırma Svelte+Vite+TS veya Vanilla TS+Vite önerdi), klasör yapısı, service worker/offline strateji, IndexedDB veri modeli, ses kilidi/AudioContext unlock deseni, GitHub Pages+Actions CI, ebeveyn paneli kapsamı.
3. `CLAUDE.md`'deki "Kodlama kuralları" ve "İçerik/veri yapısı" bölümlerini Aşama 3 kararlarıyla doldur.
4. `docs/progress.md`'yi güncelle, kullanıcıya özet ver, açık soruları listele, dur (Aşama 4'e onaysız geçilmeyecek).
5. Aşama 5 öncesi: `.env` anahtarını düzelt/doğrula, TTS bütçe eşiğini teyit et, Nehir adının telaffuzu için örnek ses üret.

## Bekleyen sorular (kullanıcıya sorulacak/teyit edilecek — şimdilik engelleyici değil)
- TTS üretim maliyeti onay eşiği şu an örnek olarak "5 USD" — Aşama 5'te gerçek rakamı teyit et.
- MVP'deki 2 ünite örneği "Selamlaşma + Dinozor renkleri" — Aşama 7'de teyit et.
- `.env`'deki `OPENAI_API_KEY` değeri bozuk/tekrarlı görünüyor (aynı anahtar ~3 kez art arda yapıştırılmış gibi) — Aşama 5'ten önce kullanıcıdan doğru anahtarı iste.
- Nehir adının İngilizce TTS'teki telaffuzu — Aşama 5'te örnek üretip kullanıcıya dinlet, onay al.

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
