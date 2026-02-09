// scripts/verify_weekly_digest.ts
import 'fake-indexeddb/auto';
import { WeeklyDigestService } from '../src/services/intelligence/WeeklyDigestService';
import { db } from '../src/services/db/meowmo_db';

async function verifyWeeklyDigest() {
    console.log("--- Starting Non-Interactive Weekly Digest Verification ---");

    const catId = "digest-cat";
    const catName = "DigestKitty";

    try {
        console.log("[Test] Creating 5 days of history...");
        for (let i = 0; i < 5; i++) {
            await db.entries.put({
                catId,
                date: new Date(Date.now() - i * 86400000).toISOString(),
                vibeScore: 1, // Happy
                appetite: 'good',
                litter: 'normal',
                syncStatus: 'synced',
                updatedAt: new Date().toISOString()
            });
        }

        console.log("[Test] Generating digest...");
        const digest = await WeeklyDigestService.generateDigest(catId, catName);

        if (digest) {
            console.log("✅ Success: Weekly Digest generated.");
            console.log(` > Narrative: ${digest.narrative}`);
            console.log(` > Avg Vibe: ${digest.avgVibe}`);
            console.log(` > Trend: ${digest.vibeTrend}`);
        } else {
            throw new Error("Failed to generate digest with valid data!");
        }

        console.log("[Test] Verifying failure with insufficient data...");
        await db.entries.clear();
        const digestEmpty = await WeeklyDigestService.generateDigest(catId, catName);
        if (digestEmpty === null) {
            console.log("✅ Success: Service correctly returned null for empty database.");
        }

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }

    console.log("\n--- Verification Complete ---");
}

verifyWeeklyDigest();
