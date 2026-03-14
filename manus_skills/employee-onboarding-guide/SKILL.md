---
name: employee-onboarding-guide
description: SCX Studio Pro projesine yeni katılan veya projeyi derinlemesine öğrenmek isteyen çalışanlar için kapsamlı onboarding, teknik mimari ve kalite kontrol rehberi. İş akışlarını anlamak, kalite standartlarını öğrenmek ve projeyi öğrenme sürecini hızlandırmak için kullanılır.
---

# Çalışan Yol Haritası ve Rehber (Employee Onboarding Guide)

Bu skill, SCX Studio Pro projesine yeni katılan bir uzmanın projeyi tamamen öğrenmesini, teknik mimariyi kavramasını ve kalite standartlarını uygulamasını sağlamak için tasarlanmıştır.

## 1. Vizyon ve Hedef
SCX Studio Pro, sıradan bir AI görsel üreticisi değil, kişisel bir dijital fotoğraf stüdyosudur. Hedefimiz, kullanıcının dijital ikizini (Character DNA) oluşturup, onu her türlü ortamda ve stilde tutarlı bir şekilde yaşatmaktır.

## 2. Teknik Onboarding ve Kurulum
Projeyi yerel ortamda çalıştırmak için şu adımları izleyin:
1.  **Repo:** `gh repo clone ssrxs/scx-studio-pro-fixed`
2.  **Bağımlılıklar:** `pnpm install`
3.  **Ortam:** `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli API anahtarlarını (FAL_KEY, GOOGLE_ID) girin.
4.  **Veritabanı:** `pnpm db:push` ve `pnpm db:seed` komutlarıyla veritabanını hazırlayın.

### Teknik Mimari
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend:** Next.js API Routes, Prisma ORM (SQLite).
- **AI:** Fal.ai (Flux 1.1 Pro + PuLID) entegrasyonu.
- **State:** Zustand merkezi store yönetimi (`lib/store.ts`).

Detaylı API ve veritabanı yapısı için `references/api_reference.md` dosyasını inceleyin.

## 3. Kalite Kontrol Standartları (QC/QA)
Bir görselin veya kodun "başarılı" sayılması için şu kriterlere uyması gerekir:
- **Kod:** Tüm yeni bileşenler TypeScript ile tip tanımlamasına sahip olmalıdır.
- **Yüz Bütünlüğü:** Referans fotoğrafla kemik yapısı ve göz rengi %100 uyumlu olmalıdır.
- **Işık Tutarlılığı:** Ortam ışığı karakterin yüzüne doğal yansımalı, `ai-rules.ts` kuralları uygulanmalıdır.
- **Anatomik Doğruluk:** Eller, parmaklar ve postür (duruş) gerçekçi olmalıdır.

## 4. İş Akışı ve Task Yönetimi
- **Linear:** Tüm görevler Linear üzerinden takip edilir.
- **Git:** Her görev için `feature/SST-[TASK_ID]` formatında branch açılmalıdır.
- **PR:** Kod değişiklikleri açıklayıcı bir PR ile ana branch'e gönderilmelidir.

## Referanslar
- `references/api_reference.md`: API uç noktaları, veritabanı şeması ve prompt akışı.
- `docs/ARCHITECTURE.md`: Sistemin modüler mimarisi.
- `docs/STUDIO_GUIDE_TR.md`: Teknik kullanım detayları.

## İpuçları
- Projeyi öğrenirken önce `app/studio/page.tsx` dosyasını inceleyerek kullanıcı deneyiminin nasıl kurgulandığını görün.
- Hata ayıklama (debug) için Prisma Studio'yu (`pnpm db:studio`) aktif kullanın.
- Yeni bir AI özelliği eklemeden önce `lib/ai-rules.ts` dosyasını mutlaka inceleyin.
