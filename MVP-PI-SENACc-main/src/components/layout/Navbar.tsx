import { Menu, Bell } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-stone-600 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-stone-500">Bem-vindo ao</p>
          <p className="font-semibold text-stone-800">BookClub Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-stone-100 text-stone-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-amber-700">AS</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-stone-700">Ana Silva</p>
            <p className="text-xs text-stone-500">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  );
}
