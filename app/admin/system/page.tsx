'use client';

import { motion } from 'framer-motion';
import { Zap, Cpu, Server, Database, Globe, Shield, RefreshCw } from 'lucide-react';

export default function AdminSystem() {
  const services = [
    { name: 'Core API Gateway', status: 'Online', latency: '24ms', load: '12%' },
    { name: 'Fal.ai Workers', status: 'Active', latency: '1.2s', load: '45%' },
    { name: 'Together AI Bridge', status: 'Online', latency: '0.8s', load: '22%' },
    { name: 'Segmind Pipeline', status: 'Active', latency: '1.5s', load: '30%' },
    { name: 'Prisma DB Engine', status: 'Stable', latency: '5ms', load: '8%' },
    { name: 'Auth.js Service', status: 'Online', latency: '12ms', load: '5%' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">SİSTEM <span className="text-blue-500">DURUMU</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Altyapı sağlığı ve servis performans verileri.</p>
        </div>
        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        {services.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={s.name}
            className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-blue-500">
                <Cpu size={24} />
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-green-500/20">{s.status}</span>
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">{s.name}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-white/20">Gecikme</span>
                <span className="text-xs font-bold">{s.latency}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/20">Yük</span>
                  <span className="text-[10px] font-bold">{s.load}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: s.load }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Traffic Placeholder */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden h-64 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        <Globe className="text-blue-500 mb-4 animate-pulse" size={48} />
        <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2">Küresel Trafik İzleyici</h3>
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Veri akışı şu an stabil seyrediyor.</p>
      </div>
    </div>
  );
}
