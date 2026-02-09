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
import { HealthPulse } from '@/components/insights/HealthPulse';
import { WeeklyDigestCard } from '@/components/insights/WeeklyDigestCard';
import { RetentionService } from '@/services/retention/RetentionService';
import { WeeklyDigestService, WeeklyDigest } from '@/services/intelligence/WeeklyDigestService';
import { TimelineEntry } from '@/lib/health_analysis_service';

export const InsightsPage: React.FC = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [brainInsights, setBrainInsights] = useState<BrainInsight[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [streakStats, setStreakStats] = useState<any>(null);
    const [weeklyDigest, setWeeklyDigest] = useState<WeeklyDigest | null>(null);
    const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium') === 'true');
    const [showPaywall, setShowPaywall] = useState(false);
    // In V1, we assume a single user context.
    const catName = localStorage.getItem('catName') || 'Cat';

    useEffect(() => {
        setIsLoading(true);
        const catId = "6a09dc55-3015-43d3-85a0-d0c1a822ad22";
        getTimeline("dummy-user", catId, { limit: 100 })
            .then(async data => {
                setEntries(data);
                setBrainInsights(analyzeTimeline(data));

                const stats = await RetentionService.calculateStreak(catId);
                setStreakStats(stats);
                setAchievements(checkAchievements(data, stats.currentStreak));

                // Generate Weekly Digest
                const digest = await WeeklyDigestService.generateDigest(catId, catName);
                setWeeklyDigest(digest);

                setIsLoading(false);
            });
    }, []);

    const calculateStreak = () => streakStats?.currentStreak || 0;


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
            <header className="flex justify-between items-end">
                <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-accent/30 mb-1">Health Check-In</div>
                    <h1 className="text-2xl font-bold text-accent">Well-Being</h1>
                </div>
                {streakStats?.currentStreak > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/10 rounded-full border border-amber/20 text-amber">
                        <Flame className="w-3.5 h-3.5 fill-amber" />
                        <span className="text-[11px] font-black tracking-tight">{streakStats.currentStreak}d</span>
                    </div>
                )}
            </header>

            {/* 📅 WEEKLY DIGEST (Phase N-3) */}
            {weeklyDigest && <WeeklyDigestCard digest={weeklyDigest} />}

            {/* 🏥 HEALTH PULSE: Autonomous Intelligence Indicator */}
            <HealthPulse
                status={brainInsights.some(i => i.severity === 'attention') ? 'attention' :
                    brainInsights.some(i => i.severity === 'vet_required') ? 'vet_required' : 'stable'}
                catName={catName}
                lastChecked="Just now"
            />

            {/* 🧠 THE BRAIN: AI Insights Section */}
            {brainInsights.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-amber/60 flex items-center gap-2 uppercase tracking-wide">
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
            <div className="glass p-5 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber/10 rounded-lg">
                            <Flame className="w-5 h-5 text-amber" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-accent">Log Streak</div>
                            <div className="text-xs text-accent/40">Consecutive days</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-amber">{calculateStreak()}</div>
                </div>
            </div>

            {/* Vibe Breakdown */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent/60" />
                    Vibe Breakdown
                </h3>

                <div className="glass rounded-2xl p-5 border border-white/5 shadow-2xl space-y-4">
                    {Object.entries(VIBE_MAP).map(([score, vibe]) => {
                        const count = vibeDistribution[Number(score)] || 0;
                        const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;

                        if (count === 0) return null; // Hide unused vibes to keep it clean

                        return (
                            <div key={score} className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                    <span className="font-medium text-accent/70 flex items-center gap-1">
                                        {vibe.icon} {vibe.label}
                                    </span>
                                    <span className="text-accent/30">{count} logs ({Math.round(percentage)}%)</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", vibe.color.replace('text-', 'bg-'))}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {entries.length === 0 && (
                        <div className="text-center text-sm text-accent/30 py-4">
                            No vibes logged yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Total Logs */}
            <div className="bg-amber/5 p-4 rounded-xl flex items-center justify-between border border-amber/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber/10 rounded-lg text-amber">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-accent">Total Memories</div>
                        <div className="text-xs text-accent/40">Since joining</div>
                    </div>
                </div>
                <div className="text-xl font-bold text-amber">{entries.length}</div>
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
