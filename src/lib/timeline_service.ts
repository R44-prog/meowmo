// src/lib/timeline_service.ts

import { validateCatOwnership } from "@/middleware/ownership_guard";

/**
 * Milestone 5: Timeline Read
 * Vertical feed of observations (newest first).
 */

export async function getTimeline(userId: string, catId: string, options: { limit?: number, offset?: number }) {
    // 1. Verify Ownership
    const isOwner = await validateCatOwnership(userId, catId);
    if (!isOwner) throw new Error("Unauthorized");

    const limit = options.limit || 10;
    const offset = options.offset || 0;

    // 2. Paginated Query (Logic)
    // SELECT ... FROM daily_entries e 
    // JOIN ... 
    // WHERE e.cat_id = catId
    // ORDER BY date DESC
    // LIMIT limit OFFSET offset

    console.log(`[TIMELINE] Fetching feed for cat ${catId} (Page: ${offset / limit + 1})`);

    return []; // Array of entries
}
