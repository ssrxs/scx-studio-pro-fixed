# ğŸ›¡ï¸ SCX-STUDIO-PRO: MASTER ENGINE YÜKSELTME PLANI (SENTINEL V2)

Bu plan, projenin performansını, Görsel kalitesini ve araç setini "Premium" seviyesine taşımayı hedefler. Sentinel v2 tarafından otonom olarak yürütülecektir.

## ğŸš€ Aşama 1: Performans Optimizasyonu (Server Components)
- **Hedef:** İlk yükleme hızını (LCP) artırmak ve SEO'yu güçlendirmek.
- **Eylem:** 
  - `app/page.tsx` dosyasından `'use client'` yönergesi kaldırılacak ve sayfa bir Sunucu Bileşenine (Server Component) dönüştürülecek.
  - Veritabanı sorguları (prompt listesi) doğrudan sunucuda yapılacak.
  - Etkileşimli alanlar (Arama, Filtreleme, Karakter Seçimi, Mixer) `components/organisms/HomeClientWrapper.tsx` adında yeni bir istemci bileşenine ayrılacak.

## ğŸ¨ Aşama 2: Görsel Devrim (Liquid Glass Design)
- **Hedef:** AraYüzü modern, derinlikli ve "Premium" hissettiren bir yapıya kavuşturmak.
- **Eylem:**
  - `ecc-liquid-glass-design` yeteneği kullanılarak Tailwind yapılandırması güncellenecek.
  - Arka planlara hareketli gradientler eklenecek.
  - `PromptCard` ve `ImageEditor` bileşenlerine derinlikli cam (glassmorphism) efektleri uygulanacak.
  - Karanlık/Aydınlık (Dark/Light) mod uyumu mükemmelleştirilecek.

## ğŸ› ï¸ Aşama 3: Güçlü Araçlar (AI Vault & Optimizer)
- **Hedef:** Kullanıcı deneyimini yapay zeka ile zenginleştirmek.
- **Eylem:**
  - **Prompt Optimizer:** Kullanıcının girdiği basit metinleri, profesyonel resim üretim parametreleriyle (ışık, lens, stil) zenginleştiren arka plan mantığı (`lib/utils/ai-rules.ts` içine entegre).
  - **AI Kıyafet Dolabı (SCX Vault):** Kullanıcıların sadece Yüzlerini değil, `scx-vault.ts` içindeki önceden tanımlı kıyafet ve aksesuarları Görsel bir araYüzle (sürükle-bırak veya seçilebilir kartlar) seçebileceği bir sistem kurulacak.

---
**Durum:** Kaptan onay verdi. Plan Mode'dan çıkılıp uygulama (Auto-Edit) moduna geçiliyor.

