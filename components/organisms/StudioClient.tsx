'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Sparkles, Wand2, Camera, Layers, 
  Plus, ArrowRight, Loader2, Image as ImageIcon, 
  ChevronRight, Sliders, History
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/atoms/Toast';
import { useMixerStore } from '@/lib/core/store';
import OnboardingDNA from './OnboardingDNA';

export default function StudioClient({ user, initialCharacters, recentImages }: { user: any, initialCharacters: any[], recentImages: any[] }) {
  const { showToast } = useToast();
  const [characters, setCharacters] = useState(initialCharacters);
  const [activeChar, setActiveChar] = useState(initialCharacters.find(c => c.isMainCharacter) || initialCharacters[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  if (characters.length === 0) {
    return <OnboardingDNA onComplete={(newChar) => { setCharacters([newChar]); setActiveChar(newChar); }} />;
  }

  const handleQuickGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          characterId: activeChar.id,
          quality: 'high'
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        showToast('Görsel üretildi!', 'success');
      }
    } catch (e) {
      showToast('Hata oluştu.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">SCX <span className="text-blue-500">STUDIO</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Neural Creative Workspace v4.0</p>
        </div>
        <div className="flex gap-3">
          <Link href="/prompts" className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            <Sparkles size={14} /> Kütüphaneyi Aç
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Kolon: Aktif Karakter & Ayarlar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block mb-6">Aktif Karakter DNA</label>
            
            <div className="flex items-center gap-5 mb-8 p-4 bg-white/5 rounded-3xl border border-white/5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl">
                {activeChar.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{activeChar.name}</h3>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{activeChar.age} YAŞ • {activeChar.bodyType}</p>
              </div>
            </div>

            <Link href="/studio" className="flex items-center justify-between w-full p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-3">
                <Sliders size={16} className="text-white/40 group-hover:text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">DNA'yı Düzenle</span>
              </div>
              <ChevronRight size={14} className="text-white/20" />
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 flex items-center gap-2">
              <History size={14} /> Son Üretimler
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recentImages.map((img, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all">
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="Recent" />
                </div>
              ))}
              {recentImages.length === 0 && <div className="col-span-2 py-8 text-center text-[9px] font-black text-white/10 uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">Geçmiş Boş</div>}
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Üretim Alanı */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-white/[0.02] pointer-events-none">
              <Zap size={300} />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Ne Hayal Ediyorsun?</h2>
                <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xl">
                  Karakterini hangi sahnede görmek istersin? Sadece yaz, gerisini otonom mühendislik halletsin.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn: Yağmurlu bir Tokyo gecesinde neon ışıklar altında, deri ceketli bir portre..."
                  className="relative w-full h-48 bg-black/60 border border-white/10 rounded-[2rem] p-8 text-lg font-medium text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-xl resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleQuickGenerate}
                  disabled={isGenerating || !prompt}
                  className="flex-[3] py-6 bg-blue-600 disabled:opacity-20 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
                  <span>{isGenerating ? 'Neural Engines working...' : 'GÖRSELİ ÜRET'}</span>
                </button>
                <Link href="/prompts" className="flex-1 py-6 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Sparkles size={16} /> Şablon Seç
                </Link>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Yüksek Kalite', text: 'Sistem otomatik olarak Flux.1 Ultra modellerini kullanır.' },
              { label: 'Yüz Koruma', text: 'Karakter DNA nız her üretimde %100 sabit tutulur.' },
              { label: 'Sınırsız Mod', text: 'Ayarlardan NSFW modunu açarak sınırları kaldırabilirsin.' }
            ].map((tip, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{tip.label}</h4>
                <p className="text-[10px] text-white/40 font-bold leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
