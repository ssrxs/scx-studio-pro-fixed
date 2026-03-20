# ğŸ›¡ï¸ SCX-STUDIO-PRO: TEMİZLİK VE GELİŞTİRME PLANI (SENTINEL V2)

Bu plan, projenin gereksiz dosyalardan arındırılması, mimarisinin Next.js 14 standartlarına yükseltilmesi ve kod kalitesinin artırılmasını hedefler.

## ğŸ“‹ Mevcut Durum Analizi
- **Junk (Çöp) Dosyalar:** Kök dizinde çok sayıda `.png`, `.webp`, `.py` (scraper) ve `. Bat` dosyası bulunuyor.
- **Mimari:** `lib/`, `components/` ve `app/` klasörleri arasında bazı bağımlılıklar karışık durumda.
- **Legacy:** `legacy_infra/` ve eski `scx-app/` klasörleri yer kaplıyor.

## ğŸ› ï¸ Uygulama Adımları

### Aşama 1: Radikal Temizlik (Junk & Legacy Removal)
- [ ] **Görsel Temizliği:** `alibaba_*.png`, `alibaba_*.webp` gibi ekran görüntüleri ve test çıktıları silinecek.
- [ ] **Scraper Temizliği:** `alibaba_scraper.py`, `banana_scraper.py`, `test_scraper.py` gibi kök dizindeki scriptler `legacy_infra/scrapers/` altına taşınacak veya gereksizse silinecek.
- [ ] **Klasör Temizliği:** `legacy_infra/` içindeki gerçekten kullanılmayan dosyalar ve `scx-app/` (yedek olduğu düşünülüyor) silinecek.
- [ ] **Geçici Dosyalar:** `.next/` (build sonrası), `node_modules/` (gerektiğinde pnpm i ile kurulur) dışındaki tüm `.log`, `.tmp` dosyaları temizlenecek.

### Aşama 2: Mimari Düzenleme (Structural Refactor)
- [ ] **Atomic Components:** `components/` altındaki bileşenler `atoms/`, `molecules/`, `organisms/` ve `templates/` olarak gruplandırılacak.
- [ ] **Lib Refactor:** `lib/` içindeki dosyalar (db.ts, generation.ts vb.) `core/`, `services/` ve `utils/` olarak ayrıştırılacak.
- [ ] **App Router Optimization:** `app/api/` rotaları ve `app/studio/` sayfası Next.js 14 performans kriterlerine göre (Server Components öncelikli) gözden geçirilecek.

### Aşama 3: Kod Kalitesi ve Güvenlik (Code Quality & Security)
- [ ] **Smolagents Cleanup:** Tüm dosyalardaki `console.log`lar, kullanılmayan `import`lar ve "dead code" (ölü kodlar) temizlenecek.
- [ ] **Security Review:** `ecc-security-review` yeteneği ile `.env` sızıntıları ve API anahtarı güvenliği taranacak.
- [ ] **TDD Integration:** Kritik fonksiyonlar için (özellikle `lib/generation.ts`) unit testler yazılacak.

## ğŸš¦ Doğrulama (Verification)
- `pnpm build` komutu ile projenin hatasız derlendiği onaylanacak.
- `ecc-verification-loop` ile tüm değişiklikler test edilecek.

---
**Onay Bekleniyor:** Kaptan, bu plan dahilinde "Aşama 1: Radikal Temizlik" ile başlamamı onaylıyor musun?

