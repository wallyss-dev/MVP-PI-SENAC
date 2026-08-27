import { type ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, rowKey, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ink-100/60">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-4 text-left text-[10px] font-medium text-ink-400 uppercase tracking-wider-editorial whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100/40">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors duration-300 ${onRowClick ? 'cursor-pointer hover:bg-cream-100/60' : 'hover:bg-cream-100/40'}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-sm text-ink-700 whitespace-nowrap">
                  {col.render ? col.render(row) : (row[col.key] as ReactNode) ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
