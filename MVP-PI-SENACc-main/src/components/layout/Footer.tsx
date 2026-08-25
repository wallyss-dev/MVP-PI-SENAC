import { BookOpenCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-amber-600" />
          <span>BookClub Hub - Plataforma de Gestão de Clubes de Leitura</span>
        </div>
        <p>© 2026 BookClub Hub. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
