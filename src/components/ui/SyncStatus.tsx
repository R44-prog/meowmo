import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SyncStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Auto-sync simulation when back online
        if (isOnline) {
            simulateSync();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline]);

    const simulateSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLastSync(new Date());
        }, 1500);
    };

    if (isOnline && !isSyncing && !lastSync) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all border",
                isOnline
                    ? "bg-white/80 border-emerald-100 text-emerald-600"
                    : "bg-orange-50/90 border-orange-200 text-orange-600"
            )}>
                {isSyncing ? (
                    <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Syncing Memories...</span>
                    </>
                ) : isOnline ? (
                    <>
                        <Cloud className="w-3 h-3" />
                        <span>Cloud Active</span>
                    </>
                ) : (
                    <>
                        <CloudOff className="w-3 h-3" />
                        <span>Offline Mode</span>
                    </>
                )}
            </div>
        </div>
    );
};
