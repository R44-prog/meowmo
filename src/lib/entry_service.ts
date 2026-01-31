// src/lib/entry_service.ts

import { validateCatOwnership } from "@/middleware/ownership_guard";

/**
 * Milestone 4: Daily Entry Upsert
 * Create-or-Update today's observation.
 */

export async function upsertDailyEntry(userId: string, data: {
    catId: string,
    vibeScore: number,
    note?: string,
    routines?: Array<{ type: string, value?: string }>
}) {
    // 1. Verify Ownership
    const isOwner = await validateCatOwnership(userId, data.catId);
    if (!isOwner) throw new Error("Unauthorized");

    // 2. SQL UPSERT (Logic)
    // INSERT INTO daily_entries (cat_id, date, vibe_score, note)
    // ON CONFLICT (cat_id, date) DO UPDATE ...

    console.log(`[ENTRY] Upserting log for cat ${data.catId} on ${new Date().toISOString().split('T')[0]}`);

    return { entryId: "uuid-from-upsert" };
}
