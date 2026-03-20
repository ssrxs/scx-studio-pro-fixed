'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, FolderOpen, MoreVertical, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';

export default function AlbumsPage() {
  const { showToast } = useToast();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/studio/albums');
      const data = await res.json();
      if (data.albums) setAlbums(data.albums);
    } catch (error) {
      showToast('Albümler yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async () => {
    if (!newAlbumName) return;
    try {
      const res = await fetch('/api/studio/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAlbumName })
      });
      if (res.ok) {
        setNewAlbumName('');
        setIsCreateOpen(false);
        fetchAlbums();
        showToast('Albüm oluşturuldu.', 'success');
      }
    } catch (error) {
      showToast('Hata oluştu.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">ALBÜMLERİM</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">Anılarını ve hikayelerini kategorize et.</p>
          </div>
          
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> YENİ ALBÜM
          </button>
        </div>

        {isCreateOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Albüm Oluştur</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Albüm adı (Örn: Yaz Tatili 2026)" 
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button onClick={createAlbum} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all">OLUŞTUR</button>
              <button onClick={() => setIsCreateOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">İPTAL</button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem]" />)}
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            <FolderOpen className="text-white/10 mb-4" size={64} />
            <p className="text-xs font-black text-white/20 uppercase tracking-widest">Henüz bir albüm oluşturulmamış.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {albums.map((album) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={album.id} 
                className="group bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl relative"
              >
                <div className="aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                  {album.images?.[0] ? (
                    <img src={album.images[0].imageUrl} className="w-full h-full object-cover" alt="Album Cover" />
                  ) : (
                    <ImageIcon className="text-white/10" size={48} />
                  )}
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white mb-1">{album.name}</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{album.images?.length || 0} GÖRSEL</p>
                
                <button className="absolute top-6 right-6 p-2 bg-black/60 rounded-xl text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
