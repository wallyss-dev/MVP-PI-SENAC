import { type ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'amber';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-stone-100 text-stone-700 border-stone-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
