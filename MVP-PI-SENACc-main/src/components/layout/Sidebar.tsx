import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, BookMarked, CalendarDays,
  Star, Lightbulb, Vote, User, Settings, BookOpenCheck, X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clubs', label: 'Clubes', icon: Users },
  { to: '/books', label: 'Livros', icon: BookOpen },
  { to: '/readings', label: 'Leituras', icon: BookMarked },
  { to: '/meetings', label: 'Encontros', icon: CalendarDays },
  { to: '/reviews', label: 'Avaliações', icon: Star },
  { to: '/suggestions', label: 'Sugestões', icon: Lightbulb },
  { to: '/votes', label: 'Votações', icon: Vote },
  { to: '/profile', label: 'Perfil', icon: User },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-stone-800 text-stone-100 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-stone-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <h1 className="font-bold text-white">BookClub Hub</h1>
              <p className="text-xs text-stone-400">Gestão de Clubes</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-stone-700 text-xs text-stone-400">
          <p>BookClub Hub v1.0</p>
          <p className="mt-1">PostgreSQL + Flask + React</p>
        </div>
      </aside>
    </>
  );
}
