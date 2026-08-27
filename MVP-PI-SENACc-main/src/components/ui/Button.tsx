import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent-500 text-cream-50 hover:bg-accent-600 focus:ring-accent-400',
  secondary: 'bg-ink-900 text-cream-50 hover:bg-ink-800 focus:ring-ink-600',
  outline: 'border border-ink-200 text-ink-600 hover:border-ink-400 hover:text-ink-900 focus:ring-ink-200',
  ghost: 'text-ink-400 hover:text-ink-900 hover:bg-cream-100 focus:ring-ink-200',
  danger: 'bg-red-700 text-cream-50 hover:bg-red-800 focus:ring-red-400',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[11px] tracking-wider-editorial uppercase',
  md: 'px-5 py-2.5 text-xs tracking-wider-editorial uppercase',
  lg: 'px-7 py-3 text-xs tracking-wider-editorial uppercase',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-350 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-50 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
