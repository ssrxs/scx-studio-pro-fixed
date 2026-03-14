# Onaylanmış Tutarlı Prompt Şablonları (2026)

Bu belge, SCX Studio Pro projesinde kullanılan ve dış AI servisleri ile test edilmiş, yüksek tutarlılık sağlayan prompt şablonlarını içerir.

## 1. Karakter DNA Şablonu (Flux 1.1 Pro + PuLID)

**Mantık:** DNA Bloğu + Ortam + Teknik Detaylar

```markdown
A [AGE] [GENDER] with [HAIR_STYLE], [SKIN_TONE], [FACIAL_FEATURES], [BODY_TYPE]. 
Wearing [OUTFIT]. 
Location: [ENVIRONMENT_DESCRIPTION]. 
Lighting: [LIGHTING_TYPE] with [COLOR_TEMPERATURE]. 
Camera: Shot on 85mm lens, f/1.8, cinematic lighting, 8k resolution, highly detailed skin textures, realistic skin pores, natural imperfections.
```

## 2. Stil Tutarlılığı Şablonu (Midjourney --sref Alternatifi)

**Mantık:** Sanatsal Dil + Renk Paleti + Kompozisyon

```markdown
Artistic Style: [STYLE_NAME] (e.g., Cyberpunk, Renaissance, Modern Minimalist). 
Color Palette: [DOMINANT_COLORS] with [ACCENT_COLORS]. 
Mood: [EMOTIONAL_TONE]. 
Composition: [FRAMING_TYPE], [CAMERA_ANGLE]. 
Visual Quality: Photorealistic, ray-traced reflections, volumetric lighting, high dynamic range.
```

## 3. Portre Tutarlılığı Şablonu

**Mantık:** Yakın Çekim + Yüz Detayı + Işık Kontrolü

```markdown
Close-up portrait of [CHARACTER_DNA]. 
Focus on eyes: [EYE_COLOR], [EYE_SHAPE], realistic catchlights. 
Skin details: Visible pores, fine lines, natural skin texture, no smoothing. 
Lighting: Rembrandt lighting, soft shadows, warm highlights. 
Background: Soft bokeh, blurred studio background.
```

## Kullanım İpuçları
- **DNA Bloğunu Değiştirmeyin:** Karakter tutarlılığı için ilk cümle her zaman aynı kalmalıdır.
- **Doğal Dil Kullanın:** Flux modelleri için virgülle ayrılmış kelimeler yerine tam cümleler kurun.
- **Negatifleri Pozitife Çevirin:** "No blur" yerine "Sharp focus" kullanın.
- **Teknik Terimlere Odaklanın:** "Beautiful" yerine "85mm lens, f/1.8" gibi teknik veriler girin.
