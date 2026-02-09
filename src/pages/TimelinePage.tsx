import React, { useState, useEffect } from 'react';
import { Plus, Flame } from 'lucide-react';
import { TimelineFeed } from '@/components/timeline/TimelineFeed';
import { TimelineSkeleton } from '@/components/timeline/TimelineSkeleton';
import { LogBooth } from '@/components/log/LogBooth';
import { getTimeline } from '@/lib/timeline_service';
import { upsertDailyEntry } from '@/lib/entry_service';
import { db } from '@/services/db/meowmo_db';
import { RetentionService, StreakStats } from '@/services/retention/RetentionService';

// Props passed from App (Global Context)
interface TimelinePageProps {
    catName: string;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ catName }) => {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogBoothOpen, setIsLogBoothOpen] = useState(false);
    const [streakStats, setStreakStats] = useState<StreakStats | null>(null);

    const catId = "6a09dc55-3015-43d3-85a0-d0c1a822ad22"; // Standardized Production ID

    // Initial Fetch
    useEffect(() => {
        if (catName) {
            loadEntries();
        }
    }, [catName]);

    const loadEntries = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch from Local DB first (Local-First Priority)
            const localEntries = await db.getRecentEntries(catId);

            // Calculate Streak autonomously
            const stats = await RetentionService.calculateStreak(catId);
            setStreakStats(stats);

            if (localEntries.length > 0) {
                setEntries(localEntries.map(e => ({
                    ...e,
                    vibe_score: e.vibeScore, // Handle mapping for feed
                    photo_url: e.photoUrl
                })));
                setIsLoading(false);
            }

            // 2. Background Refresh from Server
            const serverEntries = await getTimeline("dummy-user", catId, { limit: 50 });

            // For now, we simple override, but in a real app we'd merge
            setEntries(serverEntries);
        } catch (err) {
            console.error("[TIMELINE] Load failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveLog = async (newEntry: any) => {
        try {
            await upsertDailyEntry("dummy-user", {
                catId: catId,
                vibeScore: newEntry.vibe_score,
                note: newEntry.note,
                appetite: newEntry.appetite,
                litter: newEntry.litter,
                photoUrl: newEntry.photoUrl,
                behaviorId: newEntry.behaviorId,
                trophy: newEntry.trophy
            });

            // Optimistic / Immediate Update
            setEntries([newEntry, ...entries]);

            // Refresh streak autonomously
            const stats = await RetentionService.calculateStreak(catId);
            setStreakStats(stats);
        } catch (err) {
            console.error("[APP] Failed to save entry:", err);
        }
    };

    return (
        <div className="pb-20"> {/* Padding for FAB */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-neutral/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {catName[0]}
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight text-accent/80">{catName}'s Journey</h1>
                </div>
                {streakStats && streakStats.currentStreak > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100 text-orange-600 animate-in zoom-in duration-500">
                        <Flame className="w-4 h-4 fill-orange-500" />
                        <span className="text-xs font-black tracking-tight">{streakStats.currentStreak}</span>
                    </div>
                )}
            </header>

            <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {isLoading ? (
                    <TimelineSkeleton />
                ) : (
                    <TimelineFeed entries={entries} />
                )}
            </main>

            {/* Floating Action Button (Only on Timeline) */}
            <button
                onClick={() => setIsLogBoothOpen(true)}
                className="fixed bottom-24 right-8 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform z-30"
                aria-label="Log new activity"
            >
                <Plus size={28} />
            </button>

            {/* Log Booth Modal */}
            <LogBooth
                isOpen={isLogBoothOpen}
                onClose={() => setIsLogBoothOpen(false)}
                onSave={handleSaveLog}
                catName={catName}
            />
        </div>
    );
};
