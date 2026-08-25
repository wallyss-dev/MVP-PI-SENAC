import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const baseClass = 'w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
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
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <select className={`${baseClass} bg-white ${error ? 'border-red-400' : ''} ${className}`} {...props}>
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
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <textarea className={`${baseClass} resize-y ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
