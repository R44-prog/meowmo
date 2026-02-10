import React from 'react';
import { cn } from '../../lib/utils';
import { Smile, Cloud, Package, Zap, Moon, Ghost, Calendar, FileText, Share2 } from 'lucide-react';

interface TimelineEntryProps {
    date: string;
    vibeScore: number;
    note?: string;
    photoUrl?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
    trophy?: {
        description: string;
        imageUrl: string;
        clinicalFootnote: string;
    };
}

const VIBE_MAP: Record<number, { icon: React.ReactNode, label: string, color: string }> = {
    1: { icon: <Smile className="w-5 h-5" />, label: 'Happy', color: 'text-emerald-500' },
    2: { icon: <Cloud className="w-5 h-5" />, label: 'Quiet', color: 'text-blue-400' },
    3: { icon: <Moon className="w-5 h-5" />, label: 'Off', color: 'text-amber-500' },
    4: { icon: <Ghost className="w-5 h-5" />, label: 'Hide-y', color: 'text-indigo-500' },
    5: { icon: <Zap className="w-5 h-5" />, label: 'Energetic', color: 'text-orange-500' }
};

export const TimelineEntry: React.FC<TimelineEntryProps> = React.memo(({ date, vibeScore, note, photoUrl, appetite, litter, trophy }) => {
    const vibe = VIBE_MAP[vibeScore] || VIBE_MAP[2];

    return (
        <div className="flex gap-4 group">
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-surface border-2 border-white/5 shadow-lg z-10", vibe.color)}>
                    {vibe.icon}
                </div>
                <div className="w-0.5 flex-1 bg-white/5 group-last:bg-transparent -mt-1" />
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-10">
                <div className="calm-shadow rounded-3xl glass overflow-hidden border border-white/5 transition-transform hover:scale-[1.005]">
                    {/* Date Header */}
                    <div className="px-6 py-3 bg-surface/40 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-accent/40">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            {appetite && (
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-lg bg-midnight/40 flex items-center gap-1 border border-white/5",
                                    appetite === 'good' ? "text-emerald-400" : appetite === 'picky' ? "text-amber-400" : "text-red-400"
                                )}>
                                    {appetite === 'good' ? '🍲' : appetite === 'picky' ? '🥗' : '🚫'}
                                </span>
                            )}
                            {litter && (
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-lg bg-midnight/40 flex items-center gap-1 border border-white/5",
                                    litter === 'normal' ? "text-emerald-400" : "text-amber-400"
                                )}>
                                    {litter === 'normal' ? '✅' : '⚠️'}
                                </span>
                            )}
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-midnight/40", vibe.color)}>
                                {vibe.label}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Real Capture Photo */}
                        <div className="aspect-[4/3] bg-midnight/40 rounded-2xl flex items-center justify-center text-accent/10 overflow-hidden relative border border-white/5">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Cat" className="w-full h-full object-cover" />
                            ) : (
                                <Smile className="w-12 h-12 opacity-10" />
                            )}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                Observed State
                            </div>
                        </div>

                        {/* Trophy Reward Section (Conditionals) */}
                        {trophy && (
                            <div className="relative animate-in zoom-in-95 fade-in duration-700">
                                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-white to-accent/20 blur-xl opacity-50" />
                                <div className="relative bg-accent/5 border border-accent/10 rounded-2xl overflow-hidden shadow-inner">
                                    <div className="aspect-video relative overflow-hidden group/trophy">
                                        <img src={trophy.imageUrl} alt="AI Trophy" className="w-full h-full object-cover scale-105 group-hover/trophy:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="flex items-center gap-2 text-white">
                                                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Surreal Trophy Unlocked</span>
                                            </div>
                                            <p className="text-sm text-white/90 mt-1 font-medium leading-snug">{trophy.description}</p>
                                        </div>
                                    </div>
                                    {/* Share Action */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.hash = `#/achievement/${Math.random().toString(36).substr(2, 9)}`;
                                            }}
                                            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                            title="Share Trophy"
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                    {/* Dr. Quinn's Clinical Footnote */}
                                    <div className="p-3 bg-white/5 backdrop-blur-sm flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber/10 flex-shrink-0 flex items-center justify-center text-amber text-[10px] font-bold">
                                            Q
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-bold text-amber uppercase tracking-wider">Clinical Insight</span>
                                            <p className="text-[11px] text-accent/60 leading-tight italic">{trophy.clinicalFootnote}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {note && (
                            <div className="flex gap-3 text-sm text-accent/70 leading-relaxed bg-surface/40 p-4 rounded-xl border border-white/5 italic">
                                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-40 text-amber" />
                                <p>{note}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
