import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimelineEntry } from './TimelineEntry';
import { TimelineGridItem } from './TimelineGridItem';
import { LayoutGrid, List, FileDown, Trophy, Sparkles, ChevronRight } from 'lucide-react';

interface Entry {
    id: string;
    cat_id: string;
    date: string;
    vibeScore: number;
    note?: string;
    photoUrl?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
    trophy?: any;
}

interface TimelineFeedProps {
    entries: any[]; // Using any temporarily for easier migration
}

type ViewMode = 'list' | 'grid';

const VIEW_STORAGE_KEY = 'vibe_timeline_view';

export const TimelineFeed: React.FC<TimelineFeedProps> = ({ entries }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const saved = localStorage.getItem(VIEW_STORAGE_KEY);
        return (saved as ViewMode) || 'list';
    });

    useEffect(() => {
        localStorage.setItem(VIEW_STORAGE_KEY, viewMode);
    }, [viewMode]);

    if (entries.length === 0) {
        return (
            <div className="px-6 py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-white rounded-3xl flex items-center justify-center text-neutral/40 border border-purple-100/50 shadow-sm overflow-hidden">
                        <span role="img" aria-label="Paw prints" className="text-5xl animate-bounce duration-1000">🐾</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-pulse" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-accent tracking-tight">Your health story starts here</h2>
                    <p className="text-sm text-neutral/60 max-w-[280px] leading-relaxed">
                        Meowmo will analyze patterns once you record your first memory. Tap the <strong>+</strong> button to begin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-6 py-8">
            {/* 🏆 BEHAVIOR CHALLENGE CTA (Better-than-Them Strategy) */}
            <div
                onClick={() => navigate('/challenges')}
                className="mb-4 p-5 bg-gradient-to-br from-accent to-accent/90 rounded-2xl border border-accent/20 flex items-center justify-between gap-4 cursor-pointer hover:shadow-lg hover:shadow-accent/10 transition-all active:scale-[0.98] relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
                    <Trophy size={80} className="text-white" />
                </div>
                <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Daily Quest</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 leading-tight text-left">The Loaf Collection</h3>
                    <p className="text-[11px] text-white/70 leading-relaxed text-left">
                        Catch {localStorage.getItem('catName') || 'your cat'} in a perfect loaf to earn your first AI Trophy.
                    </p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
                    <ChevronRight size={20} />
                </div>
            </div>

            {/* 🏥 VET EXPORT CTA (Soren's suggestion) */}
            <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-blue-900 mb-1 leading-tight text-left">Vet Visit Coming Up?</h3>
                    <p className="text-[11px] text-blue-700/70 leading-relaxed text-left">
                        Export {localStorage.getItem('catName') || 'your cat'}'s health timeline as a professional PDF.
                    </p>
                </div>
                <button
                    onClick={() => window.location.hash = '#/insights'}
                    className="flex-shrink-0 w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-600 hover:scale-105 active:scale-95 transition-all"
                    aria-label="Go to insights for export"
                >
                    <FileDown size={20} />
                </button>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mb-4">
                <div className="flex bg-neutral/10 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                            ? 'bg-white shadow-sm text-accent'
                            : 'text-neutral/50 hover:text-neutral/70'
                            }`}
                        aria-label="List view"
                        title="List view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                            ? 'bg-white shadow-sm text-accent'
                            : 'text-neutral/50 hover:text-neutral/70'
                            }`}
                        aria-label="Grid view"
                        title="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* View Content */}
            {viewMode === 'list' ? (
                // Original List View
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <TimelineEntry
                            key={entry.id}
                            date={entry.date}
                            vibeScore={entry.vibeScore || entry.vibe_score}
                            note={entry.note}
                            photoUrl={entry.photoUrl || entry.photo_url}
                            appetite={entry.appetite}
                            litter={entry.litter}
                            trophy={entry.trophy || entry.trophy_data}
                        />
                    ))}
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-3 gap-2">
                    {entries
                        .filter(entry => entry.photoUrl || entry.photo_url) // Only show photos in grid
                        .map((entry) => (
                            <TimelineGridItem
                                key={entry.id}
                                date={entry.date}
                                vibeScore={entry.vibeScore || entry.vibe_score}
                                photoUrl={entry.photoUrl || entry.photo_url}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};
