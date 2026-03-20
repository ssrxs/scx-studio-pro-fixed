# CLAUDE.md â€” SCX Studio Pro

## Proje Özeti

Next.js 14 + Prisma + Supabase + NextAuth v5 ile geliştirilmiş bir AI platformu.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Veritabanı:** Prisma ORM + Supabase (PostgreSQL)
- **Auth:** NextAuth v5 (beta)
- **UI:** Tailwind CSS + Framer Motion + Lucide
- **Scraping:** Playwright (Python)

## Klasör Yapısı

```
app/          â€” Next.js App Router sayfaları
components/   â€” React bileşenleri
lib/          â€” Yardımcı fonksiyonlar
prisma/       â€” Schema ve seed dosyaları
scripts/      â€” Otomasyon scriptleri
public/       â€” Statik dosyalar
```

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run db:push      # Prisma schema güncelle
npm run db:studio    # Prisma Studio aç
```

## Önemli Kurallar

- **App Router kullan** â€” `pages/` klasörü değil, `app/` klasörü
- **Server Components varsayılan** â€” sadece gerektiğinde `"use client"`
- **Prisma** â€” raw SQL değil, Prisma ORM kullan
- **Type-safe** â€” `any` kullanma, proper typing yap

## Agent Önerileri

- Yeni özellik â†’ `/plan` komutu ile başla
- Veritabanı işlemleri â†’ **database-reviewer** agent
- Güvenlik â†’ **security-reviewer** agent (auth, API routes)
- Build hatası â†’ **build-error-resolver** agent
