# SCX Studio Pro - Teknik Kullanım ve Geliştirme Rehberi

Bu döküman, Synth Control X (SCX) Studio altyapısının çalışma prensiplerini, veritabanı mimarisini ve görsel düzenleme motorunun teknik detaylarını içerir.

---

## 1. Mimari Genel Bakış
SCX Studio, Next.js 15 tabanlı, yapay zeka destekli bir kişisel fotoğraf stüdyosudur. Sistemin kalbinde **"Yüz Tutarlılığı" (Face Consistency)** ve **"Anatomik Kontrol"** yatar.

### Temel Bileşenler:
*   **Generation Farm (Üretim Çiftliği):** Fal.ai (Flux 1.1 Pro & PuLID) API'leri ile entegre çalışan, saniyeler içinde fotogerçekçi görsel üreten motor.
*   **SCX Master Vault (Kasa):** Cinsiyet ve stil bazlı kategorize edilmiş, binlerce aksesuar ve ayakkabı modelini barındıran kütüphane.
*   **Diyafram Editör (The Aperture):** Üretilen görseller üzerinde piksel hassasiyetinde düzenleme yapan, kamera objektifi formundaki kullanıcı arayüzü.

---

## 2. Veritabanı ve Karakter DNA'sı
Veritabanımız (Prisma + SQLite), kullanıcının fiziksel özelliklerini bir "DNA Bloğu" olarak saklar.

### `CharacterDNA` Tablosu:
*   **Fiziksel Özellikler:** Yaş, Cinsiyet, Ten Rengi, Vücut Tipi.
*   **Görsel Referanslar:** 1-5 adet yüz fotoğrafı ve 1 adet tam boy poz referansı.
*   **İmza Stil:** Kullanıcının her görselinde korunmasını istediği kıyafet veya aksesuar bilgisi.

**İşleyiş:** Üretim butonuna basıldığında, bu DNA verileri `lib/ai-rules.ts` üzerinden süzülerek ana promptun başına "zorunlu kural" olarak eklenir.

---

## 3. Diyafram Editör (The Aperture) Kullanımı
Editör, kullanıcı bir görsele tıkladığında "Diyafram" animasyonu ile açılır.

### Araç Setleri:
1.  **Akıllı Rötuş (Retouch):** `CanvasDraw` kullanarak sivilce, leke veya istenmeyen nesneleri boyayarak silme.
2.  **Yüz Lab (Face Lab):**
    *   *Gülümseme Slider'ı:* Yüz ifadesini yapay zeka ile değiştirme.
    *   *Bakış Joystick'i:* Kafanın ve gözlerin 3D yönünü (Pitch/Yaw) belirleme.
3.  **Master Vault (Vitrin):**
    *   Aksesuarları (Gözlük, Kemer, Yüzük vb.) doğrudan görsel üzerine yerleştirme.
    *   **Anatomik Etki:** Topuklu ayakkabı seçildiğinde "Pelvik Tilt" ve "S-Curve" postür düzeltmelerinin otomatik prompt enjeksiyonu.

---

## 4. Geliştirici Notları ve Komutlar
*   **Veritabanı Güncelleme:** `npx prisma db push`
*   **Yeni Model Ekleme:** `lib/scx-vault.ts` dosyasına yeni öğeler eklenerek vitrin genişletilebilir.
*   **AI Kuralları:** `lib/ai-rules.ts` dosyası, tüm modellerin (Flux, Gemini vb.) uyması gereken etik ve teknik kuralları içerir.

---

*Bu sistem, 2026 yılı yapay zeka standartlarına göre "Sıfır Depolama Maliyeti" ve "Maksimum Kullanıcı Kontrolü" hedefiyle inşa edilmiştir.*
