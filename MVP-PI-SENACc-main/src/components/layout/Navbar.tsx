import { Menu, Bell } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-cream-50/70 backdrop-blur-md border-b border-ink-100/40 px-8 lg:px-12 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-ink-400 hover:text-ink-900 p-1.5 rounded-md hover:bg-cream-100 transition-colors duration-300">
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="hidden sm:block">
          <p className="text-[10px] text-ink-300 tracking-widest-editorial uppercase">Bem-vindo ao</p>
          <p className="font-serif text-lg font-light text-ink-900">BookClub Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-md hover:bg-cream-100 text-ink-300 hover:text-ink-700 transition-colors duration-300">
          <Bell className="w-4 h-4" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3.5 pl-6 border-l border-ink-100/60">
          <div className="w-9 h-9 rounded-full border border-ink-200/60 flex items-center justify-center">
            <span className="text-[11px] font-medium text-ink-500 tracking-wider-editorial uppercase">AS</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-ink-800">Ana Silva</p>
            <p className="text-[9px] text-ink-400 tracking-widest-editorial uppercase mt-0.5">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  );
}
