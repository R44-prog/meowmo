import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-20 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center gap-2 px-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-sm w-full",
                            "glass",
                            toast.type === 'success' && "border-emerald-500/20 text-emerald-400",
                            toast.type === 'error' && "border-red-500/20 text-red-400",
                            toast.type === 'info' && "border-amber/20 text-amber"
                        )}
                        role="alert"
                    >
                        {toast.type === 'success' && <CheckCircle className="shrink-0 size-5 text-emerald-400" />}
                        {toast.type === 'error' && <AlertCircle className="shrink-0 size-5 text-red-400" />}
                        {toast.type === 'info' && <Info className="shrink-0 size-5 text-amber" />}

                        <span className="text-sm font-bold flex-1">{toast.message}</span>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close notification"
                        >
                            <X size={16} className="text-accent/30" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
