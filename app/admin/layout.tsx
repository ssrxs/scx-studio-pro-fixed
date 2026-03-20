'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Image as ImageIcon, 
  MessageSquare, Settings, ShieldCheck, Zap
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  // STRICT ADMIN CHECK
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col pt-24">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest italic">Admin <span className="text-blue-500">Panel</span></h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
            { label: 'Kullanıcılar', href: '/admin/users', icon: <Users size={18} /> },
            { label: 'Tüm Görseller', href: '/admin/images', icon: <ImageIcon size={18} /> },
            { label: 'Geri Bildirimler', href: '/admin/feedback', icon: <MessageSquare size={18} /> },
            { label: 'Sistem Durumu', href: '/admin/system', icon: <Zap size={18} /> },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <Link href="/" className="text-[10px] font-black uppercase text-blue-500 hover:underline">← Studio'ya Dön</Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-12 pt-24 overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
