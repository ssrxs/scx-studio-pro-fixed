export function buildFinalPrompt(
  basePrompt: string, 
  userChanges: Record<string, string>,
  characterDNA?: any,
  selectedOutfit?: string
) {
  let final = basePrompt;

  // Mix changes - Fixed syntax
  Object.entries(userChanges).forEach(([key, val]) => {
    final = final.replace(`[{${key}}]`, val).replace(`[{${key.toUpperCase()}}]`, val);
  });

  // Character DNA 
  if (characterDNA) {
    const { age, skinTone, bodyType, hairStyle, facialFeatures } = characterDNA;
    const dnaString = `${age}, ${skinTone} skin, ${bodyType}, ${hairStyle}, ${facialFeatures}`;
    final = final.replace(/\[CHARACTER_DNA\]/g, dnaString);
  }

  // AI Kıyafet Dolabı
  if (selectedOutfit) {
    final += `, wearing ${selectedOutfit}`;
  }

  // Prompt Optimizer
  const premiumModifiers = "shot on 35mm lens, cinematic lighting, 8k resolution, photorealistic, hyper-detailed, masterpiece, octane render, unreal engine 5";
  
  if (!final.includes("8k") && !final.includes("cinematic")) {
    final = `${final}, ${premiumModifiers}`;
  }

  return final;
}
