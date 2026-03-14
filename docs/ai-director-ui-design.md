# AI Yönetmen ve Poz Asistanı: Kullanıcı Arayüzü (UI) Tasarımı

Bu belge, SCX Studio Pro projesine eklenecek olan **AI Yönetmen ve Poz Asistanı** özelliğinin kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) tasarımını detaylandırmaktadır. Bu özellik, kullanıcıların karakterlerinin pozlarını, bakış açılarını ve ifadelerini hassas bir şekilde kontrol etmelerini sağlayarak, görsel üretim sürecine sinematik bir derinlik katmayı hedeflemektedir.

## 1. Genel Konsept ve Kullanıcı Akışı

AI Yönetmen ve Poz Asistanı, kullanıcıya bir film yönetmeni gibi davranma yeteneği sunar. Kullanıcı, ana stüdyo arayüzünde karakterini seçtikten sonra, bu yeni panel aracılığıyla karakterin duruşunu ve ifadesini ayarlayabilir. Değişiklikler anlık olarak önizleme penceresinde yansıtılır ve nihai görsel üretiminde bu ayarlamalar AI motoruna prompt olarak enjekte edilir.

### Kullanıcı Akışı:
1.  Kullanıcı, SCX Studio Pro ana ekranında karakterini ve ortamını seçer.
2.  "Poz ve Yönetmen" sekmesine tıklar.
3.  Açılan panelde, poz kütüphanesinden hazır bir poz seçer veya manuel kontrollerle pozunu ayarlar.
4.  Kafa pozisyonu, bakış yönü ve yüz ifadeleri gibi detayları ince ayarlar.
5.  Değişiklikleri önizler ve onaylar.
6.  Görseli üretmek için ana üretim düğmesine basar.

## 2. Ana UI Bileşenleri ve Fonksiyonları

### 2.1. Poz Kütüphanesi (Pose Library)

Bu bölüm, önceden tanımlanmış veya kaydedilmiş pozların bir koleksiyonunu sunar. Kullanıcılar, farklı senaryolar için optimize edilmiş pozları kolayca seçebilirler.

-   **Görsel Önizlemeler:** Her pozun küçük bir görsel önizlemesi bulunur.
-   **Kategoriler:** Portre, Aksiyon, Yaşam Tarzı, Oturma, Ayakta gibi kategorilerle pozlar filtrelenebilir.
-   **Arama Çubuğu:** Anahtar kelimelerle poz arama imkanı.
-   **Kaydet/Yükle:** Kullanıcının kendi oluşturduğu pozları kaydetme ve daha sonra yükleme özelliği.

| Bileşen Adı       | Açıklama                                                              | Etkileşim Tipi      |
| :---------------- | :-------------------------------------------------------------------- | :------------------ |
| Poz Kartları      | Her biri bir pozun önizlemesini ve adını içeren tıklanabilir kartlar. | Tıklama             |
| Kategori Filtreleri | Pozları türe göre filtrelemek için düğmeler veya açılır menü.         | Tıklama / Açılır Menü |
| Arama Kutusu      | Poz kütüphanesinde metin tabanlı arama.                              | Metin Girişi        |
| Poz Kaydet Düğmesi | Mevcut ayarları yeni bir poz olarak kaydetme.                         | Tıklama             |

### 2.2. Kafa Pozisyonu Kontrolleri (Head Position Controls)

Karakterin kafa pozisyonunu ve bakış yönünü hassas bir şekilde ayarlamak için kullanılır. `lib/ai-rules.ts` içindeki `postureConsistency` kurallarının `HEAD POSITION` bölümü ile doğrudan ilişkilidir.

-   **Yaw (Sağa/Sola Dönüş):** Karakterin kafasını yatay eksende döndürme.
-   **Pitch (Yukarı/Aşağı Eğilme):** Karakterin kafasını dikey eksende eğme.
-   **Roll (Yanlara Eğilme):** Karakterin kafasını omuzlarına doğru eğme.

| Bileşen Adı       | Açıklama                                                              | Etkileşim Tipi |
| :---------------- | :-------------------------------------------------------------------- | :------------- |
| Yaw Kaydırıcı     | -30 dereceden +30 dereceye kadar kafa yatay dönüşü.                   | Slider         |
| Pitch Kaydırıcı   | -20 dereceden +20 dereceye kadar kafa dikey eğimi.                    | Slider         |
| Roll Kaydırıcı    | -15 dereceden +15 dereceye kadar kafa yan eğimi.                      | Slider         |
| Reset Düğmesi     | Tüm kafa pozisyonu ayarlarını sıfırlama.                              | Tıklama        |

### 2.3. İfade Kontrolleri (Expression Controls)

Karakterin yüz ifadelerini ve mikro-ifadelerini ayarlamak için kullanılır. `lib/ai-rules.ts` içindeki `anatomicalControl` kurallarının `MICRO-EXPRESSIONS` bölümü ile entegre olacaktır.

-   **Temel İfadeler:** Mutlu, Üzgün, Şaşkın, Kızgın, Nötr gibi önceden tanımlanmış ifadeler.
-   **Mikro-İfade Kaydırıcıları:** Hafif gülümseme, kaş çatma derinliği, göz kısma gibi ince ayarlar.
-   **Göz Odaklanması:** Karakterin bakışının belirli bir noktaya (örneğin, kameraya) odaklanmasını sağlama.

| Bileşen Adı         | Açıklama                                                              | Etkileşim Tipi      |
| :------------------ | :-------------------------------------------------------------------- | :------------------ |
| İfade Düğmeleri     | Temel ifadeleri hızlıca seçmek için düğmeler.                         | Tıklama             |
| Gülümseme Kaydırıcı | Gülümseme yoğunluğunu ayarlama.                                       | Slider              |
| Kaş Çatma Kaydırıcı | Kaş çatma derinliğini ayarlama.                                       | Slider              |
| Göz Odaklanma Seçimi | Bakışın kameraya veya başka bir yöne odaklanmasını sağlayan açılır menü. | Açılır Menü / Radyo Buton |

### 2.4. Vücut Pozisyonu ve Duruş (Body Posture & Stance)

Karakterin genel vücut duruşunu ve omuz hizalamasını kontrol eder. `lib/ai-rules.ts` içindeki `postureConsistency` kurallarının `SHOULDER ALIGNMENT` ve `SPINE CURVATURE` bölümleriyle entegre olacaktır.

-   **Omuz Hizalaması:** Omuzların yüksekliğini ve rotasyonunu ayarlama.
-   **Omurga Eğriliği:** Karakterin duruşunu (dik, rahat, öne eğik) ayarlama.
-   **El Pozisyonları:** El hareketlerini ve parmak detaylarını kontrol etme (örneğin, yumruk, açık el, işaret parmağı).

| Bileşen Adı         | Açıklama                                                              | Etkileşim Tipi |
| :------------------ | :-------------------------------------------------------------------- | :------------- |
| Omuz Kaydırıcıları  | Omuz yüksekliği ve rotasyonu için kaydırıcılar.                       | Slider         |
| Duruş Seçimi        | Önceden tanımlanmış duruş tipleri (dik, rahat).                       | Radyo Buton    |
| El Pozisyonu Seçimi | El hareketleri için görsel bir seçici veya açılır menü.               | Seçici / Açılır Menü |

## 3. Teknik Uygulama Notları

-   **Frontend:** React bileşenleri (Next.js App Router) ve Tailwind CSS ile geliştirilecektir. Framer Motion, akıcı geçişler ve etkileşimler için kullanılabilir.
-   **State Yönetimi:** Zustand, UI bileşenlerinin durumunu ve AI prompt parametrelerini merkezi olarak yönetmek için kullanılacaktır.
-   **AI Entegrasyonu:** UI kontrollerinden gelen değerler, `lib/ai-rules.ts` içindeki `enrichPromptWithRules` ve `buildFinalPrompt` fonksiyonları aracılığıyla AI motoruna gönderilecek prompt parametrelerine dönüştürülecektir.
-   **Yeni Modül:** `lib/pose-control.ts` adında yeni bir modül oluşturularak, poz kütüphanesi yönetimi, poz verilerinin saklanması ve `postureConsistency` kurallarının daha detaylı işlenmesi sağlanabilir.
-   **Görsel Geri Bildirim:** Kullanıcının yaptığı her ayar değişikliği, ana önizleme penceresinde gerçek zamanlı veya yakın gerçek zamanlı olarak yansıtılmalıdır. Bu, AI motorunun hızlı geri bildirim yeteneğine bağlı olacaktır.

Bu tasarım, AI Yönetmen ve Poz Asistanı özelliğinin hem güçlü hem de kullanıcı dostu olmasını sağlamak için bir başlangıç noktasıdır. Detaylı geliştirme sürecinde kullanıcı geri bildirimleri ve teknik kısıtlamalar doğrultusunda revizyonlar yapılabilir.
