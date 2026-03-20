'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, Clock, AlertTriangle, User } from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';

export default function AdminFeedback() {
  const { showToast } = useToast();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const res = await fetch('/api/admin/feedback');
    const data = await res.json();
    if (data.feedbacks) setFeedbacks(data.feedbacks);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      showToast('Durum güncellendi.', 'success');
      fetchFeedbacks();
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">GERİ <span className="text-blue-500">BİLDİRİMLER</span></h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2 text-white">Kullanıcı deneyimini iyileştirmek için gelen mesajlar.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 text-white">
        {feedbacks.map((f) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={f.id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === 'BUG' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                  {f.type === 'BUG' ? <AlertTriangle size={18} /> : <MessageSquare size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">{f.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={10} className="text-white/20" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">{f.user.name} ({f.user.email})</span>
                  </div>
                </div>
              </div>
              <select 
                value={f.status} 
                onChange={(e) => updateStatus(f.id, e.target.value)}
                className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border outline-none ${f.status === 'OPEN' ? 'bg-red-500/10 border-red-500/20 text-red-500' : f.status === 'RESOLVED' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                <option value="OPEN">AÇIK</option>
                <option value="IN_PROGRESS">İŞLENİYOR</option>
                <option value="RESOLVED">ÇÖZÜLDÜ</option>
                <option value="CLOSED">KAPANDI</option>
              </select>
            </div>
            <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 italic">"{f.message}"</p>
          </motion.div>
        ))}
        {feedbacks.length === 0 && !loading && (
          <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <MessageSquare className="mx-auto mb-4 text-white/5" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-white">Henüz bildirim gelmedi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
