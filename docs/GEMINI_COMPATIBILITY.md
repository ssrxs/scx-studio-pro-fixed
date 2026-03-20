# SCX Studio Pro: Gemini CLI ve Agent Uyumluluğu Stratejisi

Bu belge, SCX Studio Pro projesinin Google Gemini CLI ve diğer AI agent'ları ile tam uyumlu hale getirilmesi için stratejik bir yol haritası sunmaktadır. Amaç, mevcut skill'lerin ve proje yapısının Gemini'nin gelişmiş multimodal ve uzun bağlam (long-context) yeteneklerinden en iyi şekilde faydalanmasını sağlamaktır.

## 1. Mevcut Skill'lerin Gemini Ortamına Adaptasyonu

SCX Studio Pro bünyesindeki mevcut skill'ler (`internal-project-rules`, `employee-onboarding-guide`, `external-ai-consistency`, `AI Yönetmen ve Poz Asistanı`) Gemini CLI ortamında çalışacak şekilde optimize edilecektir. Bu optimizasyon, özellikle prompt yapılarının ve veri alışveriş formatlarının Gemini'nin beklentilerine uygun hale getirilmesini içerecektir.

### 1.1. `internal-project-rules` Skill'i
`lib/ai-rules.ts` dosyasındaki `GLOBAL_AI_RULES` yapısı, Gemini'nin daha karmaşık ve katmanlı prompt yapılarını destekleyecek şekilde genişletilecektir. Özellikle `enrichPromptWithRules` fonksiyonu, Gemini'nin farklı modelleri için özelleştirilmiş kural setlerini dinamik olarak seçebilecek yetenekte olacaktır. Bu adaptasyon sayesinde, proje içi kuralların ve AI prompt mantığının Gemini tarafından daha iyi anlaşılması ve uygulanması sağlanacaktır.

### 1.2. `employee-onboarding-guide` Skill'i
Onboarding rehberindeki metin tabanlı açıklamalar, Gemini'nin multimodal yetenekleri sayesinde Görsellerle (örneğin, kod bloklarının ekran görüntüleri, mimari diyagramlar) zenginleştirilecektir. Bu, yeni çalışanların projeyi daha hızlı kavramasına ve onboarding sürecinin daha interaktif ve anlaşılır hale gelmesine yardımcı olacaktır.

### 1.3. `external-ai-consistency` Skill'i
Bu skill, Gemini'nin farklı AI modelleriyle (örneğin, Midjourney, Leonardo) entegrasyonunu kolaylaştıracak yeni fonksiyonlar içerecektir. Özellikle `consistency_matrix.md` belgesi, Gemini'nin analiz yetenekleriyle otomatik olarak güncellenebilecek ve farklı modellerin tutarlılık performansını karşılaştırabilecektir. Bu sayede, dış AI servislerinin çıktı tutarlılığının Gemini tarafından daha etkin bir şekilde izlenmesi ve optimize edilmesi mümkün olacaktır.

### 1.4. `AI Yönetmen ve Poz Asistanı` Skill'i
`lib/pose-control.ts` modülü, Gemini'nin Görsel anlama yeteneklerini kullanarak, Kullanıcının seçtiği pozların Görsel referanslarını doğrudan işleyebilecek hale getirilecektir. `poseProfileToPrompt` fonksiyonu, Gemini'nin Görsel prompt mühendisliği için daha detaylı ve bağlamsal bilgiler üretecektir. Bu entegrasyon, poz asistanının daha akıllı ve Görsel tabanlı öneriler sunmasına ve Kullanıcının daha Doğal ve gerçekçi pozlar oluşturmasına yardımcı olacaktır.

## 2. Gemini CLI Entegrasyonu ve MCP Kullanımı

Gemini CLI, `manus-mcp-cli` aracı üzerinden entegre edilecek ve Gemini API'lerine erişim sağlanacaktır. Bu entegrasyon, özellikle uzun bağlam penceresi ve multimodal giriş/çıKış yeteneklerinden faydalanmayı hedefleyecektir.

Gemini CLI, `manus-mcp-cli` aracı üzerinden entegre edilecek ve Gemini API'lerine erişim sağlanacaktır. Bu entegrasyon, özellikle uzun bağlam penceresi ve multimodal giriş/çıKış yeteneklerinden faydalanmayı hedefleyecektir. Gemini API'leri, `manus-mcp-cli tool call gemini <tool_name> --input '...'` şeklinde çağrılarla metin, Görsel ve kod anlama/üretme yetenekleri için kullanılacaktır. Gemini'nin geniş bağlam penceresi, karmaşık görevlerde daha fazla bilgi saklamak ve daha tutarlı yanıtlar üretmek için kullanılacak; özellikle `lib/ai-rules.ts` gibi kritik dosyaların tamamı veya ilgili bölümleri, tek bir çağrıda Gemini'ye aktarılabilecektir. Multimodal giriş/çıKış yetenekleri sayesinde, Görsel referanslarla birlikte metin prompt'ları gönderilerek ve Görsel çıktıları işlenerek daha doğru sonuçlar elde edilebilecektir.

## 3. Proje Gelişimi İçin Agent-Specific Skills ve MCP Entegrasyon Rehberi

Gemini'nin yeteneklerini en üst düzeyde kullanmak için, projeye özel yeni agent skill'leri tasarlanacaktır. Bu skill'ler, Gemini'nin güçlü yanlarını (örneğin, karmaşık kod analizi, yaratıcı metin üretimi, Görsel içerik yorumlama) doğrudan hedefleyecektir.

### 3.1. Yeni Skill Önerileri
Gemini'nin yeteneklerini en üst düzeyde kullanmak için, projeye özel yeni agent skill'leri tasarlanacaktır. Bu skill'ler, Gemini'nin güçlü yanlarını (örneğin, karmaşık kod analizi, yaratıcı metin üretimi, Görsel içerik yorumlama) doğrudan hedefleyecektir:

-   **`gemini-code-analyzer`:** Proje kod tabanını analiz eden, potansiyel hataları ve iyileştirmeleri öneren bir skill. Özellikle `lib/ai-rules.ts` ve `lib/pose-control.ts` gibi kritik modüllerin kod kalitesini artıracaktır.
-   **`gemini-creative-writer`:** Pazarlama metinleri, blog yazıları veya sosyal medya içerikleri için yaratıcı metinler üreten bir skill. SCX Studio Pro'nun tanıtım materyallerini zenginleştirecektir.
-   **`gemini-visual-interpreter`:** Üretilen Görselleri analiz eden, kompozisyon, renk uyumu ve anatomik doğruluk açısından geri bildirim sağlayan bir skill. Kalite kontrol süreçlerini otomatikleştirecektir.

### 3.2. MCP Entegrasyon Rehberi
Bu skill'lerin `manus-mcp-cli` üzerinden nasıl çağrılacağına dair detaylı bir rehber hazırlanacaktır. Bu rehber, parametre yapılarını, örnek kullanımları ve beklenen çıktıları içerecektir.

## 4. GitHub Güncellemesi ve Sürekli Entegrasyon

Tüm bu planlama ve geliştirme süreçleri, GitHub reposunda sürekli olarak güncellenecektir. Yeni skill'ler, dokümantasyonlar ve kod değişiklikleri düzenli olarak commit edilecek ve push edilecektir. Bu, projenin her zaman güncel ve izlenebilir olmasını sağlayacaktır.

Bu strateji, SCX Studio Pro'nun Gemini ekosistemine sorunsuz bir şekilde entegre olmasını ve AI destekli Görsel üretimde yeni ufuklar açmasını sağlayacaktır.

