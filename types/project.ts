/**
 * SCX Studio Pro - Comprehensive Type Definitions
 * Tüm projedeki tip tanımlamalarının merkezi kaynağı
 */

// ─── CHARACTER DNA TYPES ───────────────────────────────────────────────────

export interface FacialFeatures {
  eyeShape: string;
  eyeColor: string;
  noseShape: string;
  lipShape: string;
  beardDensity?: string;
  beardLength?: string;
  hairTypeID: string;
  hairColorID: string;
  teethType?: string;
  earLobe?: string;
  skinCondition?: string;
  agingSigns?: string;
}

export interface CharacterDNA {
  id: string;
  userId: string;
  name: string;
  isMainCharacter: boolean;
  age: string;
  gender: 'men' | 'women';
  skinTone: string;
  bodyType: string;
  height: string;
  weight: string;
  hairStyle: string;
  facialFeatures: string; // JSON stringified FacialFeatures
  faceImages: string; // JSON stringified string[]
  poseReference?: string;
  view360Image?: string;
  noBgImage?: string;
  signatureOutfit?: string;
  expressions?: string; // JSON string
  storedOutfits?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterDNAInput {
  id?: string;
  name: string;
  age: string;
  gender: 'men' | 'women';
  skinToneID: string;
  bodyType: string;
  height: string;
  weight: string;
  hairTypeID: string;
  hairColorID: string;
  hairStyleID: string;
  eyeShape: string;
  eyeColor: string;
  noseShape: string;
  lipShape: string;
  beardDensity: string;
  beardLength: string;
  teethType: string;
  earLobe: string;
  skinCondition: string;
  faceImages: string[];
  fullBodyImage: string;
  view360Image: string;
  noBgImage: string;
  isMainCharacter: boolean;
}

// ─── GENERATION TYPES ──────────────────────────────────────────────────────

export interface GenerationRequest {
  prompt: string;
  characterId?: string;
  useMyFace?: boolean;
  tempFaceImage?: string;
  mixerSettings?: Record<string, string>;
  quality?: 'standard' | 'high';
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  id?: string;
  engine?: string;
  hasFaceInjection?: boolean;
  error?: string;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  promptUsed: string;
  imageUrl: string;
  engineUsed: string;
  mixerSettings?: string;
  albumId?: string;
  isFavorite: boolean;
  tags?: string;
  createdAt: Date;
}

// ─── PROMPT TYPES ─────────────────────────────────────────────────────────

export interface PromptTemplate {
  id: number;
  collection: string;
  originalPrompt: string;
  template: string;
  defaults?: string;
  explanation?: string;
  imageUrl?: string;
  localPath?: string;
  isRefined: boolean;
  isNSFW: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptMixerState {
  subject: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  pose: string;
  background: string;
  template: string;
  useMyFace: boolean;
  tempFaceImage: string | null;
}

// ─── API RESPONSE TYPES ────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StudioApiResponse {
  success?: boolean;
  character?: CharacterDNA;
  characters?: CharacterDNA[];
  error?: string;
}

export interface CalibrateApiResponse {
  success: boolean;
  results?: Array<{
    type: string;
    url: string;
  }>;
  error?: string;
}

// ─── USER TYPES ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  isAdult: boolean;
  role: 'USER' | 'ADMIN';
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── FEEDBACK TYPES ────────────────────────────────────────────────────────

export interface Feedback {
  id: string;
  userId: string;
  type: 'SUGGESTION' | 'BUG' | 'COMPLAINT';
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

// ─── ALBUM TYPES ───────────────────────────────────────────────────────────

export interface Album {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: GeneratedImage[];
}

// ─── MIXER SETTINGS TYPES ──────────────────────────────────────────────────

export interface MixerSettings {
  subject?: string;
  hairStyle?: string;
  hairColor?: string;
  outfit?: string;
  pose?: string;
  background?: string;
  [key: string]: string | undefined;
}

// ─── COMPONENT PROPS TYPES ────────────────────────────────────────────────

export interface OnboardingDNAProps {
  onComplete: (character: CharacterDNA) => void;
}

export interface StudioClientProps {
  user: User;
  initialCharacters: CharacterDNA[];
  recentImages: GeneratedImage[];
}

export interface StudioPageProps {
  // Server component props if needed
}

// ─── UTILITY TYPES ────────────────────────────────────────────────────────

export type GenerationProvider = 'fal_ai' | 'huggingface' | 'pollinations' | 'together' | 'segmind';
export type EngineType = 'flux' | 'stable-diffusion' | 'gemini' | 'dalle';
export type Gender = 'men' | 'women';
export type Quality = 'standard' | 'high';
