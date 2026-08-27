import { type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-red-200/60 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.25} />
        </div>
        <p className="text-sm text-ink-500 pt-1.5 leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-10">
        <Button variant="outline" onClick={onClose}>{cancelLabel}</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && <div className="text-ink-200 mb-6">{icon}</div>}
      <h3 className="font-serif text-xl font-light text-ink-600">{title}</h3>
      {message && <p className="text-sm text-ink-400 mt-3 max-w-sm leading-relaxed">{message}</p>}
      {action && <div className="mt-10">{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className="flex items-center justify-center py-24">
      <div className={`${sizes[size]} border border-ink-100 border-t-accent-500 rounded-full animate-spin`} />
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>Anterior</Button>
      <span className="text-[11px] text-ink-400 tracking-wider-editorial uppercase">Página {currentPage} de {totalPages}</span>
      <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>Próxima</Button>
    </div>
  );
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Search({ value, onChange, placeholder = 'Buscar...' }: SearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-72 rounded-md border border-ink-200/60 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors duration-300"
    />
  );
}
