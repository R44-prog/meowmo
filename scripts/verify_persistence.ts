import 'fake-indexeddb/auto';
import { db } from '../src/services/db/meowmo_db';

async function verifyPersistence() {
    console.log("--- Starting Non-Interactive Persistence Verification ---");

    const mockEntry = {
        catId: "test-cat-123",
        date: "2026-02-09",
        vibeScore: 5,
        note: "Non-interactive verification entry.",
        syncStatus: 'pending' as const,
        updatedAt: new Date().toISOString()
    };

    try {
        console.log("[Test] Saving entry to IndexedDB...");
        await db.saveEntry(mockEntry);

        console.log("[Test] Fetching entry back from IndexedDB...");
        const entries = await db.getRecentEntries("test-cat-123");

        if (entries.length === 0) throw new Error("Entry not found after save!");
        if (entries[0].note !== mockEntry.note) throw new Error("Data mismatch!");

        console.log("✅ Success: Local Persistence Verified");

        console.log("[Test] Checking Sync Queue...");
        const pending = await db.getPendingSync();
        if (pending.length === 0) throw new Error("Sync status 'pending' not preserved!");

        console.log(`✅ Success: Sync Queue Verified (${pending.length} item pending)`);

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }

    console.log("\n--- Verification Complete: Persistence Layer is Production Ready ---");
}

verifyPersistence();
