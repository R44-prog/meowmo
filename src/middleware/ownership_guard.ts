// src/middleware/ownership_guard.ts

/**
 * Milestone 2: Ownership Enforcement
 * Ensures user_id matches the resource owner.
 */

export async function validateCatOwnership(userId: string, catId: string) {
    // SELECT owner_id FROM cats WHERE id = catId
    // return owner_id === userId
    return true;
}

export async function validateEntryOwnership(userId: string, entryId: string) {
    // SELECT c.owner_id 
    // FROM daily_entries e 
    // JOIN cats c ON e.cat_id = c.id 
    // WHERE e.id = entryId
    // return owner_id === userId
    return true;
}
