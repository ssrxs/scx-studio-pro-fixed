'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Image as ImageIcon, MessageSquare, 
  TrendingUp, Activity, UserCheck, Shield, Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-12 w-64 bg-white/5 rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-[2.5rem]" />)}
    </div>
  </div>;

  const cards = [
    { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: <Users />, color: 'text-blue-500' },
    { label: 'Üretilen Görsel', value: stats.totalImages, icon: <ImageIcon />, color: 'text-purple-500' },
    { label: 'Karakter DNA', value: stats.totalCharacters, icon: <Zap />, color: 'text-yellow-500' },
    { label: 'Kadın Üyeler', value: stats.femaleUsers, icon: <UserCheck />, color: 'text-pink-500' },
    { label: 'Erkek Üyeler', value: stats.maleUsers, icon: <UserCheck />, color: 'text-blue-400' },
    { label: 'Açık Bildirimler', value: stats.openFeedbacks, icon: <MessageSquare />, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">SİSTEM <span className="text-blue-500">ÖZETİ</span></h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Gerçek zamanlı operasyonel veriler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.label} 
            className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all"
          >
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${card.color}`}>
              {card.icon}
            </div>
            <div className={`${card.color} mb-4`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{card.label}</p>
            <p className="text-4xl font-black italic tracking-tighter">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
            <Activity className="text-green-500" size={18} /> Sistem Sağlığı
          </h3>
          <div className="space-y-6">
            {[
              { label: 'API Gateway', status: 'Online', color: 'text-green-500' },
              { label: 'Prisma Engine', status: 'Active', color: 'text-green-500' },
              { label: 'Auth Service', status: 'Stable', color: 'text-green-500' },
              { label: 'Image Workers', status: '4 Active', color: 'text-blue-500' }
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{s.label}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
            <TrendingUp className="text-blue-500" size={18} /> Hızlı Aksiyonlar
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">DB Bakımı Yap</p>
            </button>
            <button className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center hover:bg-purple-600/20 hover:border-purple-500/40 transition-all group">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Logları Temizle</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
