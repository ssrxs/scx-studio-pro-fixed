/**
 * SCX Studio Pro - AI Rules Engine v4.0
 * Prompt optimization ve karakter DNA enjeksiyonu
 */

import type { CharacterDNA, MixerSettings, FacialFeatures } from '@/types/project';

/**
 * Karakterin DNA'sını prompt'a enjekte ederek tutarlılığı sağlar
 */
function buildCharacterDNAString(characterDNA: CharacterDNA): string {
  let dnaString = `${characterDNA.age} years old, ${characterDNA.gender} person`;
  
  if (characterDNA.skinTone) {
    dnaString += `, ${characterDNA.skinTone} skin tone`;
  }
  
  if (characterDNA.bodyType) {
    dnaString += `, ${characterDNA.bodyType} build`;
  }
  
  if (characterDNA.height) {
    dnaString += `, ${characterDNA.height}cm tall`;
  }

  // Parse facial features if available
  if (characterDNA.facialFeatures) {
    try {
      const features: FacialFeatures = typeof characterDNA.facialFeatures === 'string' 
        ? JSON.parse(characterDNA.facialFeatures) 
        : characterDNA.facialFeatures;

      const featureDescriptions: string[] = [];
      
      // Add non-default features
      if (features.eyeShape && features.eyeShape !== 'almond') {
        featureDescriptions.push(`${features.eyeShape} eyes`);
      }
      
      if (features.eyeColor && features.eyeColor !== 'obsidian') {
        featureDescriptions.push(`${features.eyeColor} colored eyes`);
      }
      
      if (features.noseShape && features.noseShape !== 'natural') {
        featureDescriptions.push(`${features.noseShape} nose`);
      }
      
      if (features.lipShape && features.lipShape !== 'natural') {
        featureDescriptions.push(`${features.lipShape} lips`);
      }

      // Beard details for men
      if (characterDNA.gender === 'men') {
        if (features.beardDensity && features.beardDensity !== 'none') {
          featureDescriptions.push(`${features.beardDensity} beard`);
        }
        if (features.beardLength && features.beardLength !== 'clean') {
          featureDescriptions.push(`${features.beardLength} facial hair`);
        }
      }

      if (featureDescriptions.length > 0) {
        dnaString += `, with ${featureDescriptions.join(', ')}`;
      }
    } catch (e) {
      console.error("Failed to parse facial features:", e);
    }
  }

  return dnaString;
}

/**
 * Mixer ayarlarından prompt değişkenleri oluşturur
 */
function buildMixerVariables(mixerSettings: MixerSettings): Record<string, string> {
  return {
    SUBJECT: mixerSettings.subject || 'a person',
    HAIR_STYLE: mixerSettings.hairStyle || 'natural hair',
    HAIR_COLOR: mixerSettings.hairColor || 'original color',
    OUTFIT: mixerSettings.outfit || 'casual clothes',
    POSE: mixerSettings.pose || 'standing',
    BACKGROUND: mixerSettings.background || 'simple background'
  };
}

/**
 * Ana prompt builder fonksiyonu
 * @param basePrompt - Kullanıcı tarafından yazılan veya şablondan gelen prompt
 * @param mixerSettings - Mixer ayarları (subject, outfit, vb.)
 * @param characterDNA - Karakter DNA'sı (opsiyonel)
 * @param selectedOutfit - Seçilen kıyafet (opsiyonel)
 * @returns Optimize edilmiş final prompt
 */
export function buildFinalPrompt(
  basePrompt: string, 
  mixerSettings: MixerSettings = {},
  characterDNA?: CharacterDNA | null,
  selectedOutfit?: string
): string {
  let final = basePrompt;

  // Step 1: Mixer ayarlarını uygula
  const mixerVars = buildMixerVariables(mixerSettings);
  Object.entries(mixerVars).forEach(([key, val]) => {
    // Support both [{KEY}] and [KEY] formats
    final = final.replace(new RegExp(`\\[\\{${key}\\}\\]`, 'g'), val);
    final = final.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
  });

  // Step 2: Karakter DNA'sını enjekte et
  if (characterDNA) {
    const dnaString = buildCharacterDNAString(characterDNA);
    
    // If there's a [CHARACTER_DNA] placeholder, replace it
    if (final.includes('[CHARACTER_DNA]')) {
      final = final.replace(/\[CHARACTER_DNA\]/g, dnaString);
    } else {
      // Otherwise, prepend DNA to the prompt for consistency
      final = `${dnaString}, ${final}`;
    }
  }

  // Step 3: Seçilen kıyafeti ekle
  if (selectedOutfit) {
    if (!final.toLowerCase().includes('wearing')) {
      final += `, wearing ${selectedOutfit}`;
    }
  }

  // Step 4: Kalite ve stil modifikatörleri ekle
  const premiumModifiers = "shot on 35mm lens, cinematic lighting, 8k resolution, photorealistic, hyper-detailed, masterpiece, octane render, unreal engine 5";
  
  // Only add premium modifiers if not already present
  if (!final.includes("8k") && !final.includes("cinematic") && !final.includes("masterpiece")) {
    final = `${final}, ${premiumModifiers}`;
  }

  // Step 5: Temizlik ve normalizasyon
  // Remove multiple spaces
  final = final.replace(/\s+/g, ' ').trim();
  
  // Ensure proper punctuation
  if (!final.endsWith('.') && !final.endsWith(',')) {
    final += '.';
  }

  return final;
}

/**
 * Prompt şablonundan mixer ayarlarını çıkarır
 */
export function extractMixerSettingsFromTemplate(template: string, defaults?: string): MixerSettings {
  const settings: MixerSettings = {};
  
  try {
    if (defaults) {
      const defaultsObj = typeof defaults === 'string' ? JSON.parse(defaults) : defaults;
      settings.subject = defaultsObj.SUBJECT || 'a person';
      settings.hairStyle = defaultsObj.HAIR_STYLE || 'natural';
      settings.hairColor = defaultsObj.HAIR_COLOR || 'original';
      settings.outfit = defaultsObj.OUTFIT || 'casual clothes';
      settings.pose = defaultsObj.POSE || 'standing';
      settings.background = defaultsObj.BACKGROUND || 'simple background';
    }
  } catch (e) {
    console.error("Failed to extract mixer settings:", e);
  }

  return settings;
}

/**
 * Prompt'un karakter DNA'sı için uygun olup olmadığını kontrol eder
 */
export function isPromptSuitableForCharacterDNA(prompt: string): boolean {
  const unsuitableKeywords = [
    'random person',
    'anyone',
    'generic',
    'no specific',
    'unknown character'
  ];

  const lowerPrompt = prompt.toLowerCase();
  return !unsuitableKeywords.some(keyword => lowerPrompt.includes(keyword));
}

/**
 * Prompt'un NSFW içeriğini kontrol eder
 */
export function detectNSFWContent(prompt: string): boolean {
  const nsfwKeywords = [
    'nude',
    'naked',
    'explicit',
    'adult',
    'sexual',
    'erotic'
  ];

  const lowerPrompt = prompt.toLowerCase();
  return nsfwKeywords.some(keyword => lowerPrompt.includes(keyword));
}
