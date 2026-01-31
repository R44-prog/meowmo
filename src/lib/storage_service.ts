// src/lib/storage_service.ts

/**
 * Milestone 3: Signed Photo Uploads
 * Direct-to-Bucket flow for reliability.
 */

export async function generateSignedUploadUrl(catId: string, userId: string) {
    // 1. Verify catId ownership (reusing ownership_guard)
    // 2. Generate a unique storage key: `cats/${catId}/${Date.now()}.jpg`
    // 3. Issue PUT URL from Storage Provider

    const storageKey = `cats/${catId}/${Date.now()}.jpg`;

    return {
        uploadUrl: `https://storage.provider/signed-put-url`,
        storageKey
    };
}

export async function attachPhotoToEntry(entryId: string, storageKey: string) {
    // INSERT INTO photos (daily_entry_id, storage_key) VALUES (...)
    console.log(`[STORAGE] Attached ${storageKey} to entry ${entryId}`);
}
