
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Film, 
  Armchair, 
  Ticket as TicketIcon, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Search,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Trash2,
  Edit,
  ArrowRightLeft,
  Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ViewType, Director, Play, Seat, Ticket } from './types';
import { INITIAL_DIRECTORS, INITIAL_PLAYS, INITIAL_SEATS, INITIAL_TICKETS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Database states
  const [directors, setDirectors] = useState<Director[]>(() => {
    const saved = localStorage.getItem('directors_pro');
    return saved ? JSON.parse(saved) : INITIAL_DIRECTORS;
  });
  const [plays, setPlays] = useState<Play[]>(() => {
    const saved = localStorage.getItem('plays_pro');
    return saved ? JSON.parse(saved) : INITIAL_PLAYS;
  });
  const [seats, setSeats] = useState<Seat[]>(() => {
    const saved = localStorage.getItem('seats_pro');
    return saved ? JSON.parse(saved) : INITIAL_SEATS;
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('tickets_pro');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // Sync to local storage
  useEffect(() => localStorage.setItem('directors_pro', JSON.stringify(directors)), [directors]);
  useEffect(() => localStorage.setItem('plays_pro', JSON.stringify(plays)), [plays]);
  useEffect(() => localStorage.setItem('seats_pro', JSON.stringify(seats)), [seats]);
  useEffect(() => localStorage.setItem('tickets_pro', JSON.stringify(tickets)), [tickets]);
  useEffect(() => localStorage.setItem('isAuth', String(isAuthenticated)), [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const resetData = () => {
    if (confirm("Haqiqatan ham barcha ma'lumotlarni dastlabki holatga qaytarmoqchimisiz?")) {
      setDirectors(INITIAL_DIRECTORS);
      setPlays(INITIAL_PLAYS);
      setSeats(INITIAL_SEATS);
      setTickets(INITIAL_TICKETS);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Film size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">TEATR PRO</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('dashboard')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Rejissyorlar" 
            active={currentView === 'directors'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('directors')}
          />
          <SidebarItem 
            icon={<Film size={20} />} 
            label="Spektakllar" 
            active={currentView === 'plays'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('plays')}
          />
          <SidebarItem 
            icon={<Armchair size={20} />} 
            label="Zal Sxemasi" 
            active={currentView === 'seats'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('seats')}
          />
          <SidebarItem 
            icon={<TicketIcon size={20} />} 
            label="Sotilgan Chiptalar" 
            active={currentView === 'tickets'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('tickets')}
          />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <SidebarItem 
              icon={<MessageSquare size={20} />} 
              label="AI Assistant" 
              active={currentView === 'ai_assistant'} 
              expanded={isSidebarOpen}
              onClick={() => setCurrentView('ai_assistant')}
              color="text-purple-400"
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={resetData}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-slate-800 transition-all text-sm"
          >
            <ArrowRightLeft size={18} />
            {isSidebarOpen && <span>Reset</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Chiqish</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Id yoki nom bo'yicha qidiruv..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">Admin</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Asosiy Boshqaruvchi</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">A</div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-[#fdfdfd]">
          {renderView(currentView, { directors, setDirectors, plays, setPlays, seats, setSeats, tickets, setTickets })}
        </section>
      </main>
    </div>
  );
};

// Sub-components

const LoginScreen: React.FC<{ onLogin: (e: React.FormEvent) => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] opacity-50" />
    <div className="max-w-md w-full glass p-10 rounded-3xl shadow-2xl relative z-10 border border-slate-800">
      <div className="flex justify-center mb-8">
        <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
          <Film className="text-white" size={40} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Xush kelibsiz</h1>
      <p className="text-center text-slate-500 mb-8">Teatr Axborot Tizimi (Pro)</p>
      
      <form onSubmit={onLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Login</label>
          <input 
            type="text" 
            required
            defaultValue="admin"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Parol</label>
          <input 
            type="password" 
            required
            defaultValue="1111"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98]"
        >
          Kirish
        </button>
      </form>
      <div className="mt-8 pt-8 border-t border-slate-100">
        <p className="text-center text-slate-400 text-xs font-medium uppercase tracking-widest">Powered by Gemini AI</p>
      </div>
    </div>
  </div>
);

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  expanded?: boolean; 
  onClick?: () => void;
  color?: string;
}> = ({ icon, label, active, expanded, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    <div className={active ? 'text-white' : color || 'text-slate-400'}>{icon}</div>
    {expanded && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);

// Helper Views
const renderView = (view: ViewType, data: any) => {
  switch (view) {
    case 'dashboard': return <DashboardView {...data} />;
    case 'directors': return <DirectorsView {...data} />;
    case 'plays': return <PlaysView {...data} />;
    case 'seats': return <SeatsView {...data} />;
    case 'tickets': return <TicketsView {...data} />;
    case 'ai_assistant': return <AIAssistant {...data} />;
    default: return <DashboardView {...data} />;
  }
};

const DashboardView: React.FC<any> = ({ directors, plays, seats, tickets }) => {
  const totalRevenue = tickets.reduce((acc: number, t: Ticket) => {
    const seat = seats.find((s: Seat) => s.id === t.joy_id);
    return acc + (seat?.narx || 0);
  }, 0);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Boshqaruv Paneli</h2>
          <p className="text-gray-500 mt-1">Sizning teatr imperiyangiz statistikasi</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
            <TrendingUp size={18} />
            <span className="font-bold">{totalRevenue.toLocaleString()} so'm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Rejissyorlar" value={directors.length} icon={<Users size={24} />} color="bg-blue-50 text-blue-600" />
        <StatCard title="Spektakllar" value={plays.length} icon={<Film size={24} />} color="bg-purple-50 text-purple-600" />
        <StatCard title="O'rinlar" value={seats.length} icon={<Armchair size={24} />} color="bg-orange-50 text-orange-600" />
        <StatCard title="Sotilgan Chiptalar" value={tickets.length} icon={<TicketIcon size={24} />} color="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Oxirgi Sotuvlar</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">Hammasini ko'rish</button>
          </div>
          <div className="divide-y divide-gray-50">
            {tickets.slice(-6).reverse().map((t: any) => {
              const play = plays.find((p: any) => p.id === t.spektakl_id);
              return (
                <div key={t.id} className="p-4 hover:bg-gray-50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                      ID:{t.id}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t.xaridor}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{play?.title || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{t.sana}</p>
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-tighter">To'langan</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6">Janrlar Bo'yicha</h3>
            <div className="space-y-4">
              {['Drama', 'Komediya', 'Tragediya', 'Tarixiy'].map((genre, idx) => {
                const count = plays.filter((p: Play) => p.janr === genre).length;
                const percent = Math.round((count / plays.length) * 100);
                return (
                  <div key={genre}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-gray-700">{genre}</span>
                      <span className="text-xs font-bold text-gray-400">{count} ta ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500'][idx]}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
              <MessageSquare size={100} />
            </div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">AI Maslahatchi</p>
            <p className="text-sm leading-relaxed text-slate-300">
              "Tarixiy spektakllar sotuvi o'tgan haftaga nisbatan 15% ga oshgan. Reklamani ko'paytirishni maslahat beraman."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DirectorsView: React.FC<any> = ({ directors, setDirectors }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', tajriba_yili: 0, tugilgan_yili: 2000 });
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = directors.filter((d: Director) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toString() === searchTerm
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setDirectors(directors.map((d: any) => d.id === editingId ? { ...d, ...formData } : d));
    } else {
      setDirectors([{ ...formData, id: Date.now() }, ...directors]);
    }
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Rejissyorlar ({directors.length})</h2>
          <p className="text-gray-500 mt-1">Teatr jamoasidagi mutaxassislar ro'yxati</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => { setShowModal(true); setEditingId(null); setFormData({ name: '', tajriba_yili: 5, tugilgan_yili: 1985 }); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={18} /> Yangi qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left table-fixed">
            <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
              <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">F.I.SH</th>
                <th className="px-6 py-4">Tajriba</th>
                <th className="px-6 py-4">Tug'ilgan yil</th>
                <th className="px-6 py-4 text-right w-32">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((d: any) => (
                <tr key={d.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">#{d.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {d.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-gray-900">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{d.tajriba_yili} yil</td>
                  <td className="px-6 py-4 text-gray-600">{d.tugilgan_yili}</td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button onClick={() => { setEditingId(d.id); setFormData(d); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"><Edit size={16} /></button>
                    <button onClick={() => setDirectors(directors.filter((x: any) => x.id !== d.id))} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-400 italic">Ma'lumot topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'O\'zgartirish' : 'Yangi Rejissyor'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ism sharifi</label>
                <input 
                  type="text" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tajribasi (yil)</label>
                  <input 
                    type="number" required 
                    value={formData.tajriba_yili} onChange={e => setFormData({...formData, tajriba_yili: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tug'ilgan yili</label>
                  <input 
                    type="number" required 
                    value={formData.tugilgan_yili} onChange={e => setFormData({...formData, tugilgan_yili: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-all">Bekor qilish</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PlaysView: React.FC<any> = ({ plays, setPlays, directors }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', janr: 'Drama', yil: 2024, rejissyor_id: directors[0]?.id || 0 });
  const [filterGenre, setFilterGenre] = useState('Barchasi');

  const filtered = plays.filter((p: Play) => filterGenre === 'Barchasi' || p.janr === filterGenre);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPlays(plays.map((p: any) => p.id === editingId ? { ...p, ...formData } : p));
    } else {
      setPlays([{ ...formData, id: Date.now() }, ...plays]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Spektakllar ({plays.length})</h2>
          <p className="text-gray-500 mt-1">Repertuardagi barcha asarlar boshqaruvi</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            value={filterGenre}
            onChange={e => setFilterGenre(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            {['Barchasi', 'Drama', 'Komediya', 'Tragediya', 'Romantika', 'Klassika', 'Tarixiy'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button 
            onClick={() => { setShowModal(true); setEditingId(null); setFormData({ title: '', janr: 'Drama', yil: 2024, rejissyor_id: directors[0]?.id || 0 }); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Yangi Spektakl
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {filtered.map((p: any) => {
          const dir = directors.find((d: any) => d.id === p.rejissyor_id);
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="h-40 overflow-hidden relative bg-slate-100 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={`https://picsum.photos/seed/play-${p.id}/400/200`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                  alt={p.title} 
                />
                <div className="absolute top-3 right-3 z-20 flex gap-2">
                  <button onClick={() => { setEditingId(p.id); setFormData(p); setShowModal(true); }} className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all"><Edit size={14} /></button>
                  <button onClick={() => setPlays(plays.filter((x: any) => x.id !== p.id))} className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{p.janr}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{p.title}</h3>
                  <span className="text-[10px] font-mono text-gray-400 mt-1">#{p.id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs mt-auto">
                  <Users size={12} className="shrink-0" />
                  <span className="truncate">Dir: <span className="text-gray-900 font-semibold">{dir?.name || 'N/A'}</span></span>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400">{p.yil}-yil</span>
                  <button className="text-blue-600 text-xs font-bold flex items-center gap-1">Ko'rish <ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Tahrirlash' : 'Yangi Spektakl'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Spektakl nomi</label>
                <input 
                  type="text" required 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Janri</label>
                  <select 
                    value={formData.janr} onChange={e => setFormData({...formData, janr: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {['Drama', 'Komediya', 'Tragediya', 'Romantika', 'Klassika', 'Tarixiy'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sahnalashtirilgan yil</label>
                  <input 
                    type="number" required 
                    value={formData.yil} onChange={e => setFormData({...formData, yil: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rejissyor</label>
                <select 
                  value={formData.rejissyor_id} onChange={e => setFormData({...formData, rejissyor_id: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {directors.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-all">Bekor qilish</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SeatsView: React.FC<any> = ({ seats, tickets }) => (
  <div className="p-8 space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Zal Sxemasi</h2>
        <p className="text-gray-500 mt-1">O'rinlarni bandlik holati va narxlar tahlili</p>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20" /> 
          <span className="text-xs font-bold text-gray-600">Bo'sh ({seats.length - tickets.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-red-500 shadow-lg shadow-red-500/20" /> 
          <span className="text-xs font-bold text-gray-600">Band ({tickets.length})</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 overflow-x-auto min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <div className="relative h-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
            <span className="relative z-10 text-[10px] text-white font-bold uppercase tracking-[0.5em]">Teatr Sahnasi</span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-3 md:gap-4">
          {seats.map((s: any) => {
            const isBooked = tickets.some((t: any) => t.joy_id === s.id);
            const ticket = tickets.find((t: any) => t.joy_id === s.id);
            return (
              <div key={s.id} className="relative group flex flex-col items-center">
                <button 
                  disabled={isBooked}
                  className={`
                    w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
                    ${isBooked ? 'bg-red-500 text-white cursor-not-allowed scale-95 opacity-80' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:-translate-y-1 hover:shadow-xl hover:scale-110'}
                  `}
                >
                  <Armchair size={18} />
                </button>
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 z-50 pointer-events-none whitespace-nowrap shadow-2xl">
                  <div className="font-bold border-b border-slate-700 pb-1 mb-1">ID: #{s.id} | Qator: {s.qator}, O'rin: {s.orin}</div>
                  <div className="text-emerald-400 font-semibold">Narx: {s.narx.toLocaleString()} so'm</div>
                  {isBooked && <div className="text-red-400 mt-1 border-t border-slate-700 pt-1">Xaridor: {ticket?.xaridor}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-12 pt-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">VIP Qatorlar</p>
            <div className="flex gap-2">
              {[1, 2, 3].map(q => <div key={q} className="w-6 h-1 bg-amber-400 rounded-full" />)}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Standart</p>
            <div className="flex gap-2">
              {[1, 2, 3].map(q => <div key={q} className="w-6 h-1 bg-gray-200 rounded-full" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TicketsView: React.FC<any> = ({ tickets, setTickets, plays, seats }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ spektakl_id: plays[0]?.id || 0, joy_id: 0, xaridor: '', sana: new Date().toISOString().split('T')[0] });
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tickets.filter((t: Ticket) => 
    t.xaridor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toString() === searchTerm
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.joy_id) {
      alert("Iltimos, bo'sh o'rinni tanlang");
      return;
    }
    setTickets([{ ...formData, id: Date.now() }, ...tickets]);
    setShowModal(false);
  };

  const freeSeats = seats.filter((s: Seat) => !tickets.some((t: Ticket) => t.joy_id === s.id));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Chipta Sotuvlari ({tickets.length})</h2>
          <p className="text-gray-500 mt-1">Sotuvlar tarixi va yangi chiptalarni rasmiylashtirish</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Xaridor nomi..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <button 
            onClick={() => { setShowModal(true); setFormData({ spektakl_id: plays[0]?.id || 0, joy_id: freeSeats[0]?.id || 0, xaridor: '', sana: new Date().toISOString().split('T')[0] }); }}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Yangi Sotuv
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left table-fixed">
            <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
              <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Xaridor</th>
                <th className="px-6 py-4">Spektakl</th>
                <th className="px-6 py-4">Joy</th>
                <th className="px-6 py-4">Sana</th>
                <th className="px-6 py-4 text-right w-24">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t: any) => {
                const play = plays.find((p: any) => p.id === t.spektakl_id);
                const seat = seats.find((s: any) => s.id === t.joy_id);
                return (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-6 py-4 text-xs font-mono text-blue-500 font-bold">#{t.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 truncate">{t.xaridor}</td>
                    <td className="px-6 py-4 text-gray-600 truncate">{play?.title || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">Q:{seat?.qator} O:{seat?.orin}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium text-xs">{t.sana}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setTickets(tickets.filter((x: any) => x.id !== t.id))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-12 text-center text-gray-400">Hech narsa topilmadi</div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chipta Rasmiylashtirish</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Xaridor F.I.SH</label>
                <input 
                  type="text" required 
                  placeholder="Masalan: Aziz Rahimov"
                  value={formData.xaridor} onChange={e => setFormData({...formData, xaridor: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Spektakl</label>
                <select 
                  value={formData.spektakl_id} onChange={e => setFormData({...formData, spektakl_id: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  {plays.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bo'sh O'rinlar</label>
                  <select 
                    value={formData.joy_id} onChange={e => setFormData({...formData, joy_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  >
                    {freeSeats.length > 0 ? (
                      freeSeats.map((s: any) => <option key={s.id} value={s.id}>Q:{s.qator} O:{s.orin} ({s.narx.toLocaleString()})</option>)
                    ) : <option disabled>Bo'sh joy yo'q</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sana</label>
                  <input 
                    type="date" required 
                    value={formData.sana} onChange={e => setFormData({...formData, sana: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg">Bekor qilish</button>
                <button type="submit" disabled={freeSeats.length === 0} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50">Sotish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AIAssistant: React.FC<any> = ({ directors, plays, tickets, seats }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `
        Sen professional Teatr Ma'lumotlar Tizimi tahlilchisisan.
        Menda 50+ rejissyor, 50+ spektakl va 60+ sotilgan chipta bor.
        Ma'lumotlar statistikasi:
        - Rejissyorlar soni: ${directors.length}
        - Spektakllar soni: ${plays.length}
        - Sotilgan chiptalar: ${tickets.length}
        - Jami o'rinlar: ${seats.length}
        
        Savolga tizim ma'lumotlari asosida to'liq, aniq va professional javob ber. 
        Agar statistik ma'lumot so'ralsa, aniq raqamlarni keltir.
      `;
      
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${context}\n\nFoydalanuvchi savoli: ${query}`,
      });

      setResponse(res.text || "Kechirasiz, ma'lumot topa olmadim.");
    } catch (error) {
      setResponse("AI bilan bog'lanishda xatolik yuz berdi. API kalitini tekshiring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="text-center py-8">
        <div className="inline-flex p-5 rounded-[2rem] bg-purple-600 text-white mb-6 shadow-2xl shadow-purple-500/40 relative">
          <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-[2rem] scale-75" />
          <MessageSquare size={48} className="relative z-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">AI Analitika Markazi</h2>
        <p className="text-slate-500 text-lg font-medium">Ma'lumotlaringizni aqlli tahlil qiling va savollaringizga javob oling</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-500/5 border border-purple-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
        <form onSubmit={askAI} className="relative mb-10">
          <input 
            type="text" 
            placeholder="Masalan: 'Eng ko'p foyda keltirgan janr qaysi?' yoki 'Rejissyorlar tajribasi bo'yicha tahlil ber'" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-8 pr-36 py-6 bg-slate-50 border border-slate-100 rounded-3xl text-xl font-medium text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-purple-200 outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-500/30 hover:bg-purple-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? 'Tahlil...' : 'So\'rash'}
          </button>
        </form>

        {response && (
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 animate-in slide-in-from-top-6 duration-500">
            <div className="flex items-center gap-2 mb-6 text-purple-400">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Tizim Tahlili Natijasi</span>
            </div>
            <div className="text-slate-100 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {response}
            </div>
          </div>
        )}

        <div className="mt-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tezkor savollar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Eng ko'p spektakl qo'ygan rejissyorlar kuchli beshligi",
              "Sotilgan chiptalar va daromad hisoboti",
              "2022-yildan keyingi spektakllar ro'yxati",
              "Zaldagi bandlik ko'rsatkichlari tahlili"
            ].map(q => (
              <button 
                key={q}
                onClick={() => setQuery(q)}
                className="text-left p-4 bg-white border border-slate-100 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all text-sm font-bold text-slate-600 flex items-center gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-purple-400 transition-colors" />
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
