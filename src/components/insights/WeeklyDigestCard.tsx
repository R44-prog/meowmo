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
        <div className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber/10 rounded-2xl flex items-center justify-center text-amber">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/30">Weekly Digest</div>
                        <h3 className="font-bold text-accent">The Weekly Memo</h3>
                    </div>
                </div>
                <div className="flex -space-x-1">
                    <div className="px-3 py-1 bg-amber/10 rounded-full text-[10px] font-bold text-amber flex items-center gap-1.5 border border-amber/20">
                        <Sparkles size={12} />
                        AI GENERATED
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex gap-4">
                    {digest.photoUrl && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border-4 border-midnight rotate-[-2deg]">
                            <img src={digest.photoUrl} alt="Best moment" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <p className="text-sm italic leading-relaxed text-accent/70">
                            "{digest.narrative}"
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5">
                                {trendIcons[digest.vibeTrend]}
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent/30">Mood: {digest.vibeTrend}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent/30">{digest.totalEntries} Memories</span>
                            </div>
                        </div>
                    </div>
                </div>

                {digest.keyInsights.length > 0 && (
                    <div className="pt-4 border-t border-dashed border-white/5 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-accent/20">Key Clinical Observations</div>
                        {digest.keyInsights.map(insight => (
                            <div key={insight.id} className="flex items-start gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", insight.severity === 'attention' ? 'bg-amber' : 'bg-blue-400')} />
                                <div className="text-xs text-accent/60 font-medium">{insight.title}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-amber flex items-center justify-center gap-2">
                Share This Moment
            </button>
        </div>
    );
};
