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
7. SUBSURFACE SCATTERING: Light penetration through ears and thin skin areas, natural glow effect
8. CAUSTICS & REFLECTIONS: Water/glass reflections, caustic patterns, specular surface interactions
  `,

  // Anatomik kontrol mekanizmaları - Geliştirilmiş
  anatomicalControl: `
### ANATOMICAL PRECISION CONTROLS ###
1. PROPORTIONS: Face width to height ratio (1:1.3 ideal), eye spacing (one eye width apart), nose width, lip fullness
2. SYMMETRY: Bilateral symmetry assessment (95-98% natural asymmetry), natural asymmetries preservation
3. MUSCULATURE: Facial muscle definition (zygomaticus, masseter, platysma), jaw muscle tension, neck muscle visibility
4. BONE STRUCTURE: Cheekbone height, jaw angle (90-110 degrees), forehead slope, chin projection (8-12mm)
5. SOFT TISSUE: Skin thickness appearance (varies by age/ethnicity), fat distribution, natural sagging patterns
6. VASCULAR PATTERNS: Visible veins (temporal, jugular), blood flow indicators, natural color variation
7. DENTAL ALIGNMENT: Tooth positioning, bite alignment, gum visibility, natural wear patterns
8. MICRO-EXPRESSIONS: Subtle muscle movements, eye crinkles (crow's feet), nasolabial fold depth
  `,

  // Stil tutarlılığı kuralları
  styleConsistency: `
### STYLE CONSISTENCY RULES ###
1. ARTISTIC DIRECTION: Photorealism vs stylization level, color grading approach
2. TEXTURE QUALITY: Surface detail level, material authenticity, weathering patterns
3. COMPOSITION RULES: Framing consistency, camera angle, depth of field settings
4. COLOR PALETTE: Dominant colors, accent colors, color harmony rules
5. MOOD & ATMOSPHERE: Emotional tone, energy level, narrative context
  `,

  // Yüz Tanıma ve Biometrik Tutarlılık
  biometricConsistency: `
### BIOMETRIC CONSISTENCY RULES (Yüz Tanıma Uyumluluğu) ###
1. FACIAL LANDMARKS: 68-point facial landmark consistency (eyes, nose, mouth, jaw, cheeks)
2. IRIS RECOGNITION: Iris pattern, pupil dilation, iris color consistency across lighting conditions
3. FACE GEOMETRY: Interocular distance, nose-to-mouth distance, face width, chin prominence
4. SKIN TEXTURE MAPPING: Pore patterns, wrinkle directions, scar/mark positions, birthmark locations
5. FEATURE STABILITY: Consistency of distinctive features (moles, dimples, asymmetries) across images
  `,

  // Renk Tutarlılığı ve Ton Eşleştirme
  colorConsistency: `
### COLOR CONSISTENCY & TONE MATCHING ###
1. SKIN UNDERTONE: Warm (golden/peachy), cool (pink/red), neutral (balanced) - maintain across all images
2. HAIR COLOR CONSISTENCY: Base color, highlight color, shadow color - RGB values within 10-15 range
3. EYE COLOR STABILITY: Iris color, sclera color, pupil response to lighting conditions
4. LIP COLOR HARMONY: Natural lip tone relative to skin tone, saturation consistency
5. CLOTHING COLOR FIDELITY: Fabric color matching, material sheen consistency, dye variation patterns
  `,

  // Hareket ve Postür Tutarlılığı
  postureConsistency: `
### POSTURE & MOVEMENT CONSISTENCY ###
1. HEAD POSITION: Yaw angle (-30 to +30 degrees), pitch angle (-20 to +20 degrees), roll angle (-15 to +15 degrees)
2. SHOULDER ALIGNMENT: Shoulder height difference (natural asymmetry), shoulder rotation
3. SPINE CURVATURE: Natural S-curve preservation, posture type (upright, relaxed, forward)
4. HAND POSITIONING: Hand size consistency, finger length ratios, nail appearance
5. BODY PROPORTIONS: Head-to-body ratio (1:7-1:8), arm length, leg length consistency
  `,

  // Yaş Progresyon Kuralları
  ageProgression: `
### AGE PROGRESSION RULES ###
1. SKIN ELASTICITY: Decreases with age - fine lines at 30s, deeper wrinkles at 50s+
2. HAIR CHANGES: Grey percentage increases (10% per decade after 30), texture changes
3. FACIAL VOLUME: Decreases with age - cheek hollowing, jawline softening
4. EYE CHANGES: Eyelid drooping (ptosis), crow's feet depth, eye opening size
5. BONE STRUCTURE: Chin projection decreases, nose appears larger (cartilage growth)
6. SKIN TEXTURE: Roughness increases, pigmentation changes, age spots appear
  `,

  // Etnik Özellikler Tutarlılığı
  ethnicFeatureConsistency: `
### ETHNIC FEATURE CONSISTENCY ###
1. FACIAL STRUCTURE VARIATIONS: Nose bridge height, cheekbone prominence, jaw width (varies by ethnicity)
2. EYE SHAPE VARIATIONS: Epicanthic fold presence, eye opening angle, eyelid characteristics
3. HAIR CHARACTERISTICS: Natural hair texture, color range, growth patterns (varies by ethnicity)
4. SKIN TONE RANGES: Natural color variation within ethnic groups, undertone consistency
5. FEATURE PROPORTIONS: Lip fullness, nose width, face shape - maintain ethnic authenticity
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

  // Biometrik Tutarlılık (Varsa)
  const biometricBlock = dna.biometricMarkers ? `Biometric markers: ${dna.biometricMarkers}.` : "";

  // Kuralları ve promptu harmanla
  // Önemli: DNA en başta olmalı (Model ağırlığı için)
  return `${dnaBlock} ${styleBlock} ${environmentBlock} ${lightingBlock} ${biometricBlock} ${userPrompt}. Ensure cinematic photorealism, 8k resolution, highly detailed textures, anatomically accurate proportions, consistent lighting interaction, facial landmark stability.`;
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
export function enrichPromptWithRules(basePrompt: string, ruleType: 'character' | 'flux' | 'anatomical' | 'style' | 'biometric' | 'color' | 'posture' | 'age' | 'ethnic' = 'character'): string {
  const ruleMap: Record<string, string> = {
    'character': 'characterConsistency',
    'flux': 'fluxOptimization',
    'anatomical': 'anatomicalControl',
    'style': 'styleConsistency',
    'biometric': 'biometricConsistency',
    'color': 'colorConsistency',
    'posture': 'postureConsistency',
    'age': 'ageProgression',
    'ethnic': 'ethnicFeatureConsistency'
  };

  const selectedRule = ruleMap[ruleType] || 'characterConsistency';
  const rules = GLOBAL_AI_RULES[selectedRule as keyof typeof GLOBAL_AI_RULES];
  
  return `${rules}\n\n${basePrompt}`;
}

/**
 * Çoklu DNA öğelerini birleştir (Karakter + Çevre + Işık + Biometrik)
 */
export function mergeDNAElements(characterDNA: any, environmentDNA?: any, lightingDNA?: any, biometricDNA?: any): any {
  return {
    ...characterDNA,
    environment: environmentDNA?.description || null,
    lighting: lightingDNA?.description || null,
    biometricMarkers: biometricDNA?.markers || null,
    environmentDNA,
    lightingDNA,
    biometricDNA
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

/**
 * Biometrik Tutarlılık Doğrulama - Yüz Tanıma Uyumluluğu
 */
export function validateBiometricConsistency(dna: any): { isConsistent: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Yüz ölçüleri kontrol
  if (dna.faceWidth && dna.faceHeight) {
    const ratio = dna.faceWidth / dna.faceHeight;
    if (ratio < 0.7 || ratio > 0.85) {
      warnings.push('Face width-to-height ratio outside normal range (0.7-0.85)');
    }
  }

  // Göz arası mesafe kontrol
  if (dna.interocularDistance && dna.faceWidth) {
    const ratio = dna.interocularDistance / dna.faceWidth;
    if (ratio < 0.3 || ratio > 0.4) {
      warnings.push('Interocular distance outside normal range (30-40% of face width)');
    }
  }

  // Cilt tonu tutarlılığı
  if (dna.skinTone && !['fair', 'light', 'medium', 'olive', 'tan', 'deep', 'dark'].includes(dna.skinTone.toLowerCase())) {
    warnings.push('Skin tone not in standard classification');
  }

  return {
    isConsistent: warnings.length === 0,
    warnings
  };
}

/**
 * Renk Tutarlılığı Doğrulama - RGB Değerleri Kontrol
 */
export function validateColorConsistency(colorData: any): { isConsistent: boolean; colorDifferences: Record<string, number> } {
  const colorDifferences: Record<string, number> = {};
  
  if (colorData.skinToneRGB && colorData.skinToneRGB.length > 1) {
    const rgbValues = colorData.skinToneRGB;
    const maxDiff = Math.max(
      Math.abs(rgbValues[0][0] - rgbValues[1][0]),
      Math.abs(rgbValues[0][1] - rgbValues[1][1]),
      Math.abs(rgbValues[0][2] - rgbValues[1][2])
    );
    colorDifferences['skinTone'] = maxDiff;
  }

  if (colorData.hairColorRGB && colorData.hairColorRGB.length > 1) {
    const rgbValues = colorData.hairColorRGB;
    const maxDiff = Math.max(
      Math.abs(rgbValues[0][0] - rgbValues[1][0]),
      Math.abs(rgbValues[0][1] - rgbValues[1][1]),
      Math.abs(rgbValues[0][2] - rgbValues[1][2])
    );
    colorDifferences['hairColor'] = maxDiff;
  }

  const isConsistent = Object.values(colorDifferences).every(diff => diff <= 15);
  return { isConsistent, colorDifferences };
}

/**
 * Yaş Progresyon Tahmini - Yaşa Göre Özellik Ayarlaması
 */
export function adjustForAgeProgression(dna: any, targetAge: number): any {
  const currentAge = dna.age || 25;
  const ageDifference = targetAge - currentAge;

  if (ageDifference === 0) return dna;

  const adjustedDNA = { ...dna };

  // Cilt Elastikiyeti Ayarlaması
  if (ageDifference > 0) {
    adjustedDNA.skinElasticity = Math.max(0, (dna.skinElasticity || 0.8) - (ageDifference * 0.02));
    adjustedDNA.wrinkleDepth = (dna.wrinkleDepth || 0) + (ageDifference * 0.05);
  }

  // Gri Saç Yüzdesi Ayarlaması
  if (ageDifference > 0) {
    adjustedDNA.greyHairPercentage = Math.min(100, (dna.greyHairPercentage || 0) + (ageDifference * 2));
  }

  // Yüz Hacmi Ayarlaması
  if (ageDifference > 0) {
    adjustedDNA.cheekVolume = Math.max(0, (dna.cheekVolume || 1) - (ageDifference * 0.03));
  }

  return adjustedDNA;
}

/**
 * Etnik Özellikler Doğrulama
 */
export function validateEthnicFeatures(dna: any): { isValid: boolean; suggestions: string[] } {
  const suggestions: string[] = [];
  const validEthnicities = ['East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'African', 'European', 'Latin American', 'Mixed'];

  if (dna.ethnicity && !validEthnicities.includes(dna.ethnicity)) {
    suggestions.push(`Ethnicity "${dna.ethnicity}" not in standard classification`);
  }

  // Özellik-Etnik Uyumluluğu Kontrol
  if (dna.ethnicity === 'East Asian' && dna.epicanthicFold !== true) {
    suggestions.push('East Asian features typically include epicanthic fold');
  }

  if (dna.ethnicity === 'African' && dna.lipFullness && dna.lipFullness < 0.6) {
    suggestions.push('African features typically include fuller lips');
  }

  return {
    isValid: suggestions.length === 0,
    suggestions
  };
}
