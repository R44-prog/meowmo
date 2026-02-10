import React, { useState, useEffect } from 'react';
import { X, Save, Smartphone, Share, PlusSquare, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    catName: string;
    onUpdateCatName: (name: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, catName, onUpdateCatName }) => {
    const [nameDraft, setNameDraft] = useState(catName);

    // Reset draft when opening/changing external prop
    useEffect(() => {
        setNameDraft(catName);
    }, [catName, isOpen]);

    const handleSave = () => {
        if (nameDraft.trim()) {
            onUpdateCatName(nameDraft.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md h-full bg-surface shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto border-l border-white/5">
                {/* Header */}
                <div className="sticky top-0 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-accent">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5 text-accent/30" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Cat Profile Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-accent/20 uppercase tracking-widest">Cat Profile</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-accent/60 ml-1">Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-accent font-bold focus:outline-none focus:ring-2 focus:ring-amber/20 transition-all"
                                    placeholder="Enter name..."
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={!nameDraft.trim() || nameDraft === catName}
                                    className="px-4 py-2 bg-amber text-white hover:opacity-90 rounded-xl transition-all disabled:opacity-20 disabled:grayscale shadow-lg shadow-amber/20"
                                    aria-label="Save name"
                                >
                                    <Save className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-accent/20 uppercase tracking-widest">Security</h3>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-accent">Privacy Lock</p>
                                    <p className="text-xs text-accent/30 font-medium">Require PIN to access app</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localStorage.getItem('privacyLockEnabled') === 'true'}
                                        onChange={(e) => {
                                            localStorage.setItem('privacyLockEnabled', e.target.checked ? 'true' : 'false');
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/5 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber"></div>
                                </label>
                            </div>
                            {localStorage.getItem('privacyLockEnabled') === 'true' && (
                                <p className="text-xs text-amber font-bold bg-amber/10 p-2 rounded-lg border border-amber/20">
                                    ✓ Lock is active. Reload app to apply changes.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-accent/20 uppercase tracking-widest">Preferences</h3>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-accent">Show Achievements</p>
                                    <p className="text-xs text-accent/30 font-medium">Display trophies on Insights page</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localStorage.getItem('showAchievements') === 'true'}
                                        onChange={(e) => {
                                            localStorage.setItem('showAchievements', e.target.checked ? 'true' : 'false');
                                            window.location.reload(); // Reload to apply
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/5 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* PWA Help Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-accent/20 uppercase tracking-widest">Install App</h3>
                        <div className="bg-amber/5 rounded-xl p-4 border border-amber/10">
                            <div className="flex items-start gap-3">
                                <Smartphone className="w-5 h-5 text-amber mt-0.5" />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-accent">
                                        Install Meowmo on your home screen for the best experience.
                                    </p>
                                    <ol className="text-xs text-accent/40 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                                        <li className="flex items-center gap-1">
                                            Tap the <Share className="w-3 h-3 inline" /> Share button in Safari.
                                        </li>
                                        <li className="flex items-center gap-1">
                                            Scroll down and tap <PlusSquare className="w-3 h-3 inline" /> Add to Home Screen.
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* App Info */}
                    <section className="pt-8 border-t border-white/5 text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-accent/20 uppercase tracking-widest">
                            <Info className="w-3 h-3" />
                            <span>Version 1.1.0</span>
                        </div>
                        <p className="text-[10px] font-bold text-accent/10 uppercase tracking-tighter">
                            Vibe Tracker for Cats
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
