export interface BrainInsight {
    id: string;
    type: 'correlation' | 'trend' | 'fact';
    title: string;
    description: string;
    severity?: 'info' | 'attention' | 'vet_required';
    score?: number; // Significance score 0-100
    icon?: string;
    color?: string; // Tailwind class
}

interface Entry {
    date: string;
    vibe_score: number;
    appetite?: string;
    litter?: 'normal' | 'off';
    [key: string]: any;
}

export const analyzeTimeline = (entries: Entry[]): BrainInsight[] => {
    const insights: BrainInsight[] = [];

    if (entries.length < 5) return insights; // Need data to be smart

    // 1. Analyze Appetite Correlation
    const goodAppetiteEntries = entries.filter(e => e.appetite === 'good');
    const pickyAppetiteEntries = entries.filter(e => e.appetite === 'picky');

    if (goodAppetiteEntries.length > 0 && pickyAppetiteEntries.length > 0) {
        const avgVibeGood = average(goodAppetiteEntries.map(e => e.vibe_score));
        const avgVibePicky = average(pickyAppetiteEntries.map(e => e.vibe_score));

        const diff = avgVibeGood - avgVibePicky;
        if (diff > 0.5) {
            insights.push({
                id: 'appetite-impact',
                type: 'correlation',
                title: 'The Hunger Effect',
                description: `When appetite is good, vibe score is ${(diff * 20).toFixed(0)}% higher.`,
                severity: 'info',
                icon: '🍗',
                color: 'bg-green-100 text-green-700'
            });
        }
    }

    // 2. Mood Stability Analysis
    const vibeScores = entries.map(e => e.vibe_score);
    const avgVibe = average(vibeScores);
    const variance = vibeScores.reduce((sum, score) => sum + Math.pow(score - avgVibe, 2), 0) / vibeScores.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 1.2) {
        insights.push({
            id: 'mood-variance',
            type: 'trend',
            title: 'Mood Variability Detected',
            description: `Vibe scores varied significantly this week. Consider noting environmental changes or stressors.`,
            severity: 'attention',
            icon: '📊',
            color: 'bg-amber-100 text-amber-700'
        });
    } else if (entries.length >= 7 && stdDev < 0.5) {
        insights.push({
            id: 'mood-stable',
            type: 'correlation',
            title: 'Stable Routine',
            description: `Consistently calm vibes suggest a stable environment and routine.`,
            severity: 'info',
            icon: '✓',
            color: 'bg-green-100 text-green-700'
        });
    }

    // 3. Litter Check
    const badLitterEntries = entries.filter(e => e.litter === 'off');
    if (badLitterEntries.length > 2) {
        insights.push({
            id: 'litter-alert',
            type: 'trend',
            title: 'Litter Watch',
            description: `Recorded 'Off' litter habits ${badLitterEntries.length} times recently.`,
            severity: 'attention',
            icon: '⚠️',
            color: 'bg-orange-100 text-orange-700'
        });
    }

    return insights;
};

const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
