import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-3 text-[11px] text-ink-300 mb-16 tracking-wider-editorial uppercase">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span className="w-1 h-1 rounded-full bg-ink-200" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-accent-600 transition-colors duration-300">{item.label}</Link>
          ) : (
            <span className="text-ink-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-20">
      <div>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-ink-900 tracking-tight leading-[1.05]">{title}</h1>
        {subtitle && <p className="text-sm text-ink-400 mt-5 tracking-editorial">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
