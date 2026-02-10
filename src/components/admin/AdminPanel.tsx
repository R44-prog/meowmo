import React from 'react';
import { X, Smile, Cloud, Package, Zap, TrendingUp, Flame, BarChart3, Moon, Ghost } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Entry {
    id: string;
    date: string;
    vibe_score: number;
    note?: string;
    photoUrl?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
}

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
    entries: Entry[];
    catName: string;
}

const FRICTION_LOG_KEY = 'founder_friction_log';

const VIBE_MAP: Record<number, { icon: React.ReactNode, label: string, color: string }> = {
    1: { icon: <Smile className="w-4 h-4" />, label: 'Happy', color: 'text-green-500' },
    2: { icon: <Cloud className="w-4 h-4" />, label: 'Quiet', color: 'text-blue-400' },
    3: { icon: <Moon className="w-4 h-4" />, label: 'Off', color: 'text-amber-500' },
    4: { icon: <Ghost className="w-4 h-4" />, label: 'Hide-y', color: 'text-purple-500' },
    5: { icon: <Zap className="w-4 h-4" />, label: 'Energetic', color: 'text-yellow-500' }
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, entries, catName }) => {
    if (!isOpen) return null;

    // Calculate insights
    const totalEntries = entries.length;

    // Calculate streak (consecutive days)
    const calculateStreak = () => {
        if (entries.length === 0) return 0;
        const sortedDates = entries
            .map(e => new Date(e.date).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i) // unique dates
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 1;
        const today = new Date().toDateString();
        if (sortedDates[0] !== today && sortedDates[0] !== new Date(Date.now() - 86400000).toDateString()) {
            return 0; // Streak broken
        }

        for (let i = 0; i < sortedDates.length - 1; i++) {
            const curr = new Date(sortedDates[i]).getTime();
            const next = new Date(sortedDates[i + 1]).getTime();
            if (curr - next === 86400000) { // 1 day difference
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };
    const currentStreak = calculateStreak();

    // Calculate vibe distribution
    const vibeDistribution = entries.reduce((acc, entry) => {
        acc[entry.vibe_score] = (acc[entry.vibe_score] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Phase C: Wake-up Trigger Logic
    const saturatedUsersCount = entries.length >= 5 ? 1 : 0; // In this per-cat view, saturation is simple
    const [frictionNote, setFrictionNote] = React.useState(() => localStorage.getItem(FRICTION_LOG_KEY) || '');

    const handleFrictionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setFrictionNote(val);
        localStorage.setItem(FRICTION_LOG_KEY, val);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md h-full bg-background shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-6 py-4 border-b border-neutral/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-accent">Founder Panel</h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Phase C: Recruitment Sleep</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral/10 rounded-lg transition-colors"
                        aria-label="Close panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Insights Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Total Entries */}
                        <div className="glass rounded-xl p-4 border border-white/5 shadow-2xl text-center">
                            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-accent/20" />
                            <div className="text-2xl font-black text-accent">{totalEntries}</div>
                            <div className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">Total Logs</div>
                        </div>

                        {/* Current Streak */}
                        <div className="glass rounded-xl p-4 border border-white/5 shadow-2xl text-center">
                            <Flame className="w-5 h-5 mx-auto mb-2 text-amber shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
                            <div className="text-2xl font-black text-accent">{currentStreak}</div>
                            <div className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">Day Streak</div>
                        </div>

                        {/* Most Common Vibe */}
                        <div className="glass rounded-xl p-4 border border-white/5 shadow-2xl text-center">
                            <BarChart3 className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                            <div className="text-2xl font-black text-accent">
                                {Object.keys(vibeDistribution).length > 0
                                    ? Object.entries(vibeDistribution).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
                                    : 0}
                            </div>
                            <div className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">Top Vibe</div>
                        </div>
                    </div>

                    {/* Wake-up Triggers */}
                    <div className="glass rounded-xl p-4 border border-amber/10 shadow-2xl">
                        <h3 className="text-sm font-medium text-accent/80 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            Wake-up Triggers
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-neutral/60">Saturation (Goal: ≥5 logs)</span>
                                <span className={cn(
                                    "text-xs font-bold px-2 py-1 rounded-md",
                                    entries.length >= 5 ? "bg-green-100 text-green-700" : "bg-neutral/5 text-neutral/40"
                                )}>
                                    {entries.length}/5
                                </span>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral/40">Friction Log (Founder Only)</label>
                                <textarea
                                    value={frictionNote}
                                    onChange={handleFrictionChange}
                                    placeholder="Note user 'punts' or workaround patterns here..."
                                    className="w-full h-24 p-3 bg-neutral/5 border border-neutral/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-200 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vibe Distribution */}
                    <div className="glass rounded-xl p-4 border border-white/5 shadow-2xl">
                        <h3 className="text-sm font-medium text-accent/80 mb-3">Vibe Distribution</h3>
                        <div className="space-y-2">
                            {Object.entries(VIBE_MAP).map(([score, vibe]) => {
                                const count = vibeDistribution[Number(score)] || 0;
                                const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
                                return (
                                    <div key={score} className="flex items-center gap-3">
                                        <div className={cn("w-6", vibe.color)}>{vibe.icon}</div>
                                        <div className="flex-1">
                                            <div className="h-2 bg-neutral/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full", vibe.color.replace('text-', 'bg-'))}
                                                    style={{ width: `${percentage}% ` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-neutral/60 w-8 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* All Entries Table */}
                    <div className="glass rounded-xl border border-white/5 shadow-2xl overflow-hidden">
                        <h3 className="text-sm font-medium text-accent/80 px-4 py-3 border-b border-neutral/10">
                            All Entries ({totalEntries})
                        </h3>
                        <div className="max-h-64 overflow-y-auto">
                            {entries.length === 0 ? (
                                <div className="p-4 text-center text-neutral/50 text-sm">
                                    No entries yet
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 sticky top-0">
                                        <tr>
                                            <th className="text-left px-4 py-2 text-[10px] font-black text-accent/30 uppercase tracking-widest">Date</th>
                                            <th className="text-center px-2 py-2 text-[10px] font-black text-accent/30 uppercase tracking-widest">Vibe</th>
                                            <th className="text-center px-2 py-2 text-[10px] font-black text-accent/30 uppercase tracking-widest">Appetite</th>
                                            <th className="text-center px-2 py-2 text-[10px] font-black text-accent/30 uppercase tracking-widest">Litter</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral/5">
                                        {entries.map((entry) => {
                                            const vibe = VIBE_MAP[entry.vibe_score] || VIBE_MAP[2];
                                            return (
                                                <tr key={entry.id} className="hover:bg-white/5 border-b border-white/5">
                                                    <td className="px-4 py-2 text-accent/60 font-medium">
                                                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="text-center px-2 py-2">
                                                        <span className={vibe.color}>{vibe.icon}</span>
                                                    </td>
                                                    <td className="text-center px-2 py-2 text-xs">
                                                        {entry.appetite === 'good' ? '🍲' : entry.appetite === 'picky' ? '🥗' : entry.appetite === 'none' ? '🚫' : '—'}
                                                    </td>
                                                    <td className="text-center px-2 py-2 text-xs">
                                                        {entry.litter === 'normal' ? '✅' : entry.litter === 'off' ? '⚠️' : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            if (confirm('Reset app? This will clear your local data.')) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                        className="w-full py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20"
                    >
                        Reset App Data
                    </button>
                </div>
            </div>
        </div>
    );
};
