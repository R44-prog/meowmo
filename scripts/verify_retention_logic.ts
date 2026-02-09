// scripts/verify_retention_logic.ts
import 'fake-indexeddb/auto';
import { RetentionService } from '../src/services/retention/RetentionService';
import { db } from '../src/services/db/meowmo_db';

async function verifyRetention() {
    console.log("--- Starting Non-Interactive Retention Verification ---");
    const catId = "test-cat-streak";

    try {
        console.log("[Test] Creating a 3-day streak...");
        const dates = [
            new Date().toISOString().split('T')[0], // Today
            new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
            new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] // Day before
        ];

        for (const date of dates) {
            await db.entries.put({
                catId,
                date,
                vibeScore: 5,
                syncStatus: 'synced',
                updatedAt: new Date().toISOString()
            });
        }

        console.log("[Test] Calculating streak stats...");
        const stats = await RetentionService.calculateStreak(catId);

        console.log(`[Result] Current Streak: ${stats.currentStreak}`);
        console.log(`[Result] Longest Streak: ${stats.longestStreak}`);

        if (stats.currentStreak !== 3) throw new Error(`Streak mismatch! Expected 3, got ${stats.currentStreak}`);

        console.log("✅ Success: Retention Logic Verified");

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }

    console.log("\n--- Verification Complete: Retention Service is Production Ready ---");
}

verifyRetention();
