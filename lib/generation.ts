import { prisma } from "./prisma";

// Üretim işçisi tipleri
export type GenerationProvider = 'gemini_browser' | 'fal_ai' | 'segmind';

interface GenerationRequest {
  prompt: string;
  referenceImage?: string;
  userId: string;
}

class GenerationManager {
  // Arka plandaki işçileri (workers) burada yönetebiliriz
  private workers = [
    { id: 1, type: 'fal_ai' as GenerationProvider, active: true },
    { id: 2, type: 'gemini_browser' as GenerationProvider, active: false }, // Playwright ile bağlanacak
    // ... daha fazla işçi eklenebilir
  ];

  async generate(req: GenerationRequest) {
    // 1. Müsait bir işçi seç (Şimdilik basitlik için Fal.ai seçiyoruz)
    const worker = this.workers.find(w => w.active);
    
    if (!worker) throw new Error("Şu an üretim için müsait bir işçi bulunamadı.");

    console.log(`Üretim başlatılıyor: İşçi #${worker.id} (${worker.type})`);

    let imageUrl = "";

    if (worker.type === 'fal_ai') {
      imageUrl = await this.generateWithFalAI(req);
    } else if (worker.type === 'gemini_browser') {
      imageUrl = await this.generateWithBrowserWorker(req);
    }

    // 2. Sonucu veritabanına kaydet
    const savedImage = await prisma.generatedImage.create({
      data: {
        userId: req.userId,
        promptUsed: req.prompt,
        imageUrl: imageUrl,
        engineUsed: worker.type
      }
    });

    return savedImage;
  }

  private async generateWithFalAI(req: GenerationRequest) {
    // Burada Fal.ai (Flux with IP-Adapter) API çağrısı yapılacak.
    // Şimdilik yer tutucu (placeholder) bir URL döndürüyoruz.
    console.log("Fal.ai API çağrılıyor...");
    return "https://api.fal.ai/placeholder-result.png"; 
  }

  private async generateWithBrowserWorker(req: GenerationRequest) {
    // Burası senin istediğin "arkada tarayıcı aç" mantığının Playwright ile çalışacağı yer.
    console.log("Playwright Worker (Gemini) çalıştırılıyor...");
    // 1. Tarayıcıyı aç
    // 2. Gemini'ye git
    // 3. Promptu yaz ve referans resmi yükle
    // 4. Sonucu indir ve URL döndür
    return "/downloads/generated-from-browser.webp";
  }
}

export const generationManager = new GenerationManager();
