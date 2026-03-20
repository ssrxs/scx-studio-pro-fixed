---
name: external-ai-consistency
description: Dış yapay zeka servislerinde (Flux, Midjourney, Leonardo vb.) karakter ve stil tutarlılığını sağlamak için araştırma ve optimizasyon rehberi. Karakter Yüz hatlarını korumak, stil sürekliliği sağlamak ve prompt mühendisliği ile çıktı kalitesini artırmak için kullanılır.
---

# Dış AI Art Tutarlılığı (External AI Art Consistency)

Bu skill, SCX Studio Pro projesinde kullanılan dış AI modellerinin (özellikle Flux 1.1 Pro ve PuLID) çıktılarını en üst sevieye çıkarmak ve farklı servisler arasında tutarlılık sağlamak için tasarlanmıştır.

## Temel İlkeler

1.  **Yüz Tutarlılığı (Face Consistency):** PuLID veya IP-Adapter gibi teknolojilerin referans Görsellerle olan etkileşimini optimize etme.
2.  **Stil Sürekliliği (Style Continuity):** Farklı promptlarda aynı sanatsal dili (lighting, texture, color grading) koruma.
3.  **Prompt Hiyerarşisi:** Modelin en çok dikkat ettiği anahtar kelimelerin (DNA blokları) promptun başında yer alması.

## İş AKışları

### 1. Karakter DNA'sını Optimize Etme
Karakterin fiziksel özelliklerini "değişmez" (invariant) olarak tanımlayın.
- **Kötü:** "A beautiful man"
- **İyi:** "A 35-year-old male with sharp jawline, deep-set hazel eyes, slight stubble, and high cheekbones."

### 2. Flux 1.1 Pro İçin Doğal Dil Kullanımı
Flux modelleri anahtar kelime yığınından ziyade Doğal dili daha iyi anlar.
- **Kural:** "Karakter DNA'sı + Ortam/Eylem + Teknik Kamera Detayları" formülünü uygulayın.

### 3. Negatif Prompt Alternatifleri
Flux doğrudan negatif prompt desteklemeyebilir. Bunun yerine "Positive Reinforcement" kullanın.
- "No blur" yerine "Sharp focus, high depth of field" kullanın.
- "Plastic skin" yerine "Visible skin pores, realistic skin texture, natural imperfections" kullanın.

## Karşılaştırma ve Analiz
Güncel model karşılaştırmaları için `references/consistency_matrix.md` dosyasını inceleyin. 2026 itibariyle Flux 1.1 Pro + PuLID kombinasyonu Yüz tutarlılığında lider konumdadır.

## Prompt Şablonları
Onaylanmış ve test edilmiş prompt yapıları için `references/prompt_templates.md` dosyasını kullanın.

## Referanslar
- `references/consistency_matrix.md`: Farklı modellerin tutarlılık karşılaştırması (2026 Güncel).
- `references/prompt_templates.md`: Onaylanmış tutarlı prompt şablonları.

## İpuçları
- **Seed Sabitleme:** Denemeler yaparken aynı seed numarasını kullanarak sadece prompt değişikliklerinin etkisini gözlemleyin.
- **Ağırlıklandırma:** Önemli özellikleri (örneğin göz rengi) birden fazla kez farklı kelimelerle vurgulayın.
- **Karakter Referansı (cref):** Midjourney entegrasyonu planlanıyorsa `--cref` parametresini en az 2 referans Görselle kullanın.

