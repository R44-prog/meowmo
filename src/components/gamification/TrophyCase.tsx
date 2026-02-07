import React from 'react';
import { Achievement } from '@/lib/game_service';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface TrophyCaseProps {
    achievements: Achievement[];
}

export const TrophyCase: React.FC<TrophyCaseProps> = ({ achievements }) => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-neutral/10 calm-shadow space-y-4">
            <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                <span>🏆</span> Trophy Case
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {achievements.map((chem) => (
                    <div
                        key={chem.id}
                        className={cn(
                            "relative overflow-hidden rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border transition-all",
                            chem.isUnlocked
                                ? "bg-white border-neutral/10 shadow-sm"
                                : "bg-neutral/5 border-transparent opacity-80"
                        )}
                    >
                        {/* Icon Badge */}
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner relative",
                            chem.isUnlocked
                                ? `bg-gradient-to-br ${chem.color} text-white`
                                : "bg-neutral/20 text-neutral/40 grayscale"
                        )}>
                            {chem.isUnlocked ? chem.icon : <Lock className="w-5 h-5" />}
                        </div>

                        {/* Text */}
                        <div>
                            <div className="font-bold text-sm text-accent leading-tight">
                                {chem.title}
                            </div>
                            <div className="text-[10px] text-neutral/50 font-medium mt-1">
                                {chem.description}
                            </div>
                        </div>

                        {/* Progress Bar (if locked but started) */}
                        {!chem.isUnlocked && (chem.progress || 0) > 0 && (
                            <div className="w-full h-1.5 bg-neutral/10 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-accent/20 rounded-full"
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
