import { BookOpenCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-100/40 bg-cream-50 px-8 lg:px-12 py-7">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-400 tracking-wider-editorial uppercase">
        <div className="flex items-center gap-2.5">
          <BookOpenCheck className="w-3.5 h-3.5 text-accent-500" strokeWidth={1.5} />
          <span>BookClub Hub — Plataforma de Gestão de Clubes de Leitura</span>
        </div>
        <p>© 2026 BookClub Hub. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
