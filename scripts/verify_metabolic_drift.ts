// scripts/verify_metabolic_drift.ts
import 'fake-indexeddb/auto';
import { analyzeHealthPatterns, TimelineEntry } from '../src/lib/health_analysis_service';

async function verifyMetabolicDrift() {
    console.log("--- Starting Non-Interactive Metabolic Drift Verification ---");

    const catName = "DriftCat";
    const entries: TimelineEntry[] = [];

    // Create 14 entries
    // Week 1 (Baseline): All 'good' appetite
    for (let i = 0; i < 7; i++) {
        entries.push({
            id: `baseline-${i}`,
            date: new Date(Date.now() - (14 - i) * 86400000).toISOString(),
            vibe_score: 1, // Happy
            appetite: 'good',
            litter: 'normal'
        });
    }

    // Week 2 (Recent): All 'picky' appetite (Drift!)
    for (let i = 0; i < 7; i++) {
        entries.push({
            id: `recent-${i}`,
            date: new Date(Date.now() - (7 - i) * 86400000).toISOString(),
            vibe_score: 2, // Quiet (slight shift)
            appetite: 'picky',
            litter: 'normal'
        });
    }

    console.log("[Test] Analyzing patterns for Appetite Drift...");
    const insights = analyzeHealthPatterns(entries, catName);

    const appetiteDrift = insights.find(i => i.pattern === 'metabolic_drift');
    const vibeShift = insights.find(i => i.pattern === 'behavior_change');

    console.log(`[Result] Found ${insights.length} insights.`);

    if (appetiteDrift) {
        console.log("✅ Success: Metabolic Drift (Appetite) detected.");
        console.log(` > Title: ${appetiteDrift.title}`);
        console.log(` > Severity: ${appetiteDrift.severity}`);
    } else {
        throw new Error("Failed to detect Metabolic Drift!");
    }

    if (vibeShift) {
        console.log("✅ Success: Baseline Vibe Shift detected.");
        console.log(` > Direction: Subdued (Score shifted from 1 to 2)`);
    }

    console.log("\n--- Verification Complete ---");
}

verifyMetabolicDrift();
