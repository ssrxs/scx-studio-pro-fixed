---
name: employee-onboarding-guide
description: SCX Studio Pro projesine yeni katılan veya projeyi derinlemesine öğrenmek isteyen çalışanlar için kapsamlı rehber. İş akışlarını anlamak, kalite standartlarını öğrenmek ve ileri düzey araçları kullanmak için kullanılır.
---

# Çalışan Onboarding ve Rehber (Employee Onboarding Guide)

Bu skill, SCX Studio Pro ekibine yeni katılan uzmanların projenin vizyonunu, teknik yapısını ve operasyonel standartlarını hızla kavraması için hazırlanmıştır.

## Vizyon ve Hedef
SCX Studio Pro, sıradan bir AI görsel üreticisi değil, kişisel bir dijital fotoğraf stüdyosudur. Hedefimiz, kullanıcının dijital ikizini (Character DNA) oluşturup, onu her türlü ortamda ve stilde tutarlı bir şekilde yaşatmaktır.

## Teknik Onboarding Adımları

### 1. Yerel Kurulum ve Veritabanı
- Projeyi klonladıktan sonra `pnpm install` ve `pnpm db:push` komutlarıyla ortamı hazırlayın.
- `prisma/scx_studio.db` dosyasını inceleyerek verinin nasıl saklandığını anlayın.

### 2. Prompt Mühendisliği ve "Aperture" (Diyafram) Mantığı
- Üretilen her görselin `lib/ai-rules.ts` üzerinden geçtiğini unutmayın.
- **Diyafram Editör:** Görsel düzenleme mantığı sadece piksel silmek değil, AI'ya yeni talimatlar vermektir (Inpainting).

## Operasyonel Kalite Standartları (QA)

Bir görselin "başarılı" sayılması için şu kriterlere uyması gerekir:
- **Yüz Bütünlüğü:** Referans fotoğrafla kemik yapısı ve göz rengi %100 uyumlu mu?
- **Işık Tutarlılığı:** Ortam ışığı karakterin yüzüne doğal yansıyor mu?
- **Anatomik Doğruluk:** Eller, parmaklar ve postür (duruş) gerçekçi mi?

## İleri Düzey Kullanım: Master Vault
`lib/scx-vault.ts` dosyasına yeni aksesuarlar ekleyerek stüdyonun kapasitesini artırın. Her yeni aksesuar için uygun prompt enjeksiyonunu test edin.

## Referanslar
- `docs/ARCHITECTURE.md`: Sistemin modüler mimarisi.
- `docs/STUDIO_GUIDE_TR.md`: Teknik kullanım detayları.

## İpuçları
- Projeyi öğrenirken önce `app/studio/page.tsx` dosyasını inceleyerek kullanıcı deneyiminin nasıl kurgulandığını görün.
- Hata ayıklama (debug) için Prisma Studio'yu (`pnpm db:studio`) aktif kullanın.

