// scripts/verify_grace_period_logic.ts
import 'fake-indexeddb/auto';
import { RetentionService } from '../src/services/retention/RetentionService';
import { db } from '../src/services/db/meowmo_db';

async function verifyGracePeriod() {
    console.log("--- Starting Non-Interactive Grace Period Verification ---");
    const catId = "test-cat-grace";

    try {
        console.log("[Test] Creating a streak with a one-day gap...");
        const today = new Date();
        const yesterday = new Date(Date.now() - 86400000);
        const twoDaysAgo = new Date(Date.now() - 86400000 * 2);
        const threeDaysAgo = new Date(Date.now() - 86400000 * 3);

        // Scenario: Logged Today, Missed Yesterday, Logged 2 days ago, Logged 3 days ago.
        // Streak should be 3 (Today, [gap], 2 days ago, 3 days ago).

        const logDates = [
            today.toISOString().split('T')[0],
            twoDaysAgo.toISOString().split('T')[0],
            threeDaysAgo.toISOString().split('T')[0]
        ];

        for (const date of logDates) {
            await db.entries.put({
                catId,
                date,
                vibeScore: 5,
                syncStatus: 'synced',
                updatedAt: new Date().toISOString()
            });
        }

        console.log("[Test] Calculating streak stats with grace period...");
        const stats = await RetentionService.calculateStreak(catId);

        console.log(`[Result] Current Streak: ${stats.currentStreak}`);

        // Today (1) + Gap (Grace) + 2 days ago (2) + 3 days ago (3) = 3
        if (stats.currentStreak !== 3) {
            throw new Error(`Grace Period mismatch! Expected 3, got ${stats.currentStreak}`);
        }

        console.log("✅ Success: Grace Period Logic Verified");

        console.log("[Test] Verifying double gap reset...");
        // Add a log 5 days ago (gap at 4 days ago)
        const fiveDaysAgo = new Date(Date.now() - 86400000 * 5);
        await db.entries.put({
            catId,
            date: fiveDaysAgo.toISOString().split('T')[0],
            vibeScore: 5,
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
        });

        const stats2 = await RetentionService.calculateStreak(catId);
        console.log(`[Result] Current Streak after 2nd gap: ${stats2.currentStreak}`);
        // Should still be 3 because the gap at 4 days ago breaks it (grace period only used once per session)
        if (stats2.currentStreak !== 3) {
            throw new Error(`Double gap check failed! Expected 3, got ${stats2.currentStreak}`);
        }

        console.log("✅ Success: Double Gap Reset Verified");

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }

    console.log("\n--- Verification Complete ---");
}

verifyGracePeriod();
