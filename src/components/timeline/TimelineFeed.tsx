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
                    <div className="w-24 h-24 bg-gradient-to-br from-midnight to-surface rounded-3xl flex items-center justify-center text-accent/20 border border-white/5 shadow-2xl overflow-hidden">
                        <span role="img" aria-label="Paw prints" className="text-5xl animate-bounce duration-1000">🐾</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber rounded-full border-2 border-midnight animate-pulse" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-accent tracking-tight">Your health story starts here</h2>
                    <p className="text-sm text-accent/40 max-w-[280px] leading-relaxed">
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
                className="mb-4 p-5 bg-gradient-to-br from-surface to-midnight rounded-2xl border border-white/5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-2xl transition-all active:scale-[0.98] relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:rotate-12 transition-transform">
                    <Trophy size={80} className="text-accent" />
                </div>
                <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={14} className="text-amber shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber/80">Daily Quest</span>
                    </div>
                    <h3 className="text-sm font-bold text-accent mb-1 leading-tight text-left">The Loaf Collection</h3>
                    <p className="text-[11px] text-accent/60 leading-relaxed text-left">
                        Catch {localStorage.getItem('catName') || 'your cat'} in a perfect loaf to earn your first AI Trophy.
                    </p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center text-accent border border-white/10">
                    <ChevronRight size={20} />
                </div>
            </div>

            {/* 🏥 VET EXPORT CTA (Soren's suggestion) */}
            <div className="mb-8 p-5 bg-gradient-to-br from-midnight to-surface rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-accent/90 mb-1 leading-tight text-left text-blue-300">Vet Visit Coming Up?</h3>
                    <p className="text-[11px] text-accent/50 leading-relaxed text-left">
                        Export {localStorage.getItem('catName') || 'your cat'}'s health timeline as a professional PDF.
                    </p>
                </div>
                <button
                    onClick={() => window.location.hash = '#/insights'}
                    className="flex-shrink-0 w-10 h-10 glass shadow-xl rounded-xl flex items-center justify-center text-amber hover:scale-105 active:scale-95 transition-all"
                    aria-label="Go to insights for export"
                >
                    <FileDown size={20} />
                </button>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mb-4">
                <div className="flex bg-surface rounded-lg p-1 gap-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                            ? 'bg-amber text-midnight shadow-lg shadow-amber/20 font-bold'
                            : 'text-accent/30 hover:text-accent/60'
                            }`}
                        aria-label="List view"
                        title="List view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                            ? 'bg-amber text-midnight shadow-lg shadow-amber/20 font-bold'
                            : 'text-accent/30 hover:text-accent/60'
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
