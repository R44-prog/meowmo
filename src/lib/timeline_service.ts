// src/lib/timeline_service.ts
import { supabase, isSupabaseConfigured } from './supabase';
import simulationData from '../data/ARCHIVED_simulation_users.json';

/**
 * Phase J: Timeline Connection
 * Read entries from Supabase with fallback to simulation data
 */

export interface TimelineEntry {
    id: string;
    cat_id: string;
    date: string;
    vibe_score: number;
    note?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
    photoUrl?: string;
}

/**
 * Retrieves the health timeline entries for a specific cat.
 * 
 * @param _userId - The ID of the current user (currently unused, kept for API consistency).
 * @param catId - The ID of the cat whose timeline is being retrieved.
 * @param options - Pagination options.
 * @param options.limit - The maximum number of entries to return (default: 10).
 * @param options.offset - The number of entries to skip (default: 0).
 * @returns A promise that resolves to an array of TimelineEntry objects.
 */
export async function getTimeline(
    _userId: string,
    catId: string,
    options: { limit?: number, offset?: number }
): Promise<TimelineEntry[]> {
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    // If Supabase is configured, use live data
    if (isSupabaseConfigured) {
        try {
            console.log(`[TIMELINE] Fetching live data for cat ${catId} (limit: ${limit}, offset: ${offset})`);

            const { data, error } = await supabase
                .from('daily_entries')
                .select('*')
                .eq('cat_id', catId)
                .order('date', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error('[TIMELINE] Supabase query error:', error);
                throw error;
            }

            console.log(`[TIMELINE] Retrieved ${data?.length || 0} entries from Supabase`);
            return data || [];

        } catch (err) {
            console.error('[TIMELINE] Failed to fetch from Supabase, falling back to simulation data:', err);
            // Fall through to simulation data
        }
    }

    // Fallback: Use archived simulation data
    console.warn('[TIMELINE] Using simulation data (Supabase not configured or failed)');

    try {
        const entries = (simulationData as any).daily_entries.filter((e: any) => e.cat_id === catId);

        // Sort newest first
        entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return entries.slice(offset, offset + limit);
    } catch (err) {
        console.error('[TIMELINE] Could not load simulation data:', err);
        return [];
    }
}
