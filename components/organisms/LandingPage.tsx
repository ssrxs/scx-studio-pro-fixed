'use client';

import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Zap, Sparkles, Shield, Image as ImageIcon, Camera, Apple } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="text-center max-w-4xl z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
          <Sparkles className="text-blue-400" size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI-Powered Visual Studio 2026</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6 leading-none">
          Karakterini <span className="text-blue-500">Yeniden</span> Tasarla
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Kendi yüzünle profesyonel fotoğraflar üret. Multi-engine desteği ve sınırsız yaratıcılıkla SCX Studio Pro emrinde.
        </p>

        <div className="flex flex-col sm:row gap-4 justify-center items-center">
          <button 
            onClick={() => signIn('google')}
            className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-2xl"
          >
            <span>GOOGLE İLE BAŞLA</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
