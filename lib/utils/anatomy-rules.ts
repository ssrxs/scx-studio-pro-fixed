/**
 * SCX Studio - Anatomical Constants & Physics Limits
 * İnsan anatomisi ve fizik kuralları çerçevesinde AI üretim kısıtlamaları.
 */

export const ANATOMY_LIMITS = {
  head: {
    yaw: { min: -80, max: 80, unit: 'degrees', description: 'Sağa/Sola dönüş sınırı' },
    pitch: { min: -70, max: 70, unit: 'degrees', description: 'Yukarı/Aşağı bakış sınırı' },
    roll: { min: -45, max: 45, unit: 'degrees', description: 'Yana yatırma sınırı' }
  },
  eyes: {
    horizontal: { min: -50, max: 50, unit: 'degrees' },
    vertical: { min: -48, max: 42, unit: 'degrees' }
  },
  proportions: {
    head_to_body_ratio: { heroic: 8, realistic: 7.5 },
    shoulder_width_heads: 2,
    groin_center_ratio: 0.5 
  }
};

/**
 * Monk Cilt Tonu Ölçeği (MST) - 2026 AI Standardı
 */
export const SKIN_TONES = [
  { id: 'A', hex: '#f6ede4', label: 'Luminous Pale' },
  { id: 'B', hex: '#f3e7db', label: 'Fair White' },
  { id: 'C', hex: '#f7ead0', label: 'Light Sand' },
  { id: 'D', hex: '#eadaba', label: 'Golden Fair' },
  { id: 'E', hex: '#d7bd96', label: 'Medium Tan' },
  { id: 'F', hex: '#a07e56', label: 'Deep Olive' },
  { id: 'G', hex: '#825c44', label: 'Soft Brown' },
  { id: 'H', hex: '#604134', label: 'Umbra Brown' },
  { id: 'I', hex: '#3a312a', label: 'Dark Ebony' },
  { id: 'J', hex: '#292420', label: 'Midnight Black' }
];

/**
 * Dünya Saç Tipleri ve Yapıları
 */
export const HAIR_TYPES = [
  { id: '1A', label: 'Düz (Fine)', desc: 'Asya/Avrupa tipi, parlak ve sert.' },
  { id: '2B', label: 'Dalgalı (Medium)', desc: 'Akdeniz/Avrupa tipi, doğal hacim.' },
  { id: '3C', label: 'Kıvırcık (Curly)', desc: 'Yassı oval folikül, belirgin bukleler.' },
  { id: '4C', label: 'Sıkı Bukle (Coily)', desc: 'Afrika tipi, yoğun doku ve mat görünüm.' }
];

export const BIOMETRIC_STANDARDS = {
  men: {
    height: { min: 160, max: 210, default: 180 },
    weight: { min: 55, max: 130, default: 80 },
    skin: { thickness: "+25%", pores: "large", sebum: "high", collagen: "high" }
  },
  women: {
    height: { min: 150, max: 195, default: 168 },
    weight: { min: 45, max: 110, default: 60 },
    skin: { thickness: "standard", pores: "fine", sebum: "normal", sss: "high" }
  }
};

export const FACIAL_ANCHORS = [
  "interpupillary distance",
  "nose bridge structure",
  "jawline definition",
  "ear lobe attachment",
  "eye shape and eyelid fold"
];
