import React from 'react';
import { Activity, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HealthPulseProps {
    status: 'stable' | 'attention' | 'vet_required';
    catName: string;
    lastChecked: string;
}

export const HealthPulse: React.FC<HealthPulseProps> = ({ status, catName, lastChecked }) => {
    const configs = {
        stable: {
            color: 'bg-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            icon: <ShieldCheck size={18} />,
            label: 'Stable Pattern',
            desc: `${catName}'s recent observations match their healthy baseline.`
        },
        attention: {
            color: 'bg-amber',
            bg: 'bg-amber/10',
            border: 'border-amber/20',
            text: 'text-amber',
            icon: <Info size={18} />,
            label: 'Pattern Noticed',
            desc: `Some subtle shifts in ${catName}'s routine have been detected.`
        },
        vet_required: {
            color: 'bg-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-400',
            icon: <AlertCircle size={18} />,
            label: 'Action Recommended',
            desc: `A pattern identified by Dr. Quinn suggests a veterinary consult.`
        }
    };

    const config = configs[status];

    return (
        <div className={cn("p-6 rounded-[2rem] border animate-in fade-in duration-1000 shadow-2xl", config.bg, config.border)}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg", config.color)}>
                        <Activity size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-white/40")}>
                            Clinical Health Pulse
                        </div>
                        <h2 className={cn("text-lg font-bold leading-tight", config.text)}>
                            {config.label}
                        </h2>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-midnight bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">I</div>
                    <div className="w-8 h-8 rounded-full border-2 border-midnight bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">Q</div>
                </div>
            </div>

            <p className={cn("text-sm leading-relaxed mb-4", config.text, "opacity-80")}>
                {config.desc}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Last Analysis: {lastChecked}</span>
                <button className={cn("text-[10px] font-black uppercase tracking-widest hover:opacity-100 transition-opacity", config.text)}>
                    View Report
                </button>
            </div>
        </div>
    );
};
