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
        <div className="fixed inset-0 bg-ink-900/30 backdrop-blur-sm z-30 lg:hidden animate-fade-in" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-ink-900 text-cream-100 flex flex-col transition-transform duration-400 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-8 pt-10 pb-10 border-b border-ink-700/30">
          <div className="flex items-center gap-3.5">
            <BookOpenCheck className="w-7 h-7 text-accent-400" strokeWidth={1} />
            <div>
              <h1 className="font-serif text-xl font-light text-cream-50 leading-tight">BookClub <span className="italic text-accent-400">Hub</span></h1>
              <p className="text-[9px] text-ink-500 tracking-widest-editorial uppercase mt-1">Gestão de Clubes</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-500 hover:text-cream-50 transition-colors duration-300">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-4 px-4 py-3 rounded-md text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-cream-50 font-medium'
                      : 'text-ink-500 hover:text-cream-100 font-normal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-7 bg-accent-500 rounded-full" />
                    )}
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <span className="tracking-editorial">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-8 py-7 border-t border-ink-700/30 text-[9px] text-ink-600 tracking-widest-editorial uppercase">
          <p>BookClub Hub v1.0</p>
          <p className="mt-1 text-ink-700">PostgreSQL + Flask + React</p>
        </div>
      </aside>
    </>
  );
}
