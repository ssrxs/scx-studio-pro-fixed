'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, 
  Trash2, UserCheck, Shield, ChevronDown
} from 'lucide-react';
import { useToast } from '@/components/atoms/Toast';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterGender]);

  const fetchUsers = async () => {
    setLoading(true);
    const url = filterGender === 'all' ? '/api/admin/users' : `/api/admin/users?gender=${filterGender}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  };

  const updateUser = async (userId: string, data: any) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    if (res.ok) {
      showToast('Kullanıcı güncellendi.', 'success');
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">KULLANICI <span className="text-blue-500">YÖNETİMİ</span></h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Tüm üyeleri filtrele, yetkilendir ve düzenle.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5">
          {['all', 'female', 'male'].map(g => (
            <button
              key={g}
              onClick={() => setFilterGender(g)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterGender === g ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              {g === 'all' ? 'Tümü' : g === 'female' ? 'Kadın' : 'Erkek'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Kullanıcı</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Cinsiyet</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Rol</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">İstatistik</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={u.image || ''} className="w-10 h-10 rounded-full border border-white/10" alt="Avatar" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{u.name || 'İsimsiz'}</p>
                      <p className="text-[10px] text-white/20 font-bold">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <select 
                    value={u.gender || ''} 
                    onChange={(e) => updateUser(u.id, { gender: e.target.value })}
                    className="bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Belirsiz</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kadın</option>
                  </select>
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => updateUser(u.id, { role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${u.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}
                  >
                    {u.role}
                  </button>
                </td>
                <td className="p-6 text-center">
                  <div className="flex justify-center gap-4 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/20">{u._count.generatedImages} Görsel</span>
                    <span className="text-white/20">{u._count.characters} DNA</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-white/10 hover:text-white transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Users className="mx-auto mb-4 text-white/5" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Kullanıcı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
