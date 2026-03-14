'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface PromptItem {
  id: number;
  collection: string;
  prompt: string;
  originalPrompt?: string;
  template?: string;
  defaults?: string;
  explanation?: string;
  imageUrl?: string;
  localPath?: string;
  isRefined: boolean | number;
}

interface PromptCardProps {
  item: PromptItem;
  onOpenMixer: (item: PromptItem) => void;
}

export default function PromptCard({ item, onOpenMixer }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isRefined = item.isRefined === true || (item.isRefined as unknown as number) === 1;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.originalPrompt || item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`break-inside-avoid group relative mb-6 overflow-hidden rounded-3xl bg-neutral-900 ring-1 transition-all ${
        isRefined ? 'ring-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.15)]' : 'ring-white/10 hover:ring-white/30'
      }`}
    >
      {/* Görsel Alanı */}
      <div className="relative aspect-auto min-h-[200px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {(item.localPath || item.imageUrl) && !imgError ? (
          <img
            src={item.localPath || item.imageUrl} 
            alt={item.collection}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
            <Sparkles className="text-neutral-600" size={40} />
          </div>
        )}
        
        {/* Karartma Gradien */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-90' : 'opacity-0 group-hover:opacity-100'}`} />

        {/* PRO Etiketi (Şablonlanmış ise) */}
        {isRefined && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg">
            <Sparkles size={12} />
            <span>Studio Pro</span>
          </div>
        )}
      </div>

      {/* İçerik (Hover veya Genişletilmiş durumda görünür) */}
      <div className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-300 ${isExpanded ? 'translate-y-0 opacity-100 relative bg-black' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 absolute'}`}>
        
        <div className="mb-4">
          <p className={`text-[13px] leading-relaxed text-neutral-200 font-medium ${!isExpanded && 'line-clamp-3'}`}>
            {item.originalPrompt || item.prompt}
          </p>
        </div>

        {/* Genişletilmiş Detaylar (Sadece Şablonlanmışlarda) */}
        <AnimatePresence>
          {isExpanded && isRefined && item.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl bg-white/5 p-4 border border-white/10"
            >
              <h4 className="text-xs font-bold text-yellow-400 mb-1 uppercase tracking-wider">Sanat Stili & Açıklama</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">{item.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aksiyon Butonları */}
        <div className="flex gap-2">
          {isRefined ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenMixer(item); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 shadow-xl"
            >
              <SlidersHorizontal size={18} strokeWidth={2.5} />
              <span>Mikserde Düzenle</span>
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-white/20 backdrop-blur-md"
            >
              {copied ? <><Check size={18} /> Kopyalandı</> : <><Copy size={18} /> Promptu Al</>}
            </button>
          )}
          
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="flex w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
