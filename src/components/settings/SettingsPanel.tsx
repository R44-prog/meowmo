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
            <div className="relative w-full max-w-md h-full bg-background shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-6 py-4 border-b border-neutral/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-accent">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral/10 rounded-lg transition-colors"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5 text-neutral/60" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Cat Profile Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral/40 uppercase tracking-wider">Cat Profile</h3>
                        <div className="space-y-2">
                            <label className="text-sm text-neutral/60">Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    className="flex-1 bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-3 text-accent font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter name..."
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={!nameDraft.trim() || nameDraft === catName}
                                    className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Save name"
                                >
                                    <Save className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral/40 uppercase tracking-wider">Security</h3>
                        <div className="bg-white rounded-xl p-4 border border-neutral/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-accent">Privacy Lock</p>
                                    <p className="text-xs text-neutral/50">Require PIN to access app</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localStorage.getItem('privacyLockEnabled') === 'true'}
                                        onChange={(e) => {
                                            localStorage.setItem('privacyLockEnabled', e.target.checked ? 'true' : 'false');
                                            // Note: User needs to reload for this to take effect
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-neutral/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            {localStorage.getItem('privacyLockEnabled') === 'true' && (
                                <p className="text-xs text-neutral/40 bg-blue-50/50 p-2 rounded-lg">
                                    ✓ Lock is active. Reload app to apply changes.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral/40 uppercase tracking-wider">Preferences</h3>
                        <div className="bg-white rounded-xl p-4 border border-neutral/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-accent">Show Achievements</p>
                                    <p className="text-xs text-neutral/50">Display trophies on Insights page</p>
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
                                    <div className="w-11 h-6 bg-neutral/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* PWA Help Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral/40 uppercase tracking-wider">Install App</h3>
                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-start gap-3">
                                <Smartphone className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="text-sm text-accent">
                                        Install Meowmo on your home screen for the best experience.
                                    </p>
                                    <ol className="text-xs text-neutral/60 space-y-2 list-decimal list-inside">
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
                    <section className="pt-8 border-t border-neutral/10 text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral/5 rounded-full text-xs text-neutral/40">
                            <Info className="w-3 h-3" />
                            <span>Version 1.0.0</span>
                        </div>
                        <p className="text-[10px] text-neutral/30">
                            Vibe Tracker for Cats
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
