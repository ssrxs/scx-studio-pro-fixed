# SCX Studio Pro — Synth Control X

> Kendi yüzünüzü kullanarak profesyonel yapay zeka fotoğrafları üretin.

## 🚀 Özellikler

- **Prompt Kütüphanesi** — 8+ kategoride özenle seçilmiş şablonlanmış promptlar
- **Prompt Mikseri** — Şablonları kişiselleştirmek için görsel kontrol paneli
- **Studio Pro Kartları** — Gelişmiş şablonlar ve açıklamalar
- **Görsel Üretimi** — Fal.ai FLUX PuLID entegrasyonu (FAL_KEY gerekli)
- **Karakter DNA** — Yüzünüzü bir kez tanıtın, tüm promptlarda kullanın
- **Image Editor** — Diyafram mekanizmalı gelişmiş görsel düzenleme
- **SCX Vault** — Aksesuar ve kıyafet koleksiyonu
- **Google OAuth** — Güvenli kimlik doğrulama
- **PWA Desteği** — Mobil uygulama gibi kurulabilir

## 🛠️ Kurulum

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
# .env dosyasını düzenle ve gerekli değerleri gir

# Veritabanını oluştur
pnpm db:push

# Örnek verileri ekle
pnpm db:seed

# Geliştirme sunucusunu başlat
pnpm dev
```

Uygulama `http://localhost:3000` adresinde çalışacak.

## ⚙️ Ortam Değişkenleri

`.env.example` dosyasını kopyalayıp gerekli değerleri doldurun:

| Değişken | Açıklama | Zorunlu |
|---|---|---|
| `DATABASE_URL` | SQLite DB yolu | ✅ |
| `AUTH_SECRET` | NextAuth gizli anahtarı | ✅ |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | ✅ |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | ✅ |
| `FAL_KEY` | Fal.ai API anahtarı (görsel üretimi için) | ⚠️ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (dosya yükleme için) | ⚠️ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | ⚠️ |

## 📁 Proje Yapısı

```
scx-studio-pro-fixed/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── generate/            # Görsel üretim API
│   │   └── prompts/             # Prompt listeleme API
│   ├── studio/                  # Karakter stüdyosu sayfası
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Ana sayfa
├── components/
│   ├── ImageEditor.tsx          # Gelişmiş görsel editör
│   ├── LoadingSkeleton.tsx      # Yükleme iskelet bileşeni
│   ├── PromptCard.tsx           # Prompt kart bileşeni
│   ├── Providers.tsx            # Session provider
│   └── Toast.tsx                # Bildirim sistemi
├── lib/
│   ├── ai-rules.ts              # AI prompt optimizasyon kuralları
│   ├── prisma.ts                # Prisma client
│   ├── scx-vault.ts             # Aksesuar koleksiyonu
│   └── store.ts                 # Zustand state yönetimi
├── prisma/
│   ├── schema.prisma            # Veritabanı şeması
│   └── seed.ts                  # Örnek veri
├── public/
│   ├── logo.jpeg                # Uygulama logosu
│   └── manifest.json            # PWA manifest
├── auth.ts                      # NextAuth konfigürasyonu
├── auth.config.ts               # Edge-uyumlu auth ayarları
├── middleware.ts                # Route koruma
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Geliştirme Komutları

```bash
pnpm dev          # Geliştirme sunucusu
pnpm build        # Production build
pnpm start        # Production sunucusu
pnpm db:push      # Veritabanı şemasını güncelle
pnpm db:seed      # Örnek verileri ekle
pnpm db:studio    # Prisma Studio (DB görsel arayüzü)
```

## 🎨 Teknoloji Yığını

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + Framer Motion
- **Auth**: NextAuth v5 (Google OAuth)
- **Database**: SQLite + Prisma ORM
- **State**: Zustand
- **AI**: Fal.ai FLUX PuLID
- **Storage**: Supabase (opsiyonel)

## 📝 Lisans

MIT

---

**SCX Studio Pro** — Yapay zeka fotoğrafçılığının geleceği.
