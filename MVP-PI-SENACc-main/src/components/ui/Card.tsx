import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-cream-50 rounded-lg border border-ink-100/50 transition-all duration-400 ease-out ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between px-8 py-7 border-b border-ink-100/40">
      <div>
        <h3 className="font-serif text-xl font-light text-ink-900">{title}</h3>
        {subtitle && <p className="text-[11px] text-ink-400 mt-1.5 tracking-wider-editorial uppercase">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`px-8 py-7 ${className}`}>{children}</div>;
}
