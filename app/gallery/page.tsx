'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Trash2, Download, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';
import ImageEditor from '@/components/organisms/ImageEditor';

export default function GalleryPage() {
  const { showToast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/studio/images'); // Bu API'yi bir sonraki adımda yazacağım
      const data = await res.json();
      if (data.images) setImages(data.images);
    } catch (error) {
      showToast('Galeri yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğine emin misin?')) return;
    try {
      const res = await fetch(`/api/studio/images?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        showToast('Görsel silindi.', 'success');
      }
    } catch (error) {
      showToast('Silme işlemi başarısız.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">BENİM <span className="text-blue-500">GALERİM</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">Ürettiğin tüm otonom eserler burada saklanır.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Görsel ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-white/5 rounded-3xl" />)}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            <ImageIcon className="text-white/10 mb-4" size={64} />
            <p className="text-xs font-black text-white/20 uppercase tracking-widest">Henüz bir görsel üretilmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key={img.id} 
                className="group relative aspect-square bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl"
              >
                <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className="flex-1 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                      DÜZENLE
                    </button>
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="p-2 bg-red-500/20 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageEditor 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
          onSave={(newUrl) => { setSelectedImage(null); fetchGallery(); }} 
        />
      )}
    </div>
  );
}
