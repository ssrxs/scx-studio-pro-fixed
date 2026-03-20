import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * ğŸ§  FaceAnalysisService: Kullanıcı Yüzünü analiz ederek "Anatomik DNA" oluşturur.
 */
export class FaceAnalysisService {
  private genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

  async analyzeFace(imageUrl: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Analyze this person's face in detail for AI image generation. 
      Describe: exact facial structure, eye shape and color, nose shape, lip thickness, jawline, skin texture, and unique features. 
      Output only a highly descriptive 50-word paragraph that will be used as a character consistency anchor. 
      Focus on anatomical details that don't change.`;

      // Not: URL'den Görsel okuma mantığı burada (base64 veya fetch) simüle ediliyor.
      // Gerçek uygulamada imageUrl bir Buffer veya Base64'e çevrilir.
      const result = await model.generateContent([prompt, imageUrl]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Yüz analizi başarısız:", error);
      return "distinctive facial features, high quality portrait details";
    }
  }
}

export const faceAnalysisService = new FaceAnalysisService();

