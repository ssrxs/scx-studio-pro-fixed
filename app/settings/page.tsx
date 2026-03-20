'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Shield, Globe, Cpu, Zap, Save, RefreshCw, Lock, Unlock, 
  ExternalLink, Info, HelpCircle, ChevronRight, CheckCircle2,
  LogIn, Link as LinkIcon, RefreshCcw, Smartphone
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useToast } from '@/components/atoms/Toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  const toggleKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Ayarlar başarıyla kaydedildi.', 'success');
    }, 1500);
  };

  const API_PROVIDERS = [
    { 
      id: 'google', 
      label: 'Google Cloud (Gemini)', 
      placeholder: 'AIzaSy...', 
      link: 'https://aistudio.google.com/app/apikey',
      desc: 'Gemini 1.5 Pro ve Flash modelleri için API anahtarı.'
    },
    { 
      id: 'openai', 
      label: 'OpenAI (DALL-E 3)', 
      placeholder: 'sk-...', 
      link: 'https://platform.openai.com/api-keys',
      desc: 'ChatGPT ve DALL-E 3 görsel üretimi için gereklidir.'
    },
    { 
      id: 'huggingface', 
      label: 'Hugging Face Token', 
      placeholder: 'hf_...', 
      link: 'https://huggingface.co/settings/tokens',
      desc: 'Ücretsiz ve açık kaynaklı modeller (Flux, SDXL) için.'
    },
    { 
      id: 'together', 
      label: 'Together AI', 
      placeholder: 'tgp_...', 
      link: 'https://api.together.ai/settings/api-keys',
      desc: 'Hızlı Flux.1 ve SDXL üretimi için en iyi alternatif.'
    },
    { 
      id: 'segmind', 
      label: 'Segmind API', 
      placeholder: 'SG_...', 
      link: 'https://www.segmind.com/dashboard/api-keys',
      desc: 'Günlük ücretsiz kredi ile ControlNet ve Flux desteği.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">SİSTEM <span className="text-blue-500">AYARLARI</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2 italic">Hesaplarını ve anahtarlarını tek merkezden yönet.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] disabled:opacity-50 active:scale-95"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            DEĞİŞİKLİKLERİ KAYDET
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Kolon: Hesap Bağlantıları */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <LinkIcon size={20} className="text-blue-500" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Bağlı Hesaplar</h3>
              </div>

              <div className="space-y-4">
                {/* Google Connection */}
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white tracking-widest">Google Cloud</p>
                      <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-0.5">BAĞLI</p>
                    </div>
                  </div>
                  <button onClick={() => signIn('google')} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                    <RefreshCcw size={14} />
                  </button>
                </div>

                {/* Apple Connection */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <Smartphone size={18} className="text-white/40" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Apple ID</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">BAĞLI DEĞİL</p>
                    </div>
                  </div>
                  <button disabled className="p-2.5 bg-white/5 rounded-xl text-white/10 cursor-not-allowed">
                    <LogIn size={14} />
                  </button>
                </div>

                {/* Microsoft Connection */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <Cpu size={18} className="text-white/40" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Microsoft</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">BAĞLI DEĞİL</p>
                    </div>
                  </div>
                  <button disabled className="p-2.5 bg-white/5 rounded-xl text-white/10 cursor-not-allowed">
                    <LogIn size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-10 p-6 bg-blue-600/10 border border-blue-500/20 rounded-[1.5rem] text-center">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] leading-relaxed">
                  Hesabınızı bağlayarak Nanobanana Pro 2 ve Gemini Advanced kotalarınızı doğrudan SCX Studio içerisinde kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Orta Kolon: API Girişleri */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 text-white/[0.02] pointer-events-none">
                <Key size={200} />
              </div>
              
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Zap size={24} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">API Bağlantı Merkezi (BYOK)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {API_PROVIDERS.map((provider) => (
                  <div key={provider.id} className="space-y-4 group">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] group-hover:text-blue-500 transition-colors">{provider.label}</label>
                      <button 
                        onClick={() => setActiveHelp(activeHelp === provider.id ? null : provider.id)}
                        className="text-[9px] font-black text-white/20 hover:text-white flex items-center gap-1.5 uppercase tracking-widest transition-all"
                      >
                        <HelpCircle size={12} /> Yardım
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type={showKeys[provider.id] ? "text" : "password"}
                        placeholder={provider.placeholder}
                        className="w-full bg-black/60 border border-white/5 rounded-[1.5rem] py-5 pl-8 pr-16 text-xs font-bold text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-xl"
                      />
                      <button 
                        onClick={() => toggleKey(provider.id)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors"
                      >
                        {showKeys[provider.id] ? <Unlock size={18} /> : <Lock size={18} />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {activeHelp === provider.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-blue-600/5 border border-blue-500/10 rounded-2xl p-5 space-y-3 shadow-inner"
                        >
                          <p className="text-[10px] text-blue-400 font-bold leading-relaxed">{provider.desc}</p>
                          <a 
                            href={provider.link} 
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-white bg-blue-600/20 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                          >
                            <ExternalLink size={12} /> ANAHTARI AL
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
