import { type ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'amber';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-transparent text-ink-500 border-ink-300/50',
  success: 'bg-transparent text-green-700 border-green-300/50',
  warning: 'bg-transparent text-amber-700 border-amber-300/50',
  error: 'bg-transparent text-red-600 border-red-300/50',
  info: 'bg-transparent text-blue-700 border-blue-300/50',
  amber: 'bg-transparent text-accent-600 border-accent-300/50',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border tracking-wider-editorial uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
