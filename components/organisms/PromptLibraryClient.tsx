'use client';

import { useState } from 'react';
import { Search, Sparkles, X, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptCard from '@/components/molecules/PromptCard';
import { useMixerStore } from '@/lib/core/store';
import { useToast } from '@/components/atoms/Toast';

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'Fashion', label: 'Moda' },
  { id: 'Portrait', label: 'Portre' },
  { id: 'Cyberpunk', label: 'Siberpunk' },
  { id: 'Nature', label: 'Doğa' },
  { id: 'Luxury', label: 'Lüks' },
  { id: 'Art', label: 'Sanat' },
  { id: 'Street', label: 'Sokak' },
];

export default function PromptLibraryClient({ initialPrompts }: { initialPrompts: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mixerActive, setMixerActive] = useState(false);
  const [activePrompt, setActivePrompt] = useState<any>(null);
  
  const mixer = useMixerStore();
  const { showToast } = useToast();

  const filteredPrompts = initialPrompts.filter(p => {
    const matchesSearch = p.collection.toLowerCase().includes(search.toLowerCase()) || 
                         p.explanation?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.collection === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenMixer = (item: any) => {
    setActivePrompt(item);
    mixer.initializeFromPrompt(item.template, item.defaults);
    setMixerActive(true);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">PROMPT <span className="text-blue-500">KÜTÜPHANESİ</span></h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">İlham alabileceğin profesyonel şablonlar.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Stil veya tema ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-xl"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${selectedCategory === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPrompts.map((p, i) => (
          <PromptCard key={i} item={p} onOpenMixer={handleOpenMixer} />
        ))}
      </div>

      {/* Mixer Modal could go here or redirect to Studio with the selected prompt */}
    </div>
  );
}
