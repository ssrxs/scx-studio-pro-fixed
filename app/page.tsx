'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Sparkles, LogIn, Loader2, X, Wand2, UserCircle, Download, Clapperboard } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import PromptCard from '@/components/PromptCard';
import ImageEditor from '@/components/ImageEditor';
import { useMixerStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { SkeletonGrid } from '@/components/LoadingSkeleton';

export default function Home() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Mixer & Editor State
  const [mixerActive, setMixerActive] = useState(false);
  const [activePrompt, setActivePrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState('');
  const mixer = useMixerStore();
  
  const observer = useRef<any>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setPrompts([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    fetchPrompts();
  }, [page, search]);

  const fetchPrompts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      setFetchError(false);
      const res = await fetch(`/api/prompts?page=${page}&limit=20&q=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      
      if (!data.items || data.items.length === 0) {
        setHasMore(false);
      } else {
        setPrompts(prev => page === 1 ? data.items : [...prev, ...data.items]);
        if (data.items.length < 20) setHasMore(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFetchError(true);
      showToast('Promptlar yüklenirken hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
    setLoading(false);
  };

  const handleOpenMixer = (item) => {
    setActivePrompt(item);
    setGeneratedImage(null);
    mixer.initializeFromPrompt(item.template, item.defaults);
    setMixerActive(true);
  };

  const closeMixer = () => {
    setMixerActive(false);
    setTimeout(() => {
      setActivePrompt(null);
      setGeneratedImage(null);
    }, 300);
  };

  const handleGenerate = async () => {
    if (!session?.user) {
      showToast('Üretim yapmak için lütfen önce giriş yapın.', 'error');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: mixer.getFinalPrompt(),
          useMyFace: mixer.useMyFace,
          tempFaceImage: mixer.tempFaceImage, // Hızlı yüklenen görsel
          mixerSettings: {
            subject: mixer.subject,
            hairStyle: mixer.hairStyle,
            hairColor: mixer.hairColor,
            outfit: mixer.outfit,
            pose: mixer.pose,
            background: mixer.background
          }
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.error || 'Üretim sırasında bir hata oluştu.', 'error');
      } else {
        setGeneratedImage(data.imageUrl);
        showToast('Görsel başarıyla üretildi! 🎉', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Bir bağlantı hatası oluştu. İnternet bağlantınızı kontrol edin.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenEditor = (url: string) => {
    setEditorImageUrl(url);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="/logo.jpeg" className="h-20 w-auto rounded-2xl object-contain shadow-[0_0_25px_rgba(250,204,21,0.2)] border border-white/5" />
                    <div className="flex flex-col">
                      <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent leading-none">
                          SCX
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-yellow-400 mt-1">
                        Synth Control X
                      </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Studio Linki */}
                  {session && (
                    <a 
                      href="/studio"
                      className="hidden sm:flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400 transition-all hover:bg-yellow-400/20 active:scale-95"
                    >
                      <Clapperboard size={16} />
                      <span>Stüdyom</span>
                    </a>
                  )}
                  {status === 'loading' ? (
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 sm:px-5 py-2">
                      <Loader2 size={18} className="animate-spin" />
                    </div>
                  ) : session ? (
                    <div className="flex items-center gap-2">
                      <img src={session.user?.image || ''} alt={session.user?.name || ''} className="w-8 h-8 rounded-full ring-2 ring-yellow-400/30" />
                      <button 
                        onClick={() => signOut()}
                        className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-5 py-2 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                      >
                        <span>Çıkış</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => signIn('google')}
                      className="flex items-center gap-2 rounded-full bg-yellow-400 text-black px-4 sm:px-5 py-2 text-sm font-bold transition-all hover:bg-yellow-300 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                    >
                      <LogIn size={18} />
                      <span className="hidden sm:inline">Google ile Giriş</span>
                    </button>
                  )}
                </div>
            </div>
        </div>
      </nav>

      {/* Hero / Search */}
      <section className="relative overflow-hidden py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold tracking-tight sm:text-6xl"
            >
              Hayal Gücünüzü <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]">Promptlarla</span> Özgür Bırakın
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400"
            >
              Yapay zeka için özenle seçilmiş ve şablonlanmış prompt kütüphanesi.
            </motion.p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 blur-2xl transition-all group-focus-within:opacity-100" />
              <div className="relative flex items-center rounded-2xl border border-white/10 bg-neutral-900/50 p-1.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-yellow-400/50">
                <div className="flex h-12 w-12 items-center justify-center text-neutral-500">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Ara... (örn: 'cinematic', '3d caricature')"
                  className="flex-1 bg-transparent px-2 py-2 text-lg outline-none placeholder:text-neutral-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['Hepsi', 'Sinematik', 'Fantastik', 'Animasyon', 'Lifestyle', 'Sanatsal'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSearch(cat === 'Hepsi' ? '' : cat);
                }}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  (search === cat || (cat === 'Hepsi' && search === '')) 
                  ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                  : 'bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Stream */}
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Hata Durumu */}
        {fetchError && prompts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Veriler yüklenemedi</h3>
            <p className="text-neutral-400 mb-6">Sunucu bağlantısında bir sorun oluştu.</p>
            <button 
              onClick={() => { setPage(1); setHasMore(true); setFetchError(false); }}
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* İlk Yükleme Skeleton */}
        {loading && prompts.length === 0 && <SkeletonGrid count={8} />}

        {/* Boş Durum */}
        {!loading && !fetchError && prompts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Sparkles className="text-neutral-600 mb-4" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">Sonuç bulunamadı</h3>
            <p className="text-neutral-400">Farklı anahtar kelimeler deneyin.</p>
          </div>
        )}

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
          <AnimatePresence>
            {prompts.map((item, index) => (
              <div key={`${item.id}-${index}`} ref={index === prompts.length - 1 ? lastElementRef : null}>
                <PromptCard item={item} onOpenMixer={handleOpenMixer} />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading Footer - Sayfalama */}
        {loading && prompts.length > 0 && (
          <div className="mt-12 flex justify-center py-8">
            <Loader2 className="animate-spin text-yellow-400" size={40} />
          </div>
        )}

        {/* Tüm promptlar yüklendi */}
        {!hasMore && prompts.length > 0 && (
          <div className="mt-12 flex justify-center py-8">
            <p className="text-neutral-600 text-sm font-medium">Tüm promptlar yüklendi ({prompts.length} adet)</p>
          </div>
        )}
      </main>

      {/* Slide-up Mixer Modal */}
      <AnimatePresence>
        {mixerActive && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMixer}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[70] flex h-[85vh] flex-col rounded-t-3xl border-t border-white/10 bg-neutral-950 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400" /> Prompt Mikseri
                  </h2>
                  <p className="text-sm text-neutral-400">Şablonu kendi tarzınıza göre özelleştirin.</p>
                </div>
                <button onClick={closeMixer} className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                  <X size={24} />
                </button>
              </div>

              {/* Body (Placeholder for Next Task) */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  {/* Left: Preview */}
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 flex items-center justify-center relative overflow-hidden">
                    {generatedImage ? (
                       <img 
                         src={generatedImage} 
                         className="w-full h-full object-contain rounded-xl cursor-zoom-in hover:brightness-110 transition-all shadow-[0_0_30px_rgba(250,204,21,0.2)]" 
                         onClick={() => handleOpenEditor(generatedImage)}
                       />
                    ) : (
                       <>
                         <img src={activePrompt?.localPath || activePrompt?.imageUrl} className="max-h-full max-w-full rounded-xl object-contain opacity-50" />
                         <div className="absolute font-bold text-xl text-neutral-400">Görsel Önizleme Gelecek</div>
                       </>
                    )}
                    {isGenerating && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                         <Loader2 className="animate-spin text-yellow-400 mb-4" size={48} />
                         <p className="text-yellow-400 font-bold animate-pulse">Yapay Zeka Üretiyor...</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Controls Placeholder */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                      <Wand2 className="text-yellow-400" /> Kontrol Paneli
                    </h3>
                    
                    {/* Face Lock & Quick Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <UserCircle className={mixer.useMyFace ? "text-yellow-400" : "text-neutral-400"} size={24} />
                          <div>
                            <p className="font-bold">Kendi Yüzümü Kullan</p>
                            <p className="text-xs text-neutral-400">Referans fotoğrafınızı veya profilinizi kullanır.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => mixer.setField('useMyFace', !mixer.useMyFace)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mixer.useMyFace ? 'bg-yellow-400' : 'bg-neutral-600'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mixer.useMyFace ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {/* Quick Upload Area */}
                      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="text-neutral-400" size={20} />
                          <span className="text-xs font-medium text-neutral-300">
                            {mixer.tempFaceImage ? "Görsel Yüklendi ✅" : "Hızlı Yüz Yükle (Tek Seferlik)"}
                          </span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              // TODO: Supabase upload mantığı buraya bağlanacak
                              const reader = new FileReader();
                              reader.onload = (f) => {
                                mixer.setField('tempFaceImage', f.target?.result);
                                mixer.setField('useMyFace', true);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {mixer.tempFaceImage && (
                          <button 
                            onClick={() => mixer.setField('tempFaceImage', null)}
                            className="mt-2 text-[10px] text-red-400 hover:underline"
                          >
                            Görseli Kaldır
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Subject */}
                      {!mixer.useMyFace && (
                        <div className="space-y-2 col-span-full">
                          <label className="text-sm font-bold text-neutral-300">Karakter / Özne</label>
                          <input 
                            type="text" 
                            value={mixer.subject} 
                            onChange={(e) => mixer.setField('subject', e.target.value)}
                            className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      )}

                      {/* Hair Style */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-300">Saç Modeli</label>
                        <select 
                          value={mixer.hairStyle}
                          onChange={(e) => mixer.setField('hairStyle', e.target.value)}
                          className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50 appearance-none"
                        >
                          <option value="natural">Doğal (Şablondaki)</option>
                          <option value="messy">Dağınık (Messy)</option>
                          <option value="slicked back">Geriye Taranmış</option>
                          <option value="curly">Kıvırcık</option>
                          <option value="bald">Kel</option>
                          <option value="long wavy">Uzun Dalgalı</option>
                        </select>
                      </div>

                      {/* Hair Color */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-300">Saç Rengi</label>
                        <select 
                          value={mixer.hairColor}
                          onChange={(e) => mixer.setField('hairColor', e.target.value)}
                          className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50 appearance-none"
                        >
                          <option value="original">Orijinal</option>
                          <option value="black">Siyah</option>
                          <option value="blonde">Sarışın</option>
                          <option value="brown">Kahverengi</option>
                          <option value="red">Kızıl</option>
                          <option value="silver">Gümüş/Gri</option>
                        </select>
                      </div>

                      {/* Outfit */}
                      <div className="space-y-2 col-span-full">
                        <label className="text-sm font-bold text-neutral-300">Kıyafet</label>
                        <input 
                          type="text" 
                          value={mixer.outfit} 
                          onChange={(e) => mixer.setField('outfit', e.target.value)}
                          className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50"
                        />
                        <div className="flex gap-2 flex-wrap mt-2">
                          {['black tuxedo', 'casual streetwear', 'cyberpunk armor', 'white summer dress'].map(chip => (
                            <button 
                              key={chip}
                              onClick={() => mixer.setField('outfit', chip)}
                              className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pose */}
                      <div className="space-y-2 col-span-full">
                        <label className="text-sm font-bold text-neutral-300">Poz</label>
                        <input 
                          type="text" 
                          value={mixer.pose} 
                          onChange={(e) => mixer.setField('pose', e.target.value)}
                          className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50"
                        />
                      </div>

                      {/* Background */}
                      <div className="space-y-2 col-span-full">
                        <label className="text-sm font-bold text-neutral-300">Arka Plan</label>
                        <input 
                          type="text" 
                          value={mixer.background} 
                          onChange={(e) => mixer.setField('background', e.target.value)}
                          className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-sm outline-none focus:border-yellow-400/50"
                        />
                      </div>
                    </div>
                    
                    {/* Final Prompt Preview */}
                    <div className="mt-8 p-4 bg-black/50 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Nihai Prompt</p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(mixer.getFinalPrompt())}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          Kopyala
                        </button>
                      </div>
                      <code className="text-sm text-neutral-300 leading-relaxed block">
                        {mixer.getFinalPrompt()}
                      </code>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:bg-yellow-300 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? <><Loader2 className="animate-spin" size={24} /> Üretiliyor...</> : "Bu Ayarlarla Üret"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Advanced Image Editor (Diyafram) */}
      <AnimatePresence>
        {isEditorOpen && (
          <ImageEditor 
            imageUrl={editorImageUrl} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={(newUrl) => {
              setGeneratedImage(newUrl);
              setIsEditorOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
