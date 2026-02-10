import React from 'react';
import { Trophy, Target, ChevronRight, Star } from 'lucide-react';
import playbook from '../../config/behavior_playbook.json';

export const ChallengeHub: React.FC = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-accent tracking-tighter uppercase">Behavior Quests</h2>
                    <p className="text-[10px] text-accent/30 font-bold uppercase tracking-widest">Capture moments, earn trophies</p>
                </div>
                <div className="bg-amber/10 text-amber px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber/20">
                    <Star size={14} className="fill-amber" />
                    <span className="text-xs font-black tracking-tight">1,250</span>
                </div>
            </header>

            {playbook.categories.map((category) => (
                <section key={category.id} className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/20 ml-1">
                        {category.name}
                    </h3>
                    <div className="grid gap-3">
                        {category.challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="group glass p-4 rounded-2xl border border-white/5 hover:border-amber/20 hover:shadow-2xl transition-all cursor-pointer flex items-center gap-4 active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-accent/30 group-hover:bg-amber/10 group-hover:text-amber transition-colors border border-white/5">
                                    <Target size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-accent leading-tight">
                                        {challenge.name}
                                    </h4>
                                    <p className="text-[10px] text-accent/40 font-medium line-clamp-1 mt-0.5">
                                        {challenge.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] font-black text-accent/20 uppercase tracking-tighter mb-0.5">
                                        {challenge.difficulty}
                                    </div>
                                    <div className="text-sm font-black text-amber">
                                        +{challenge.points}
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-neutral/20 group-hover:text-accent transition-colors" />
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <div className="p-6 bg-gradient-to-br from-surface to-midnight rounded-3xl text-accent shadow-2xl relative overflow-hidden border border-amber/10 group">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <Trophy size={20} className="text-amber fill-amber" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-amber">Next Trophy</span>
                    </div>
                    <h3 className="text-lg font-black leading-tight">The Space Explorer</h3>
                    <p className="text-xs text-accent/60 font-medium leading-relaxed max-w-[180px]">
                        Complete 2 more "Action" challenges to unlock this scene.
                    </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber/5 rounded-full blur-2xl group-hover:bg-amber/10 transition-colors" />
                <Trophy size={120} className="absolute -bottom-4 -right-4 text-amber/10 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
            </div>
        </div>
    );
};
