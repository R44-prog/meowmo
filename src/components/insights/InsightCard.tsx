import React from 'react';
import { cn } from '@/lib/utils';
import { BrainInsight } from '@/lib/brain_service';
import { Sparkles } from 'lucide-react';

interface InsightCardProps {
    insight: BrainInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl p-5 mb-4 shadow-sm border border-neutral/10 transition-all hover:scale-[1.01]",
            "bg-gradient-to-br from-[#faf9f7] to-white" // Base paper
        )}>
            {/* Magic Glow Border Effect (CSS Hack) */}
            <div className={`absolute top-0 left-0 w-1 h-full ${(insight.color || '').split(' ')[0].replace('bg-', 'bg-')}`} />

            <div className="flex items-start gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
                    insight.color
                )}>
                    {insight.icon || <Sparkles className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-accent text-sm uppercase tracking-wide opacity-80">
                            {insight.title}
                        </h3>
                        {insight.type === 'correlation' && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                                AI
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                        {insight.description}
                    </p>
                </div>
            </div>
        </div>
    );
};
