import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, BarChart3, Smile, Cloud, Moon, Ghost, Zap } from 'lucide-react';
import { getTimeline } from '@/lib/timeline_service';
import { cn } from '@/lib/utils';
import { analyzeTimeline, BrainInsight } from '@/lib/brain_service';
import { InsightCard } from '@/components/insights/InsightCard';
import { checkAchievements, Achievement } from '@/lib/game_service';
import { TrophyCase } from '@/components/gamification/TrophyCase';
import { ExportButton } from '@/components/export/ExportButton';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { HealthInsights } from '@/components/insights/HealthInsights';
import { TimelineEntry } from '@/lib/health_analysis_service';

export const InsightsPage: React.FC = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [brainInsights, setBrainInsights] = useState<BrainInsight[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium') === 'true');
    const [showPaywall, setShowPaywall] = useState(false);
    // In V1, we assume a single user context.
    const catName = localStorage.getItem('catName') || 'Cat';

    useEffect(() => {
        setIsLoading(true);
        // Using fixed catId for Milestone 7
        getTimeline("dummy-user", "6a09dc55-3015-43d3-85a0-d0c1a822ad22", { limit: 100 })
            .then(data => {
                setEntries(data);
                setBrainInsights(analyzeTimeline(data));

                // Calculate streak specifically for games
                // Re-using the logic inside calculateStreak would be better if extracted, 
                // but for now we can just let the component render cycle calculate it or extract it.
                // Let's extract streak calculation to use it for achievements.
                const streak = calculateLogicStreak(data);
                setAchievements(checkAchievements(data, streak));

                setIsLoading(false);
            });
    }, []);

    // --- Logic extracted from AdminPanel ---
    const calculateLogicStreak = (data: any[]) => {
        if (data.length === 0) return 0;
        const sortedDates = data
            .map(e => new Date(e.date).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        // ... (Simplified copy of streak logic for effect scope)
        // Ideally we refactor this utility.
        let streak = 1;
        const today = new Date().toDateString();
        if (sortedDates[0] !== today && sortedDates[0] !== new Date(Date.now() - 86400000).toDateString()) {
            return 0;
        }
        for (let i = 0; i < sortedDates.length - 1; i++) {
            if (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i + 1]).getTime() === 86400000) streak++;
            else break;
        }
        return streak;
    };

    const calculateStreak = () => calculateLogicStreak(entries);


    const VIBE_MAP: Record<number, { icon: React.ReactNode, label: string, color: string }> = {
        1: { icon: <Smile className="w-5 h-5" />, label: 'Happy', color: 'text-green-500' },
        2: { icon: <Cloud className="w-5 h-5" />, label: 'Quiet', color: 'text-blue-400' },
        3: { icon: <Moon className="w-5 h-5" />, label: 'Off', color: 'text-amber-500' },
        4: { icon: <Ghost className="w-5 h-5" />, label: 'Hide-y', color: 'text-purple-500' },
        5: { icon: <Zap className="w-5 h-5" />, label: 'Energetic', color: 'text-yellow-500' }
    };

    const vibeDistribution = entries.reduce((acc, entry) => {
        acc[entry.vibe_score] = (acc[entry.vibe_score] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    if (isLoading) {
        return <div className="p-6 text-center text-neutral/40">Loading insights...</div>;
    }

    return (
        <div className="p-6 pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <div className="text-xs font-bold uppercase tracking-widest text-neutral/40 mb-1">Health Check-In</div>
                <h1 className="text-2xl font-bold text-accent">{catName}'s Well-Being</h1>
            </header>

            {/* 🧠 THE BRAIN: AI Insights Section */}
            {brainInsights.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-accent/50 flex items-center gap-2 uppercase tracking-wide">
                        <span className="text-lg">🧠</span> Brain Insights
                    </h3>
                    <div className="grid gap-2">
                        {brainInsights.map(insight => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))}
                    </div>
                </div>
            )}

            {/* 🏥 HEALTH INSIGHTS: Pattern Detection */}
            <HealthInsights
                entries={entries as TimelineEntry[]}
                catName={catName}
                onExportClick={() => setShowPaywall(!isPremium)}
            />

            {/* 📊 VET EXPORT: Premium Feature */}
            <ExportButton
                entries={entries}
                catName={catName}
                isPremium={isPremium}
                onUpgradeClick={() => setShowPaywall(true)}
            />

            {/* Streak Card - Simplified */}
            <div className="bg-white p-5 rounded-2xl border border-neutral/10 calm-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-accent">Log Streak</div>
                            <div className="text-xs text-neutral/50">Consecutive days</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{calculateStreak()}</div>
                </div>
            </div>

            {/* Vibe Breakdown */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent/60" />
                    Vibe Breakdown
                </h3>

                <div className="bg-white rounded-2xl p-5 border border-neutral/10 calm-shadow space-y-4">
                    {Object.entries(VIBE_MAP).map(([score, vibe]) => {
                        const count = vibeDistribution[Number(score)] || 0;
                        const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;

                        if (count === 0) return null; // Hide unused vibes to keep it clean

                        return (
                            <div key={score} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="font-medium text-neutral/70 flex items-center gap-1">
                                        {vibe.icon} {vibe.label}
                                    </span>
                                    <span className="text-neutral/40">{count} logs ({Math.round(percentage)}%)</span>
                                </div>
                                <div className="h-2 bg-neutral/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", vibe.color.replace('text-', 'bg-'))}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {entries.length === 0 && (
                        <div className="text-center text-sm text-neutral/40 py-4">
                            No vibes logged yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Total Logs */}
            <div className="bg-blue-50/50 p-4 rounded-xl flex items-center justify-between border border-blue-100/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-accent">Total Memories</div>
                        <div className="text-xs text-neutral/50">Since joining</div>
                    </div>
                </div>
                <div className="text-xl font-bold text-blue-600">{entries.length}</div>
            </div>

            {/* 🎮 THE GAME: Trophy Case (Opt-in) */}
            {localStorage.getItem('showAchievements') === 'true' && achievements.length > 0 && (
                <TrophyCase achievements={achievements} />
            )}

            {/* Premium Paywall Modal */}
            <PremiumGate
                isOpen={showPaywall}
                onClose={() => {
                    setShowPaywall(false);
                    // Refresh premium status in case user upgraded
                    setIsPremium(localStorage.getItem('isPremium') === 'true');
                }}
                feature="export"
            />
        </div>
    );
};
