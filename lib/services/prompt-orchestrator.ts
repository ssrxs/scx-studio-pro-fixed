import { GoogleGenerativeAI } from "@google/generative-ai";
import { ANATOMY_LIMITS, FACIAL_ANCHORS, SKIN_TONES, BIOMETRIC_STANDARDS } from "../utils/anatomy-rules";
import { HAND_RULES, SKIN_ZONE_PHYSICS, FACIAL_PROPORTIONS, EYE_DYNAMICS, NECK_LAWS, BODY_RATIOS, FABRIC_PHYSICS } from "../utils/biometric-database";

export type EngineType = 'flux' | 'stable-diffusion' | 'gemini' | 'dalle';

/**
 * 🧠 PromptOrchestrator: Her motorun "dilini" konuşan AI katmanı.
 */
export class PromptOrchestrator {
  private genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

  async optimize(
    basePrompt: string, 
    engine: EngineType, 
    dna?: any
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const skinInfo = dna?.skinToneID ? SKIN_TONES.find(s => s.id === dna.skinToneID) : null;
      const isFemale = dna?.gender === 'women';
      
      const systemPrompt = `You are an expert AI Prompt Engineer specializing in hyper-realistic human biometrics and fashion physics.
      
      SPATIAL & BIOMETRIC REASONING:
      - Name: ${dna?.name || "Person"}, Gender: ${dna?.gender || "unspecified"}, Age: ${dna?.age || "25"}
      - Height: ${dna?.height || "170"}cm, Weight: ${dna?.weight || "70"}kg.
      - Female Anatomy: ${isFemale ? `Breast: ${dna?.breastType || "teardrop"} with ${dna?.braEffect || "natural"} support. Hips: ${dna?.hipShape || "hourglass"}. WHR: ${BODY_RATIOS.whr_ideal}.` : ""}
      - Legs & Hosiery: ${isFemale ? `Legs wearing ${dna?.hosieryType || "sheer 15 denier"} stockings. Skin interaction: translucent sheen, visible knee anatomy.` : ""}
      - Skin: Tone MST-${dna?.skinToneID || "E"}, ${dna?.skinCondition || "clear"}.
      
      ANATOMICAL LAWS:
      - Eye Physics: ${EYE_DYNAMICS.rotation.horiz} horizontal range. Specular highlights on moist tear film.
      - Neck/Head: Natural muscle tension. Proportions: 7.5 heads height.
      - Fabric Physics: ${FABRIC_PHYSICS.silk} for dresses, ${FABRIC_PHYSICS.leather} for shoes/jackets.
      
      RULES FOR ${engine}:
      ${this.getEngineRules(engine)}
      
      USER INTENT: "${basePrompt}"
      
      Output ONLY the final optimized prompt string. Maintain ${FACIAL_ANCHORS.join(", ")}. ENSURE ABSOLUTE ANATOMICAL REALISM.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Prompt optimizasyonu başarısız:", error);
      return basePrompt; 
    }
  }

  private getEngineRules(engine: EngineType): string {
    switch (engine) {
      case 'flux': return "- Natural language focus. Cinematic micro-textures and precise lighting.";
      case 'stable-diffusion': return "- Technical tags focus. Emphasize masterpiece and PBR rendering.";
      case 'gemini': return "- Artistic direction and poetic storytelling focus.";
      case 'dalle': return "- High specificity in object relationships and composition.";
      default: return "- High-fidelity output.";
    }
  }
}

export const promptOrchestrator = new PromptOrchestrator();
