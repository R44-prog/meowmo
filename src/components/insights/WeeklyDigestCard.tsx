import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Camera, Sparkles } from 'lucide-react';
import { WeeklyDigest } from '@/services/intelligence/WeeklyDigestService';
import { cn } from '@/lib/utils';

export const WeeklyDigestCard: React.FC<{ digest: WeeklyDigest }> = ({ digest }) => {
    const trendIcons = {
        improving: <TrendingUp className="text-emerald-500" size={16} />,
        stable: <Minus className="text-blue-500" size={16} />,
        waning: <TrendingDown className="text-amber-500" size={16} />
    };

    return (
        <div className="bg-white rounded-[2rem] border border-neutral/10 calm-shadow overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Weekly Digest</div>
                        <h3 className="font-bold text-accent">The Weekly Memo</h3>
                    </div>
                </div>
                <div className="flex -space-x-1">
                    <div className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-bold text-accent flex items-center gap-1.5">
                        <Sparkles size={12} />
                        AI GENERATED
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex gap-4">
                    {digest.photoUrl && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border-4 border-white rotate-[-2deg]">
                            <img src={digest.photoUrl} alt="Best moment" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <p className="text-sm italic leading-relaxed text-neutral/80">
                            "{digest.narrative}"
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5">
                                {trendIcons[digest.vibeTrend]}
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Mood: {digest.vibeTrend}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{digest.totalEntries} Memories</span>
                            </div>
                        </div>
                    </div>
                </div>

                {digest.keyInsights.length > 0 && (
                    <div className="pt-4 border-t border-dashed border-neutral/10 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Key Clinical Observations</div>
                        {digest.keyInsights.map(insight => (
                            <div key={insight.id} className="flex items-start gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", insight.severity === 'attention' ? 'bg-amber-400' : 'bg-blue-400')} />
                                <div className="text-xs text-neutral/70 font-medium">{insight.title}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <button className="w-full py-4 bg-accent/5 hover:bg-accent/10 transition-colors text-xs font-bold text-accent flex items-center justify-center gap-2">
                Share This Moment
            </button>
        </div>
    );
};
