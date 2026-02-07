import React, { useState } from 'react';
import { Settings, Shield } from 'lucide-react';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const ProfilePage: React.FC = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    // We need context for catName and entries in a real app.
    // For V1 refactor, we are limiting Admin Panel access here or need props.
    // Compromise: We fetch catName from localStorage directly for now.
    const catName = localStorage.getItem('catName') || 'Cat';
    const entries: any[] = []; // Admin Panel needs entries. This is a gap in the refactor.

    return (
        <div className="p-6 pt-12 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-accent mb-1">Profile</h1>
                <p className="text-neutral/60">Manage settings for {catName}</p>
            </header>

            <div className="space-y-3">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-neutral/10 rounded-xl calm-shadow hover:bg-neutral/5 transition-colors"
                >
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <Settings size={20} />
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-medium text-accent">Settings</div>
                        <div className="text-xs text-neutral/50">Name, PWA, Notifications</div>
                    </div>
                </button>

                <button
                    onClick={() => setIsAdminOpen(true)}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-neutral/10 rounded-xl calm-shadow hover:bg-neutral/5 transition-colors"
                >
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                        <Shield size={20} />
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-medium text-accent">Founder Panel</div>
                        <div className="text-xs text-neutral/50">Wake-up triggers & Analytics</div>
                    </div>
                </button>
            </div>

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                catName={catName}
                onUpdateCatName={(name) => {
                    localStorage.setItem('catName', name);
                    window.location.reload(); // Force reload to update context for now
                }}
            />

            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
                entries={entries} // Currently empty in Profile view
                catName={catName}
            />
        </div>
    );
};
