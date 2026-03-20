# SCX Studio Pro - API ve Teknik Referans (2026)

Bu belge, yeni bir çalışanın projenin teknik mimarisini ve API yapısını anlaması için hazırlanmıştır.

## 1. Veritabanı Şeması (Prisma)
Proje, SQLite veritabanı kullanır. Ana tablolar:
- **User:** Kullanıcı kimlik bilgileri ve Google OAuth verileri.
- **CharacterDNA:** Karakterin fiziksel özellikleri (yaş, cinsiyet, saç, Yüz hatları).
- **PromptTemplate:** Hazır prompt şablonları ve kategorileri.
- **GeneratedImage:** Üretilen Görsellerin URL'leri ve kullanılan promptlar.

## 2. API Uç Noktaları (Next.js API Routes)

### `GET /api/prompts`
- **Amacı:** Kategorize edilmiş prompt şablonlarını listeler.
- **Parametreler:** `category` (opsiyonel).

### `POST /api/generate`
- **Amacı:** Fal.ai (Flux + PuLID) kullanarak Görsel üretir.
- **Girdi:** `userPrompt`, `dnaId`.
- **Süreç:** `lib/ai-rules.ts` üzerinden prompt zenginleştirilir ve Fal.ai'ye gönderilir.

### `GET /api/auth/[...nextauth]`
- **Amacı:** Google OAuth 2.0 kimlik doğrulama süreçlerini yönetir.

## 3. Durum Yönetimi (Zustand)
`lib/store.ts` dosyası şu global durumları yönetir:
- `currentUser`: Aktif Kullanıcı bilgisi.
- `activeDNA`: Seçili olan Karakter DNA'sı.
- `imageGallery`: Üretilen Görsellerin listesi.

## 4. Prompt Mühendisliği AKışı
1. Kullanıcı basit bir prompt girer (örn: "kahve içiyor").
2. `buildFinalPrompt` fonksiyonu çağrılır.
3. Karakter DNA'sı promptun başına eklenir.
4. `GLOBAL_AI_RULES` içindeki teknik detaylar sona eklenir.
5. Sonuç Fal.ai API'sine iletilir.

