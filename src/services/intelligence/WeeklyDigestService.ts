// src/services/intelligence/WeeklyDigestService.ts
import { db } from '@/services/db/meowmo_db';
import { analyzeHealthPatterns, HealthInsight } from '@/lib/health_analysis_service';

export interface WeeklyDigest {
    id: string;
    catName: string;
    periodStart: string;
    periodEnd: string;
    narrative: string;
    avgVibe: number;
    vibeTrend: 'improving' | 'stable' | 'waning';
    keyInsights: HealthInsight[];
    photoUrl?: string; // Best photo of the week
    totalEntries: number;
}

export class WeeklyDigestService {
    static async generateDigest(catId: string, catName: string): Promise<WeeklyDigest | null> {
        const entries = await db.entries
            .where('catId')
            .equals(catId)
            .reverse()
            .sortBy('date');

        const last7Days = entries.filter(e => {
            const date = new Date(e.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        });

        if (last7Days.length < 3) return null; // Not enough data for a digest

        const prev7To14Days = entries.filter(e => {
            const date = new Date(e.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            return date >= twoWeeksAgo && date < weekAgo;
        });

        const recentVibe = last7Days.reduce((sum, e) => sum + e.vibeScore, 0) / last7Days.length;
        const baselineVibe = prev7To14Days.length > 0
            ? prev7To14Days.reduce((sum, e) => sum + e.vibeScore, 0) / prev7To14Days.length
            : recentVibe;

        const trend: 'improving' | 'stable' | 'waning' =
            recentVibe < baselineVibe - 0.5 ? 'improving' :
                recentVibe > baselineVibe + 0.5 ? 'waning' : 'stable';

        // Mapping local entries to TimelineEntry for health analysis
        const mappedEntries = last7Days.map(e => ({
            id: e.id || '',
            date: e.date,
            vibe_score: e.vibeScore,
            appetite: e.appetite as any,
            litter: e.litter as any,
            note: e.note,
            photoUrl: e.photoUrl
        }));

        const insights = analyzeHealthPatterns(mappedEntries, catName);

        // Best photo (first one with a photo)
        const photoEntry = last7Days.find(e => e.photoUrl);

        return {
            id: crypto.randomUUID(),
            catName,
            periodStart: last7Days[last7Days.length - 1].date,
            periodEnd: last7Days[0].date,
            narrative: this.generateNarrative(catName, recentVibe, trend, last7Days.length),
            avgVibe: recentVibe,
            vibeTrend: trend,
            keyInsights: insights.slice(0, 2),
            photoUrl: photoEntry?.photoUrl,
            totalEntries: last7Days.length
        };
    }

    private static generateNarrative(catName: string, vibe: number, trend: string, count: number): string {
        const vibeDesc = vibe <= 1.5 ? 'very happy' : vibe <= 2.5 ? 'quiet and calm' : 'a bit off';
        const trendDesc = trend === 'improving' ? 'showed a lovely upward trend' : trend === 'waning' ? 'seemed a little less energetic than usual' : 'remained perfectly steady';

        return `${catName} had a ${vibeDesc} week with ${count} observations. Their mood ${trendDesc} throughout the period.`;
    }
}
