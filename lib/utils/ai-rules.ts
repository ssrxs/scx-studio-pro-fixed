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
    let dnaString = `${age} years old, ${skinTone} skin tone, ${bodyType} body, ${hairStyle} hair style`;
    
    if (facialFeatures) {
      try {
        const features = typeof facialFeatures === 'string' ? JSON.parse(facialFeatures) : facialFeatures;
        const featureStrings = Object.entries(features)
          .filter(([_, v]) => v && v !== 'natural' && v !== 'none' && v !== 'clean')
          .map(([k, v]) => `${v} ${k.replace(/ID|Shape|Color|Density|Length/g, '')}`);
        
        if (featureStrings.length > 0) {
          dnaString += `, with ${featureStrings.join(', ')}`;
        }
      } catch (e) {
        dnaString += `, ${facialFeatures}`;
      }
    }
    
    final = final.replace(/\[CHARACTER_DNA\]/g, dnaString);
    // If [CHARACTER_DNA] tag is not in the prompt, append it for better consistency
    if (!final.includes(dnaString)) {
      final = `${dnaString}, ${final}`;
    }
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
