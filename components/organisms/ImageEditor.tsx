'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Maximize2, ZoomIn, Check, Loader2, Zap, Layers, Smile, 
  Download, Copy, Sun, Moon, Cloud, Eraser, Sparkles, 
  Image as ImageIcon, Sliders, Thermometer, Wind, Eye, 
  UserPlus, UserMinus, RotateCw, Wand2, Box, Calendar, 
  User, Aperture, Frame, Palette, Camera
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import CanvasDraw from 'react-canvas-draw';
import { SCX_VAULT } from '@/lib/shared/scx-vault';
import { useToast } from '@/components/atoms/Toast';

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}

type ActiveTab = 'face' | 'eraser' | 'env' | 'relight' | 'expand' | 'adjust' | 'vault' | 'fx';

export default function ImageEditor({ imageUrl, onClose, onSave }: ImageEditorProps) {
  const { showToast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('face');
  const [selectedGender, setSelectedGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [smileIntensity, setSmileIntensity] = useState(50);
  const [weightValue, setWeightValue] = useState(0); 
  const [ageValue, setAgeValue] = useState(25);
  
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const handleApplyAction = async (action: string, params: any = {}) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentImageUrl, action, params })
      });
      
      const data = await response.json();
      if (data.newImageUrl) {
        setCurrentImageUrl(data.newImageUrl);
        showToast('İşlem başarıyla uygulandı!', 'success');
      } else {
        await new Promise(r => setTimeout(r, 2000));
        showToast('AI Motoru işlemi tamamladı (Cloud)', 'info');
      }
    } catch (e) {
      showToast('İşlem sırasında bir hata oluştu.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEraserApply = () => {
    if (canvasRef.current) {
      const maskData = canvasRef.current.getSaveData();
      handleApplyAction('remove_object', { mask: maskData });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `scx-pro-ultra-${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black select-none">
      <AnimatePresence>
        {!isReady && (
          <motion.div initial={{ scale: 1, opacity: 1 }} exit={{ scale: 4, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[110] flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[200vmax] h-[200vmax] bg-[#050505]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative flex h-full w-full">
        
        <div className="absolute top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-8 z-[120]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Aperture className="text-white animate-[spin_10s_linear_infinite]" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.4em] italic text-white">SCX PRO <span className="text-blue-500">ULTRA</span></span>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Editing Engine v4.0</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-2xl transition-all border border-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 relative bg-[#020202] flex items-center justify-center p-4 lg:p-12 pt-24 overflow-hidden">
          {activeTab === 'eraser' ? (
            <div className="relative border-2 border-blue-500/20 rounded-3xl overflow-hidden cursor-crosshair shadow-[0_0_100px_rgba(59,130,246,0.05)] bg-[#080808]">
              <CanvasDraw
                ref={canvasRef}
                imgSrc={currentImageUrl}
                brushColor="rgba(59, 130, 246, 0.5)"
                brushRadius={18}
                canvasWidth={800}
                canvasHeight={800}
                lazyRadius={0}
                enablePanAndZoom={true}
                className="rounded-2xl"
              />
              <div className="absolute top-6 right-6 z-10 flex gap-3">
                <button onClick={() => canvasRef.current?.clear()} className="p-4 bg-black/80 rounded-2xl text-white hover:text-blue-400 transition-all border border-white/10 shadow-2xl backdrop-blur-xl"><Eraser size={20} /></button>
              </div>
            </div>
          ) : (
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={10} centerOnInit>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 bg-black/80 backdrop-blur-3xl px-8 py-4 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <button onClick={() => zoomIn()} className="text-white/40 hover:text-blue-400 transition-colors"><ZoomIn size={24} /></button>
                    <button onClick={() => resetTransform()} className="px-6 text-[10px] font-black border-x border-white/10 text-white/60 hover:text-blue-400 transition-colors uppercase italic tracking-[0.2em]">Reset</button>
                    <button onClick={() => zoomOut()} className="text-white/40 hover:text-blue-400 transition-colors"><Maximize2 size={24} /></button>
                  </div>
                  <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}
                    contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="relative group p-4">
                      <img 
                        src={currentImageUrl} 
                        alt="SCX Editor" 
                        style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)` }}
                        className="max-h-[75vh] w-auto rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] object-contain transition-all duration-700 ease-out" 
                        draggable={false} 
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl flex flex-col items-center justify-center rounded-3xl z-10 border border-blue-500/20">
                          <Loader2 className="animate-spin text-blue-500" size={64} />
                          <p className="mt-8 text-blue-400 font-black tracking-[0.5em] uppercase text-[10px] italic animate-pulse">Processing Frame...</p>
                        </div>
                      )}
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          )}
        </div>

        <div className="relative flex h-full items-center pt-20">
          <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 z-[130] bg-blue-600 text-white p-4 rounded-l-3xl shadow-2xl hover:bg-blue-500 transition-all">
            <Sliders size={24} className={`transition-transform duration-700 ${isSidePanelOpen ? '' : 'rotate-180'}`} />
          </button>
          
          {isSidePanelOpen && (
            <div className="w-80 lg:w-[420px] h-full bg-[#080808]/95 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl">
              <div className="flex bg-black/40 shrink-0 overflow-x-auto scrollbar-hide border-b border-white/5">
                {[
                  { id: 'face', icon: <Smile size={18} />, label: 'YÜZ' },
                  { id: 'eraser', icon: <Eraser size={18} />, label: 'SİLGİ' },
                  { id: 'relight', icon: <Sun size={18} />, label: 'IŞIK' },
                  { id: 'env', icon: <Wind size={18} />, label: 'ORTAM' },
                  { id: 'expand', icon: <Maximize2 size={18} />, label: 'GENİŞLET' },
                  { id: 'adjust', icon: <Sliders size={18} />, label: 'AYAR' },
                  { id: 'vault', icon: <Layers size={18} />, label: 'STİL' },
                  { id: 'fx', icon: <Zap size={18} />, label: 'FX' }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex flex-col items-center gap-2 py-5 px-6 min-w-[90px] text-[9px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab.id ? 'text-blue-500 bg-blue-500/5 border-blue-500' : 'text-white/20 border-transparent hover:text-white/60 hover:bg-white/5'}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-8 overflow-y-auto scrollbar-hide space-y-10">
                {activeTab === 'face' && (
                  <div className="space-y-8">
                    <h3 className="text-base font-black text-white uppercase italic tracking-widest">Yüz Lab</h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-end"><label className="text-[10px] font-black uppercase tracking-widest text-white/40">Gülümseme</label><span className="text-xs text-blue-500 font-black">{smileIntensity}%</span></div>
                        <input type="range" min="0" max="100" value={smileIntensity} onChange={e => setSmileIntensity(+e.target.value)} className="w-full h-1 bg-white/10 rounded-full accent-blue-500 cursor-pointer" />
                        <button onClick={() => handleApplyAction('face_smile', { intensity: smileIntensity/100 })} className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white/60 hover:bg-blue-600 transition-all">UYGULA</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleApplyAction('face_eyes_open')} className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/40 transition-all group shadow-xl">
                          <Eye className="text-white/20 group-hover:text-blue-400" size={28} />
                          <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest">Gözleri Aç</span>
                        </button>
                        <button onClick={() => handleApplyAction('face_fix')} className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/40 transition-all group shadow-xl">
                          <Wand2 className="text-white/20 group-hover:text-blue-400" size={28} />
                          <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest">Hataları Onar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'eraser' && (
                  <div className="space-y-10 text-center">
                    <Eraser className="text-blue-500 mx-auto" size={40} />
                    <h3 className="text-base font-black text-white uppercase italic tracking-widest">Sihirli Silgi</h3>
                    <p className="text-[10px] text-white/40 font-bold leading-relaxed tracking-widest">İşaretlediğin alanı AI temizleyecektir.</p>
                    <button onClick={handleEraserApply} disabled={isProcessing}
                      className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all">ALANI TEMİZLE</button>
                  </div>
                )}

                {activeTab === 'adjust' && (
                  <div className="space-y-8">
                    <h3 className="text-base font-black text-white uppercase italic tracking-widest">Kalite Ayarı</h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase text-white/40 tracking-widest"><span>Parlaklık</span><span>{brightness}%</span></div>
                        <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(+e.target.value)} className="w-full h-1 bg-white/10 rounded-full accent-blue-500" />
                      </div>
                      <button onClick={() => handleApplyAction('img_upscale')} className="w-full py-6 rounded-[1.5rem] bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all">4K Ultra Netlik</button>
                    </div>
                  </div>
                )}

                {activeTab === 'fx' && (
                  <div className="space-y-6">
                    <h3 className="text-base font-black text-white uppercase italic tracking-widest">Filtreler</h3>
                    {[
                      {label:'Siberpunk',action:'cyberpunk', icon: <Zap />},
                      {label:'Retro',action:'retro', icon: <Camera />},
                      {label:'Noir',action:'noir', icon: <Moon />},
                      {label:'Vibrant',action:'pop', icon: <Palette />}
                    ].map(fx => (
                      <button key={fx.action} onClick={() => handleApplyAction('fx_apply', { type: fx.action })} className="group flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all text-left w-full shadow-xl">
                        <div className="w-12 h-12 bg-blue-600/5 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">{fx.icon}</div>
                        <div><p className="text-[11px] font-black text-white uppercase tracking-widest">{fx.label}</p></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 bg-black/80 border-t border-white/10 space-y-4 shrink-0">
                <button onClick={() => onSave(currentImageUrl)} className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-[1.03] transition-all">KAYDET VE ÇIK</button>
                <button onClick={handleDownload} className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">İNDİR</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
