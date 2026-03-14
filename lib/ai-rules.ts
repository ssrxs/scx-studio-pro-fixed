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
  `,

  // Karakter DNA kuralları - Yüz ve fiziksel özellikler
  characterDNA: `
### CHARACTER DNA RULES (Yüz Tutarlılığı) ###
1. FACIAL STRUCTURE: Jawline definition, cheekbone prominence, forehead shape, nose bridge angle
2. EYE CHARACTERISTICS: Eye shape (almond, round, hooded), iris color depth, pupil size, eyelid fold
3. SKIN PROPERTIES: Skin tone (with undertone), texture (smooth/textured), visible pores, freckles/marks
4. HAIR DETAILS: Hair color (base + highlights), texture (straight/wavy/curly), volume, length, growth pattern
5. EXPRESSION BASELINE: Resting facial expression, micro-expressions, smile type, eye crinkles
6. AGE MARKERS: Fine lines, skin elasticity, age spots, grey hair percentage (if applicable)
  `,

  // Çevre DNA kuralları - Ortam tutarlılığı
  environmentDNA: `
### ENVIRONMENT DNA RULES (Ortam Tutarlılığı) ###
1. LIGHTING SETUP: Light source position (key, fill, back), color temperature (warm/cool), intensity ratio
2. SHADOW PATTERNS: Shadow direction, softness (hard/diffused), color cast, falloff
3. BACKGROUND CONSISTENCY: Location type, depth of field, background blur amount, color palette
4. ATMOSPHERIC CONDITIONS: Fog/haze presence, dust particles, moisture level, time of day indicators
5. MATERIAL INTERACTIONS: How light reflects off skin, hair, clothing, and surroundings
  `,

  // Işık DNA kuralları - Aydınlatma tutarlılığı
  lightingDNA: `
### LIGHTING DNA RULES (Işık Tutarlılığı) ###
1. COLOR TEMPERATURE: Kelvin value (2700K warm, 5600K daylight, 6500K cool), color cast consistency
2. CONTRAST RATIO: Highlight to shadow ratio, mid-tone distribution, dynamic range
3. SPECULAR HIGHLIGHTS: Brightness, size, position on facial features, color (white/warm/cool)
4. SHADOW FILL: Fill light intensity, color, direction, softness level
5. RIM LIGHTING: Rim light presence, color, intensity, effect on hair and face edges
6. GLOBAL ILLUMINATION: Ambient light level, bounce light from surroundings, overall scene brightness
  `,

  // Anatomik kontrol mekanizmaları
  anatomicalControl: `
### ANATOMICAL PRECISION CONTROLS ###
1. PROPORTIONS: Face width to height ratio, eye spacing, nose width, lip fullness
2. SYMMETRY: Bilateral symmetry assessment, natural asymmetries preservation
3. MUSCULATURE: Facial muscle definition, jaw muscle tension, neck muscle visibility
4. BONE STRUCTURE: Cheekbone height, jaw angle, forehead slope, chin projection
5. SOFT TISSUE: Skin thickness appearance, fat distribution, natural sagging patterns
6. VASCULAR PATTERNS: Visible veins, blood flow indicators, natural color variation
  `,

  // Stil tutarlılığı kuralları
  styleConsistency: `
### STYLE CONSISTENCY RULES ###
1. ARTISTIC DIRECTION: Photorealism vs stylization level, color grading approach
2. TEXTURE QUALITY: Surface detail level, material authenticity, weathering patterns
3. COMPOSITION RULES: Framing consistency, camera angle, depth of field settings
4. COLOR PALETTE: Dominant colors, accent colors, color harmony rules
5. MOOD & ATMOSPHERE: Emotional tone, energy level, narrative context
  `
};

/**
 * Karakter DNA'sını ve kullanıcı promptunu birleştirerek kusursuz bir komut oluşturur.
 */
export function buildFinalPrompt(userPrompt: string, dna: any) {
  // Eğer DNA verisi yoksa sadece promptu döndür
  if (!dna) return userPrompt;

  // Karakter DNA Bloğu (NotebookLM Formülü) - Detaylı
  const facialFeatures = dna.facialFeatures || 'distinctive facial features';
  const dnaBlock = `A ${dna.age || ''} ${dna.skinTone || ''} ${dna.gender || ''} with ${dna.hairStyle || ''}, ${facialFeatures}, ${dna.bodyType || ''}.`;
  
  // İmza Kıyafet ve Stil (Varsa)
  const styleBlock = dna.signatureOutfit ? `Wearing ${dna.signatureOutfit}.` : "";

  // Çevre DNA (Varsa)
  const environmentBlock = dna.environment ? `Environment: ${dna.environment}.` : "";

  // Işık DNA (Varsa)
  const lightingBlock = dna.lighting ? `Lighting: ${dna.lighting}.` : "";

  // Kuralları ve promptu harmanla
  // Önemli: DNA en başta olmalı (Model ağırlığı için)
  return `${dnaBlock} ${styleBlock} ${environmentBlock} ${lightingBlock} ${userPrompt}. Ensure cinematic photorealism, 8k resolution, highly detailed textures, anatomically accurate proportions, consistent lighting interaction.`;
}

/**
 * Karakter DNA'sını doğrula ve eksik alanları tespit et
 */
export function validateCharacterDNA(dna: any): { isValid: boolean; missingFields: string[] } {
  const requiredFields = ['age', 'gender', 'skinTone', 'hairStyle', 'facialFeatures', 'bodyType'];
  const missingFields = requiredFields.filter(field => !dna[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Prompt'u AI kurallarıyla zenginleştir
 */
export function enrichPromptWithRules(basePrompt: string, ruleType: 'character' | 'flux' | 'anatomical' | 'style' = 'character'): string {
  const rules = GLOBAL_AI_RULES[ruleType === 'character' ? 'characterConsistency' : 
                               ruleType === 'flux' ? 'fluxOptimization' :
                               ruleType === 'anatomical' ? 'anatomicalControl' : 'styleConsistency'];
  
  return `${rules}\n\n${basePrompt}`;
}

/**
 * Çoklu DNA öğelerini birleştir (Karakter + Çevre + Işık)
 */
export function mergeDNAElements(characterDNA: any, environmentDNA?: any, lightingDNA?: any): any {
  return {
    ...characterDNA,
    environment: environmentDNA?.description || null,
    lighting: lightingDNA?.description || null,
    environmentDNA,
    lightingDNA
  };
}

/**
 * Stil tutarlılığı için prompt şablonu oluştur
 */
export function createStyleConsistencyTemplate(styleProfile: any): string {
  const {
    artisticDirection = 'photorealism',
    textureQuality = 'highly detailed',
    colorPalette = 'natural',
    mood = 'neutral',
    composition = 'centered'
  } = styleProfile;

  return `
Artistic Direction: ${artisticDirection}
Texture Quality: ${textureQuality}
Color Palette: ${colorPalette}
Mood: ${mood}
Composition: ${composition}
  `.trim();
}
