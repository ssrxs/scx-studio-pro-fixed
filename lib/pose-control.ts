/**
 * SCX Studio - Pose Control and Director Assistant Module
 * Bu modül, karakterin poz, duruş ve ifade kontrolünü yönetir.
 * AI Yönetmen ve Poz Asistanı özelliğinin teknik altyapısını sağlar.
 */

/**
 * Kafa Pozisyonu Tanımı
 * Yaw, Pitch, Roll açılarını derece cinsinden tutar.
 */
export interface HeadPosition {
  yaw: number;    // -30 to +30 degrees (sağa/sola dönüş)
  pitch: number;  // -20 to +20 degrees (yukarı/aşağı eğilme)
  roll: number;   // -15 to +15 degrees (yanlara eğilme)
}

/**
 * İfade Kontrolleri Tanımı
 * Karakterin yüz ifadelerini ve mikro-ifadelerini tanımlar.
 */
export interface ExpressionControls {
  baseExpression: 'happy' | 'sad' | 'surprised' | 'angry' | 'neutral' | 'confused';
  smileIntensity: number;      // 0 to 1 (gülümseme yoğunluğu)
  frownDepth: number;          // 0 to 1 (kaş çatma derinliği)
  eyeOpenness: number;         // 0 to 1 (göz açıklığı)
  eyeFocus: 'camera' | 'left' | 'right' | 'up' | 'down' | 'away';
  mouthOpenness: number;       // 0 to 1 (ağız açıklığı)
  eyeCrinkles: number;         // 0 to 1 (göz kırışıklıkları/yaşlılık belirtileri)
}

/**
 * Vücut Duruşu Tanımı
 * Omuz, omurga ve genel vücut pozisyonunu tanımlar.
 */
export interface BodyPosture {
  shoulderHeight: 'level' | 'left_high' | 'right_high';  // Omuz hizalaması
  shoulderRotation: number;    // -45 to +45 degrees (omuz rotasyonu)
  spinalCurvature: 'upright' | 'relaxed' | 'forward_lean' | 'backward_lean';
  handPosition: 'sides' | 'pockets' | 'crossed' | 'on_hips' | 'open' | 'pointing';
  fingerDetail: 'relaxed' | 'fist' | 'pointing' | 'peace_sign' | 'thumbs_up';
}

/**
 * Tam Poz Tanımı
 * Kafa, ifade ve vücut duruşunun tamamını içerir.
 */
export interface PoseProfile {
  id: string;
  name: string;
  description: string;
  category: 'portrait' | 'action' | 'lifestyle' | 'sitting' | 'standing' | 'custom';
  headPosition: HeadPosition;
  expression: ExpressionControls;
  posture: BodyPosture;
  createdAt: Date;
  isDefault: boolean;
}

/**
 * Poz Kütüphanesi - Önceden Tanımlanmış Pozlar
 */
export const POSE_LIBRARY: Record<string, PoseProfile> = {
  // Portre Pozları
  'portrait-direct': {
    id: 'portrait-direct',
    name: 'Doğrudan Bakış (Direct Gaze)',
    description: 'Kameraya doğrudan bakış yapan klasik portre pozı',
    category: 'portrait',
    headPosition: { yaw: 0, pitch: 0, roll: 0 },
    expression: {
      baseExpression: 'neutral',
      smileIntensity: 0.3,
      frownDepth: 0,
      eyeOpenness: 0.8,
      eyeFocus: 'camera',
      mouthOpenness: 0.1,
      eyeCrinkles: 0.1
    },
    posture: {
      shoulderHeight: 'level',
      shoulderRotation: 0,
      spinalCurvature: 'upright',
      handPosition: 'sides',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  'portrait-three-quarter': {
    id: 'portrait-three-quarter',
    name: '3/4 Açısı (Three-Quarter)',
    description: 'Klasik 3/4 açısından çekilen portre pozı',
    category: 'portrait',
    headPosition: { yaw: 20, pitch: -5, roll: 0 },
    expression: {
      baseExpression: 'neutral',
      smileIntensity: 0.4,
      frownDepth: 0,
      eyeOpenness: 0.85,
      eyeFocus: 'camera',
      mouthOpenness: 0.05,
      eyeCrinkles: 0.15
    },
    posture: {
      shoulderHeight: 'right_high',
      shoulderRotation: 15,
      spinalCurvature: 'relaxed',
      handPosition: 'sides',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  'portrait-profile': {
    id: 'portrait-profile',
    name: 'Profil (Profile)',
    description: 'Tam profil açısından çekilen portre pozı',
    category: 'portrait',
    headPosition: { yaw: 30, pitch: 0, roll: 0 },
    expression: {
      baseExpression: 'neutral',
      smileIntensity: 0.2,
      frownDepth: 0,
      eyeOpenness: 0.7,
      eyeFocus: 'away',
      mouthOpenness: 0,
      eyeCrinkles: 0.1
    },
    posture: {
      shoulderHeight: 'level',
      shoulderRotation: 30,
      spinalCurvature: 'upright',
      handPosition: 'sides',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  // Yaşam Tarzı Pozları
  'lifestyle-thinking': {
    id: 'lifestyle-thinking',
    name: 'Düşünceli (Thinking)',
    description: 'Düşünceli bir ifadeyle uzağa bakış',
    category: 'lifestyle',
    headPosition: { yaw: -15, pitch: 10, roll: 0 },
    expression: {
      baseExpression: 'confused',
      smileIntensity: 0,
      frownDepth: 0.3,
      eyeOpenness: 0.7,
      eyeFocus: 'away',
      mouthOpenness: 0.05,
      eyeCrinkles: 0.2
    },
    posture: {
      shoulderHeight: 'level',
      shoulderRotation: -10,
      spinalCurvature: 'relaxed',
      handPosition: 'on_hips',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  'lifestyle-confident': {
    id: 'lifestyle-confident',
    name: 'Özgüvenli (Confident)',
    description: 'Özgüvenli ve güçlü bir duruş',
    category: 'lifestyle',
    headPosition: { yaw: 0, pitch: -10, roll: 0 },
    expression: {
      baseExpression: 'happy',
      smileIntensity: 0.6,
      frownDepth: 0,
      eyeOpenness: 0.9,
      eyeFocus: 'camera',
      mouthOpenness: 0.2,
      eyeCrinkles: 0.3
    },
    posture: {
      shoulderHeight: 'level',
      shoulderRotation: 0,
      spinalCurvature: 'upright',
      handPosition: 'on_hips',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  // Oturma Pozları
  'sitting-relaxed': {
    id: 'sitting-relaxed',
    name: 'Oturmuş - Rahat (Sitting Relaxed)',
    description: 'Rahat bir şekilde oturmuş pozisyon',
    category: 'sitting',
    headPosition: { yaw: 10, pitch: 5, roll: 0 },
    expression: {
      baseExpression: 'neutral',
      smileIntensity: 0.3,
      frownDepth: 0,
      eyeOpenness: 0.8,
      eyeFocus: 'camera',
      mouthOpenness: 0.1,
      eyeCrinkles: 0.1
    },
    posture: {
      shoulderHeight: 'level',
      shoulderRotation: 5,
      spinalCurvature: 'relaxed',
      handPosition: 'sides',
      fingerDetail: 'relaxed'
    },
    createdAt: new Date(),
    isDefault: true
  },

  // Aksiyon Pozları
  'action-dynamic': {
    id: 'action-dynamic',
    name: 'Dinamik (Dynamic)',
    description: 'Hareket ve enerji içeren dinamik pozisyon',
    category: 'action',
    headPosition: { yaw: -25, pitch: -15, roll: 5 },
    expression: {
      baseExpression: 'happy',
      smileIntensity: 0.7,
      frownDepth: 0,
      eyeOpenness: 0.95,
      eyeFocus: 'camera',
      mouthOpenness: 0.3,
      eyeCrinkles: 0.4
    },
    posture: {
      shoulderHeight: 'left_high',
      shoulderRotation: -20,
      spinalCurvature: 'forward_lean',
      handPosition: 'open',
      fingerDetail: 'open'
    },
    createdAt: new Date(),
    isDefault: true
  }
};

/**
 * Poz Kütüphanesinden Poz Getir
 */
export function getPoseFromLibrary(poseId: string): PoseProfile | null {
  return POSE_LIBRARY[poseId] || null;
}

/**
 * Tüm Poz Kategorilerini Getir
 */
export function getPosesByCategory(category: string): PoseProfile[] {
  return Object.values(POSE_LIBRARY).filter(pose => pose.category === category);
}

/**
 * Kafa Pozisyonunu Prompt'a Dönüştür
 */
export function headPositionToPrompt(head: HeadPosition): string {
  let description = 'Head position: ';
  
  if (head.yaw > 15) description += 'looking to the right, ';
  else if (head.yaw < -15) description += 'looking to the left, ';
  else description += 'facing forward, ';

  if (head.pitch > 10) description += 'looking down, ';
  else if (head.pitch < -10) description += 'looking up, ';
  else description += 'level gaze, ';

  if (head.roll > 10) description += 'head tilted right';
  else if (head.roll < -10) description += 'head tilted left';
  else description += 'head straight';

  return description;
}

/**
 * İfade Kontrollerini Prompt'a Dönüştür
 */
export function expressionToPrompt(expression: ExpressionControls): string {
  let description = 'Expression: ';
  
  const expressionMap: Record<string, string> = {
    'happy': 'joyful and warm',
    'sad': 'melancholic and thoughtful',
    'surprised': 'surprised and engaged',
    'angry': 'intense and determined',
    'neutral': 'calm and composed',
    'confused': 'thoughtful and questioning'
  };

  description += expressionMap[expression.baseExpression] + '. ';

  if (expression.smileIntensity > 0.5) description += 'Genuine smile with visible teeth. ';
  else if (expression.smileIntensity > 0.2) description += 'Subtle smile. ';

  if (expression.eyeCrinkles > 0.3) description += 'Visible eye crinkles suggesting warmth. ';

  if (expression.eyeFocus === 'camera') description += 'Direct eye contact with camera. ';
  else if (expression.eyeFocus === 'away') description += 'Eyes looking away thoughtfully. ';

  return description;
}

/**
 * Vücut Duruşunu Prompt'a Dönüştür
 */
export function postureToPrompt(posture: BodyPosture): string {
  let description = 'Posture: ';

  const postureMap: Record<string, string> = {
    'upright': 'upright and professional',
    'relaxed': 'relaxed and comfortable',
    'forward_lean': 'leaning forward with engagement',
    'backward_lean': 'leaning back with confidence'
  };

  description += postureMap[posture.spinalCurvature] + '. ';

  if (posture.shoulderHeight === 'level') description += 'Shoulders level and balanced. ';
  else if (posture.shoulderHeight === 'left_high') description += 'Left shoulder slightly higher. ';
  else if (posture.shoulderHeight === 'right_high') description += 'Right shoulder slightly higher. ';

  return description;
}

/**
 * Tam Poz Profilini Prompt'a Dönüştür
 */
export function poseProfileToPrompt(pose: PoseProfile): string {
  const headPrompt = headPositionToPrompt(pose.headPosition);
  const expressionPrompt = expressionToPrompt(pose.expression);
  const posturePrompt = postureToPrompt(pose.posture);

  return `${headPrompt} ${expressionPrompt} ${posturePrompt}`;
}

/**
 * Kafa Pozisyonunu Doğrula
 */
export function validateHeadPosition(head: HeadPosition): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (head.yaw < -30 || head.yaw > 30) warnings.push('Yaw angle outside normal range (-30 to +30 degrees)');
  if (head.pitch < -20 || head.pitch > 20) warnings.push('Pitch angle outside normal range (-20 to +20 degrees)');
  if (head.roll < -15 || head.roll > 15) warnings.push('Roll angle outside normal range (-15 to +15 degrees)');

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * İfade Kontrollerini Doğrula
 */
export function validateExpressionControls(expression: ExpressionControls): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  const validateRange = (value: number, min: number, max: number, name: string) => {
    if (value < min || value > max) {
      warnings.push(`${name} outside valid range (${min} to ${max})`);
    }
  };

  validateRange(expression.smileIntensity, 0, 1, 'Smile intensity');
  validateRange(expression.frownDepth, 0, 1, 'Frown depth');
  validateRange(expression.eyeOpenness, 0, 1, 'Eye openness');
  validateRange(expression.mouthOpenness, 0, 1, 'Mouth openness');
  validateRange(expression.eyeCrinkles, 0, 1, 'Eye crinkles');

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Tam Poz Profilini Doğrula
 */
export function validatePoseProfile(pose: PoseProfile): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  const headValidation = validateHeadPosition(pose.headPosition);
  const expressionValidation = validateExpressionControls(pose.expression);

  warnings.push(...headValidation.warnings);
  warnings.push(...expressionValidation.warnings);

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Poz Profilini Kaydet (LocalStorage'a)
 */
export function savePoseProfile(pose: PoseProfile): void {
  const savedPoses = getSavedPoses();
  const existingIndex = savedPoses.findIndex(p => p.id === pose.id);

  if (existingIndex >= 0) {
    savedPoses[existingIndex] = pose;
  } else {
    savedPoses.push(pose);
  }

  localStorage.setItem('scx_saved_poses', JSON.stringify(savedPoses));
}

/**
 * Kaydedilmiş Poz Profillerini Getir
 */
export function getSavedPoses(): PoseProfile[] {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('scx_saved_poses');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Kaydedilmiş Poz Profilini Sil
 */
export function deleteSavedPose(poseId: string): void {
  const savedPoses = getSavedPoses();
  const filtered = savedPoses.filter(p => p.id !== poseId);
  localStorage.setItem('scx_saved_poses', JSON.stringify(filtered));
}

/**
 * İki Poz Profilini Karşılaştır
 */
export function comparePoseProfiles(pose1: PoseProfile, pose2: PoseProfile): { similarity: number; differences: string[] } {
  const differences: string[] = [];
  let matchingFields = 0;
  const totalFields = 9;

  if (pose1.headPosition.yaw === pose2.headPosition.yaw) matchingFields++;
  else differences.push(`Yaw: ${pose1.headPosition.yaw}° vs ${pose2.headPosition.yaw}°`);

  if (pose1.headPosition.pitch === pose2.headPosition.pitch) matchingFields++;
  else differences.push(`Pitch: ${pose1.headPosition.pitch}° vs ${pose2.headPosition.pitch}°`);

  if (pose1.headPosition.roll === pose2.headPosition.roll) matchingFields++;
  else differences.push(`Roll: ${pose1.headPosition.roll}° vs ${pose2.headPosition.roll}°`);

  if (pose1.expression.baseExpression === pose2.expression.baseExpression) matchingFields++;
  else differences.push(`Expression: ${pose1.expression.baseExpression} vs ${pose2.expression.baseExpression}`);

  if (pose1.expression.smileIntensity === pose2.expression.smileIntensity) matchingFields++;
  else differences.push(`Smile: ${pose1.expression.smileIntensity} vs ${pose2.expression.smileIntensity}`);

  if (pose1.posture.spinalCurvature === pose2.posture.spinalCurvature) matchingFields++;
  else differences.push(`Posture: ${pose1.posture.spinalCurvature} vs ${pose2.posture.spinalCurvature}`);

  if (pose1.posture.shoulderHeight === pose2.posture.shoulderHeight) matchingFields++;
  else differences.push(`Shoulders: ${pose1.posture.shoulderHeight} vs ${pose2.posture.shoulderHeight}`);

  if (pose1.posture.handPosition === pose2.posture.handPosition) matchingFields++;
  else differences.push(`Hands: ${pose1.posture.handPosition} vs ${pose2.posture.handPosition}`);

  if (pose1.posture.fingerDetail === pose2.posture.fingerDetail) matchingFields++;
  else differences.push(`Fingers: ${pose1.posture.fingerDetail} vs ${pose2.posture.fingerDetail}`);

  const similarity = (matchingFields / totalFields) * 100;

  return {
    similarity,
    differences
  };
}

/**
 * Poz Profilini Interpolate Et (İki Poz Arasında Geçiş)
 */
export function interpolatePoseProfiles(pose1: PoseProfile, pose2: PoseProfile, t: number): PoseProfile {
  // t değeri 0 ile 1 arasında olmalı (0 = pose1, 1 = pose2)
  const clampedT = Math.max(0, Math.min(1, t));

  return {
    ...pose1,
    id: `interpolated-${Date.now()}`,
    name: `Interpolated Pose (${Math.round(clampedT * 100)}%)`,
    headPosition: {
      yaw: pose1.headPosition.yaw + (pose2.headPosition.yaw - pose1.headPosition.yaw) * clampedT,
      pitch: pose1.headPosition.pitch + (pose2.headPosition.pitch - pose1.headPosition.pitch) * clampedT,
      roll: pose1.headPosition.roll + (pose2.headPosition.roll - pose1.headPosition.roll) * clampedT
    },
    expression: {
      ...pose1.expression,
      smileIntensity: pose1.expression.smileIntensity + (pose2.expression.smileIntensity - pose1.expression.smileIntensity) * clampedT,
      frownDepth: pose1.expression.frownDepth + (pose2.expression.frownDepth - pose1.expression.frownDepth) * clampedT,
      eyeOpenness: pose1.expression.eyeOpenness + (pose2.expression.eyeOpenness - pose1.expression.eyeOpenness) * clampedT,
      mouthOpenness: pose1.expression.mouthOpenness + (pose2.expression.mouthOpenness - pose1.expression.mouthOpenness) * clampedT,
      eyeCrinkles: pose1.expression.eyeCrinkles + (pose2.expression.eyeCrinkles - pose1.expression.eyeCrinkles) * clampedT
    }
  };
}
