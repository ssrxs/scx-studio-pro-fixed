---
name: internal-project-rules
description: SCX Studio Pro projesi için kod standartları, veritabanı şeması ve AI prompt enjeksiyon kuralları rehberi. Yeni özellik eklerken, veritabanı güncellerken veya AI mantığını geliştirirken kullanılır.
---

# Proje İçi Kurallar ve Mantık (Internal Project Rules)

Bu skill, SCX Studio Pro'nun teknik mimarisini korumak ve geliştirme sürecinde standartları sağlamak için kullanılır.

## Mimari Standartlar

1.  **Next.js App Router:** Tüm yeni sayfalar `app/` dizini altında ve Server Component öncelikli olmalıdır.
2.  **Prisma & SQLite:** Veritabanı değişiklikleri `prisma/schema.prisma` dosyasında yapılmalı ve `npx prisma db push` ile uygulanmalıdır.
3.  **Zustand State Management:** İstemci tarafı state yönetimi `lib/store.ts` üzerinden merkezi olarak yapılmalıdır.

## AI Prompt Enjeksiyon Kuralları (`lib/ai-rules.ts`)

Sisteme eklenen her kural şu kriterlere uymalıdır:
- **Zorunluluk:** Kurallar promptun başına eklenmeli (DNA Bloğu).
- **Çelişmezlik:** Yeni eklenen kurallar `GLOBAL_AI_RULES` ile çelişmemelidir.
- **Teknik Dil:** "Beautiful", "amazing" gibi öznel kelimeler yerine "cinematic lighting", "8k textures", "anatomical precision" gibi teknik terimler kullanılmalıdır.

## Kod Yazım Kuralları
- **TypeScript:** Tüm bileşenler ve fonksiyonlar için tip tanımlaması zorunludur.
- **Tailwind CSS:** Stil işlemleri için harici CSS dosyası yerine Tailwind sınıfları tercih edilmelidir.
- **Framer Motion:** Animasyonlar için standart kütüphane olarak kullanılmalıdır.

## Referanslar
- `references/db_schema.md`: Güncel veritabanı tablosu ve ilişkileri.
- `references/ai_logic_flow.md`: Prompt oluşturma sürecinin mantıksal aKış diyagramı.

## İpuçları
- Yeni bir AI sağlayıcısı eklerken `lib/generation.ts` içindeki `GenerationManager` sınıfını genişletin.
- `components/` dizinindeki bileşenleri atomik yapıda tutmaya özen gösterin.


