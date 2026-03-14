'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Smile, Maximize2, Eraser, 
  Move, ZoomIn, RotateCw, Check, Loader2, Camera, Zap, Layers
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dynamic from 'next/dynamic';
import { SCX_VAULT } from '@/lib/scx-vault';

// CanvasDraw SSR hatasını engellemek için dinamik yükleme
const CanvasDraw = dynamic(() => import('react-canvas-draw'), { ssr: false });

/**
 * ImageEditor: SCX Studio'nun "Diyafram" mekanizmalı ana düzenleme motoru.
 * Kullanıcıların üretilen görseller üzerinde cerrahi işlemler yapmasını sağlar.
 */

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}

export default function ImageEditor({ imageUrl, onClose, onSave }: ImageEditorProps) {
  // --- DURUM YÖNETİMİ ---
  const [isApertureOpen, setIsApertureOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true); // Mobilde başlangıçta kapalı olabilir
  const [activeTab, setActiveTab] = useState<'retouch' | 'face' | 'vault' | 'fx'>('vault');
  const [selectedGender, setSelectedGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<any>(null);
  
  // Diyafram animasyonunu tetikle
  useEffect(() => {
    const timer = setTimeout(() => setIsApertureOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * AI Düzenleme Eylemlerini Yönetir
   */
  const handleApplyAction = async (action: string, params: any = {}) => {
    setIsProcessing(true);
    try {
      console.log(`SCX Action: ${action}`, params);
      // Fal.ai entegrasyonu için bekleme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
      
      {/* 1. DIYAFRAM ANIMASYONU */}
      <AnimatePresence>
        {!isApertureOpen && (
          <motion.div 
            initial={{ scale: 1 }}
            exit={{ scale: 3, opacity: 0, rotate: 120 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[110] flex items-center justify-center overflow-hidden pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-[200vmax] h-[200vmax] text-neutral-900 fill-current">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <path key={i} d="M50,50 L100,0 L100,100 Z" transform={`rotate(${angle} 50 50)`} />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex h-full w-full flex-col lg:flex-row">
        {/* Kapat Butonu */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[120] rounded-full bg-white/5 border border-white/10 p-3 text-white hover:bg-red-500/20 hover:text-red-500 transition-all">
          <X size={24} />
        </button>

        {/* SOL: GÖRSEL İŞLEME */}
        <div className="flex-1 relative bg-neutral-950 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
          <TransformWrapper initialScale={1} minScale={0.5} maxScale={10} centerOnInit>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl text-white">
                  <button onClick={() => zoomIn()}><ZoomIn size={20}/></button>
                  <button onClick={() => resetTransform()} className="px-4 py-1 text-[10px] font-black border-x border-white/10">SIFIRLA</button>
                  <button onClick={() => zoomOut()}><Maximize2 size={20}/></button>
                </div>

                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                  <div className="relative">
                    {activeTab === 'retouch' ? (
                      <CanvasDraw
                        ref={canvasRef}
                        imgSrc={imageUrl}
                        brushColor="rgba(250, 204, 21, 0.5)"
                        brushRadius={3}
                        canvasWidth={800}
                        canvasHeight={1000}
                        lazyRadius={0}
                        className="rounded-lg shadow-2xl"
                      />
                    ) : (
                      <img src={imageUrl} alt="SCX" className="max-h-[85vh] w-auto rounded-lg shadow-2xl object-contain pointer-events-none" />
                    )}
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-[60]">
                        <Loader2 className="animate-spin text-yellow-400" size={60} />
                        <p className="mt-6 text-yellow-400 font-black tracking-[0.3em] uppercase text-xs">Yapay Zeka İşliyor</p>
                      </div>
                    )}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* SAĞ: KONTROL PANELİ */}
        <div className="relative flex h-full items-center">
          <button 
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-[130] bg-yellow-400 text-black p-3 rounded-l-2xl shadow-[-15px_0_30px_rgba(250,204,21,0.3)] hover:scale-110 transition-all active:rotate-180"
          >
            <Zap size={24} className={isSidePanelOpen ? 'rotate-180' : ''} />
          </button>

          <AnimatePresence>
            {isSidePanelOpen && (
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="w-full lg:w-[480px] h-full bg-neutral-900/95 backdrop-blur-3xl border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
                <div className="flex border-b border-white/5 bg-black/40">
                  {[
                    { id: 'vault', icon: <Layers size={18}/>, label: 'Vitrin' },
                    { id: 'retouch', icon: <Eraser size={18}/>, label: 'Rötuş' },
                    { id: 'face', icon: <Smile size={18}/>, label: 'Yüz Lab' },
                    { id: 'fx', icon: <Zap size={18}/>, label: 'Efektler' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex flex-col items-center gap-1 py-6 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'text-yellow-400 bg-yellow-400/5 border-b-2 border-yellow-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-8 overflow-y-auto scrollbar-hide space-y-10">
                  {activeTab === 'vault' && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-white italic uppercase italic">SCX Vault</h3>
                        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                          {(['women', 'men', 'unisex'] as const).map(g => (
                            <button key={g} onClick={() => setSelectedGender(g)} className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${selectedGender === g ? 'bg-white/10 text-white' : 'text-neutral-600'}`}>
                              {g === 'women' ? 'Kadın' : g === 'men' ? 'Erkek' : 'Unisex'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {SCX_VAULT[selectedGender].categories.map((cat: any) => (
                          <div key={cat.id} className="col-span-full space-y-4">
                            <h4 className="text-[11px] font-black text-yellow-400/50 uppercase tracking-[0.3em] border-b border-white/5 pb-2">{cat.name}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {cat.styles[0].items.map((item: any) => (
                                <div key={item.id} onClick={() => handleApplyAction('add_accessory', item)} className="group relative aspect-[4/5] bg-gradient-to-br from-neutral-800 to-black rounded-2xl border border-white/5 p-4 flex flex-col items-center justify-center gap-3 hover:border-yellow-400 transition-all cursor-pointer overflow-hidden shadow-xl">
                                  <Sparkles className="text-neutral-700 group-hover:text-yellow-400 transition-all" size={32} />
                                  <div className="text-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">{item.name}</p>
                                    {item.postureImpact && <span className="text-[8px] text-yellow-400/60 font-bold uppercase">Anatomik</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diğer Tablar: face, retouch, fx... */}
                  {activeTab === 'face' && (
                    <div className="space-y-10">
                      <div className="space-y-4 text-white">
                        <label className="text-[10px] font-black uppercase tracking-widest">Gülümseme Şiddeti</label>
                        <input type="range" className="w-full h-1 bg-white/5 rounded-full accent-yellow-400" />
                      </div>
                      <div className="space-y-6 text-white">
                        <label className="text-[10px] font-black uppercase tracking-widest">Bakış Yönü (3D)</label>
                        <div className="aspect-square w-48 mx-auto bg-black/60 rounded-full border-4 border-white/5 relative flex items-center justify-center shadow-inner">
                          <motion.div drag dragConstraints={{ left: -60, right: 60, top: -60, bottom: 60 }} className="w-14 h-14 bg-yellow-400 rounded-full cursor-grab" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-black/60 border-t border-white/10">
                  <button onClick={() => onSave(imageUrl)} className="w-full py-5 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]">
                    <Check size={22} strokeWidth={3} /> STÜDYOYU KAYDET VE ÇIK
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
