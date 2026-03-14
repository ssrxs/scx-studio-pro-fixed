# Synth Control X (SCX) Mimari Dokümanı

## 1. Genel Bakış
SCX, kullanıcıların kendi yüz referanslarını kullanarak yüksek kaliteli AI görselleri üretmelerini sağlayan modern bir "Personal AI Studio" platformudur.

## 2. Teknoloji Yığını (Tech Stack)
- **Framework:** Next.js 15 (App Router)
- **Frontend UI:** Tailwind CSS + Framer Motion
- **State Management:** Zustand (Mixer Store)
- **Authentication:** NextAuth.js v5 (Google OAuth)
- **Database:** SQLite (Geliştirme aşamasında Prisma ORM ile)
- **AI Integration:** Multi-provider (Gemini, Fal.ai, Browser Workers)

## 3. Mimari Bileşenler

### 3.1. Frontend
- **`/app`:** Next.js App Router sayfaları.
- **`/components`:** Yeniden kullanılabilir UI bileşenleri (PromptCard, Mixer Panel vb.).
- **`/lib/store.ts`:** Mikser üzerindeki anlık prompt değişikliklerini yöneten Zustand mağazası.

### 3.2. Backend (API)
- **`/app/api/prompts`:** Veritabanındaki hazır şablonları filtreleyerek ve sayfalayarak sunan uç nokta.
- **`/lib/prisma.ts`:** Veritabanı bağlantı istemcisi.
- **`/lib/generation.ts`:** Gelen talepleri farklı AI sağlayıcılarına dağıtan "Smart Dispatcher" (Akıllı Dağıtıcı).

### 3.3. Güvenlik
- **Middleware:** `/studio` ve API uç noktaları NextAuth middleware ile korunur.
- **Environment Variables:** Tüm hassas veriler `.env` dosyasında saklanır.

## 4. Veri Akışı
1. Kullanıcı Google ile giriş yapar.
2. `/studio` üzerinden referans yüz fotoğrafını yükler.
3. Galeriden bir stil beğenir ve Mikser'i açar.
4. Mikser üzerinden saç, kıyafet vb. ayarları değiştirir (Zustand).
5. "Üret" dediğinde `/api/generate` (Planlanan) üzerinden en uygun AI motoru seçilir ve görsel üretilir.
