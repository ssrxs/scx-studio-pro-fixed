'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Smile, Eye, Scissors, User, 
  Palette, Droplets, Sliders, ShieldCheck, 
  HelpCircle, AlertCircle, Info, Zap, 
  CheckCircle2, Ruler, Scale, Wind, Circle,
  Heart, Layers, Accessibility, Sparkles, Wand2
} from 'lucide-react';
import { 
  EYE_SHAPES, EYE_COLORS_ETHNIC, NOSE_SHAPES, 
  LIP_SHAPES, SKIN_TONES, ETHNIC_HAIR_STRUCTURES, 
  SKIN_CONDITIONS, AGING_SIGNS, BEARD_DENSITY,
  BEARD_GROWTH_MM, MUSTACHE_STYLES, HAIR_LOSS_SCALES,
  BREAST_TYPES, BRA_EFFECTS, HOSIERY_TYPES, HIP_SHAPES,
  EAR_TYPES, JAWLINE_SHAPES, SKIN_MARKS, MAKEUP_STYLES, LIPSTICK_FINISHES
} from '@/lib/utils/biometric-database';

interface CharacterVisualEditorProps {
  dna: any;
  setDna: (dna: any) => void;
  onSave: () => void;
  onClose: () => void;
}

type ActivePanel = 'eye' | 'nose' | 'lip' | 'skin' | 'hair' | 'grooming' | 'physique' | 'body_fem' | 'legs_fem' | 'makeup' | 'structure';

export default function CharacterVisualEditor({ dna, setDna, onSave, onClose }: CharacterVisualEditorProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel | null>(null);

  const updateDna = (key: string, value: any) => {
    setDna({ ...dna, [key]: value });
  };

  const isMale = dna.gender === 'men';
  const isFemale = dna.gender === 'women';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full max-w-7xl flex flex-col md:flex-row relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-[160] p-3 bg-white/5 hover:bg-red-500/20 rounded-full border border-white/10 transition-all">
          <X size={24} className="text-white/60 hover:text-red-400" />
        </button>

        {/* Sol Alan: Karakter Görseli */}
        <div className="flex-1 relative flex items-center justify-center p-8 bg-gradient-to-br from-blue-600/10 to-transparent">
          <div className="relative group max-w-md w-full aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-black">
            <img 
              src={dna.faceImages[0] || 'https://via.placeholder.com/600x800?text=DNA+Preview'} 
              className="w-full h-full object-cover opacity-70" 
              alt="Character"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Hotspots */}
            <div className="absolute inset-0">
              <button onClick={() => setActivePanel('hair')} className="absolute top-[10%] left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-purple-500/30 bg-purple-500/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-xl"><Scissors size={18} className="text-purple-400" /></button>
              <button onClick={() => setActivePanel('eye')} className="absolute top-[35%] left-[30%] -translate-x-1/2 w-12 h-12 rounded-full border-2 border-blue-500/30 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"><Eye size={16} className="text-blue-400" /></button>
              <button onClick={() => setActivePanel('nose')} className="absolute top-[45%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center hover:scale-110 transition-all"><Circle size={8} className="text-white/20" /></button>
              <button onClick={() => setActivePanel('lip')} className="absolute top-[60%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-red-500/30 bg-red-500/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"><Smile size={16} className="text-red-400" /></button>
              <button onClick={() => setActivePanel('makeup')} className="absolute top-[40%] right-[25%] -translate-x-1/2 w-12 h-12 rounded-full border-2 border-pink-500/30 bg-pink-500/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"><Sparkles size={16} className="text-pink-400" /></button>
              <button onClick={() => setActivePanel('structure')} className="absolute bottom-[25%] left-[25%] -translate-x-1/2 w-12 h-12 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"><Wand2 size={16} className="text-emerald-400" /></button>
            </div>
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="w-full md:w-[480px] h-full bg-[#050505] border-l border-white/5 flex flex-col shadow-2xl overflow-hidden pt-24">
          <div className="flex-1 p-8 md:p-10 overflow-y-auto scrollbar-hide">
            {!activePanel ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-2xl"><Zap size={48} className="text-blue-500" /></div>
                <div><h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">DNA Studio Pro</h3><p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-2">Neural Biometrics Interface v11.0</p></div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-blue-500">
                      <Zap size={20} />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">{activePanel.toUpperCase()}</h2>
                  </div>
                  <button onClick={() => setActivePanel(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-all"><X size={20} className="text-white/20" /></button>
                </div>

                {/* --- MAKEUP PANEL --- */}
                {activePanel === 'makeup' && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/30 ml-2">Makyaj Stili</label>
                      <div className="grid grid-cols-1 gap-3">
                        {MAKEUP_STYLES.map(m => (
                          <button key={m.id} onClick={() => updateDna('makeupStyle', m.id)}
                            className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all ${dna.makeupStyle === m.id ? 'bg-pink-600/10 border-pink-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
                            <div><p className="text-[11px] font-black uppercase">{m.label}</p><p className="text-[9px] opacity-50 mt-1">{m.desc}</p></div>
                            {dna.makeupStyle === m.id && <CheckCircle2 size={16} className="text-pink-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/30 ml-2">Dudak Bitişi (Finish)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {LIPSTICK_FINISHES.map(f => (
                          <button key={f.id} onClick={() => updateDna('lipstickFinish', f.id)}
                            className={`p-3 rounded-xl border text-[8px] font-black uppercase text-center transition-all ${dna.lipstickFinish === f.id ? 'bg-red-600/10 border-red-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STRUCTURE & MARKS PANEL --- */}
                {activePanel === 'structure' && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/30 ml-2">Çene Hattı (Jawline)</label>
                      <div className="grid grid-cols-2 gap-3">
                        {JAWLINE_SHAPES.map(j => (
                          <button key={j.id} onClick={() => updateDna('jawlineShape', j.id)}
                            className={`p-5 rounded-2xl border text-left transition-all ${dna.jawlineShape === j.id ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
                            <p className="text-[10px] font-black uppercase">{j.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/30 ml-2">Kulak Yapısı</label>
                      <select value={dna.earType} onChange={e => updateDna('earType', e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-bold">
                        {EAR_TYPES.map(e => <option key={e.id} value={e.id}>{e.label.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white/30 ml-2">Karakteristik İzler</label>
                      <div className="grid grid-cols-2 gap-3">
                        {SKIN_MARKS.map(s => (
                          <button key={s.id} onClick={() => updateDna('skinMark', s.id)}
                            className={`p-4 rounded-2xl border text-left transition-all ${dna.skinMark === s.id ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
                            <p className="text-[10px] font-black uppercase">{s.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Diğer paneller... */}
              </motion.div>
            )}
          </div>

          <div className="p-10 bg-black/80 border-t border-white/5 space-y-4 backdrop-blur-3xl shrink-0">
            <button onClick={onSave} className="w-full py-7 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2.5rem] flex items-center justify-center gap-5 text-xs uppercase tracking-[0.5em] shadow-[0_30px_80px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
              <ShieldCheck size={28} /> DNA MÜHÜRÜNÜ GÜNCELLE
            </button>
            <button onClick={onClose} className="w-full py-4 text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all">İPTAL</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
