'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, User, Trash2, CheckCircle2, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

export default function StudioPage() {
  const [referenceImage, setReferenceImage] = useState(null);
  const [uploading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      // Simüle edilmiş yükleme (Backend API hazır olduğunda gerçek yükleme yapılacak)
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result);
        setLoading(false);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // Burada Prisma üzerinden User tablosundaki referenceImage güncellenecek
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="text-yellow-400" /> AI Kişisel Stüdyon
            </h1>
            <p className="text-neutral-400 mt-2">Yüzünüzü bir kez tanıtın, tüm promptlarda kendinizi görün.</p>
          </div>
          <a href="/" className="text-sm text-neutral-500 hover:text-white transition-colors">← Galeriye Dön</a>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-400" /> Güvenlik & Gizlilik
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Yüklediğiniz fotoğraf sadece size özel üretimler yapmak için kullanılır. Üçüncü taraflarla paylaşılmaz ve istediğiniz an silebilirsiniz.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-neutral-500">İpuçları</h3>
              <ul className="text-xs text-neutral-400 space-y-3">
                <li>• Net ve iyi ışıklandırılmış bir selfie seçin.</li>
                <li>• Yüzünüzde gözlük veya maske olmamasına dikkat edin.</li>
                <li>• Arka planın sade olması başarıyı artırır.</li>
              </ul>
            </div>
          </div>

          {/* Right: Upload Area */}
          <div className="md:col-span-2">
            <div className={`relative rounded-3xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center min-h-[400px] ${
              referenceImage ? 'border-yellow-400/50 bg-yellow-400/5' : 'border-white/10 bg-white/5'
            }`}>
              {referenceImage ? (
                <div className="relative w-full max-w-xs aspect-square">
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={referenceImage} 
                    className="w-full h-full object-cover rounded-2xl ring-4 ring-yellow-400/20 shadow-2xl"
                  />
                  <button 
                    onClick={() => setReferenceImage(null)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-all">
                    <Upload className="text-white group-hover:text-black transition-colors" size={32} />
                  </div>
                  <span className="text-lg font-bold group-hover:text-yellow-400 transition-colors">Referans Fotoğrafını Yükle</span>
                  <p className="text-sm text-neutral-500 mt-2 italic">Sürükleyip bırakabilir veya tıklayabilirsiniz.</p>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Loader2 className="animate-spin text-yellow-400" size={48} />
                </div>
              )}
            </div>

            {referenceImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-end gap-4"
              >
                <button 
                  onClick={saveProfile}
                  disabled={isSaved}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
                    isSaved ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Profil Kaydedildi!</span>
                    </>
                  ) : (
                    <>
                      <User size={20} />
                      <span>Bu Yüzü Karakterim Olarak Tanımla</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
