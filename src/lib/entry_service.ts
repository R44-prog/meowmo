// src/lib/entry_service.ts

import { validateCatOwnership } from "@/middleware/ownership_guard";
import { supabase } from "./supabase";

/**
 * Milestone 4: Daily Entry Upsert
 * Create-or-Update today's observation.
 */

/**
 * Creates or updates a daily health observation for a specific cat.
 * Validates ownership before proceeding with the database operation.
 * 
 * @param userId - The ID of the current user.
 * @param data - The entry data.
 * @param data.catId - The ID of the cat.
 * @param data.vibeScore - The health/vibe score (usually 1-5).
 * @param data.note - Optional text note for the entry.
 * @param data.appetite - Optional appetite status.
 * @param data.litter - Optional litter box status.
 * @returns A promise that resolves to the upserted entry.
 * @throws Error if the user is not the owner of the cat.
 */
export async function upsertDailyEntry(userId: string, data: {
    catId: string,
    vibeScore: number,
    note?: string,
    appetite?: 'good' | 'picky' | 'none',
    litter?: 'normal' | 'off'
}) {
    // 1. Verify Ownership
    const isOwner = await validateCatOwnership(userId, data.catId);
    if (!isOwner) throw new Error("Unauthorized");

    // 2. SQL UPSERT (Logic)
    // In Milestone 7, we ensure the date is normalized to YYYY-MM-DD for the unique constraint.
    const today = new Date().toISOString().split('T')[0];

    console.log(`[ENTRY] Upserting log for cat ${data.catId} on ${today} with vibe ${data.vibeScore}`);

    const { data: entry, error } = await supabase
        .from('daily_entries')
        .upsert({
            cat_id: data.catId,
            date: today,
            vibe_score: data.vibeScore,
            note: data.note,
            appetite: data.appetite,
            litter: data.litter
        }, { onConflict: 'cat_id,date' })
        .select()
        .single();

    if (error) {
        console.error("[ENTRY] Database error:", error);
        throw error;
    }

    return entry;
}
