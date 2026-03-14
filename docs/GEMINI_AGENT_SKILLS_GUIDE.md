# SCX Studio Pro: Gemini Agent Skills ve MCP Entegrasyon Rehberi

Bu belge, SCX Studio Pro projesinin Gemini CLI ortamında daha etkin çalışabilmesi için tasarlanacak olan agent-specific skill'leri ve bu skill'lerin Model Context Protocol (MCP) üzerinden nasıl entegre edileceğine dair bir rehber sunmaktadır. Bu skill'ler, Gemini'nin gelişmiş yeteneklerini projenin özel ihtiyaçlarına göre optimize etmeyi amaçlamaktadır.

## 1. Agent-Specific Skills Tasarımı

Gemini'nin multimodal ve uzun bağlam yeteneklerinden tam olarak faydalanmak için, projenin farklı alanlarına odaklanan özel agent skill'leri önerilmektedir. Bu skill'ler, Gemini'nin karmaşık görevleri daha verimli bir şekilde yerine getirmesini sağlayacaktır.

### 1.1. `gemini-code-analyzer` Skill'i

-   **Açıklama:** Bu skill, SCX Studio Pro'nun kod tabanını analiz etmek, potansiyel hataları, performans darboğazlarını ve güvenlik açıklarını tespit etmek için tasarlanmıştır. Özellikle `lib/ai-rules.ts`, `lib/pose-control.ts` ve diğer kritik modüllerin kod kalitesini artırmaya odaklanacaktır.
-   **Kullanım Alanları:** Yeni kod eklenmeden önce otomatik kod incelemesi, mevcut kodun refaktoring önerileri, best practices uyumluluğu kontrolü.
-   **Beklenen Çıktı:** Kod analizi raporları, iyileştirme önerileri, belirli kod blokları için optimize edilmiş versiyonlar.

### 1.2. `gemini-creative-writer` Skill'i

-   **Açıklama:** Bu skill, SCX Studio Pro için pazarlama metinleri, blog yazıları, sosyal medya içerikleri ve kullanıcı arayüzü metinleri gibi yaratıcı içerikler üretmek üzere geliştirilecektir. Gemini'nin doğal dil işleme ve yaratıcı yazma yeteneklerini kullanarak, projenin tanıtım materyallerini zenginleştirecektir.
-   **Kullanım Alanları:** Ürün açıklamaları, reklam metinleri, blog gönderileri, e-posta kampanyaları, UI/UX metinleri.
-   **Beklenen Çıktı:** Belirli bir konsept veya anahtar kelime setine dayalı yaratıcı metinler, farklı tonlarda (resmi, samimi, ikna edici) içerik varyasyonları.

### 1.3. `gemini-visual-interpreter` Skill'i

-   **Açıklama:** Bu skill, SCX Studio Pro tarafından üretilen görselleri analiz etmek ve kalite kontrol süreçlerine yardımcı olmak için tasarlanmıştır. Gemini'nin multimodal yeteneklerini kullanarak, görsellerdeki kompozisyon, renk uyumu, anatomik doğruluk, ışıklandırma tutarlılığı gibi unsurları değerlendirecektir.
-   **Kullanım Alanları:** Üretilen görsellerin otomatik kalite kontrolü, görsel iyileştirme önerileri, belirli bir stil veya tema ile uyumluluk analizi.
-   **Beklenen Çıktı:** Görsel analiz raporları, iyileştirme için spesifik geri bildirimler (örneğin, 
anatomik hata tespiti, renk dengesizliği uyarısı), görselin belirli bir prompt ile ne kadar uyumlu olduğunu gösteren skorlar.

## 2. MCP Entegrasyon Rehberi

Bu agent-specific skill'lerin Gemini CLI üzerinden `manus-mcp-cli` ile nasıl çağrılacağına dair detaylı bir rehber aşağıda sunulmuştur. Bu rehber, her bir skill için örnek kullanım senaryolarını, gerekli parametreleri ve beklenen çıktı formatlarını içerecektir.

### 2.1. Genel Çağrı Yapısı

```bash
manus-mcp-cli tool call gemini <skill_adı> --input '<JSON_parametreleri>'
```

### 2.2. `gemini-code-analyzer` Örnek Kullanımı

-   **Amaç:** Belirli bir kod dosyasını analiz etmek ve iyileştirme önerileri almak.
-   **Parametreler:**
    -   `filePath`: Analiz edilecek dosyanın yolu (örneğin, `lib/ai-rules.ts`).
    -   `analysisType`: Analiz türü (`quality`, `performance`, `security`).
-   **Örnek Çağrı:**

    ```bash
    manus-mcp-cli tool call gemini gemini-code-analyzer --input '{"filePath": "lib/ai-rules.ts", "analysisType": "quality"}'
    ```

-   **Beklenen Çıktı:** Kod kalitesi raporu, belirli satırlar için iyileştirme önerileri.

### 2.3. `gemini-creative-writer` Örnek Kullanımı

-   **Amaç:** Yeni bir ürün için pazarlama metni oluşturmak.
-   **Parametreler:**
    -   `topic`: Metnin konusu (örneğin, "AI Yönetmen ve Poz Asistanı").
    -   `contentType`: İçerik türü (`marketing_copy`, `blog_post`, `social_media`).
    -   `tone`: Metnin tonu (`persuasive`, `informative`, `friendly`).
-   **Örnek Çağrı:**

    ```bash
    manus-mcp-cli tool call gemini gemini-creative-writer --input '{"topic": "AI Yönetmen ve Poz Asistanı", "contentType": "marketing_copy", "tone": "persuasive"}'
    ```

-   **Beklenen Çıktı:** Belirtilen konuya ve tona uygun yaratıcı pazarlama metni.

### 2.4. `gemini-visual-interpreter` Örnek Kullanımı

-   **Amaç:** Üretilen bir görselin anatomik doğruluğunu kontrol etmek.
-   **Parametreler:**
    -   `imageUrl`: Analiz edilecek görselin URL adresi.
    -   `analysisType`: Analiz türü (`anatomical_accuracy`, `color_consistency`, `composition`).
-   **Örnek Çağrı:**

    ```bash
    manus-mcp-cli tool call gemini gemini-visual-interpreter --input '{"imageUrl": "https://example.com/generated_image.png", "analysisType": "anatomical_accuracy"}'
    ```

-   **Beklenen Çıktı:** Görseldeki anatomik hataların tespiti ve düzeltme önerileri.

## 3. GitHub Güncellemesi

Bu rehber ve önerilen skill yapıları, SCX Studio Pro GitHub reposunda `docs/GEMINI_AGENT_SKILLS_GUIDE.md` olarak güncellenecektir. Bu, projenin Gemini entegrasyonu için şeffaf ve izlenebilir bir yol haritası sağlayacaktır.

Bu strateji, SCX Studio Pro projesinin Gemini CLI ve diğer AI agent'ları ile sorunsuz bir şekilde çalışmasını sağlayarak, geliştirme sürecini hızlandıracak ve AI yeteneklerini en üst düzeye çıkaracaktır.
