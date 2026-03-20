'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, LogIn, Loader2, X, Wand2, UserCircle,
  Clapperboard, Eye, EyeOff, ShieldAlert, CheckCircle2,
  Calendar, Upload, Disc3, Zap, Play, Lock, Unlock,
  SlidersHorizontal, Camera, ChevronDown, Images, Trash2,
  Download, RefreshCw
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import PromptCard from '@/components/molecules/PromptCard';
import ImageEditor from '@/components/organisms/ImageEditor';
import OnboardingDNA from '@/components/organisms/OnboardingDNA';
import { useMixerStore } from '@/lib/core/store';
import { useToast } from '@/components/atoms/Toast';
import { SkeletonGrid } from '@/components/atoms/LoadingSkeleton';

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'curated', label: 'Küratörlü' },
  { id: 'Fashion', label: 'Moda' },
  { id: 'Portrait', label: 'Portre' },
  { id: 'Cyberpunk', label: 'Siberpunk' },
  { id: 'Nature', label: 'Doğa' },
  { id: 'Luxury', label: 'Lüks' },
  { id: 'Art', label: 'Sanat' },
  { id: 'Street', label: 'Sokak' },
];

export default function HomeClientWrapper({ initialPrompts, user }: { initialPrompts: any[], user: any }) {
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  // State
  const [prompts, setPrompts] = useState<any[]>(initialPrompts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // DNA & Mixer
  const [activeCharacter, setActiveCharacter] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  const [mixerActive, setMixerActive] = useState(false);
  const [activePrompt, setActivePrompt] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState('');
  
  const mixer = useMixerStore();

  useEffect(() => {
    if (session?.user) {
      loadCharacters();
    }
  }, [session]);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/studio');
      const data = await res.json();
      if (data.characters) {
        setCharacters(data.characters);
        const main = data.characters.find((c: any) => c.isMainCharacter) || data.characters[0];
        if (main) {
          setActiveCharacter(main);
          setIsOnboarding(false);
        } else {
          setIsOnboarding(true);
        }
      }
    } catch (error) {
      // cleaned
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (newChar: any) => {
    setActiveCharacter(newChar);
    setCharacters([newChar, ...characters]);
    setIsOnboarding(false);
  };

  const handleOpenMixer = (item: any) => {
    setActivePrompt(item);
    mixer.initializeFromPrompt(item.template, item.defaults);
    setMixerActive(true);
  };

  const handleGenerate = async () => {
    if (!activePrompt || !activeCharacter) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: activePrompt.id,
          characterId: activeCharacter.id,
          settings: {
            subject: mixer.subject,
            hairStyle: mixer.hairStyle,
            hairColor: mixer.hairColor,
            outfit: mixer.outfit,
            pose: mixer.pose,
            background: mixer.background,
            useMyFace: mixer.useMyFace
          }
        })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setEditorImageUrl(data.imageUrl);
        setIsEditorOpen(true);
        showToast('Görsel başarıyla üretildi!', 'success');
      }
    } catch (error) {
      showToast('Üretim sırasında bir hata oluştu.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isOnboarding) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <OnboardingDNA onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 relative min-h-screen">
      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all rounded-3xl" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Promptlarda ara veya stil bul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="relative w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-xl"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap backdrop-blur-xl border ${selectedCategory === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      {loading && characters.length === 0 ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {prompts.map((p, i) => (
            <PromptCard 
              key={i} 
              item={p} 
              onOpenMixer={handleOpenMixer} 
            />
          ))}
        </div>
      )}

      {/* Mixer Modal */}
      <AnimatePresence>
        {mixerActive && activePrompt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
            >
              {/* Preview Area */}
              <div className="w-full md:w-1/2 aspect-square relative bg-black group">
                <img 
                  src={activePrompt.localPath || activePrompt.imageUrl} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" 
                  alt="Style"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl">
                    <Sparkles className="text-blue-500" size={40} />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">{activePrompt.collection}</h3>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed max-w-xs">{activePrompt.explanation}</p>
                </div>
              </div>

              {/* Controls Area */}
              <div className="w-full md:w-1/2 p-10 lg:p-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-[#0a0a0a] to-black">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Style Mixer</h2>
                    <p className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.3em]">Neural Engine v4.0</p>
                  </div>
                  <button onClick={() => setMixerActive(false)} className="p-3 hover:bg-white/5 rounded-2xl border border-white/5 transition-all"><X size={24} /></button>
                </div>

                {/* Character Profile */}
                <div className="mb-12">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block mb-4 ml-2">Aktif DNA</label>
                  {activeCharacter ? (
                    <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl group hover:border-blue-500/30 transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                        {activeCharacter.name[0]}
                      </div>
                      <div>
                        <p className="text-base font-black uppercase italic tracking-tighter text-white">{activeCharacter.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-md font-bold text-white/40 uppercase">{activeCharacter.bodyType}</span>
                          <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-md font-bold text-white/40 uppercase">{activeCharacter.age} YAŞ</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-center">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Karakter Bulunamadı</p>
                    </div>
                  )}
                </div>

                <button
                  disabled={!activeCharacter || isGenerating}
                  onClick={handleGenerate}
                  className="w-full py-6 bg-blue-600 disabled:bg-white/5 disabled:text-white/10 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
                  <span>{isGenerating ? 'Neural processing...' : 'GÖRSELİ ÜRET'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ultra Image Editor */}
      {isEditorOpen && (
        <ImageEditor 
          imageUrl={editorImageUrl} 
          onClose={() => setIsEditorOpen(false)}
          onSave={(newUrl) => { setGeneratedImage(newUrl); setIsEditorOpen(false); }}
        />
      )}
    </div>
  );
}
