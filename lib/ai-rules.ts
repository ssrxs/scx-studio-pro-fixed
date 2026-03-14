/**
 * SCX Studio - Global AI Character Consistency Rules
 * Bu kurallar, tüm yapay zeka motorlarına (Fal, Gemini, etc.) gönderilen promptlara otomatik enjekte edilir.
 */

export const GLOBAL_AI_RULES = {
  // Karakter tutarlılığını sağlamak için kullanılan teknik yönergeler
  characterConsistency: `
### MANDATORY CHARACTER INTEGRITY RULES ###
1. IDENTITY PRESERVATION: Maintain exact bone structure, eye shape, and facial symmetry of the reference subject.
2. DNA DOMINANCE: Character physical traits (age, gender, skin texture) must be treated as absolute constraints.
3. BORING PRECISION: Use specific, technical anatomical descriptions instead of subjective words like "beautiful" or "cool".
4. SKIN FIDELITY: Always render realistic skin pores, natural imperfections, and consistent skin tone. No "plastic" or "AI-smooth" skin.
5. LIGHTING COHERENCE: Ensure environment lighting interacts naturally with the character's face shadows and highlights.
  `,

  // Flux modelleri için özel prompt mühendisliği (NotebookLM araştırmasından)
  fluxOptimization: `
### FLUX ENGINE OPTIMIZATION ###
- Use natural language sentences instead of keyword soup.
- Prepend character traits at the absolute beginning of the prompt.
- Avoid negative prompts; use positive descriptions for clarity (e.g., "sharp focus" instead of "no blur").
  `
};

/**
 * Karakter DNA'sını ve kullanıcı promptunu birleştirerek kusursuz bir komut oluşturur.
 */
export function buildFinalPrompt(userPrompt: string, dna: any) {
  // Eğer DNA verisi yoksa sadece promptu döndür
  if (!dna) return userPrompt;

  // Karakter DNA Bloğu (NotebookLM Formülü)
  const dnaBlock = `A ${dna.age || ''} ${dna.skinTone || ''} ${dna.gender || ''} with ${dna.hairStyle || ''}, ${dna.facialFeatures || ''}, ${dna.bodyType || ''}.`;
  
  // İmza Kıyafet ve Stil (Varsa)
  const styleBlock = dna.signatureOutfit ? `Wearing ${dna.signatureOutfit}.` : "";

  // Kuralları ve promptu harmanla
  // Önemli: DNA en başta olmalı (Model ağırlığı için)
  return `${dnaBlock} ${styleBlock} ${userPrompt}. Ensure cinematic photorealism, 8k resolution, highly detailed textures.`;
}
