import React from 'react';
import { Trophy, Target, ChevronRight, Star } from 'lucide-react';
import playbook from '../../config/behavior_playbook.json';

export const ChallengeHub: React.FC = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-accent tracking-tight">Behavior Quests</h2>
                    <p className="text-xs text-neutral/50 font-medium">Capture moments, earn trophies</p>
                </div>
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Star size={14} className="fill-yellow-600" />
                    <span className="text-sm font-bold">1,250</span>
                </div>
            </header>

            {playbook.categories.map((category) => (
                <section key={category.id} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral/40 ml-1">
                        {category.name}
                    </h3>
                    <div className="grid gap-3">
                        {category.challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="group bg-white p-4 rounded-2xl border border-neutral/5 hover:border-accent/20 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 bg-neutral/5 rounded-xl flex items-center justify-center text-neutral/30 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                    <Target size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-neutral-800 leading-tight">
                                        {challenge.name}
                                    </h4>
                                    <p className="text-[11px] text-neutral/50 line-clamp-1 mt-0.5">
                                        {challenge.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-neutral/30 uppercase tracking-tighter mb-0.5">
                                        {challenge.difficulty}
                                    </div>
                                    <div className="text-xs font-black text-accent">
                                        +{challenge.points}
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-neutral/20 group-hover:text-accent transition-colors" />
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <div className="p-6 bg-gradient-to-br from-accent to-accent/80 rounded-3xl text-white shadow-lg shadow-accent/20 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-xs font-bold tracking-widest uppercase opacity-80">Next Trophy</span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight">The Space Explorer</h3>
                    <p className="text-xs opacity-70 leading-relaxed max-w-[180px]">
                        Complete 2 more "Action" challenges to unlock this scene.
                    </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <Trophy size={120} className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" />
            </div>
        </div>
    );
};
