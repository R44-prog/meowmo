import React from 'react';
import { Smile, Cloud, Moon, Ghost, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TimelineGridItemProps {
    date: string;
    vibeScore: number;
    photoUrl?: string;
    onClick?: () => void;
}

const VIBE_MAP: Record<number, { icon: React.ReactNode, color: string, bgColor: string }> = {
    1: { icon: <Smile className="w-3 h-3" />, color: 'text-green-500', bgColor: 'bg-green-500' },
    2: { icon: <Cloud className="w-3 h-3" />, color: 'text-blue-400', bgColor: 'bg-blue-400' },
    3: { icon: <Moon className="w-3 h-3" />, color: 'text-amber-500', bgColor: 'bg-amber-500' },
    4: { icon: <Ghost className="w-3 h-3" />, color: 'text-purple-500', bgColor: 'bg-purple-500' },
    5: { icon: <Zap className="w-3 h-3" />, color: 'text-yellow-500', bgColor: 'bg-yellow-500' }
};

export const TimelineGridItem: React.FC<TimelineGridItemProps> = React.memo(({ date, vibeScore, photoUrl, onClick }) => {
    const vibe = VIBE_MAP[vibeScore] || VIBE_MAP[2];

    return (
        <button
            onClick={onClick}
            className="aspect-square relative rounded-xl overflow-hidden glass group focus:outline-none focus:ring-2 focus:ring-amber/50"
        >
            {photoUrl ? (
                <img src={photoUrl} alt="Cat" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Smile className="w-8 h-8 opacity-20" />
                </div>
            )}

            {/* Vibe indicator dot */}
            <div className={cn(
                "absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-midnight shadow-xl border border-white/20",
                vibe.bgColor
            )}>
                {vibe.icon}
            </div>

            {/* Date overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-white text-xs font-medium">
                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </button>
    );
});
