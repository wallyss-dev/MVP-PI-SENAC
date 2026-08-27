import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1.5} />,
    error: <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />,
    warning: <AlertCircle className="w-4 h-4 text-accent-600" strokeWidth={1.5} />,
    info: <Info className="w-4 h-4 text-blue-600" strokeWidth={1.5} />,
  };

  const borders = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-accent-500',
    info: 'border-l-blue-500',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 bg-cream-50 rounded-lg shadow-lg shadow-ink-900/8 border border-l-2 ${borders[toast.type]} border-ink-100/50 px-5 py-4 animate-slide-in`}
          >
            {icons[toast.type]}
            <p className="text-sm text-ink-700 flex-1 leading-relaxed">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-ink-300 hover:text-ink-600 transition-colors duration-300">
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
