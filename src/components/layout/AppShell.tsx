import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { getQueueCount } from '@/lib/offline_queue';
import { WifiOff, Upload } from 'lucide-react';

export const AppShell: React.FC = () => {
    const [queueCount, setQueueCount] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        // Update queue count on mount and when online status changes
        setQueueCount(getQueueCount());

        const handleOnline = () => {
            setIsOnline(true);
            setQueueCount(getQueueCount());
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Poll queue count every 2 seconds
        const interval = setInterval(() => {
            setQueueCount(getQueueCount());
        }, 2000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-midnight pb-20"> {/* pb-20 for BottomNav space */}
            {/* Offline/Queue Indicator */}
            {(!isOnline || queueCount > 0) && (
                <div
                    className="fixed top-4 right-4 z-50 glass rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300"
                    role="status"
                    aria-live="polite"
                >
                    {!isOnline ? (
                        <>
                            <WifiOff className="w-4 h-4 text-amber" />
                            <span className="text-accent/60">Offline Mode</span>
                        </>
                    ) : queueCount > 0 ? (
                        <>
                            <Upload className="w-4 h-4 text-blue-400 animate-pulse" />
                            <span className="text-accent/60">{queueCount} pending sync</span>
                        </>
                    ) : null}
                </div>
            )}
            <main className="max-w-md mx-auto min-h-screen relative">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};
