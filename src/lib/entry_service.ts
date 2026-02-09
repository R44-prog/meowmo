// src/lib/entry_service.ts

import { validateCatOwnership } from "@/middleware/ownership_guard";
import { supabase } from "./supabase";
import { db, LocalEntry } from "@/services/db/meowmo_db";

/**
 * Milestone 4: Daily Entry Upsert (Enhanced for Local-First)
 * Create-or-Update today's observation locally first, then background sync.
 */
export async function upsertDailyEntry(userId: string, data: {
    catId: string,
    vibeScore: number,
    note?: string,
    appetite?: 'good' | 'picky' | 'none',
    litter?: 'normal' | 'off',
    photoUrl?: string,
    behaviorId?: string,
    trophy?: any
}) {
    // 1. Verify Ownership (Still required for security)
    const isOwner = await validateCatOwnership(userId, data.catId);
    if (!isOwner) throw new Error("Unauthorized");

    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    // 2. Local-First Write
    const localEntry: LocalEntry = {
        catId: data.catId,
        date: today,
        vibeScore: data.vibeScore,
        note: data.note,
        appetite: data.appetite,
        litter: data.litter,
        photoUrl: data.photoUrl,
        behaviorId: data.behaviorId,
        trophy: data.trophy,
        syncStatus: 'pending',
        updatedAt: timestamp
    };

    console.log(`[ENTRY] Saving local-first log for cat ${data.catId} on ${today}`);
    await db.saveEntry(localEntry);

    // 3. Background Sync Attempt
    try {
        const { data: entry, error } = await supabase
            .from('daily_entries')
            .upsert({
                cat_id: data.catId,
                date: today,
                vibe_score: data.vibeScore,
                note: data.note,
                appetite: data.appetite,
                litter: data.litter,
                photo_url: data.photoUrl, // Ensure schema matches
                behavior_id: data.behaviorId,
                trophy_data: data.trophy // Assumes JSONB col
            }, { onConflict: 'cat_id,date' })
            .select()
            .single();

        if (error) throw error;

        // 4. Mark as Synced
        await db.entries.where({ catId: data.catId, date: today }).modify({ syncStatus: 'synced' });
        return entry;
    } catch (err) {
        console.warn("[ENTRY] Background sync failed (offline?), will retry later:", err);
        return localEntry; // Return local even if sync fails
    }
}
