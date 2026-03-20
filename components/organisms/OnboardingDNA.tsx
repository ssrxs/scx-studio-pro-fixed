'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, CheckCircle2, Loader2, Camera, 
  User, Trash2, ArrowRight, Video, Play, Info,
  ShieldCheck, AlertCircle, RefreshCcw, Plus
} from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';

interface OnboardingDNAProps {
  onComplete: (character: any) => void;
}

export default function OnboardingDNA({ onComplete }: OnboardingDNAProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Mod Seçimi, 1: Yükleme, 2: Detaylar
  const [mode, setMode] = useState<'photo' | 'video' | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '25',
    gender: 'women',
    bodyType: 'fit',
    faceImages: [] as string[],
    videoUrl: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload to S3/Supabase here
    // For now, we use a mock URL
    const mockUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      faceImages: [...prev.faceImages, mockUrl].slice(0, 3)
    }));
    showToast('Fotoğraf eklendi.', 'success');
  };

  const handleSave = async () => {
    if (!formData.name || (mode === 'photo' && formData.faceImages.length === 0)) {
      showToast('Lütfen isim ve en az bir fotoğraf ekleyin.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isMainCharacter: true })
      });
      const data = await res.json();
      if (data.success) {
        showToast('DNA Başarıyla mühürlendi!', 'success');
        onComplete(data.character);
      }
    } catch (error) {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/20">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${(step / 2) * 100}%` }}
            className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
          />
        </div>

        <div className="p-8 md:p-12">
          
          {/* STEP 0: MOD SEÇİMİ */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 text-center">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">DNA Kayıt Merkezi</h2>
                <p className="text-xs text-white/40 font-bold uppercase mt-2 tracking-[0.2em]">Karakterini nasıl tanıtmak istersin?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => { setMode('photo'); setStep(1); }}
                  className="group p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-blue-500/40 transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-blue-500/10 transition-colors">
                    <Camera size={80} />
                  </div>
                  <Camera className="text-blue-500 mb-4" size={32} />
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Hızlı Mod</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase mt-2 leading-relaxed">3-5 Fotoğraf ile standart tutarlılık.</p>
                </button>

                <button 
                  onClick={() => { setMode('video'); setStep(1); }}
                  className="group p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-purple-500/40 transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-purple-500/10 transition-colors">
                    <Video size={80} />
                  </div>
                  <Video className="text-purple-500 mb-4" size={32} />
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Pro Mod</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase mt-2 leading-relaxed">60sn Video ile %100 anatomik mühürleme.</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: YÜKLEME (FOTO VEYA VİDEO) */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  {mode === 'photo' ? 'Fotoğrafları Yükle' : 'Mühürleme Videosu'}
                </h2>
                <p className="text-[10px] text-white/40 font-bold uppercase mt-2 tracking-widest">
                  {mode === 'photo' ? 'En az 3 farklı açıdan portre.' : 'Kalibrasyon metnini okuyarak kaydet.'}
                </p>
              </div>

              {mode === 'video' ? (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl text-left space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                      <Info size={14} /> Okunacak Metin
                    </div>
                    <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                      "Merhaba, ben [Karakter Adı]. SCX Studio Pro için biyometrik mühürlemeye başlıyorum. Sola dönüyorum, sağa dönüyorum... DNA mühürlendi."
                    </p>
                  </div>
                  <label className="w-full h-48 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10 transition-all">
                    {formData.videoUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Video Hazır</span>
                      </div>
                    ) : (
                      <>
                        <Video className="text-white/20" size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Videoyu Yükle</span>
                      </>
                    )}
                    <input 
                      type="file" className="hidden" accept="video/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, videoUrl: URL.createObjectURL(file) }));
                          showToast('Video eklendi.', 'success');
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map(i => (
                    <label key={i} className="aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all relative overflow-hidden">
                      {formData.faceImages[i] ? (
                        <img src={formData.faceImages[i]} alt={`DNA ${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="text-white/10" size={24} />
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Karakter Kimliği</label>
                <input 
                  type="text" placeholder="Örn: Yusuf Yavuz"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">GERİ</button>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name}
                  className="flex-[2] py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-xl"
                >
                  DEVAM ET <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ANATOMİK DETAYLAR */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <ShieldCheck className="text-blue-500" size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Anatomik Onay</h2>
                <p className="text-xs text-white/40 font-bold uppercase mt-2 tracking-widest">Biyometrik verileri sonlandır</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Cinsiyet</label>
                  <select 
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold appearance-none cursor-pointer outline-none"
                  >
                    <option value="women">KADIN</option>
                    <option value="men">ERKEK</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Yaş</label>
                  <input 
                    type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] flex gap-4">
                <Sparkles className="text-blue-500 shrink-0" size={24} />
                <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-wider">
                  Yapay zeka, yüklediğin verileri tarayarak sana özel bir "Biyometrik Mühür" oluşturacak. Bu mühür, karakterinin her görselde kusursuz görünmesini sağlar.
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10">GERİ</button>
                <button 
                  onClick={handleSave} disabled={loading}
                  className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/40"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> DNA MÜHÜRLE</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
