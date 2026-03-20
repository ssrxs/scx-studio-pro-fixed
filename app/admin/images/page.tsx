'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2, User, Calendar, ExternalLink, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';

export default function AdminImages() {
  const { showToast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch('/api/admin/images');
    const data = await res.json();
    if (data.images) setImages(data.images);
    setLoading(false);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Bu görseli sistemden kalıcı olarak silmek istediğine emin misin?')) return;
    const res = await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Görsel silindi.', 'success');
      fetchImages();
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">İÇERİK <span className="text-blue-500">DENETİMİ</span></h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Sistemde üretilen tüm görselleri yönet.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
          {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="aspect-square bg-white/5 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((img) => (
            <motion.div 
              layout
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              key={img.id} 
              className="group relative aspect-square bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-red-500/30 transition-all shadow-2xl"
            >
              <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <div className="mb-4">
                  <p className="text-[9px] font-black uppercase text-white truncate">{img.user.name}</p>
                  <p className="text-[7px] font-bold text-white/40 uppercase truncate">{img.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(img.imageUrl, '_blank')}
                    className="flex-1 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    GÖR
                  </button>
                  <button 
                    onClick={() => deleteImage(img.id)}
                    className="p-2.5 bg-red-500/20 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {images.length === 0 && !loading && (
        <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <ImageIcon className="mx-auto mb-4 text-white/5" size={48} />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-white">Henüz içerik üretilmemiş.</p>
        </div>
      )}
    </div>
  );
}
