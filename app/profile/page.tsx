'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Zap, Image as ImageIcon, Camera, Sliders, Key } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">PROFİL <span className="text-blue-500">AYARLARI</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">Kişisel verilerini ve üyelik durumunu yönet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kolon: Profil Kartı */}
          <div className="md:col-span-1">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
              <img 
                src={session.user?.image || ''} 
                className="w-24 h-24 rounded-3xl mx-auto mb-6 border-2 border-white/10 shadow-2xl" 
                alt="Avatar" 
              />
              <h2 className="text-xl font-black uppercase italic tracking-tighter mb-1">{session.user?.name}</h2>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-6">PRO ÜYE</p>
              
              <div className="flex justify-center gap-4 border-t border-white/5 pt-6">
                <div className="text-center">
                  <p className="text-lg font-black italic">124</p>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">GÖRSEL</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="text-center">
                  <p className="text-lg font-black italic">12</p>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">ALBÜM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Detaylar */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Hesap Bilgileri
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">E-Posta Adresi</span>
                  <span className="text-xs font-bold">{session.user?.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Üyelik Tipi</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Ömür Boyu Pro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Hesap Durumu</span>
                  <span className="text-xs font-bold text-green-500 flex items-center gap-2">
                    <Shield size={12} /> AKTİF
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <Zap size={16} className="text-blue-500" /> Hızlı İstatistikler
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Kalan Kredi</p>
                  <p className="text-xl font-black italic text-white">∞ Sınırsız</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Popüler Stil</p>
                  <p className="text-xl font-black italic text-white">Siberpunk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
