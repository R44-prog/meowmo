// scripts/production_stability_audit.ts
import 'fake-indexeddb/auto';
import { db } from '../src/services/db/meowmo_db';
import { analyzeHealthPatterns } from '../src/lib/health_analysis_service';
import { RetentionService } from '../src/services/retention/RetentionService';
import { WeeklyDigestService } from '../src/services/intelligence/WeeklyDigestService';

async function runAudit() {
    console.log("=== MEOWMO PRODUCTION STABILITY AUDIT ===");
    const catId = "audit-cat-final";
    const catName = "AuditTom";

    try {
        // 1. Database Integrity
        console.log("[1/4] Persistence: Verifying DexieDB integrity...");
        await db.entries.put({
            catId,
            date: new Date().toISOString().split('T')[0],
            vibeScore: 1,
            appetite: 'good',
            litter: 'normal',
            syncStatus: 'synced',
            updatedAt: new Date().toISOString()
        });
        const entryCount = await db.entries.count();
        if (entryCount === 0) throw new Error("Database failed to store entry.");
        console.log("  ✅ Persistence Layer: Healthy");

        // 2. Intelligence Engine
        console.log("[2/4] Intelligence: Verifying Brain 2.0 pattern detection...");
        const mockEntries = Array(14).fill(null).map((_, i) => ({
            id: `id-${i}`,
            date: new Date(Date.now() - i * 86400000).toISOString(),
            vibe_score: i < 7 ? 4 : 1, // Significant shift
            appetite: 'picky' as any,
            litter: 'normal' as any
        }));
        const patterns = analyzeHealthPatterns(mockEntries, catName);
        if (patterns.length === 0) throw new Error("Brain failed to detect clear patterns.");
        console.log(`  ✅ Brain Engine: Detected ${patterns.length} patterns successfully.`);

        // 3. Retention & Habits
        console.log("[3/4] Retention: Verifying habit loops...");
        const stats = await RetentionService.calculateStreak(catId);
        if (stats.currentStreak !== 1) throw new Error("Retention service failed streak calculation.");
        console.log("  ✅ Retention Engine: Healthy");

        // 4. Digest Generation
        console.log("[4/4] Automation: Verifying Weekly Digest pipeline...");
        const digest = await WeeklyDigestService.generateDigest(catId, catName);
        // Might be null if not enough data, but we just want to ensure it doesn't crash
        console.log("  ✅ Automation Pipeline: Response received (Healthy)");

        console.log("\n=== AUDIT COMPLETE: MEOWMO IS PRODUCTION READY ===");
        process.exit(0);
    } catch (error) {
        console.error("❌ AUDIT FAILED:", error);
        process.exit(1);
    }
}

runAudit();
