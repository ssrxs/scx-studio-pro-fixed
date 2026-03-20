'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Zap, Image as ImageIcon, User, Layers, 
  Settings, LogOut, ChevronDown, Sparkles, Camera,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  const isAdmin = session.user?.role === 'ADMIN';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[90] bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase italic tracking-[0.3em] text-white">SCX STUDIO <span className="text-blue-500">PRO</span></span>
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Master Engine 2026</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Stüdyo', href: '/', icon: <Zap size={16} /> },
            { label: 'Kütüphane', href: '/prompts', icon: <Sparkles size={16} /> },
            { label: 'Albümlerim', href: '/albums', icon: <Layers size={16} /> },
            { label: 'Galeri', href: '/gallery', icon: <ImageIcon size={16} /> },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Profile & Admin */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link 
              href="/admin" 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          )}

          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 p-1.5 pl-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">{session.user?.name}</p>
                <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{isAdmin ? 'ADMIN' : 'PRO PLAN'}</p>
              </div>
              <img 
                src={session.user?.image || ''} 
                className="w-10 h-10 rounded-xl border border-white/10" 
                alt="Profile" 
              />
              <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]"
                >
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hesap Yönetimi</p>
                  </div>
                  <div className="p-2">
                    {isAdmin && (
                      <Link href="/admin" className="md:hidden flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-600/10 transition-colors text-blue-500">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Admin Panel</span>
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                      <User size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Profil Ayarları</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                      <Settings size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">API Anahtarlarım</span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-500/60 hover:text-red-500 mt-2"
                    >
                      <LogOut size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Güvenli Çıkış</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
