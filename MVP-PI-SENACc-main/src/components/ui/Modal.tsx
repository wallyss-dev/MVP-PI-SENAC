import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative bg-cream-50 rounded-lg shadow-2xl shadow-ink-900/10 w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-slow`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-ink-100/40">
          <h2 className="font-serif text-2xl font-light text-ink-900">{title}</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700 p-1.5 rounded-md hover:bg-cream-100 transition-colors duration-300">
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-8 py-7">{children}</div>
      </div>
    </div>
  );
}
