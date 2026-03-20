# SCX Studio Pro â€” Synth Control X

> Kendi Yüzünüzü kullanarak profesyonel yapay zeka fotoğrafları üretin.

## ğŸš€ Özellikler

- **Prompt Kütüphanesi** â€” 8+ kategoride özenle seçilmiş şablonlanmış promptlar
- **Prompt Mikseri** â€” Şablonları kişiselleştirmek için Görsel kontrol paneli
- **Studio Pro Kartları** â€” Gelişmiş şablonlar ve açıklamalar
- **Görsel Üretimi** â€” Fal.ai FLUX PuLID entegrasyonu (FAL_KEY gerekli)
- **Karakter DNA** â€” Yüzünüzü bir kez tanıtın, tüm promptlarda kullanın
- **Image Editor** â€” Diyafram mekanizmalı gelişmiş Görsel Düzenleme
- **SCX Vault** â€” Aksesuar ve kıyafet koleksiyonu
- **Google OAuth** â€” Güvenli kimlik doğrulama
- **PWA Desteği** â€” Mobil uygulama gibi kurulabilir

## ğŸ› ï¸ Kurulum

### Gereksinimler
- Node.js 18+
- pnpm

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/ssrxs/scx-studio-pro-fixed.git
cd scx-studio-pro-fixed

# Bağımlılıkları kur
pnpm install

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasını Düzenle ve gerekli değerleri gir

# Veritabanını oluştur
pnpm db:push

# Örnek verileri ekle
pnpm db:seed

# Geliştirme sunucusunu başlat
pnpm dev
```

Uygulama `http://localhost:3000` adresinde çalışacak.

## âš™ï¸ Ortam Değişkenleri

`.env.example` dosyasını kopyalayıp gerekli değerleri doldurun:

| Değişken | Açıklama | Zorunlu |
|---|---|---|
| `DATABASE_URL` | SQLite DB yolu | âœ… |
| `AUTH_SECRET` | NextAuth gizli anahtarı | âœ… |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | âœ… |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | âœ… |
| `FAL_KEY` | Fal.ai API anahtarı (Görsel üretimi için) | âš ï¸ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (dosya yükleme için) | âš ï¸ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | âš ï¸ |

## ğŸ“ Proje Yapısı

```
scx-studio-pro-fixed/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ auth/[...nextauth]/  # NextAuth handler
â”‚   â”‚   â”œâ”€â”€ generate/            # Görsel üretim API
â”‚   â”‚   â””â”€â”€ prompts/             # Prompt listeleme API
â”‚   â”œâ”€â”€ studio/                  # Karakter stüdyosu sayfası
â”‚   â”œâ”€â”€ globals.css
â”‚   â”œâ”€â”€ layout.tsx
â”‚   â””â”€â”€ page.tsx                 # Ana sayfa
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ImageEditor.tsx          # Gelişmiş Görsel editör
â”‚   â”œâ”€â”€ LoadingSkeleton.tsx      # Yükleme iskelet bileşeni
â”‚   â”œâ”€â”€ PromptCard.tsx           # Prompt kart bileşeni
â”‚   â”œâ”€â”€ Providers.tsx            # Session provider
â”‚   â””â”€â”€ Toast.tsx                # Bildirim sistemi
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ ai-rules.ts              # AI prompt optimizasyon kuralları
â”‚   â”œâ”€â”€ prisma.ts                # Prisma client
â”‚   â”œâ”€â”€ scx-vault.ts             # Aksesuar koleksiyonu
â”‚   â””â”€â”€ store.ts                 # Zustand state yönetimi
â”œâ”€â”€ prisma/
â”‚   â”œâ”€â”€ schema.prisma            # Veritabanı şeması
â”‚   â””â”€â”€ seed.ts                  # Örnek veri
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ logo.jpeg                # Uygulama logosu
â”‚   â””â”€â”€ manifest.json            # PWA manifest
â”œâ”€â”€ auth.ts                      # NextAuth konfigürasyonu
â”œâ”€â”€ auth.config.ts               # Edge-uyumlu auth ayarları
â”œâ”€â”€ middleware.ts                # Route koruma
â”œâ”€â”€ next.config.js
â”œâ”€â”€ tailwind.config.js
â””â”€â”€ tsconfig.json
```

## ğŸ”§ Geliştirme Komutları

```bash
pnpm dev          # Geliştirme sunucusu
pnpm build        # Production build
pnpm start        # Production sunucusu
pnpm db:push      # Veritabanı şemasını güncelle
pnpm db:seed      # Örnek verileri ekle
pnpm db:studio    # Prisma Studio (DB Görsel araYüzü)
```

## ğŸ¨ Teknoloji Yığını

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + Framer Motion
- **Auth**: NextAuth v5 (Google OAuth)
- **Database**: SQLite + Prisma ORM
- **State**: Zustand
- **AI**: Fal.ai FLUX PuLID
- **Storage**: Supabase (opsiyonel)

## ğŸ“ Lisans

MIT

---

**SCX Studio Pro** â€” Yapay zeka fotoğrafçılığının geleceği.

