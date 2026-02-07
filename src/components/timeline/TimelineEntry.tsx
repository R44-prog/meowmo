import React from 'react';
import { cn } from '../../lib/utils';
import { Smile, Cloud, Package, Zap, Moon, Ghost, Calendar, FileText } from 'lucide-react';

interface TimelineEntryProps {
    date: string;
    vibeScore: number;
    note?: string;
    photoUrl?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
}

const VIBE_MAP: Record<number, { icon: React.ReactNode, label: string, color: string }> = {
    1: { icon: <Smile className="w-5 h-5" />, label: 'Happy', color: 'text-green-500' },
    2: { icon: <Cloud className="w-5 h-5" />, label: 'Quiet', color: 'text-blue-400' },
    3: { icon: <Moon className="w-5 h-5" />, label: 'Off', color: 'text-amber-500' },
    4: { icon: <Ghost className="w-5 h-5" />, label: 'Hide-y', color: 'text-purple-500' },
    5: { icon: <Zap className="w-5 h-5" />, label: 'Energetic', color: 'text-yellow-500' }
};

export const TimelineEntry: React.FC<TimelineEntryProps> = React.memo(({ date, vibeScore, note, photoUrl, appetite, litter }) => {
    const vibe = VIBE_MAP[vibeScore] || VIBE_MAP[2];

    return (
        <div className="flex gap-4 group">
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-neutral/10 shadow-sm z-10", vibe.color)}>
                    {vibe.icon}
                </div>
                <div className="w-0.5 flex-1 bg-neutral/10 group-last:bg-transparent -mt-1" />
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-10">
                <div className="calm-shadow rounded-2xl bg-white overflow-hidden border border-neutral/5 transition-transform hover:scale-[1.01]">
                    {/* Date Header */}
                    <div className="px-4 py-2 bg-neutral/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium opacity-50">
                            <Calendar className="w-3 h-3" />
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            {appetite && (
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-md bg-white/50 flex items-center gap-1 border border-neutral/5",
                                    appetite === 'good' ? "text-green-600" : appetite === 'picky' ? "text-amber-600" : "text-red-500"
                                )}>
                                    {appetite === 'good' ? '🍲' : appetite === 'picky' ? '🥗' : '🚫'}
                                </span>
                            )}
                            {litter && (
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-md bg-white/50 flex items-center gap-1 border border-neutral/5",
                                    litter === 'normal' ? "text-green-600" : "text-amber-600"
                                )}>
                                    {litter === 'normal' ? '✅' : '⚠️'}
                                </span>
                            )}
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/50", vibe.color)}>
                                {vibe.label}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {/* Placeholder for Photo (using generate_image eventually, but generic for now) */}
                        <div className="aspect-[4/3] bg-neutral/10 rounded-xl flex items-center justify-center text-neutral/30 overflow-hidden relative">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Cat" className="w-full h-full object-cover" />
                            ) : (
                                <Smile className="w-12 h-12 opacity-10" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {note && (
                            <div className="flex gap-2 text-sm opacity-70 leading-relaxed italic">
                                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-40" />
                                <p>{note}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
