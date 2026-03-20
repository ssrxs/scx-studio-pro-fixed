'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, User, Trash2, CheckCircle2, Sparkles, 
  ShieldCheck, Loader2, Info, Plus, UserCircle, 
  Camera, Check, X, AlertCircle, Accessibility,
  Move, ChevronRight, Fingerprint, Dna, Layers,
  Smile, Heart, Zap, Image as ImageIcon, HelpCircle,
  Maximize, Scan, Frame, Box, Scale, Ruler, Palette, 
  Droplets, Scissors, Briefcase, Globe, Wind, Eye,
  RefreshCw, Wand2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/atoms/Toast';
import { BIOMETRIC_STANDARDS, ANATOMY_LIMITS, SKIN_TONES } from '@/lib/utils/anatomy-rules';
import { 
  NOSE_SHAPES, LIP_SHAPES, BEARD_DENSITY, BEARD_GROWTH_MM, 
  ETHNIC_HAIR_STRUCTURES, SKIN_CONDITIONS, HAIR_LOSS_SCALES,
  EYE_SHAPES, EYE_COLORS_ETHNIC, AGING_SIGNS, TEETH_TYPES, EAR_LOBES,
  HAIR_TYPES_GRANULAR, HAIR_COLORS, HAIR_STYLES_MEN, HAIR_STYLES_WOMEN
} from '@/lib/utils/biometric-database';

export default function StudioPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  
  const [dna, setDna] = useState({
    id: '',
    name: 'Yeni Karakter',
    age: '25',
    gender: 'women' as 'women' | 'men',
    skinToneID: 'E',
    hairTypeID: '1A',
    hairColorID: 'jet_black',
    hairStyleID: 'beach_waves',
    eyeShape: 'almond',
    eyeColor: 'obsidian',
    teethType: 'natural',
    earLobe: 'detached',
    bodyType: 'fit',
    height: '168',
    weight: '60',
    noseShape: 'natural',
    lipShape: 'natural',
    beardDensity: 'none',
    beardLength: 'clean',
    hairLossStage: 'n1',
    skinCondition: 'clear',
    faceImages: [] as string[],
    fullBodyImage: '',
    view360Image: '',
    noBgImage: '',
    isMainCharacter: false
  });

  const calculateConsistency = () => {
    let score = 0;
    if (dna.faceImages.length > 0) score += 30; 
    if (dna.faceImages.length > 1) score += 10; 
    if (dna.faceImages.length > 2) score += 10; 
    if (dna.fullBodyImage) score += 20;         
    if (dna.view360Image) score += 15;          
    if (dna.noBgImage) score += 15;             
    return score;
  };

  const consistencyScore = calculateConsistency();

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/studio');
      const data = await res.json();
      if (data.characters) {
        setCharacters(data.characters);
        if (data.characters.length > 0 && !activeCharId) {
          loadCharacter(data.characters[0]);
        }
      }
    } catch (err) {
      console.error("Characters could not be loaded:", err);
      showToast('Karakterler yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchCharacters();
  }, [session]);

  const loadCharacter = (char: any) => {
    const features = char.facialFeatures ? (typeof char.facialFeatures === 'string' ? JSON.parse(char.facialFeatures) : char.facialFeatures) : {};
    
    setDna({
      ...dna,
      id: char.id,
      name: char.name || 'İsimsiz',
      age: char.age || '25',
      gender: (char.gender === 'men' ? 'men' : 'women'),
      skinToneID: char.skinTone || 'E',
      hairTypeID: features.hairTypeID || char.hairTypeID || '1A',
      hairColorID: features.hairColorID || char.hairColorID || 'jet_black',
      hairStyleID: char.hairStyle || (char.gender === 'men' ? 'fade_undercut' : 'beach_waves'),
      eyeShape: features.eyeShape || char.eyeShape || 'almond',
      eyeColor: features.eyeColor || char.eyeColor || 'obsidian',
      teethType: char.teethType || 'natural',
      earLobe: char.earLobe || 'detached',
      bodyType: char.bodyType || 'fit',
      height: char.height || (char.gender === 'men' ? '180' : '168'),
      weight: char.weight || (char.gender === 'men' ? '80' : '60'),
      noseShape: features.noseShape || char.noseShape || 'natural',
      lipShape: features.lipShape || char.lipShape || 'natural',
      beardDensity: features.beardDensity || 'none',
      beardLength: features.beardLength || 'clean',
      faceImages: char.faceImages ? (typeof char.faceImages === 'string' ? JSON.parse(char.faceImages) : char.faceImages) : [],
      fullBodyImage: char.poseReference || '',
      view360Image: char.view360Image || '',
      noBgImage: char.noBgImage || '',
      isMainCharacter: char.isMainCharacter || false
    });
    setActiveCharId(char.id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const mockUrl = URL.createObjectURL(file);
      if (type === 'face') {
        if (dna.faceImages.length >= 3) return showToast('Maks 3 yüz.', 'error');
        setDna(prev => ({ ...prev, faceImages: [...prev.faceImages, mockUrl] }));
      } else if (type === 'body') setDna(prev => ({ ...prev, fullBodyImage: mockUrl }));
      else if (type === '360') setDna(prev => ({ ...prev, view360Image: mockUrl }));
      else if (type === 'nobg') setDna(prev => ({ ...prev, noBgImage: mockUrl }));
      showToast('Referans eklendi.', 'success');
    } catch (e) { showToast('Hata.', 'error'); }
    finally { setSaving(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dna)
      });
      if (res.ok) { showToast('DNA Mühürlendi!', 'success'); fetchCharacters(); }
    } catch (e) { showToast('Kaydedilemedi.', 'error'); }
    finally { setSaving(false); }
  };

  const handleAICalibrate = async () => {
    if (!activeCharId) return;
    const missingTypes = [];
    if (!dna.fullBodyImage) missingTypes.push('body');
    if (!dna.view360Image) missingTypes.push('360');
    if (!dna.noBgImage) missingTypes.push('nobg');

    if (missingTypes.length === 0) {
      showToast('Tüm referanslar zaten mevcut.', 'info');
      return;
    }

    setCalibrating(true);
    try {
      const res = await fetch('/api/studio/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: activeCharId, missingTypes })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Eksik kareler AI ile tamamlandı!', 'success');
        fetchCharacters();
      }
    } catch (e) {
      showToast('Kalibrasyon başarısız.', 'error');
    } finally {
      setCalibrating(false);
    }
  };

  const standards = BIOMETRIC_STANDARDS[dna.gender];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40">
              <Scan className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">DNA <span className="text-blue-500">LAB ULTRA</span></h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1 italic text-white">Neural Consistency Optimizer v7.0</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleAICalibrate}
              disabled={calibrating || !activeCharId}
              className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl disabled:opacity-20"
            >
              {calibrating ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
              EKSİK KARELERİ AI İLE TAMAMLA
            </button>
            <button onClick={() => setActiveCharId(null)} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all">
              <Plus size={18} /> YENİ CAST
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6 block">Aktif Kadro</label>
              <div className="space-y-3">
                {characters.map((char) => (
                  <button key={char.id} onClick={() => loadCharacter(char)}
                    className={`w-full flex flex-col p-5 rounded-2xl border transition-all ${activeCharId === char.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-[1.02]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <span className="font-black text-[11px] uppercase tracking-widest">{char.name}</span>
                      <span className="text-[10px] font-black">{consistencyScore}%</span>
                    </div>
                    <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${consistencyScore}%` }} className={`h-full ${activeCharId === char.id ? 'bg-white' : 'bg-blue-600'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Anatomik Stabilite</h3>
              <div className="space-y-4 text-white">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-white/20 uppercase mb-1">Göz Geometrisi</p>
                  <p className="text-[10px] font-bold text-white uppercase">{dna.eyeShape}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-white/20 uppercase mb-1">Cilt Tonu</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SKIN_TONES.find(s => s.id === dna.skinToneID)?.hex }} />
                    <p className="text-[10px] font-bold text-white uppercase">MST-{dna.skinToneID}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Lab */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* References with Progress Feedback */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['face', 'body', '360', 'nobg'].map((type) => (
                <div key={type} className="group relative">
                  <div className={`p-6 bg-[#0a0a0a] border rounded-[2rem] shadow-2xl transition-all ${dnaReferenceExists(type, dna) ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'}`}>
                    <label className="aspect-square rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center cursor-pointer hover:border-blue-500/40 transition-all overflow-hidden relative">
                      {slotIcon(type, dna)}
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, type)} accept="image/*" />
                    </label>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{type} REF</span>
                      {dnaReferenceExists(type, dna) ? <CheckCircle2 size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-yellow-500/40" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Precision Biometry Form */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Hair & Ethnicity Section */}
                <div className="space-y-10 text-white">
                  <div className="flex items-center gap-3"><Scissors className="text-blue-500" size={24} /><h3 className="text-xl font-black uppercase italic tracking-tighter">Saç & Etnisite Lab</h3></div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Saç Tipi (Andre Walker)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {HAIR_TYPES_GRANULAR.map(h => (
                          <button key={h.id} onClick={() => setDna({...dna, hairTypeID: h.id})}
                            className={`p-4 rounded-2xl border text-left transition-all ${dna.hairTypeID === h.id ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' : 'bg-black/40 border-white/5 text-white/40'}`}>
                            <p className="text-[10px] font-black uppercase">{h.label}</p>
                            <p className="text-[7px] opacity-50 mt-1 uppercase">{h.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Saç Rengi</label>
                      <div className="grid grid-cols-5 gap-3">
                        {HAIR_COLORS.map(c => (
                          <button key={c.id} onClick={() => setDna({...dna, hairColorID: c.id})}
                            className={`aspect-square rounded-full border-2 transition-all ${dna.hairColorID === c.id ? 'border-white scale-110 shadow-xl' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c.hex }} title={c.label} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Saç Modeli</label>
                      <select value={dna.hairStyleID} onChange={e => setDna({...dna, hairStyleID: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-bold outline-none cursor-pointer">
                        {(dna.gender === 'men' ? HAIR_STYLES_MEN : HAIR_STYLES_WOMEN).map(s => (
                          <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Physical Scaling Section */}
                <div className="space-y-10">
                  <div className="flex items-center gap-3"><Scale className="text-blue-500" size={24} /><h3 className="text-xl font-black uppercase italic tracking-tighter">Fiziksel Ölçekleme</h3></div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between px-2"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Boy (cm)</label><span className="text-xs font-black text-blue-500">{dna.height} cm</span></div>
                      <input type="range" min={standards.height.min} max={standards.height.max} value={dna.height} onChange={e => setDna({...dna, height: e.target.value})} className="w-full h-1.5 bg-white/5 rounded-full accent-blue-500 cursor-pointer" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between px-2"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Kilo (kg)</label><span className="text-xs font-black text-blue-500">{dna.weight} kg</span></div>
                      <input type="range" min={standards.weight.min} max={standards.weight.max} value={dna.weight} onChange={e => setDna({...dna, weight: e.target.value})} className="w-full h-1.5 bg-white/5 rounded-full accent-blue-500 cursor-pointer" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Göz Şekli</label>
                        <select value={dna.eyeShape} onChange={e => setDna({...dna, eyeShape: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                          {EYE_SHAPES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">İris Rengi</label>
                        <select value={dna.eyeColor} onChange={e => setDna({...dna, eyeColor: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                          {EYE_COLORS_ETHNIC.map(c => <option key={c.id} value={c.id}>{c.label.toUpperCase()}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Burun Yapısı</label>
                        <select value={dna.noseShape} onChange={e => setDna({...dna, noseShape: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                          {NOSE_SHAPES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Dudak Yapısı</label>
                        <select value={dna.lipShape} onChange={e => setDna({...dna, lipShape: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                          {LIP_SHAPES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                        </select>
                      </div>
                    </div>

                    {dna.gender === 'men' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Sakal Yoğunluğu</label>
                          <select value={dna.beardDensity} onChange={e => setDna({...dna, beardDensity: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                            {BEARD_DENSITY.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                          </select>
                        </div>
                        <div className="space-y-3"><label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Sakal Uzunluğu</label>
                          <select value={dna.beardLength} onChange={e => setDna({...dna, beardLength: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-[10px] font-bold">
                            {BEARD_GROWTH_MM.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button onClick={saveProfile} disabled={saving} className="px-20 py-8 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2.5rem] flex items-center justify-center gap-6 text-xs uppercase tracking-[0.6em] shadow-[0_30px_100px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                {saving ? <Loader2 className="animate-spin" size={32} /> : <><CheckCircle2 size={32} /> DNA MÜHÜRLE VE KAYDET</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function dnaReferenceExists(type: string, dna: any) {
  if (type === 'face') return dna.faceImages.length > 0;
  if (type === 'body') return !!dna.fullBodyImage;
  if (type === '360') return !!dna.view360Image;
  if (type === 'nobg') return !!dna.noBgImage;
  return false;
}

function slotIcon(type: string, dna: any) {
  if (type === 'face' && dna.faceImages[0]) return <img src={dna.faceImages[0]} className="w-full h-full object-cover" />;
  if (type === 'body' && dna.fullBodyImage) return <img src={dna.fullBodyImage} className="w-full h-full object-cover" />;
  if (type === '360' && dna.view360Image) return <img src={dna.view360Image} className="w-full h-full object-cover" />;
  if (type === 'nobg' && dna.noBgImage) return <img src={dna.noBgImage} className="w-full h-full object-cover" />;
  return <Plus className="text-white/10" size={32} />;
}
