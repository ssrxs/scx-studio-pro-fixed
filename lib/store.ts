import { create } from 'zustand';

interface MixerState {
  subject: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  pose: string;
  background: string;
  template: string;
  useMyFace: boolean;
  tempFaceImage: string | null; // Base64 veya URL
  
  // Actions
  setField: (field: keyof MixerState, value: any) => void;
  initializeFromPrompt: (template: string, defaults: any) => void;
  getFinalPrompt: () => string;
}

export const useMixerStore = create<MixerState>((set, get) => ({
  subject: 'a person',
  hairStyle: 'natural',
  hairColor: 'original',
  outfit: 'casual clothes',
  pose: 'standing',
  background: 'simple background',
  template: '',
  useMyFace: false,
  tempFaceImage: null,

  setField: (field, value) => set({ [field]: value }),

  initializeFromPrompt: (template, defaultsStr) => {
    try {
      const defaults = typeof defaultsStr === 'string' ? JSON.parse(defaultsStr) : defaultsStr;
      set({
        template: template || '',
        subject: defaults?.SUBJECT || 'a person',
        hairStyle: defaults?.HAIR_STYLE || 'natural',
        hairColor: defaults?.HAIR_COLOR || 'original',
        outfit: defaults?.OUTFIT || 'casual clothes',
        pose: defaults?.POSE || 'standing',
        background: defaults?.BACKGROUND || 'simple background',
        useMyFace: false,
        tempFaceImage: null // Her yeni promptta sıfırla
      });
    } catch (e) {
      console.error("Failed to parse prompt defaults", e);
    }
  },

  getFinalPrompt: () => {
    const s = get();
    if (!s.template) return '';
    
    const finalSubject = s.useMyFace ? "the exact person from the reference image" : s.subject;

    return s.template
      .replace(/\[SUBJECT\]/g, finalSubject)
      .replace(/\[HAIR_STYLE\]/g, s.hairStyle)
      .replace(/\[HAIR_COLOR\]/g, s.hairColor)
      .replace(/\[OUTFIT\]/g, s.outfit)
      .replace(/\[POSE\]/g, s.pose)
      .replace(/\[BACKGROUND\]/g, s.background);
  }
}));
