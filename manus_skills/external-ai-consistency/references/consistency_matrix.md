# AI Model Tutarlılık Karşılaştırma Matrisi (2026)

Bu belge, SCX Studio Pro projesinde kullanılan ve potansiyel olarak entegre edilebilecek AI modellerinin karakter ve stil tutarlılığı performanslarını karşılaştırır.

| Özellik | Flux 1.1 Pro + PuLID | Midjourney (v6.1+) | Leonardo.ai | Stable Diffusion 3.5 |
| :--- | :--- | :--- | :--- | :--- |
| **Yüz Tutarlılığı** | â­â­â­â­â­ (Mükemmel) | â­â­â­â­ (Çok İyi) | â­â­â­â­ (İyi) | â­â­â­ (Orta) |
| **Stil Sürekliliği** | â­â­â­â­â­ (Yüksek) | â­â­â­â­â­ (Mükemmel) | â­â­â­â­ (İyi) | â­â­â­â­ (İyi) |
| **Prompt Uyumu** | â­â­â­â­â­ (Doğal Dil) | â­â­â­â­ (Sanatsal) | â­â­â­â­ (Esnek) | â­â­â­ (Teknik) |
| **Hız** | âš¡ 6x Daha Hızlı | ğŸ¢ Yavaş | âš¡ Hızlı | âš¡ Hızlı |
| **Kontrol Mekanizması** | PuLID / LoRA | --cref / --sref | Character Reference | ControlNet / IP-Adapter |
| **Kullanım Kolaylığı** | Orta (API/Kod) | Kolay (Discord/Web) | Çok Kolay (Web UI) | Zor (Yerel Kurulum) |

## Model Analizleri

### 1. Flux 1.1 Pro + PuLID
*   **Avantajlar:** 2026 itibariyle en yüksek Yüz tutarlılığını sunar. PuLID entegrasyonu, referans Yüzün kemik yapısını ve karakteristik özelliklerini bozmadan farklı ortamlara aktarabilir.
*   **Dezavantajlar:** API maliyeti ve teknik kurulum gerektirir.

### 2. Midjourney (v6.1+)
*   **Avantajlar:** `--cref` (Character Reference) ve `--sref` (Style Reference) parametreleri ile rakipsiz sanatsal tutarlılık sağlar.
*   **Dezavantajlar:** Kapalı ekosistem, API erişimi kısıtlı veya pahalı.

### 3. Leonardo.ai
*   **Avantajlar:** Web araYüzü üzerinden "Character Reference" kullanımı çok pratiktir. Hızlı prototipleme için idealdir.
*   **Dezavantajlar:** Çok karmaşık sahnelerde Yüz detaylarında hafif kaymalar yaşanabilir.

### 4. Stable Diffusion 3.5
*   **Avantajlar:** Tamamen açık kaynak ve özelleştirilebilir. LoRA ve ControlNet ile sonsuz kontrol imkanı.
*   **Dezavantajlar:** Kurulum ve optimizasyon süreci uzundur, donanım bağımlılığı yüksektir.

## Stratejik Öneriler
- **Üretim (Production):** Flux 1.1 Pro + PuLID kombinasyonu, "Karakter DNA" sistemimizle en iyi uyumu sağlar.
- **Sanatsal Keşif:** Midjourney, yeni stil ve konsept geliştirmede referans olarak kullanılmalıdır.
- **Hızlı Revizyon:** Leonardo.ai, müşteri onay süreçlerinde hızlı Görsel üretimi için tercih edilebilir.

