import React from 'react';
import { Achievement } from '@/lib/game_service';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface TrophyCaseProps {
    achievements: Achievement[];
}

export const TrophyCase: React.FC<TrophyCaseProps> = ({ achievements }) => {
    return (
        <div className="glass rounded-3xl p-6 border border-white/5 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                <span className="text-amber">🏆</span> Trophy Case
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {achievements.map((chem) => (
                    <div
                        key={chem.id}
                        className={cn(
                            "relative overflow-hidden rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border transition-all",
                            chem.isUnlocked
                                ? "bg-white/5 border-white/10 shadow-xl scale-[1.02]"
                                : "bg-black/20 border-white/5 opacity-60"
                        )}
                    >
                        {/* Icon Badge */}
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner relative",
                            chem.isUnlocked
                                ? `bg-gradient-to-br ${chem.color} text-white`
                                : "bg-white/5 text-accent/20 grayscale"
                        )}>
                            {chem.isUnlocked ? chem.icon : <Lock className="w-5 h-5" />}
                        </div>

                        {/* Text */}
                        <div>
                            <div className="font-bold text-sm text-accent leading-tight">
                                {chem.title}
                            </div>
                            <div className="text-[10px] text-accent/40 font-medium mt-1">
                                {chem.description}
                            </div>
                        </div>

                        {/* Progress Bar (if locked but started) */}
                        {!chem.isUnlocked && (chem.progress || 0) > 0 && (
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-amber/40 rounded-full"
                                    style={{ width: `${chem.progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
