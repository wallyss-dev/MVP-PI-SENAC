import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const baseClass = 'w-full rounded-md border border-ink-200/60 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors duration-300';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2.5">
      {label && <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">{label}</label>}
      <input className={`${baseClass} ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="space-y-2.5">
      {label && <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">{label}</label>}
      <select className={`${baseClass} ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-2.5">
      {label && <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">{label}</label>}
      <textarea className={`${baseClass} resize-y ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
