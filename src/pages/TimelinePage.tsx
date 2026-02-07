import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TimelineFeed } from '@/components/timeline/TimelineFeed';
import { TimelineSkeleton } from '@/components/timeline/TimelineSkeleton';
import { LogBooth } from '@/components/log/LogBooth';
import { getTimeline } from '@/lib/timeline_service';
import { upsertDailyEntry } from '@/lib/entry_service';

// Props passed from App (Global Context)
interface TimelinePageProps {
    catName: string;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ catName }) => {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogBoothOpen, setIsLogBoothOpen] = useState(false);

    // Initial Fetch
    useEffect(() => {
        if (catName) {
            loadEntries();
        }
    }, [catName]);

    const loadEntries = () => {
        setIsLoading(true);
        // Using fixed catId as per Milestone 7
        getTimeline("dummy-user", "6a09dc55-3015-43d3-85a0-d0c1a822ad22", { limit: 50 })
            .then(data => {
                setEntries(data);
                setIsLoading(false);
            });
    };

    const handleSaveLog = async (newEntry: any) => {
        try {
            const entryData = {
                catId: "6a09dc55-3015-43d3-85a0-d0c1a822ad22",
                vibeScore: newEntry.vibe_score,
                note: newEntry.note,
                appetite: newEntry.appetite,
                litter: newEntry.litter
            };

            await upsertDailyEntry("dummy-user", entryData);

            // Optimistic / Immediate Update
            const optimisticEntry = {
                ...newEntry,
                id: crypto.randomUUID(), // Temp ID until refresh
                date: new Date().toISOString()
            };
            setEntries([optimisticEntry, ...entries]);
            localStorage.setItem(`last_log_${catName}`, JSON.stringify(newEntry));
        } catch (err) {
            console.error("[APP] Failed to save entry:", err);
            // Revert or show error
        }
    };

    return (
        <div className="pb-20"> {/* Padding for FAB */}
            {/* Header is now part of the Page or global? 
                Let's keep specific headers per page for flexibility.
            */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-neutral/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {catName[0]}
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight text-accent/80">{catName}'s Journey</h1>
                </div>
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
