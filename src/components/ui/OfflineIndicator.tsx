import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineIndicator: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed top-0 inset-x-0 z-50 animate-in slide-in-from-top duration-500">
            <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg backdrop-blur-md bg-amber-500/90">
                <WifiOff size={14} className="animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                    Offline Mode: Logs will sync automatically
                </span>
            </div>
        </div>
    );
};
