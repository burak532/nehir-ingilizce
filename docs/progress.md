# İlerleme Dosyası

> Her yeni oturum önce `CLAUDE.md` ve bu dosyayı okumalı.

## Şu anki aşama
**Aşama 1 tamamlandı — Aşama 2 (Pedagojik tasarım → `docs/curriculum.md`) kullanıcı onayı bekliyor.**

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
Araştırma aşaması bitti. Sırada Aşama 2 (müfredat/pedagojik tasarım, `docs/curriculum.md`) var ama **kullanıcı onayı alınmadan başlanmayacak** (talimat: "hiçbir aşamada bir sonrakine onay olmadan geçme").

## Sıradaki adımlar
1. Kullanıcıdan Aşama 2'ye geçiş onayı al.
2. Onay gelirse: araştırma bulgularına dayanarak `docs/curriculum.md` taslağını hazırla (ünite/tema listesi, oyun döngüsü, aralıklı tekrar modeli, ölçme planı) — Bölüm 3'teki beklentileri araştırmayla karşılaştırıp uyuşmayan noktaları işaretle.
3. Araştırma sırasında ortaya çıkan açık soruları (özellikle Türkçe fading zamanlaması, kayıt-dinle özelliğinin pedagojik ağırlığı) curriculum.md'de "varsayım, test edilecek" olarak işaretle.
4. `docs/progress.md`'yi güncelle, kullanıcıya özet ver, açık soruları listele, dur (Aşama 3'e onaysız geçilmeyecek).
5. Aşama 5 öncesi: `.env` anahtarını düzelt/doğrula, bütçe eşiğini teyit et.

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
